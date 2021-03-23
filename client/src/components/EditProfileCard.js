import React, { useState } from 'react'

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

import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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

    const moment = require('moment-timezone');
    const lookup = require('country-code-lookup');

    let countriesList = moment.tz.countries().map(country => 
        <option key = {country} value = {country}>{lookup.byIso(country).country}</option>);
    const [timezonesList, setTimezonesList] = useState(<></>);

    const handleCountryChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        console.log('selected country is', e.target.value);
        setTimezonesList(moment.tz.zonesForCountry(e.target.value).map(timezone => 
        <option key = {timezone} value = {timezone}>{timezone}</option>));
    };

    const user = props.user;

    const [data, setData] = useState({
        user: user,
        name: (user && user.name),
        email: (user && user.email),
        password: (user && user.password),
        languageFrom: (user && user.languageFrom),
        languageTo: (user && user.languageTo),
        proofRead: [],
        femaleTranslator: (user && user.femaleTranslator),
        image: (user && user.image),
        timezone: (user && user.timezone),
        error: null,
        country: "",
        requiredPasswordError: false
    });
    
    const [showTranslator, setShowTranslator] = useState(false)

    const onClickEditLanguages = () => setShowTranslator(true)
    const onClickBecomeTranslator = () => setShowTranslator(!showTranslator)
    const onClickStopBeingTranslator = () => { 
        setShowTranslator(false);
        setData({ ...data, languageFrom: [], languageTo: [], proofRead: [], femaleTranslator:false});
    }

    const { name, email, password, languageFrom, languageTo, proofRead, femaleTranslator, image, timezone, error, country, requiredPasswordError } = data;
    const [languagesSelected, setlanguegesSelected] = React.useState([]);
    const [languagesSelectedTo, setlanguegesSelectedTo] = React.useState([]);
    const [languagesSelectedFrom, setlanguegesSelectedFrom] = React.useState([]);
    const [selectedImagePreview, setImagePrev] = useState(user.image);

    const imageSelectedHandler = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (event.target.files.length == 0) {
          setImagePrev(null);
        } else {
            const fileType = file['type'];
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            if (!validImageTypes.includes(fileType)) {
              setImagePrev(null);
              window.alert("This is not an Image file");
            } else {
                setImagePrev(URL.createObjectURL(file));
                setData({ ...data, image: URL.createObjectURL(file)});
            }
        }
      }
   
    const handleArray = (e) => {
        if(e.target.name == "languageFrom"){
          setlanguegesSelectedFrom(e.target.value);
        }
        if(e.target.name == "languageTo"){
          setlanguegesSelectedTo(e.target.value);
        }
    };
    const handleMerge = (e) => {
        var result = languagesSelectedFrom.concat(languagesSelectedTo);
        let uniqueArray = [...new Set(result)];
        setlanguegesSelected(uniqueArray);
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setData({ ...data, requiredPasswordError:false, [e.target.name]: e.target.value });
    };

    const handleChangeRadioButton = (event) => {
        setData({ ...data, [event.target.name]: event.target.checked });
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };

    const [values, setValues] = React.useState({
        showPassword: false,
    });
    
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleUpdate = async (e) => {
        console.log("HERE IS THE DATA POSTED for UPDATE PROFILE:\t",data);
        e.preventDefault();
        try {
            setData({ ...data, error: null });
            if (password == "" || password == null) {
                console.log("Password field is empty");
                setData({ ...data, requiredPasswordError: true});
                return;
            }
            await axios.put(
                "/api/users/edit",
                { user, name, email, password, languageFrom, languageTo, proofRead, femaleTranslator, image, timezone },
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
                                                onChange={e => { handleChange(e); handleArray(e)}}
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
                                                onClick={handleMerge}
                                                onChange={e => {handleChange(e); handleArray(e)}}
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
                                            <FormLabel component="legend">Languages for which you proofread documents:</FormLabel>
                                            <Select
                                                name="proofRead"
                                                multiple
                                                value={proofRead}
                                                onChange={e => { handleChange(e)}}
                                                input={<Input />}
                                            >
                                            {languagesSelected.map((l) => (
                                                <MenuItem key={l} value={l} >
                                                    {l}
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
                                    <div className="col-4" style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                        <h5>Change Your Image</h5>
                                            <div className="">
                                            <img src={selectedImagePreview} className="img-fluid z-depth-1 rounded-circle" alt="avatar" />

                                            <input type="file" onChange={imageSelectedHandler} required />
                                        </div>
                                    </div>
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
                                        <div>
                                            <FormControl required={true} error={requiredPasswordError} style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                                <Input 
                                                    id="password"
                                                    name="password"
                                                    type={values.showPassword ? 'text' : 'password'}
                                                    onChange={handlePasswordChange}
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        >
                                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
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
                                    <label htmlFor="country">
                                        Country: </label>
                                        <div className="ui-select">
                                        <select name="country" className="form-control" value={country} onChange={handleCountryChange}>
                                        <option defaultValue>Choose your country</option>
                                        {countriesList}
                                        </select>
                                    </div>
                                    <label htmlFor="timezone">
                                        My time zone: </label>
                                        <div className="ui-select">
                                        <select name="timezone" className="form-control" value={timezone} onChange={handleChange}>
                                        <option defaultValue>Choose your time zone</option>
                                        {timezonesList}
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

