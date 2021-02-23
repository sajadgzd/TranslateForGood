import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    border: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: '5px 0px',
    // padding: '2px 2px',
    backgroundColor: '#FAFAFA'
},
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));


function ActiveRequestCard(props) {
  const classes = useStyles();
  const selectRequest = () => void 0;
  const timeOfRequest = moment(props.createdAt).format('LLL');

  return (  
        <Card className={classes.root}>
            <div style={{ width: '100%' }}>
                <Box display="flex" p={1} >
                    <Box p={1} flexGrow={1}> 
                        <CardContent>
                            <Box display="flex" p={1}>
                                
                                <Box p={1}>
                                    {props.from} to {props.to}
                                </Box>
                                <Box p={1}>
                                    {timeOfRequest}
                                </Box>
                                <Box p={1}>
                                    {props.name}
                                </Box>
                            </Box>
                        </CardContent>
                    </Box>
                
                    <Box p={1}>
                        <CardActions>
                            {/* <IconButton color="primary" aria-label="View attached documents" onClick={showAttachments}>
                                <AttachFileIcon />
                            </IconButton> */}
                            <Button  variant="contained" color="primary" onClick={selectRequest}>Select</Button>
                        </CardActions>
                    </Box>
                    
                </Box>
            </div>   
        </Card> 
  );
}

export default ActiveRequestCard;
