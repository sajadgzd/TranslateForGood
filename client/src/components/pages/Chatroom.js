import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const Chatroom = () => {
    // const [chatrooms, setChatrooms] = useState([]);
    
    // const getChatrooms = () => {
    //     axios
    //     .get("/api/chat/getChats", {
    //         headers: {
    //             Authorization : "Bearer" + localStorage.getItem("token"),
    //         }
    //     })
    //     .then((response) => {
    //         setChatrooms(response.data);
    //     }).catch((err) => {
    //         setTimeout(getChatrooms, 3000);
    //     });
    // };

    // useEffect(() => {
    //     getChatrooms();
    // }, []);

    const [chatrooms, setChatroomsList] = useState([]);
    // retrieve all chatrooms available to current user
    const getChatroomsList = async () => {

        const res = await axios.get("/api/auth", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
        });
        let user = res.data;
        // console.log(user);
        let requestTransl = user.translationActivity.accepted;
        let requestUser = user.requests;
        let requestsSet = new Set(requestTransl.concat(requestUser));
        let requestsList = [...requestsSet];
        const chatrooms = await axios.get("/api/chat/filter", { 
            params: {
                requestsList  
            }
          });

        setChatroomsList(chatrooms.data);
        
    };
    useEffect(() => {
        getChatroomsList();
    }, []);

    return (
        <div>
            <div>Chatrooms</div>
            <div className="chatrooms">
                {chatrooms.map((chatroom) => (
                    <div key={chatroom._id} className="chat">
                        <div>{chatroom.name}</div>
                        <Link to={"/chat/" + chatroom._id}>
                            <div>Join</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Chatroom;