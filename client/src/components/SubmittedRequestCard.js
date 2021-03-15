import React, { useState } from 'react';
import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import CloseIcon from '@material-ui/icons/Close';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { fade } from "@material-ui/core/styles/colorManipulator";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment';

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
      },
      textPurple: {
        color: "#d50000",
        "&:hover": {
          backgroundColor: fade("#d50000", theme.palette.action.hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      },
      outlinedPurple: {
        border: `1px solid ${fade("#d50000", 0.5)}`,
        "&:hover": {
          border: `1px solid ${"#d50000"}`
        },
      },
  }));

function SubmittedRequestCard(props) {
  const classes = useStyles();

  const timeOfRequest = moment(props.createdAt).format('LLL');
  const dueDateTime = moment(props.due).format('LLL');

  return (  
    <div>
        <Grid container spacing={10} direction="column" alignItems="center" justify="center">
                <Grid item xs={10} style={{
                    display: "center",
                    marginTop:10,
                    marginBottom:10,
                    marginLeft:10, 
                    marginRight:10
                }}>
                    <Card 
                        style={{
                            width: 350,
                            hight: 350,
                        }}
                    >
                        <CardContent >
                            <Grid container justify="center" alignItems="center" style={{ marginBottom: '1rem'}}>
                                {props.isActive == true ? 
                                    <div style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem', 
                                         display: 'flex', alignItems: 'center'}}>
                                        <div>  
                                            <Tooltip title="We will notify you once someone accepts your request">
                                                <HourglassEmptyIcon fontSize="large" style={{fill: "green"}}/> 
                                            </Tooltip> 
                                        </div>
                                        <div style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem', 
                                                        display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                                            <Typography gutterBottom align='center' component={'span'} style={{ fontWeight: 300 }}>
                                                This request is active and is waiting to be accepted by a translator.
                                            </Typography >
                                        </div>
                                    </div>
                                    :
                                    <div style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem', 
                                         display: 'flex', alignItems: 'center'}}>
                                        <div>
                                            <Tooltip title="Your request expired before we could find a translator">
                                                <CloseIcon fontSize="large" style={{fill: "red"}}/>
                                            </Tooltip> 
                                        </div>
                                        <div style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}} >
                                            <Typography gutterBottom align='center' component={'span'}  style={{ fontWeight: 300 }}>
                                                This request expired. You can remove it and submit a new one. 
                                            </Typography >
                                        </div>
                                    </div>
                                }
                            </Grid>
                            <Typography gutterBottom component={'span'}>
                                <Box border={1} borderColor="grey.300" borderRadius={16} style={{ marginTop: '1rem', marginBottom:'0.5rem'}}>
                                    <Typography gutterBottom align='center' component={'span'} style={{ fontWeight: 600, fontSize:18, marginLeft:'1rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                        {props.from} to {props.to}
                                    </Typography >
                                </Box>
                                <Box display='block' style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                    <Box fontWeight="bold" display="inline"> 
                                        <Tooltip title="Request submission time"><AddCircleOutlineIcon/></Tooltip>
                                    </Box>
                                    <Box m={1} display="inline">{timeOfRequest}</Box>
                                </Box>
                                <Box display='block' style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                    <Box fontWeight="bold" display="inline">
                                        <Tooltip title="Due date of your request">
                                            { props.isActive ? 
                                                <ScheduleIcon/> 
                                                : 
                                                <ScheduleIcon style={{fill: "red"}}/> 
                                            }
                                        </Tooltip>
                                    </Box>
                                    { props.isActive ? 
                                        <Box m={1} display="inline">{dueDateTime}</Box>
                                        :
                                        <Box m={1} color="red" display="inline">{dueDateTime}</Box>
                                    }
                                </Box>
                                {props.femaleTranslator == true ? 
                                        <Box display='block' style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                            <Box display="inline"><CheckIcon/> Requested a female translator</Box>
                                        </Box> 
                                        : 
                                        <Box display='block' style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                            <Box display="inline"><NotInterestedIcon/> Didn't request a female translator</Box>
                                        </Box>
                                    } 
                                    {props.documentProofreading == true ?
                                        <Box display='block' style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                            <Box display="inline"><CheckIcon/> Requested document proofreading</Box>
                                        </Box>
                                        :
                                        <Box display='block' style={{ marginTop: '1rem', marginLeft: '0.5rem', marginBottom:'0.5rem'}}>
                                            <Box display="inline"><NotInterestedIcon/> Didn't request document proofreading</Box>
                                        </Box>
                                    }
                            </Typography >
                        </CardContent>
                        <CardActions className={classes.root}>
                            {props.isActive ?
                                <Button variant="outlined" size="small"/*onClick={}*/ >Edit Request</Button> 
                                :
                                <></>
                            }
                            <Button variant="outlined" size="small" className={classes.outlinedPurple, classes.textPurple} /*onClick={}*/ >Remove Request</Button>
                        </CardActions>     
                    </Card> 
                </Grid>
        </Grid>
    </div>
  );
}

export default SubmittedRequestCard;
