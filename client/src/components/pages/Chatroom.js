import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const Chatroom = () => {
    const [chatrooms, setChatrooms] = useState([]);

    const getChatrooms = () => {
        axios
        .get("/api/chat/getChats", {
            headers: {
                Authorization : "Bearer" + localStorage.getItem("token"),
            }
        })
        .then((response) => {
            setChatrooms(response.data);
        }).catch((err) => {
            setTimeout(getChatrooms, 3000);
        });
    };

    useEffect(() => {
        getChatrooms();
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