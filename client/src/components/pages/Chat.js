import React, { useEffect, useState, useRef  } from 'react'

import axios from "axios";
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Footer from '../Footer';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import { withRouter } from 'react-router';
import MicRecorder from 'mic-recorder-to-mp3';
import {Recorder} from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'
import Voice from "./Voice";
import PopUp from "./PopUp"; 

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    footer: {
        top: 'auto',
        bottom: 0
    },
    input:{
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
    },
    inputRoot: {
        color: 'inherit',
      },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
        
    }
  }));

const Chat = ({match, socket}) => {
    const classes = useStyles();
    const chatroomId = match.params.id;
    const messagesEndRef = useRef(null);
    const [chatName, setChatName] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [isChatActive, setChatStatus] = useState(true);


    
    const getUser = async () => {
        const res = await axios.get("/api/auth", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserName(res.data.name);
        setUserId(res.data._id);
      };
    
      useEffect(() => {
        getUser();
      }, []);

    const getChat = async () => {

        const chatroom = await axios.get("/api/chat/getById", { 
            params: {
                chatroomId  
            }
        });
        let response = chatroom.data;
        setChatName(response.name);
        setChatStatus(!response.complete);       
    };
    useEffect(() => {
        console.log("chatname: ", chatName);
        getChat();
    }, []);


    const [messages, setMessages] = useState([]); 
    const messageRef = useRef();

    const [file, setFile] = useState();
    const [mp3, setMP3] = useState();
    const sendMessage = () => {
        getChat();
        if(socket) {
            console.log("--------socket", file)
            console.log("kkkkkkkkkkkkkkkkkkkkk", )
            if(file){
                console.log("File exist", typeof(file))
                const messageObject = {
                    chatroomId, 
                    message : file,
                    };
                    setFile();
                socket.emit("chatroomMessage", messageObject);
                messageRef.current.value = file;
            } else {
                const messageObject = {
                    chatroomId, 
                    message : messageRef.current.value,
                    };
                socket.emit("chatroomMessage", messageObject);
                messageRef.current.value = "";
            }
            messageRef.current.value = "";
        }
        console.log(messages);
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

            socket.on("historyMessages", (formattedMessageArray) => {
                let jsonArray = JSON.parse(JSON.stringify(formattedMessageArray)).formattedMessageArray;
                // console.log("\nFRONTEND RECEIVED HISTORYMESSAGES:\n", jsonArray, "\n");
                // console.log("\nFRONTEND RECEIVED typeof jsonArray:\n", typeof jsonArray, "\n");
                // console.log("\nFRONTEND RECEIVED jsonArray.formattedMessageArray.length:\n", jsonArray.length, "\n");

                setMessages([...messages, ...jsonArray]);
            });

            socket.on("newMessage", (message) => {
                setMessages([...messages, message]);
                getChat();
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth",
                                                block: 'end',
                                                inline: 'nearest' })
    }

    useEffect(() => {
        scrollToBottom()
      }, [messages]);

    const handleCompleteChat = async (e)=>{
        console.log("sending id:", chatroomId);
        try{
            await axios.post(
                "/api/chat/complete",
                {  chatroomId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
            ).then(function(response){
                console.log("RESPONSE FROM MARKING CHATROOM AS COMPLETE:\t", response.data.message);
              })
        } catch (e) {
            console.log(e);
        }

        sendMessage();
        window.location.href="/chatList";
    };

    const handleLeaveChat = () =>{
        window.location.href="/chatList";
    };

    const selectFile = (e) =>{
        console.log("Here !!!")
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            setFile(reader.result);
        console.log('RESULT', reader.result);
        }
    reader.readAsDataURL(file);
    };
    const [seen, setSeen] = useState();
    const togglePop = () => {
        setSeen(
         !seen
        );
       };
    return (
        <div >
    
            {/*  Chat name: */}   
            <AppBar position="static">
                <Toolbar>
                    <Grid container alignItems="center">
                        <Grid item xs={11}>
                            <Typography variant="h6" >
                                {chatName}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            {isChatActive ? <Button variant="contained" color="secondary" onClick={handleCompleteChat}>Finish translation</Button> :
                                            <Button variant="contained" color="secondary" onClick={handleLeaveChat}>Leave Room</Button>}
                            
                        </Grid>                    
                    </Grid>
                </Toolbar>
            </AppBar> 
    
            {/*  Messages window. */}   
            <Paper style={{height: 500, overflow: 'auto'}}>
            {messages.map((message, i) => (
              userName == message.name ? 
              <List> 
                    <ListItem key= {i} style={{marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, display: "flex", flexDirection: "row-reverse"}} >
                            <List style={{paddingTop: 0, paddingBottom: 0}} >
                                <Box fontWeight="fontWeightBold" fontSize={12} m={1}>{message.name}</Box>
                                {userName == message.name && message.message.startsWith('data:image') ? <img style={{width:350, height: "auto"}} src={message.message} alt="image"></img>
                                :userName == message.name ?
                                    <Chip avatar={<Avatar>{message.name.charAt(0)}</Avatar>} label={message.message} color="primary"/> 
                                    
                                            : message.name=='' ? <Typography>{message.message}</Typography>
                                            : message.message.startsWith('data:image') ? <img style={{width:350, height: "auto"}} src={message.message} alt="image"></img>
                                    : <Chip avatar={<Avatar>{message.name.charAt(0)}</Avatar>} label={message.message} /> 
                                    }
                                
                                <Box textAlign="right"  fontSize={12} m={1}>{message.time}</Box>
                            </List>   
                    </ListItem>
                    <div ref={messagesEndRef} />
                </List>
                :
                <List> 
                    <ListItem key= {i} style={{marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0}} >
                        <List style={{paddingTop: 0, paddingBottom: 0}} >
                            <Box fontWeight="fontWeightBold" fontSize={12} m={1}>{message.name}</Box>
                            {userName == message.name && message.message.startsWith('data:image') ? <img style={{width:350, height: "auto"}} src={message.message} alt="image"></img>
                                :userName == message.name ?
                                    <Chip avatar={<Avatar>{message.name.charAt(0)}</Avatar>} label={message.message} color="primary"/> 
                                    
                                            : message.name=='' ? <Typography>{message.message}</Typography>
                                            : message.message.startsWith('data:image') ? <img style={{width:350, height: "auto"}} src={message.message} alt="image"></img>
                                    : <Chip avatar={<Avatar>{message.name.charAt(0)}</Avatar>} label={message.message} /> 
                                    }
                            
                            <Box textAlign="right"  fontSize={12} m={1}>{message.time}</Box>
                        </List>   
                    </ListItem>
                        <div ref={messagesEndRef} />
                </List>

            ))}
            </Paper>  
    
            {/* Input field. Attach icon, input field, voice message */}
            {isChatActive ? 
            <div className={classes.root}>
                <AppBar position="relative" className={classes.footer}>
                    <Toolbar>
                    <div className={classes.input}>
                            <InputBase
                                accept="image/*"
                                id="icon-button-file"
                                type="file"
                                onChange={selectFile} 
                                type="file"
                            />
                            </div>
                        <div className={classes.input}>
                            <InputBase
                                placeholder="Type your message"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'input' }}
                                inputRef={messageRef}
                            />
                        </div>
                        <IconButton onClick={sendMessage}><SendIcon /></IconButton>
                        <div>
                            <div className="btn" onClick={togglePop}>
                            <button>Record</button>
                            </div>
                            {seen ? <PopUp toggle={togglePop} /> : null}
                            </div>
                        <IconButton onClick={Voice}><MicIcon/></IconButton>
                                
    
                    </Toolbar>
                </AppBar>
            </div> : <div></div>}
            
    
          <Footer />
        </div>
      );
    }
    
    export default withRouter(Chat);