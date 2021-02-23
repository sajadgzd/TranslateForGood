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


const Register = (props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    languageFrom: [],
    languageTo: [],
    femaleTranslator: false,
    timezone: "",
    error: null,
  });

  const [showTranslator, setShowTranslator] = React.useState(false)
  const onClick = () => setShowTranslator(!showTranslator)

  const { name, email, password, languageFrom, languageTo, femaleTranslator, timezone, error } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setData({ ...data, error: null });
      await axios.post(
        "/api/auth/register",
        { name, email, password, languageFrom, languageTo, femaleTranslator, timezone },
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
              <input id="copy" type="checkbox" class="form-check-input" onClick={onClick}/>
              <label htmlFor="form-check-translator">I want to register as a translator!</label>
              { showTranslator ?
            <div id="translator">
              <div id="ArrayOne" style={{ marginTop: '2rem' }}>
              <FormControl className="languageFrom">
              <FormLabel component="legend">Languages you can translate from:</FormLabel>
                  <Select
                      name="languageFrom"
                      multiple
                      value={languageFrom}
                      onChange={handleChange}
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
              <FormControl className="languageTo">
              <FormLabel component="legend">Languages you can translate to:</FormLabel>
                  <Select
                      name="languageTo"
                      multiple
                      value={languageTo}
                      onChange={handleChange}
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
              <div id="Female">
              <FormControl component="fieldset" style={{ marginTop: '2rem' }}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch value={femaleTranslator} onChange={handleChange} name="femaleTranslator" />}
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
            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label htmlFor="timezone">
                Time zone: </label>
                <div className="ui-select">
                <select name="timezone" className="form-control" value={timezone} onChange={handleChange}>
                  <option value="Eastern"  >(GMT-05:00) Eastern Time</option>
                  <option value="Hawaii"  >(GMT-10:00) Hawaii Time</option>
                  <option value="Alaska"  >(GMT-09:00) Alaska Time</option>
                  <option value="Pacific"  >(GMT-08:00) Pacific Time</option>
                  <option value="Mountain"  >(GMT-07:00) Mountain Time</option>
                  <option value="Central"  >(GMT-06:00) Central Time</option>
                </select>
              </div>
            </div>
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
