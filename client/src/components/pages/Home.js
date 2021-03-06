import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Languages from '../../util/languages';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';

import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import RequestsTabs from '../RequestsTabs';
import EnableNotificationsBtn from '../EnableNotificationsBtn';
import Footer from '../Footer';

// material-ui styles
const theme = createMuiTheme();
theme.typography.h3 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
};
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: "#1a237e",
    fontSize: '1.2rem',
    marginBottom: 30
  },
  formControl: {
    margin: theme.spacing(3),
  }
}));

// Home component func definition
const Home = (props) => {

  const [data, setData] = useState({
    user: "",
    languageFrom: "",
    languageTo: "",
    error: null,
    dueDateTime:null,
    isUrgent: false,
    femaleTranslatorBool: false,
    documentProofReadingBool: false,
    previousTranslatorInfo: "",
    materialFromInputError: false,
    materialToInputError: false,
    materialDateTimeInputError: false,
    dueDateHelperText:"Please select the due date for your request at least ONE HOUR from now",
    isActive: true,
    openDialog: false,
    materialRadioInputError: false
  });

  const getUser = async () => {
    const res = await axios.get("/api/auth", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setData({ ...data, user: res.data});
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleChangeSelect = (e) => {
    if (e.target.value.length > 1) {
      setData({ ...data, materialFromInputError: false, materialToInputError:false, [e.target.name]: e.target.value });
    } else {
      this.setData({materialFromInputError: true });
    }
  };

  const handleChangeCheckBox = (event) => {
    setData({ ...data, [event.target.name]: event.target.checked });
  };

  const handleChangeRadioButton = (event) => {
    setData({ ...data, [event.target.name]: event.target.value, materialRadioInputError: false});
  };

  const handleDateChange = (date) => {
    setData({...data, materialDateTimeInputError:false, dueDateTime:date});
  };

  const { user, languageFrom, languageTo, error, femaleTranslatorBool, documentProofReadingBool, dueDateTime, isUrgent,
          previousTranslatorInfo, materialFromInputError, materialToInputError, materialDateTimeInputError, 
          dueDateHelperText, isActive, openDialog, materialRadioInputError } = data;

  const handleCloseDialog = () => {
    setData({...data, 
             languageFrom: "",
             languageTo: "",
             dueDateTime: null,
             femaleTranslatorBool: false,
             documentProofReadingBool: false,
             isUrgent: false,
             previousTranslatorInfo: "",
             materialDateTimeInputError:false,
             dueDateHelperText:"Please select the due date for your request at least ONE HOUR from now",
             openDialog: false})
  };

  // Create new request, return its ID
  // Show 'Request submitted dialog window"
  // Run matching algoritm
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      setData({...data, user: user}); 
      setData({ ...data, error: null });
      if (data.languageFrom === "") {
        console.log("FROM language Field IS EMPTY")
        // return;
        setData({ ...data, materialFromInputError: true});
        return;
      } else if (data.languageTo === "" || data.languageFrom === data.languageTo){
        console.log("TO language field is empty or identical to language from");
        // return;
        setData({ ...data, materialToInputError: true});
        return;
      } else if(dueDateTime == null || dueDateTime == undefined) {
        console.log("Due date field is empty");
        setData({ ...data, materialDateTimeInputError: true, dueDateHelperText:"Please provide the due date for your request"});
        return;
      } 
      // User tries to submit a due date shorter than an hour
      // 3540000 milliseconds is 59 minutes - that's to make time change
      // easier for the users as they only see current hour not seconds 
      else if(dueDateTime < (new Date().getTime() + 3540000)) { //3540000
        console.log("Due date is shorter than an hour")
        setData({ ...data, materialDateTimeInputError: true, dueDateHelperText:"Your due date is too soon. We need at least an hour to work on your request"});
        return;
      }
      let newRequestID;
      user.image = "";
      console.log("User no image");
        await axios.post(
          "/api/requests/new",
          {  user, languageFrom, languageTo, dueDateTime, femaleTranslatorBool, documentProofReadingBool, previousTranslatorInfo, isActive },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(function(response){
          // console.log("RESPONSE FROM NEW REQUEST:\t", response.data.requestID)
          newRequestID = response.data.requestID;
        });
        // console.log("NEW REQUEST ID:\t", newRequestID)
        // when successful, refresh page to home page
        props.history.push("/home");
        console.log("HERE IS THE DATA POSTED for SUBMIT REUQUEST FORM button:\t",data)
        setData({ ...data, openDialog: true});
        //Looking for matching translators for each request
        if (dueDateTime < (new Date().getTime() + 3600000*5)){
          console.log("Request has due date less than 5 hours, which is urgent for us!");
          await axios.get(
            "/api/users/matchedTranslators", { 
              params: {
                languageFrom, languageTo, isUrgent: true, dueDateTime, femaleTranslatorBool, documentProofReadingBool, user, newRequestID
              }
            });
        } else {
        await axios.get(
          "/api/users/matchedTranslators", { 
            params: {
              languageFrom, languageTo, isUrgent: false, dueDateTime, femaleTranslatorBool, documentProofReadingBool, user, newRequestID
            }
          });
        }
      } catch (err) {
        setData({ ...data, error: err.response.data.error });
      }
  };

const handleSubmitPreviousTranslator = async (e) => {
  e.preventDefault();

  try {
    setData({ ...data, error: null });
    if (data.previousTranslatorInfo === "") {
      console.log("previousTranslatorInfo radio IS EMPTY")
      setData({ ...data, materialRadioInputError: true});
      // return;

      return;
    }
    // await axios.post(
    //   "/api/auth/register",
    //   { user, languageFrom, languageTo, error},
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // when successful, refresh page to home page
    props.history.push("/home");
    console.log("HERE IS THE DATA POSTED for SUBMIT PREVIOUS TRANSLATOR button:\t", data.previousTranslatorInfo)

    setData({ ...data, openDialog: true});
  } catch (err) {
    setData({ ...data, error: err.response.data.error });
  }
};

  // If no token, go to login page
  if (!localStorage.getItem("token")) {
    props.history.push("/about");
  }

  // use defined styles above
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ marginTop: 30 }}>
    <Grid container spacing={8}>
      <Grid item xs={12} sm={10} >
        <ThemeProvider theme={theme}>
          <Typography component={'span'} variant="h5" style={{ marginLeft: 50}} >Welcome {user && user.name}</Typography>
        </ThemeProvider>
      </Grid>
      <Grid item xs={12} sm={2} >
        <EnableNotificationsBtn user={user._id}/>
      </Grid>

      <Grid item xs={12} sm={10} style={{ marginLeft: 20}} >
        <Paper className={classes.paper}>
          <ThemeProvider theme={theme}>
            <Typography component={'span'} variant="h6" style={{ marginLeft: 10, marginBottom: 20 }} >Request a Translator</Typography>
          </ThemeProvider>

          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField required={true}
                id="standard-select-language-from"
                select
                label="From"
                name="languageFrom"
                error={data.materialFromInputError}
                value={languageFrom}
                onChange={handleChangeSelect}
                helperText="Please select your language"
              >
                {Languages.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField required={true}
                id="standard-select-language-to"
                select
                label="To"
                name="languageTo"
                error={data.materialToInputError}
                value={languageTo}
                onChange={handleChangeSelect}
                helperText="Please select the target language"
              >
                {Languages.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  required={true}
                  id="select-due-date-time"
                  label="Due date"
                  name="dueDateTime"
                  disablePast
                  error={materialDateTimeInputError}
                  value={dueDateTime}
                  onChange={handleDateChange}
                  helperText={dueDateHelperText}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Options</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={femaleTranslatorBool} onChange={handleChangeCheckBox} name="femaleTranslatorBool" />}
                  label="Female Translator"
                />
                <FormControlLabel
                  control={<Checkbox checked={documentProofReadingBool} onChange={handleChangeCheckBox} name="documentProofReadingBool" />}
                  label="Document Proofreading"
                />
              </FormGroup>
            </FormControl>
            </div>
            <div>
            <Button
              id="requestTranslatorFormBtn"
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Request Successfully Submitted!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Your request is successfully submitted and we are working on it! We will notify you once your translator is found!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary" autoFocus>
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
            </div>
          </form>

        </Paper>
      </Grid>
    </Grid>
    <RequestsTabs user={user}/>
    <Footer />
  </div>

  );
};

export default Home;