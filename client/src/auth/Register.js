import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = (props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    languageFrom: "",
    languageTo: "",
    timezone: "",
    error: null,
  });

  const [showTranslator, setShowTranslator] = React.useState(false)
  const onClick = () => setShowTranslator(!showTranslator)

  const { name, email, password, languageFrom, languageTo, timezone, error } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setData({ ...data, error: null });
      await axios.post(
        "/api/auth/register",
        { name, email, password, languageFrom, languageTo, timezone },
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
            <div className="form-group">
              <label htmlFor="languageFrom">
                Language you can translate from: </label>
                <div className="ui-select">
                <select name="languageFrom" className="form-control" value={languageFrom} onChange={handleChange}>
                  <option>Select language from list ... </option>
                  <option value="Arabic">Arabic</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Burmese">Burmese</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Javanese">Javanese</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Korean">Korean</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Mandarin Chinese">Mandarin Chinese</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Oriya">Oriya</option>
                  <option value="Panjabi">Panjabi</option>
                  <option value="Persian">Persian</option>
                  <option value="Polish">Polish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Thai">Thai</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Ukrainian">Ukrainian</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Vietnamese">Vietnamese</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="languageTo">
                Language you can translate to: </label>
                <div className="ui-select">
                <select name="languageTo" className="form-control" value={languageTo} onChange={handleChange}>
                  <option>Select language from list ... </option>
                  <option value="Arabic">Arabic</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Burmese">Burmese</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Javanese">Javanese</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Korean">Korean</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Mandarin Chinese">Mandarin Chinese</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Oriya">Oriya</option>
                  <option value="Panjabi">Panjabi</option>
                  <option value="Persian">Persian</option>
                  <option value="Polish">Polish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Thai">Thai</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Ukrainian">Ukrainian</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Vietnamese">Vietnamese</option>
                </select>
              </div>
            </div>
          </div>
          : null }
          </div>
            <div className="form-group">
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
