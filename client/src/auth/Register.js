import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';


const Register = (props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    languageFrom: [],
    languageTo: [],
    proofRead: [],
    femaleTranslator: false,
    timezone: "",
    error: null,
    materialInputError: false,
  });

  const [showTranslator, setShowTranslator] = React.useState(false)
  const onClick = () => setShowTranslator(!showTranslator)

  const { name, email, password, languageFrom, languageTo, proofRead, femaleTranslator, timezone, error } = data;
  const [languagesSelected, setlanguegesSelected] = React.useState([]);
  const [languagesSelectedTo, setlanguegesSelectedTo] = React.useState([]);
  const [languagesSelectedFrom, setlanguegesSelectedFrom] = React.useState([]);
 
  
  const handleChange = (e) => {
      setData({ ...data, materialInputError: false, [e.target.name]: e.target.value });
  };
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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setData({ ...data, error: null });
      if (data.name === "" || data.email === "" || data.password === "" || data.timezone === "") {
        console.log("Some of requered fields during registration new user are empty!")
        setData({ ...data, materialInputError: true});
        return;
      }
      await axios.post(
        "/api/auth/register",
        { name, email, password, languageFrom, languageTo, proofRead, femaleTranslator, timezone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // when successful, redirect to login page
      props.history.push("/login");
    } catch (err) {
      setData({ ...data, error: err.response.data.error });
    }
  };

  const languages = ["Arabic","Bengali","Burmese","English",
  "French","German","Gujarati","Hindi","Italian","Japanese",
  "Javanese","Kannada","Korean","Malayalam","Mandarin Chinese",
  "Marathi","Oriya","Panjabi","Persian","Polish","Portuguese",
  "Russian","Spanish","Tamil","Telugu","Thai","Turkish",
  "Ukrainian","Urdu","Vietnamese"];


  const handleChangeRadioButton = (event) => {
    setData({ ...data, [event.target.name]: event.target.checked });
  };
  
  return (
    <div className="row">
      <div className="col-sm-2" />
      <div className="col-sm-8">
        <h4 className="text-muted text-center mb-5">Create an account</h4>

        <div className="card p-5 shadow">
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <TextField required={true}
                className="form-control"
                type="name"
                name="name"
                error={data.materialInputError}
                value={name}
                onChange={handleChange}
                ></TextField>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <TextField required={true}
                className="form-control"
                type="email"
                name="email"
                error={data.materialInputError}
                value={email}
                onChange={handleChange}
                ></TextField>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <TextField required={true}
                className="form-control"
                type="password"
                name="password"
                error={data.materialInputError}
                value={password}
                onChange={handleChange}
                ></TextField>
            </div>
            <div className="form-check">
              <input id="copy" type="checkbox" className="form-check-input" onClick={onClick}/>
              <label htmlFor="form-check-translator">I want to register as a translator!</label>
              { showTranslator ?
            <div id="translator">
              <div id="ArrayOne" style={{ marginTop: '2rem' }}>
              <FormControl variant="filled" className="form-control">
              <InputLabel id="demo-simple-select-filled-label">Languages you can translate from:</InputLabel>
                  <Select
                      name="languageFrom"
                      multiple
                      value={languageFrom}
                      onChange={e => { handleChange(e); handleArray(e)}}
                      input={<Input />}
                  >
                  {languages.map((l) => (
                  <MenuItem key={l} value={l} >
                    {l}
                  </MenuItem>
                  ))}
                  </Select>
              </FormControl>
              </div>
              <div id="ArrayTwo" style={{ marginTop: '2rem' }}>
              <FormControl variant="filled" className="form-control">
              <InputLabel id="demo-simple-select-filled-label">Languages you can translate to:</InputLabel>
                  <Select
                      name="languageTo"
                      multiple
                      value={languageTo}
                      onClick={handleMerge}
                      onChange={e => { handleChange(e); handleArray(e)}}
                      input={<Input />}
                  >
                  {languages.map((l) => (
                  <MenuItem key={l} value={l} >
                    {l}
                  </MenuItem>
                  ))}
                  </Select>
              </FormControl>
              </div>
              <div id="ArrayThree" style={{ marginTop: '2rem' }}>
              <FormControl variant="filled" className="form-control">
              <InputLabel id="demo-simple-select-filled-label">Languages you feel comfortable to proofread:</InputLabel>
                  <Select
                      name="proofRead"
                      multiple
                      value={proofRead}
                      onChange={handleChange}
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
              <div id="Female">
              <FormControl component="fieldset" style={{ marginTop: '2rem' }}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch checked={femaleTranslator} onChange={handleChangeRadioButton} name="femaleTranslator" />}
                      label="I am female translator!"
                    />
                  </FormGroup>
                <FormHelperText>We need to know if you are a female translator for special 
                  cases when a female translator requested for doctor's appointment and others.</FormHelperText>
              </FormControl>
              </div>
          </div>
          : null }
          </div>
            <FormControl className="form-control" style={{ marginBottom: '2rem' }}>
              <InputLabel htmlFor="age-native-helper">Time Zone</InputLabel>
                <NativeSelect
                  required={true}
                  error={data.materialInputError}
                  value={timezone}
                  onChange={handleChange}
                  inputProps={{
                    name: 'timezone',
                    id: 'age-native-helper',
                  }}
                >
                 <option aria-label="None" value="" />
                 <option value="UTC+14:00 Pacific/Kiritimati">UTC+14:00 Pacific/Kiritimati</option>
                </NativeSelect>
              <FormHelperText>Please select the UTC you are located.</FormHelperText>
            </FormControl>
            {error ? <p className="text-danger">{error}</p> : null}
            <div className="text-center">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Register
              </button>
            </div>
            <p className="mt-3 text-center">
              Already a user?
              <Link to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div className="col-sm-2" />
    </div>
  );
};


export default Register;
