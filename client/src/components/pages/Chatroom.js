import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const Chatroom = () => {

    // const [chatrooms, setChatroomsList] = useState([]);
    const [chatroomsTranslator, setChatroomsTranslator] = useState([]);
    const [chatroomsRequester, setChatroomsRequester] = useState([]);


    // chatrooms where user is a translator
    const getChatroomsTranslator = async () => {

        const res = await axios.get("/api/auth", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
        });
        let user = res.data;
        let requestsList = user.translationActivity.accepted;
        const chatroomsTranslator = await axios.get("/api/chat/filter", { 
            params: {
                requestsList  
            }
          });

          setChatroomsTranslator(chatroomsTranslator.data);
        
    };
    useEffect(() => {
        getChatroomsTranslator();
    }, []);

    // chatrooms where user is a requester
    const getChatroomsRequester = async () => {

        const res = await axios.get("/api/auth", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
        });
        let user = res.data;
        // console.log(user);
        let requestsList = user.requests;
        const chatroomsRequester = await axios.get("/api/chat/filter", { 
            params: {
                requestsList  
            }
          });

          setChatroomsRequester(chatroomsRequester.data);
        
    };
    useEffect(() => {
        getChatroomsRequester();
    }, []);


    return (
        <div>
            <div>
                <div>Translate:</div>
                <div className="chatrooms">
                    {chatroomsTranslator.map((chatroom) => (
                        <div key={chatroom._id} className="chat">
                            <div>{chatroom.name}</div>
                            <Link to={"/chat/" + chatroom._id}>
                                <div>Join</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div>Get Translation:</div>
                <div className="chatrooms">
                    {chatroomsRequester.map((chatroom) => (
                        <div key={chatroom._id} className="chat">
                            <div>{chatroom.name}</div>
                            <Link to={"/chat/" + chatroom._id}>
                                <div>Join</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
    )
};

export default Chatroom;