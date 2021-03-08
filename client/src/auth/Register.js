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
  });

  const [showTranslator, setShowTranslator] = React.useState(false)
  const onClick = () => setShowTranslator(!showTranslator)

  const { name, email, password, languageFrom, languageTo, proofRead, femaleTranslator, timezone, error } = data;
  const [languagesSelected, setlanguegesSelected] = React.useState([]);
  const [languagesSelectedTo, setlanguegesSelectedTo] = React.useState([]);
  const [languagesSelectedFrom, setlanguegesSelectedFrom] = React.useState([]);
  const [errors, setErrors] = React.useState({});
 
  
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
  const handleValidation = (e) =>{
    let errors = {};
    let formIsValid = true;
    if(!data.name){
       formIsValid = false;
       errors["name"] = "Cannot be empty";
    }
    if(!data.email){
       formIsValid = false;
       errors["email"] = "Cannot be empty";
    }
   if(!data.password){
    formIsValid = false;
    errors["password"] = "Cannot be empty";
  }
  if(!data.timezone){
    formIsValid = false;
    errors["timezone"] = "Cannot be empty";
  }
   setErrors({errors: errors});
   return formIsValid;
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(handleValidation()){
      alert("Form submitted");
   }else{
      alert("Form has errors: ", errors.value)
   }
    try {
      setData({ ...data, error: null });
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
              <input
                className="form-control"
                type="name"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
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
                  value={timezone}
                  onChange={handleChange}
                  inputProps={{
                    name: 'timezone',
                    id: 'age-native-helper',
                  }}
                >
                 <option aria-label="None" value="" />
                 <option value="UTC-12:00 Baker Island, Howland Island">UTC-12:00 Baker Island, Howland Island</option>
                 <option value="UTC-11:00 Pacific/Samoa, US/Samoa">UTC-11:00 Pacific/Samoa, US/Samoa</option>
                 <option value="UTC-10:00 US/Aleutian, US/Hawaii">UTC-10:00 US/Aleutian, US/Hawaii</option>
                 <option value="UTC-09:00 US/Alaska">UTC-09:00 US/Alaska</option>
                 <option value="UTC-08:00 US/Pacific, Canada/Pacific">UTC-08:00 US/Pacific, Canada/Pacific</option>
                 <option value="UTC-07:00 US/Arizona, Canada/Mountain">UTC-07:00 US/Arizona, Canada/Mountain</option>
                 <option value="UTC-06:00 US/Central, Canada/Central">UTC-06:00 US/Central, Canada/Central</option>
                 <option value="UTC-05:00 US/Eastern, Canada/Eastern">UTC-05:00 US/Eastern, Canada/Eastern</option>
                 <option value="UTC-04:00 Canada/Atlantic, Brazil/West">UTC-04:00 Canada/Atlantic, Brazil/West</option>
                 <option value="UTC-03:00 Canada/Newfoundland, Brazil/East">UTC-03:00 Canada/Newfoundland, Brazil/East</option>
                 <option value="UTC-02:00 Brazil/DeNoronha, Atlantic/South Georgia">UTC-02:00 Brazil/DeNoronha, Atlantic/South Georgia</option>
                 <option value="UTC-01:00 Portugal/Azores, Greenland/Ittoqqortoormiit">UTC-01:00 Portugal/Azores, Greenland/Ittoqqortoormiit</option>
                 <option value="UTC±00:00 Portugal, Europe/Belfast">UTC±00:00 Portugal, Europe/Belfast</option>
                 <option value="UTC+01:00 Poland, Europe/Vatican">UTC+01:00 Poland, Europe/Vatican</option>
                 <option value="UTC+02:00 Egypt, Asia/Istanbul">UTC+02:00 Egypt, Asia/Istanbul</option>
                 <option value="UTC+03:00 Africa/Asmera, Europe/Moscow">UTC+03:00 Africa/Asmera, Europe/Moscow</option>
                 <option value="UTC+04:00 Asia/Dubai, Indian/Mahe">UTC+04:00 Asia/Dubai, Indian/Mahe</option>
                 <option value="UTC+05:00 Asia/Ashkhabad, Indian/Maldives">UTC+05:00 Asia/Ashkhabad, Indian/Maldives</option>
                 <option value="UTC+06:00 Asia/Thimbu, Asia/Dacca">UTC+06:00 Asia/Thimbu, Asia/Dacca</option>
                 <option value="UTC+07:00 Asia/Saigon, Indian/Christmas">UTC+07:00 Asia/Saigon, Indian/Christmas</option>
                 <option value="UTC+08:00 Australia/West, Asia/Macao">UTC+08:00 Australia/West, Asia/Macao</option>
                 <option value="UTC+09:00 Japan, Australia/South">UTC+09:00 Japan, Australia/South</option>
                 <option value="UTC+10:00 Australia/North, Pacific/Truk">UTC+10:00 Australia/North, Pacific/Truk</option>
                 <option value="UTC+11:00 Pacific/Ponape, Asia/Kamchatka">UTC+11:00 Pacific/Ponape, Asia/Kamchatka</option>
                 <option value="UTC+12:00 Pacific/Wallis, Pacific/Fiji">UTC+12:00 Pacific/Wallis, Pacific/Fiji</option>
                 <option value="UTC+13:00 Pacific/Enderbury, Pacific/Tongatapu">UTC+13:00 Pacific/Enderbury, Pacific/Tongatapu</option>
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
