import React, { useEffect, useState, useRef } from 'react'
import {withRouter} from "react-router-dom";

const Chat = ({match, socket}) => {

    const chatroomId = match.params.id;
    const [messages, setMessages] = useState([]);
    
    const messageRef = useRef();

    const sendMessage = () => {
        if(socket) {
            socket.emit("chatroomMessage", {
                chatroomId, 
                message : messageRef.current.value,
            });
            messageRef.current.value = "";
        }
    };

    useEffect(() => {   
        if(socket) {
            socket.on("newMessage", (message) => {
                const newMessages = [...messages, message];
                setMessages(newMessages);
            });
        }
    }, [messages]);

    useEffect(() => {   
        console.log("Chat ID: ", chatroomId);
        console.log("Socket: ", socket);
       
        if(socket) {
            socket.emit("joinRoom", {
                chatroomId,
            });

            socket.on("newMessage", (message) => {
                setMessages([...messages, message]);
            });
        }

        return () => {
            if(socket) {
                socket.emit("leaveRoom", {
                    chatroomId,
                });
            }
        };
    }, []);

    return (
        <div >
            CHATTTTTT
            <div className="chatroomPage">
                <div className="chatroomSection">
                    <div className="cardHeader">Chatroom Name</div>
                </div>
                <div className="chatroomContent">
                    {messages.map((message, i) => (
                        <div key={i} className="message">
                            <span className="otherMessage">{message.name}:</span> {" "}
                            {message.message}
                        </div> 
                    ))}
                </div>
                <div className="chatroomActions">
                    <div>
                        <input type="text" name="message" placceholder="Say something!" ref={messageRef}></input>
                    </div>
                    <div>
                        <button className="Send" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Chat);



// import React, { useEffect, useState } from 'react'
// import axios from "axios";
// import { fade, makeStyles } from '@material-ui/core/styles';
// import InputBase from '@material-ui/core/InputBase';
// import Footer from '../Footer';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import Chip from '@material-ui/core/Chip';
// import Avatar from '@material-ui/core/Avatar';
// import Box from '@material-ui/core/Box';
// import AttachFileIcon from '@material-ui/icons/AttachFile';
// import MicIcon from '@material-ui/icons/Mic';
// import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
// import SendIcon from '@material-ui/icons/Send';
// import ChatRoom from '../ChatRoom';
// import { IconButton } from '@material-ui/core';
// import { withRouter } from 'react-router';

// const useStyles = makeStyles((theme) => ({
//     root: {
//       flexGrow: 1,
//     },
//     footer: {
//         top: 'auto',
//         bottom: 0
//     },
//     input:{
//         position: 'relative',
//         borderRadius: theme.shape.borderRadius,
//         backgroundColor: fade(theme.palette.common.white, 0.15),
//         '&:hover': {
//         backgroundColor: fade(theme.palette.common.white, 0.25),
//         },
//         marginRight: theme.spacing(2),
//         marginLeft: 0,
//         width: '100%',
//     },
//     inputRoot: {
//         color: 'inherit',
//       },
//     inputInput: {
//         padding: theme.spacing(1, 1, 1, 0),
//         // vertical padding + font size from searchIcon
//         paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
//         transition: theme.transitions.create('width'),
//         width: '100%',
//         [theme.breakpoints.up('md')]: {
//           width: '20ch',
//         },
        
//     }
//   }));

// const Chat = ({match, socket}) => {
//     const chatroomId = match.params.id;
//     const classes = useStyles();
//     const messages = [
//         {
//             id: 1,
//             user: 'Tom',
//             message: "Message message message message",
//             timestamp: "6:45pm"
//         },
//         {
//             id: 2,
//             user: 'Paul',
//             message: "Message message message message",
//             timestamp: "6:45pm"
//         },
//         {
//             id: 3,
//             user: 'Paul',
//             message: "Message message message message",
//             timestamp: "6:45pm"
//         },
//         {
//             id: 4,
//             user: 'Tom',
//             message: "Message message message message",
//             timestamp: "6:45pm"
//         },
//         {
//             id: 5,
//             user: 'Paul',
//             message: "Message message message message",
//             timestamp: "6:45pm"
//         },
//     ]

//     // this useEffect() is just to test if id and socket are passed correctly. can be deleted
//     useEffect(() => {
//         console.log("Checking chatroomId in Chat.js: ", chatroomId);
//         console.log("Checking socket in Chat.js: ", socket);
//     });

//   return (
//     <div >

//         {/*  Chat name: 
//             UserName - TranslatorName (languageFrom - languageTo);
//             Fixed */}

//         <AppBar position="static">
//             <Toolbar>
//                 <Typography variant="h6" >
//                     "Chat name here"
//                 </Typography>               
//             </Toolbar>
//         </AppBar> 

//         {/*  Messages window. 
//             From logged in user: on right, from other user: on left in diff. color;
//             Scrollable  */}

//         <Paper style={{height: 500, overflow: 'auto'}}>
//             <List>
//                 {messages.map(({ id, user, message, timestamp }) => (
//                     <ListItem key= {id}>
//                         <List>
//                             <Box fontWeight="fontWeightBold" fontSize={12} m={1}>{user}</Box>
//                             <Chip avatar={<Avatar>{user.charAt(0)}</Avatar>} label={message}/>
//                             <Box textAlign="right"  fontSize={12} m={1}>{timestamp}</Box>
//                         </List>   
//                     </ListItem>
//                 ))}
//             </List>
//         </Paper>  

//         {/* Input field.
//             Attach icon, input field, voice message */}
//         <div className={classes.root}>
//             <AppBar position="relative" className={classes.footer}>
//                 <Toolbar>
//                     <IconButton> <AttachFileIcon/> </IconButton>

//                     <div className={classes.input}>
//                         <InputBase
//                             placeholder="Type your message"
//                             classes={{
//                                 root: classes.inputRoot,
//                                 input: classes.inputInput,
//                             }}
//                             inputProps={{ 'aria-label': 'input' }}
//                         />
//                     </div>

//                     <IconButton><SendIcon/></IconButton>
//                     <IconButton><MicIcon/></IconButton>

//                 </Toolbar>
//             </AppBar>
//         </div> 
        

        

//       <ChatRoom />
//       <Footer />
//     </div>
//   );
// }

// export default withRouter(Chat);
