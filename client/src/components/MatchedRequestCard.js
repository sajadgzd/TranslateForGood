import React from 'react';
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
  }));

const colorVocabIcon = {'true': "secondary", 'false': "disabled"};
const colorVocabCustomIcon = {'true': "#dc004e", 'false': "#D3D3D3"};


function MatchedRequestCard(props) {
  const classes = useStyles();
  const selectRequest = () => void 0;
  const timeOfRequest = moment(props.createdAt).format('LLL');

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
                </Typography >
                <Box style={{ marginTop: 20 }}>
                    <Tooltip title="Only Female Translator"><Icon path={mdiFaceWoman} size={1.5} color={colorVocabCustomIcon[props.femaleTranslator]}/></Tooltip>
                    <Tooltip title="Document Proofreading"><DescriptionIcon color={colorVocabIcon[props.documentProofreading]} fontSize="large"/></Tooltip>
                </Box>
            </CardContent>
            
            <CardActions className={classes.root}>
                <Button variant="contained" size="small" color="primary" onClick={selectRequest}>Select</Button>
            </CardActions>
                    
        </Card> 
  );
}

export default MatchedRequestCard;