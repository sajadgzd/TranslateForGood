import axios from "axios";
import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
        paddingTop: theme.spacing(10)
      },
    paper: {
        elevation: 3,
        width: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
      },
      button: {
        margin: theme.spacing(1),
      },
  }));


const ChatList = (props) => {
    const[showTransl, setShowTransl] = useState(false);
    const socket = props.socket;

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
        setShowTransl(user.languageFrom != "");
        console.log(user);
        let requestsList = user.translationActivity.accepted;
        const chatroomsTranslator = await axios.get("/api/chat/filter", { 
            params: {
                requestsList  
            }
        });

        setChatroomsTranslator( chatroomsTranslator.data);
        
        
    };
    useEffect(() => {
        console.log("Socket: ", socket);
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
        setShowTransl(user.languageFrom != "");
        if (user){
            let requestsList = user.requests;
            const chatroomsRequester = await axios.get("/api/chat/filter", { 
                params: {
                    requestsList  
                }
            });

            setChatroomsRequester(chatroomsRequester.data);
        }    
    };
    useEffect(() => {
        console.log("Socket: ", socket);
        getChatroomsRequester();
    }, []);

    const classes = useStyles();

    return (
        <Grid container className={classes.root} spacing={2}>
            
            <Grid item xs={6}>
                <Typography variant="h5" align="center">
                    Get Translation:
                </Typography>
                <Grid container justify="flex-start" >
                {chatroomsRequester.map((chatroom) => (
                    <Paper key={chatroom._id} className={classes.paper}>
                        <Grid item>
                            <Grid item>
                            {chatroom.name}
                            </Grid>
                            <Grid container justify="center">
                                <Link to={'/chat/' + chatroom._id}>
                                    <div>Join</div>
                                </Link>
                            </Grid>

                        </Grid>
                    </Paper>
                ))}
                </Grid>
            </Grid>    
            <Grid item xs={6}>
            <Typography variant="h5"  align="center"> 
                {showTransl ? <div>Translate:</div> : null}
            </Typography>
                <Grid container justify="flex-start" >
                {chatroomsTranslator.map((chatroom) => (
                    <Paper key={chatroom._id} className={classes.paper} >
                        <Grid item>
                            <Grid item>
                            {chatroom.name}
                            </Grid>
                            <Grid container justify="center">
                                {/* <Button href={"/chat/" + String(chatroom._id)} className={classes.button} variant="contained" color="primary">
                                    Join
                                </Button> */}
                                <Link to={'/chat/' + chatroom._id}>
                                    <div>Join</div>
                                </Link>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
                </Grid>
            </Grid> 
        </Grid> 
        
    )
};

export default ChatList;