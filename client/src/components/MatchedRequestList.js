import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchedRequestCard from './MatchedRequestCard';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

export default function MatchedRequestList(props) {

  const useStyles = makeStyles(theme => ({
    root: {
      justifyContent: "center"    },
  }));

  const [requests, setRequest] = useState("");
  let [, setState] = useState();

  let list = requests;
  if (typeof list === 'string'){
    list = [];
  } 

  let result = list.map(request => 
    <Grid item xs={3} key = {request._id}>
        <MatchedRequestCard 
          femaleTranslator = {request.femaleTranslator} 
          documentProofreading = {request.documentProofreading} 
          urgentTranslation= {request.urgentTranslation} 
          name ={request.author ? request.author.name : request.author} 
          createdAt= {request.createdAt} 
          from = {request.languageFrom} 
          to={request.languageTo}>
        
        </MatchedRequestCard>
    </Grid>
    )

  const handleRefresh = () => {
    getRequests();
    let list = requests;
    if (typeof list === 'string'){
      list = [];
    }
    result = list.map(request => 
      <Grid item xs={3} item key = {request._id}>
          <MatchedRequestCard name ={request.author ? request.author.name : request.author} createdAt= {request.createdAt} from = {request.languageFrom} to={request.languageTo}></MatchedRequestCard>
      </Grid>
      )
    setState({});
  }
  let userID = props.user._id;
  const getRequests = async () => {
    const reqs = await axios.get("/api/users/translatorsMatchedRequests", { 
        params: {
          userID
        }
      });
    console.log("/api/users/translatorsMatchedRequests:\t", reqs)
    setRequest(reqs.data);
  };
 
  useEffect(() => {
    getRequests(); 
  }, []);


    const classes = useStyles(); 
    return (
        <div style={{ marginTop: 100 }}>
          {// Only show if there is any result
            result === undefined || result.length == 0 ?
            <Grid container alignItems="center" spacing={3} >
              <Grid  item xs={11}>
              <Typography align="center" variant="h4" gutterBottom>
                You are not matched with any requests at the moment.
              </Typography>
              </Grid> 
              <Grid item xs={1}>
                <IconButton  color="primary" aria-label="Refresh Active requests list" onClick={handleRefresh}><RefreshIcon className={classes.root} /></IconButton>
              </Grid>            
                {result}
            </Grid>
            : 
            <Grid container alignItems="center" spacing={3} >
              <Grid  item xs={11}>
              <Typography align="center" variant="h4" gutterBottom>
                You are matched with the following requests
              </Typography>
              </Grid> 
              <Grid item xs={1}>
                <IconButton  color="primary" aria-label="Refresh Active requests list" onClick={handleRefresh}><RefreshIcon className={classes.root} /></IconButton>
              </Grid>            
                {result}
            </Grid>
          }
        </div>  

    );
  }

