import React, { useEffect, useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Footer from '../Footer';
import AppBar from '@material-ui/core/AppBar';
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
import SendIcon from '@material-ui/icons/Send';
import ChatRoom from '../ChatRoom';
import { IconButton } from '@material-ui/core';

import io from "socket.io-client"

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

const Chat = (props) => {

    const chatroomId = props.id;
    const socket = io("http://localhost:5000", {
        query: {
            token: localStorage.getItem("token"),
        },
        transport : ['websocket']
    });

    const classes = useStyles();
    const messages = [
        {
            id: 1,
            user: 'Tom',
            message: "Message message message message",
            timestamp: "6:45pm"
        },
        {
            id: 2,
            user: 'Paul',
            message: "Message message message message",
            timestamp: "6:45pm"
        },
        {
            id: 3,
            user: 'Paul',
            message: "Message message message message",
            timestamp: "6:45pm"
        },
        {
            id: 4,
            user: 'Tom',
            message: "Message message message message",
            timestamp: "6:45pm"
        },
        {
            id: 5,
            user: 'Paul',
            message: "Message message message message",
            timestamp: "6:45pm"
        },
    ]

  return (
    <div >
        {/*  Chat name: 
            UserName - TranslatorName (languageFrom - languageTo);
            Fixed */}

        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" >
                    Tom - Paul (English - Italian)
                </Typography>               
            </Toolbar>
        </AppBar>

        {/*  Messages window. 
            From logged in user: on right, from other user: on left in diff. color;
            Scrollable  */}

        <Paper style={{height: 500, overflow: 'auto'}}>
            <List>
                {messages.map(({ id, user, message, timestamp }) => (
                    <ListItem key= {id}>
                        <List>
                            <Box fontWeight="fontWeightBold" fontSize={12} m={1}>{user}</Box>
                            <Chip avatar={<Avatar>{user.charAt(0)}</Avatar>} label={message}/>
                            <Box textAlign="right"  fontSize={12} m={1}>{timestamp}</Box>
                        </List>   
                    </ListItem>
                ))}
            </List>
        </Paper>

        {/* Input field.
            Attach icon, input field, voice message */}
        <div className={classes.root}>
            <AppBar position="relative" className={classes.footer}>
                <Toolbar>
                    <IconButton> <AttachFileIcon/> </IconButton>

                    <div className={classes.input}>
                        <InputBase
                            placeholder="Type your message"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'input' }}
                        />
                    </div>

                    <IconButton><SendIcon/></IconButton>
                    <IconButton><MicIcon/></IconButton>

                </Toolbar>
            </AppBar>
        </div> 
        

        

      <ChatRoom />
      <Footer />
    </div>
  );
}

export default Chat
