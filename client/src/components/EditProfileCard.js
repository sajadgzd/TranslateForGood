import React, { useEffect, useState } from 'react'

import axios from "axios";

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Input from '@material-ui/core/Input';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';

import Languages from '../util/languages';

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
  formControl: {
    margin: theme.spacing(2),
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const EditProfileCard = (props) => {

    const user = props.user;

    const [data, setData] = useState({
        user: user,
        name: (user && user.name),
        email: (user && user.email),
        languageFrom: (user && user.languageFrom),
        languageTo: (user && user.languageTo),
        femaleTranslator: (user && user.femaleTranslator),
        timezone: (user && user.timezone),
        error: null,
    });
    
    const [showTranslator, setShowTranslator] = useState(false)

    const onClickEditLanguages = () => setShowTranslator(true)
    const onClickBecomeTranslator = () => setShowTranslator(true)
    const onClickStopBeingTranslator = () => { 
        setShowTranslator(false);
        setData({ ...data, languageFrom: [], languageTo: [], femaleTranslator:false});
    }

    const { name, email, languageFrom, languageTo, femaleTranslator, timezone, error } = data;

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleChangeRadioButton = (event) => {
        setData({ ...data, [event.target.name]: event.target.checked });
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };

    const handleUpdate = async (e) => {
        console.log("HERE IS THE DATA POSTED for UPDATE PROFILE:\t",data);
        e.preventDefault();
        try {
            setData({ ...data, error: null });
            await axios.put(
                "/api/users/edit",
                { user, name, email, languageFrom, languageTo, femaleTranslator, timezone },
                {
                headers: {
                    "Content-Type": "application/json",
                },
                }
            );
            handleClickOpen();
            console.log("Clicked")
        } catch (err) {
            setData({ ...data, error: err.response.data.error });
        }
    };

    const classes = useStyles();

    const showLanguagesToAndFrom = <div>
                                 <div id="translator">
                                    <div id="ArrayOne" style={{ marginTop: '1rem', marginLeft: '1rem'}}>
                                        <FormControl>
                                            <FormLabel component="legend">Languages you can translate from:</FormLabel>
                                            <Select
                                                name="languageFrom"
                                                multiple
                                                displayEmpty={true}
                                                value={languageFrom}
                                                onChange={handleChange}
                                                input={<Input />}
                                                >
                                                {Languages.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                                </FormControl>
                                                </div>
                                                <div id="ArrayTwo" style={{ marginTop: '2rem', marginLeft: '1rem', marginBottom: '2rem'}}>
                                                <FormControl>
                                                <FormLabel component="legend">Languages you can translate to:</FormLabel>
                                                <Select
                                                    name="languageTo"
                                                    multiple
                                                    displayEmpty={true}
                                                    value={languageTo}
                                                    onChange={handleChange}
                                                    input={<Input />}
                                                >
                                                {Languages.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                                </FormControl>
                                                </div>
                                            </div>
                                        </div>
    
    const showFemaleTranslatorCheck = <div>
                                    <div id="Female">
                                        <FormControl component="fieldset" style={{ marginTop: '1rem' }}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Switch checked={femaleTranslator} name="femaleTranslator" onChange={handleChangeRadioButton}/>}
                                                    label="I am female translator"
                                                />
                                            </FormGroup>
                                            <FormHelperText>Remainder: We need to know if you are a female translator for special 
                                            cases when a female translator is requested for doctor's appointment and others.</FormHelperText>
                                        </FormControl>
                                    </div>
                                </div>

    return(
        <div className={classes.root}>
            <Grid container spacing={10} direction="column" alignItems="center" justify="center">
                <Box>
                    <Grid item xs={10} style={{
                        display: "center",
                        marginTop:60,
                        marginBottom:60,
                    }}>
                    <Card
                        style={{
                        width: 700,
                        maxHight: 600,
                        }}>
                        <CardContent>
                            <Button size="large" color="primary" onClick={() => props.changeToFalse()} style={{marginLeft:'1rem'}}>
                                Go Back
                            </Button>
                            <div>
                                <form className={classes.formControl}>
                                    <div>
                                        <div>
                                            <TextField required={true}
                                                id="name"
                                                label="Name"
                                                name="name"
                                                error={data.materialFromInputError}
                                                value={name}
                                                onChange={handleChange}
                                            >
                                            </TextField>
                                        </div>
                                        <div>
                                            <TextField required={true}
                                                id="email"
                                                label="Email"
                                                name="email"
                                                error={data.materialFromInputError}
                                                value={email}
                                                onChange={handleChange}
                                            > </TextField>
                                        </div>
                                    </div>
                                    <div className="form-check">
                                    {(user && user.languageFrom != "") ? 
                                        (
                                            <div>
                                                {showFemaleTranslatorCheck}
                                                <div>
                                                    <FormControl component="fieldset" error={data.materialRadioInputError} style={{marginTop: '1rem'}}>
                                                        <RadioGroup 
                                                                name="editTranslatorInfo" 
                                                            >
                                                            <FormControlLabel value="editLangauges" onChange={onClickEditLanguages} control={<Radio />} label="Edit my langauges" />
                                                            { showTranslator ?
                                                                showLanguagesToAndFrom
                                                            : null }
                                                            <FormControlLabel value="stopBeingTranslator" onChange={onClickStopBeingTranslator} control={<Radio />} label="I don't want to be a translator anymore" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        ) : (
                                            <FormControl style={{marginTop: '1rem'}}>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                            // checked={implementFunction}
                                                            // onChange={this.handleChange('checkedA')}
                                                            value="becomeTranslatorCheck"
                                                            onChange={onClickBecomeTranslator}
                                                            />
                                                        }
                                                        label="I'd like to become a translator"
                                                    />
                                                    { showTranslator ?
                                                                (
                                                                    <div>
                                                                        <div>
                                                                            {showFemaleTranslatorCheck}
                                                                        </div>
                                                                        <div>
                                                                            {showLanguagesToAndFrom}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            : null }
                                                </FormGroup>
                                            </FormControl>
                                        )
                                    }
                                    </div>
                                    <div className="form-group" style={{ marginTop: '2rem', marginLeft: '1rem'}}>
                                    <label htmlFor="timezone">
                                        My time zone: </label>
                                        <div className="ui-select">
                                        <select name="timezone" className="form-control" value={timezone} onChange={handleChange}>
                                        <option value="Eastern" >(GMT-05:00) Eastern Time</option>
                                        <option value="Hawaii" >(GMT-10:00) Hawaii Time</option>
                                        <option value="Alaska" >(GMT-09:00) Alaska Time</option>
                                        <option value="Pacific" >(GMT-08:00) Pacific Time</option>
                                        <option value="Mountain" >(GMT-07:00) Mountain Time</option>
                                        <option value="Central" >(GMT-06:00) Central Time</option>
                                        </select>
                                    </div>
                                </div>
                                {error ? <p className="text-danger">{error}</p> : null}
                            </form>
                            </div>
                        </CardContent>
                        <CardActions>
                        <Button size="large" color="primary" onClick={handleUpdate} style={{marginLeft: '1rem'}}>
                            Update
                        </Button>
                    </CardActions>
                    </Card>
                    </Grid>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Your profile has been succesfully updated!
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={props.changeToFalse} color="primary" autoFocus justify="center">
                            Go back to my profile
                        </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Grid>
        </div>
    )
}

export default EditProfileCard;
