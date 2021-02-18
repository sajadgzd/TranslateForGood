import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';

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

  return (
    <div className="m-5">
      <div className="jumbotron">
        <p className="lead">Welcome {user && user.name}</p>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </div>
    </div>
  );
};

export default Home;
