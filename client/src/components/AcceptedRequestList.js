import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AcceptedRequestCard from "./AcceptedRequestCard";
import List from '@material-ui/core/List';

function AcceptedRequestList(props) {

  const useStyles = makeStyles(theme => ({
    root: {
      justifyContent: "center"    },
  }));

  const [acceptedRequests, setAcceptedRequests] = useState("");
  let [, setState] = useState();
  let user = props.user;
//   let userID = props.user._id;

  let list = acceptedRequests;
  if (typeof list === 'string'){
    list = [];
  } 
  let result = list.map(acceptedRequest => 
    <Grid item xs={3} key = {acceptedRequest._id}>
        <AcceptedRequestCard 
          femaleTranslator = {acceptedRequest.femaleTranslator} 
          documentProofreading = {acceptedRequest.documentProofreading} 
          name ={acceptedRequest.author ? acceptedRequest.author.name : acceptedRequest.author}
          from = {acceptedRequest.languageFrom} 
          to={acceptedRequest.languageTo}
          requestID={acceptedRequest._id}
          due={acceptedRequest.dueDateTime}
          image={acceptedRequest.author ? acceptedRequest.author.image : acceptedRequest.author}
        >
        </AcceptedRequestCard>
    </Grid>
    )

  const handleRefresh = () => {
    getAcceptedRequests();
    let list = acceptedRequests;
    if (typeof list === 'string'){
      list = [];
    }
    result = list.map(acceptedRequest => 
      <Grid item xs={3} item key = {acceptedRequest._id}>
        <AcceptedRequestCard 
            name ={acceptedRequest.author ? acceptedRequest.author.name : acceptedRequest.author}
            femaleTranslator = {acceptedRequest.femaleTranslator} 
            documentProofreading = {acceptedRequest.documentProofreading} 
            createdAt= {acceptedRequest.createdAt} 
            from = {acceptedRequest.languageFrom} 
            to={acceptedRequest.languageTo} 
            due={acceptedRequest.dueDateTime} 
            acceptedTranslator={acceptedRequest.acceptedTranslator}
        ></AcceptedRequestCard>
      </Grid>
      )
    setState({});
  }

  let userID = props.user._id;

  const getAcceptedRequests = async () => {
    console.log("In getAcceptedRequests()");
    const reqs = await axios.get("/api/users/accepted_requests", { 
        params: {
          userID
        }
      });
    console.log("Accepted request author: ", reqs.data.author);
    setAcceptedRequests(reqs.data);
  };
 
  useEffect(() => {
    getAcceptedRequests(); 
  }, []);


    const classes = useStyles(); 
    return (
        <div style={{ marginTop: 50, marginBottom: 100 }}>
          {// Only show if there is any result
            result === undefined || result.length == 0 ?
            <Grid container align="center" spacing={10} 
            direction="column" alignItems="center" justify="center">
              <Grid  item xs={11} >
                <Typography component={"span"} variant="h4">
                    You don't have any accepted requests at the moment.
                </Typography>
              </Grid> 
              <Grid item xs={1}>
                <IconButton  color="primary" aria-label="Refresh matched requests list" onClick={handleRefresh}><RefreshIcon className={classes.root} /></IconButton>
              </Grid>   
            </Grid>
            : 
            <Grid container align="center" spacing={3} >
              <Grid  item xs={11}>
              <Typography component={"span"} variant="h4" >
                You accepted the following requests. Click on a request to chat with its author.
              </Typography>
              </Grid> 
              <Grid item xs={1}>
                <IconButton  color="primary" aria-label="Refresh matched requests list" onClick={handleRefresh}><RefreshIcon className={classes.root} /></IconButton>
              </Grid>        
              <Grid item xs={12} component={"div"}>
                 <List>
                    {result}
                </List> 
              </Grid>    
            </Grid>
          }
        </div>  

    );
  }

export default AcceptedRequestList;