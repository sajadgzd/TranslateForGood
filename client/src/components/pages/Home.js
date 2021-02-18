import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { AddToPhotos } from "@material-ui/icons";
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Languages from '../../util/languages'

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
  }
}));


// Home component func definition
const Home = (props) => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const res = await axios.get("/api/auth", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUser(res.data);
  };
  useEffect(() => {
    getUser();
  }, []);

  // If no token, go to login page
  if (!localStorage.getItem("token")) {
    props.history.push("/about");
  }

  // use defined styles above
  const classes = useStyles();

  const [language, setlanguageFrom, setlanguageTo] = React.useState('English');

  const handleChangeSelectFrom = (event) => {
    setlanguageFrom(event.target.value);
  };

  const handleChangeSelectTo = (event) => {
    setlanguageTo(event.target.value);
  };

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
            <Typography variant="h6">Request a Translator!</Typography>
          </ThemeProvider>
          
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                id="standard-select-language-from"
                select
                label="From"
                value={language}
                onChange={handleChangeSelectFrom}
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
                value={language}
                onChange={handleChangeSelectTo}
                helperText="Please select the target language"
              >
                {Languages.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
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
