import React from 'react';
import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@mdi/react'


import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { mdiFaceWoman } from '@mdi/js';
import AlarmIcon from '@material-ui/icons/Alarm';
import DescriptionIcon from '@material-ui/icons/Description';
import moment from 'moment';
import defaultImage from './default_photo.png';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    root: {
      justifyContent: "center",
      marginBottom: 10
    },
    media: {
      height: 140
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        justifyContent: "center"
      },
    acceptButtonColor: {
        borderColor: '#4caf50',
        color: '#4caf50',
        '&:hover': {
            color: '#4caf50',
            borderColor: '#4caf50',
            boxShadow: 'none',
          },
      }
  }));

const colorVocabIcon = {'true': "secondary", 'false': "disabled"};
const colorVocabCustomIcon = {'true': "#dc004e", 'false': "#D3D3D3"};


function MatchedRequestCard(props) {
  const classes = useStyles();
  
  const handleAcceptMachedTranslationRequest = (requestID, acceptedUserID) => async (e) => {
    e.preventDefault();
    await axios.post(
    "/api/requests/onAccepted",
    {requestID, acceptedUserID},
    {
        headers: {
        "Content-Type": "application/json",
        },
    }
    ).then(function(response){
        console.log("RESPONSE FROM Accept:\t", response.data)
    });
  };
  const handleDeclineMachedTranslationRequest = async () => {
    // to be implemented later
    
    //   await axios.post(
    //     //   
    //     ).then(function(response){
    //       // console.log("RESPONSE FROM Decline:\t", response.data)
    //     });
  };
  const timeOfRequest = moment(props.createdAt).format('LLL');
  const dueDateTime = moment(props.due).format('LLL');

  return (  
        <Card className={classes.root}>
            <CardContent >
                <Grid container justify="center" alignItems="center"><Avatar alt="Profie Picture" className={classes.large}  src={defaultImage} /></Grid>
                
                <Typography gutterBottom component={'span'}>
                    <Typography gutterBottom align='center' component={'span'} variant="h6" component="h1" style={{ fontWeight: 600 }}>
                        {props.from} to {props.to}

                    </Typography >
                    <Box display='block'>
                        <Box fontWeight="bold" display="inline">Posted:</Box>
                        <Box m={1} display="inline"> {timeOfRequest}</Box>
                    </Box>
                    <Box display='block'>
                        <Box fontWeight="bold" display="inline">User:</Box>          
                        <Box m={1} display="inline">{props.name}</Box>
                    </Box>
                    <Box display='block'>
                        <Box fontWeight="bold" display="inline">Due Time:</Box>          
                        <Box m={1} display="inline">{dueDateTime}</Box>
                    </Box>
                </Typography >
                <Box style={{ marginTop: 20 }}>
                    <Tooltip title="Only Female Translator"><Icon path={mdiFaceWoman} size={1.5} color={colorVocabCustomIcon[props.femaleTranslator]}/></Tooltip>
                    <Tooltip title="Document Proofreading"><DescriptionIcon color={colorVocabIcon[props.documentProofreading]} fontSize="large"/></Tooltip>
                </Box>
            </CardContent>
            
            <CardActions className={classes.root}>
                <Button variant="outlined" size="small" color="primary" onClick={handleAcceptMachedTranslationRequest(props.requestID, props.acceptedUserID)} className={classes.acceptButtonColor}>Accept</Button>
                <Button variant="outlined" size="small" color="secondary" onClick={handleDeclineMachedTranslationRequest} >Decline</Button>
            </CardActions>
                    
        </Card> 
  );
}

export default MatchedRequestCard;
