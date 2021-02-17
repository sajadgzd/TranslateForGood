import React, { useEffect, useState } from 'react'
import axios from "axios";
import './Profile.css'

const Profile = () => {

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

  return (
      <div>
        <div className='profile'>
          <div>
            <img className='user-photo'
                src="https://images.unsplash.com/photo-1612024638904-bda171b93c66?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDN8fHBlcnNvbnxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
            />
          </div>
          <div className='user-info' >
            <div className='user-info'>
              Name: {user && user.name}
            </div>
            <div className='user-info'>
              Email: {user && user.email}
            </div>
            <div className='user-info'>
              Language I can translate from: {user && user.languageFrom}
            </div>
            <div className='user-info'>
              Language I can translate to: {user && user.languageTo}
            </div>
            <div className='user-info'>
              Time zone: {user && user.timezone}
            </div>
            <div>
              <button className='user-info'>Update Profile</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Profile
