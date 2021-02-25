import React, { useEffect, useState } from "react";
import axios from "axios";
import ActiveRequestCard from './ActiveRequestCard';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

export default function ActiveRequestList() {

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
        <ActiveRequestCard 
          femaleTranslator = {request.femaleTranslator} 
          documentProofreading = {request.documentProofreading} 
          urgentTranslation= {request.urgentTranslation} 
          name ={'FixMe'} 
          createdAt= {request.createdAt} 
          from = {request.languageFrom} 
          to={request.languageTo}>
        
        </ActiveRequestCard>
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
          <ActiveRequestCard name ={'FixMe'} createdAt= {request.createdAt} from = {request.languageFrom} to={request.languageTo}></ActiveRequestCard>
      </Grid>
      )
    setState({});
  }

  const getRequests = async () => {
    const reqs = await axios.get("/api/requests");
    setRequest(reqs.data);
  };

  useEffect(() => {
    getRequests(); 
  }, []);

  // const getUserName = async (id) => {
  //   const reqs = await axios.get("/api/users/:id",
  //   {
  //     params: {
  //       userId: id,
  //     }
  //   });
  //   console.log(reqs.data);
  // };

  // getUserName("6035d317540e3934a4f65114");
    const classes = useStyles();
    return (
        <div style={{ marginTop: 100 }}>
          <Grid container alignItems="center" spacing={3} >
            <Grid  item xs={11}>
            <Typography align="center" variant="h3" gutterBottom>
              Matching Active Requests
            </Typography>
            </Grid> 
            <Grid item xs={1}>
              <IconButton  color="primary" aria-label="Refresh Active requests list" onClick={handleRefresh}><RefreshIcon className={classes.root} /></IconButton>
            </Grid>            
              {result}
          </Grid>
        </div>  
        

    );
  }

