import React, { useState } from 'react';
import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@mdi/react';
import CloseIcon from '@material-ui/icons/Close';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { mdiFaceWoman } from '@mdi/js';
import AlarmIcon from '@material-ui/icons/Alarm';
import DescriptionIcon from '@material-ui/icons/Description';
import moment from 'moment';
import defaultImage from './default_photo.png';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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


function SubmittedRequestCard(props) {
  const classes = useStyles();

  const timeOfRequest = moment(props.createdAt).format('LLL');
  const dueDateTime = moment(props.due).format('LLL');

  const [openDialog, setDialog] = useState(false);
  const handleCloseDialog = () => {
    setDialog(false);
    window.location.reload(false);
  };

  return (  
    <div>
      <Card className={classes.root}>
          <CardContent >
              <Grid container justify="center" alignItems="center" style={{ marginBottom: '3rem'}}>
                {props.isActive == true ? 
                    <div>
                        <div> 
                            <HourglassEmptyIcon fontSize="large"/> 
                        </div>
                        <div>
                            <Typography gutterBottom align='center' component={'span'} style={{ fontWeight: 300 }}>
                                This request is active and waiting for a translator.
                            </Typography >
                        </div>
                    </div>
                    :
                    <div>
                        <div>
                            <CloseIcon fontSize="large"/>
                        </div>
                        <div>
                            <Typography gutterBottom align='center' component={'span'}  style={{ fontWeight: 300 }}>
                                Your request is expired. Unfortunatelly we didn't find a translator. You can remive this requests and submit a new one. 
                            </Typography >
                        </div>
                    </div>
                }
              </Grid>
              <Typography gutterBottom component={'span'}>
                  <Typography gutterBottom align='center' component={'span'} style={{ fontWeight: 600 }}>
                      {props.from} to {props.to}
                  </Typography >
                  <Box display='block'>
                      <Box fontWeight="bold" display="inline">Posted:</Box>
                      <Box m={1} display="inline"> {timeOfRequest}</Box>
                  </Box>
                  {/* <Box display='block'>
                      <Box fontWeight="bold" display="inline">User:</Box>          
                      <Box m={1} display="inline">{props.name}</Box>
                  </Box> */}
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
              <Button variant="outlined" size="small" color="secondary" /*onClick={}*/ >Remove Request</Button>
          </CardActions>     
      </Card> 
{/* 
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Request is Declined!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Request was successfully declined. Thank you for your time.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>  */}
    </div>
  );
}

export default SubmittedRequestCard;
