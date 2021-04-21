import React from 'react';
import io from "socket.io-client";

const Chatroom = (props) => {
    const chatroomId = props.id;
    const socket = io("http://localhost:5000", {
        query : {
            token : localStorage.getItem("CC_Token"),
        },
    }); 

    return (
        <div>
         
        </div>
    );
}

export default Chatroom;