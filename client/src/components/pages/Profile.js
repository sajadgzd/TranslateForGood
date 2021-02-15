import React, { useEffect, useState } from 'react'
import axios from "axios";

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
        <div align="center" style={{
          margin:"50px"
        }}>
          <div>
            <img style={{width:"250px", height:"250px", borderRadius:"125px"}}
                src="https://images.unsplash.com/photo-1612024638904-bda171b93c66?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDN8fHBlcnNvbnxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
            />
          </div>
          <div style={{
            margin:"30px"
          }}>
            <div style={{
              margin:"20px"
            }}>
              Name: {user && user.name}
            </div>
            <div style={{
              margin:"20px"
            }}>
              Email: {user && user.email}
            </div>
            <div style={{
              margin:"20px"
            }}>
              Languages: Polish, English, Russian
            </div>
            <div style={{
              margin:"20px"
            }}>
              Translator for: Polish
            </div>
          </div>
        </div>
      </div>
    )
}


export default Profile
