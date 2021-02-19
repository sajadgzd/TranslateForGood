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
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleChangeCheckBox = (event) => {
    setData({ ...data, [event.target.name]: event.target.checked });
  };

  const { user, languageFrom, languageTo, error, femaleTranslatorBool, UrgentTranslatorBool, DocumentProofReadingBool } = data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setData({ ...data, error: null });
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
      console.log("HERE IS THE DATA POSTED for SUBMIT button:\t",data)
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
              <TextField
                id="standard-select-language-from"
                select
                label="From"
                name="languageFrom"
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
              <TextField
                id="standard-select-language-to"
                select
                label="To"
                name="languageTo"
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
              variant="contained"
              color="primary"
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
        <Paper className={classes.paper}>xs=12 sm=6</Paper>
      </Grid>

    </Grid>
  </div>

  );
};

export default Home;
