import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchedRequestCard from './MatchedRequestCard';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SubmittedRequestCard from "./SubmittedRequestCard";


function SubmittedRequestList(props) {

  const useStyles = makeStyles(theme => ({
    root: {
      justifyContent: "center"    },
  }));

  const [requests, setRequest] = useState("");
  let [, setState] = useState();
  let user = props.user;
//   let userID = props.user._id;

  let list = requests;
  if (typeof list === 'string'){
    list = [];
  } 
  let result = list.map(request => 
    <Grid item xs={3} key = {request._id}>
        <SubmittedRequestCard 
          femaleTranslator = {request.femaleTranslator} 
          documentProofreading = {request.documentProofreading} 
          createdAt= {request.createdAt} 
          from = {request.languageFrom} 
          to={request.languageTo}
          requestID={request._id}
          due={request.dueDateTime}
          isActive={request.isActive}
        >
        </SubmittedRequestCard>
    </Grid>
    )

  const handleRefresh = () => {
    getSubmittedRequests();
    let list = requests;
    if (typeof list === 'string'){
      list = [];
    }
    result = list.map(request => 
      <Grid item xs={3} item key = {request._id}>
        <SubmittedRequestCard 
            createdAt= {request.createdAt} from = {request.languageFrom} to={request.languageTo} due={request.dueDateTime}
        ></SubmittedRequestCard>
      </Grid>
      )
    setState({});
  }

  let userID = props.user._id;

  const getSubmittedRequests = async () => {
    const reqs = await axios.get("/api/users/" + userID + "/requests", { 
        params: {
          userID
        }
      });
    setRequest(reqs.data);
    console.log("RETURNED REQUESTS: ", reqs.data);
  };
 
  useEffect(() => {
    getSubmittedRequests(); 
  }, []);


    const classes = useStyles(); 
    return (
        <div style={{ marginTop: 50, marginBottom: 100 }}>
          {// Only show if there is any result
            result === undefined || result.length == 0 ?
            <Grid container spacing={10} direction="column" alignItems="center" justify="center" >
              <Grid  item xs={10} >
                <Typography align="center" variant="h4">
                    You don't have any submitted requests at the moment.
                </Typography>
              </Grid> 
              <Grid item xs={1}>
                <IconButton  color="primary" aria-label="Refresh matched requests list" onClick={handleRefresh}><RefreshIcon className={classes.root} /></IconButton>
              </Grid>            
                {result}
            </Grid>
            : 
            <Grid container alignItems="center" spacing={3} >
              <Grid  item xs={11}>
              <Typography align="center" variant="h4" >
                You submitted the following requests 
              </Typography>
              </Grid> 
              <Grid item xs={1}>
                <IconButton  color="primary" aria-label="Refresh matched requests list" onClick={handleRefresh}><RefreshIcon className={classes.root} /></IconButton>
              </Grid>            
                {result}
            </Grid>
          }
        </div>  

    );
  }

export default SubmittedRequestList;