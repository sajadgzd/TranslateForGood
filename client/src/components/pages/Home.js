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
import ActiveRequestList from '../ActiveRequestList';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';



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
    femaleTranslatorBool: false,
    urgentTranslatorBool: false,
    documentProofReadingBool: false,
    previousTranslatorInfo: "",
    materialFromInputError: false,
    materialToInputError: false,
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

  const { user, languageFrom, languageTo, error, femaleTranslatorBool, urgentTranslatorBool, documentProofReadingBool, 
          previousTranslatorInfo, materialFromInputError, materialToInputError, isActive, openDialog, materialRadioInputError } = data;

  const handleCloseDialog = () => {
    setData({...data, 
             languageFrom: "",
             languageTo: "",
             femaleTranslatorBool: false,
             urgentTranslatorBool: false,
             documentProofReadingBool: false,
             previousTranslatorInfo: "",
             openDialog: false})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setData({...data, user: user}); //////////res.data._id
      setData({ ...data, error: null });
      if (data.languageFrom === "") {
        console.log("FROM language Field IS EMPTY")
        // return;
        setData({ ...data, materialFromInputError: true});
        return;
      } else if (data.languageTo === "" || data.languageFrom === data.languageTo){
        console.log("TO language field is empty or identical to language from")
        // return;
        setData({ ...data, materialToInputError: true});
        return;
      }
        await axios.post(
          "/api/requests/new",
          {  user, languageFrom, languageTo, femaleTranslatorBool, urgentTranslatorBool, documentProofReadingBool, previousTranslatorInfo, isActive },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // when successful, refresh page to home page
        props.history.push("/home");
        console.log("HERE IS THE DATA POSTED for SUBMIT REUQUEST FORM button:\t",data)
        setData({ ...data, openDialog: true});
        //Looking for matching translators for each request
        await axios.get(
          "/api/users/matchedTranslators", { 
            params: {
              languageFrom, languageTo, femaleTranslatorBool, user
            }
          });
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

    <div className={classes.root} style={{ marginTop: 40 }}>
    <Grid container spacing={8}>
      <Grid item xs={12} sm={12} >
        <ThemeProvider theme={theme}>
          <Typography variant="h5" style={{ marginLeft: 30 }} >Welcome {user && user.name}</Typography>
        </ThemeProvider>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper className={classes.paper}>
          <ThemeProvider theme={theme}>
            <Typography variant="h6" style={{ marginLeft: 10, marginBottom: 20 }} >Request a Translator</Typography>
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
                  control={<Checkbox checked={urgentTranslatorBool} onChange={handleChangeCheckBox} name="urgentTranslatorBool" />}
                  label="Urgent Translation"
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
      <Grid item xs={12} sm={6}>
        <Paper className={classes.paper}>
          <ThemeProvider theme={theme}>
              <Typography variant="h6" style={{ marginLeft: 10, marginBottom: 20 }} > Or Select a Previous Translator</Typography>
          </ThemeProvider>
          <FormControl component="fieldset" error={data.materialRadioInputError}>
            <FormLabel component="legend">Select your translator</FormLabel>
              <RadioGroup aria-label="previousTranslatorInfo" name="previousTranslatorInfo" value={previousTranslatorInfo} 
                defaultValue="SajadGmail" onChange={handleChangeRadioButton}
                >
                <FormControlLabel value="SajadGmail" control={<Radio defaultValue/>} label="Sajad G. English to Farsi" />
                <FormControlLabel value="EkaterinaGmail" control={<Radio />} label="Ekaterina A. English to Russian" />
                <FormControlLabel value="NataliaGmail" control={<Radio />} label="Natalia H. English to Polish" />
                {/* {Languages.map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))} */}
                <FormHelperText>{"Please select an option"}</FormHelperText>
              </RadioGroup>
          </FormControl>
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              onClick={handleSubmitPreviousTranslator}
              style={{marginTop: 15}}
            >
              Submit
            </Button>
          </div>
        </Paper>
      </Grid>

    </Grid>
    
    {// Only translators can see the list of active requests
      user.languageFrom === undefined || user.languageFrom.length == 0 ?
      <></>: <ActiveRequestList />
    }
  </div>

  );
};

export default Home;