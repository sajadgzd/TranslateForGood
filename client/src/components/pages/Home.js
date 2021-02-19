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
    UrgentTranslatorBool: false,
    DocumentProofReadingBool: false,
    previousTranslatorInfo: "",
    materialFromInputError: false,
    materialToInputError: false
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
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const { user, languageFrom, languageTo, error, femaleTranslatorBool, UrgentTranslatorBool, DocumentProofReadingBool, previousTranslatorInfo, materialFromInputError, materialToInputError } = data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setData({ ...data, error: null });
      if (data.languageFrom === "") {
        console.log("FROM language Field IS EMPTY")
        // return;
        setData({ ...data, materialFromInputError: true});
        return;
      } else if (data.languageTo === ""){
        console.log("TO language Field IS EMPTY")
        // return;
        setData({ ...data, materialToInputError: true});
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
        console.log("HERE IS THE DATA POSTED for SUBMIT REUQUEST FORM button:\t",data)
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
                  control={<Checkbox checked={UrgentTranslatorBool} onChange={handleChangeCheckBox} name="UrgentTranslatorBool" />}
                  label="Urgent Translation"
                />
                <FormControlLabel
                  control={<Checkbox checked={DocumentProofReadingBool} onChange={handleChangeCheckBox} name="DocumentProofReadingBool" />}
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
            </div>
          </form>
        
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.paper}>
          <ThemeProvider theme={theme}>
              <Typography variant="h6" style={{ marginLeft: 10, marginBottom: 20 }} > Or Select a Previous Translator</Typography>
          </ThemeProvider>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select your translator</FormLabel>
              <RadioGroup aria-label="previousTranslatorInfo" name="previousTranslatorInfo" value={previousTranslatorInfo} defaultValue="SajadGmail" onChange={handleChangeRadioButton}>
                <FormControlLabel value="SajadGmail" control={<Radio defaultValue/>} label="Sajad G. English to Farsi" />
                <FormControlLabel value="EkaterinaGmail" control={<Radio />} label="Ekaterina A. English to Russian" />
                <FormControlLabel value="NataliaGmail" control={<Radio />} label="Natalia H. English to Polish" />
                {/* {Languages.map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))} */}
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
  </div>

  );
};

export default Home;
