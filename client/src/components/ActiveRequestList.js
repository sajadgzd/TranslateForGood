import React, { useEffect, useState } from "react";
import axios from "axios";
import ActiveRequestCard from './ActiveRequestCard';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    }
  })); 
  
  export default function ActiveRequestList() {
    // const getRequests = async() =>{
    //   const reqs = await axios.get("/api/requests");
    //   return(reqs.data);
    // }
    // let newRequestList = getRequests();



    // // retrieve active requests every minute
    // const MINUTE_MS = 60000;
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     newRequestList = getRequests();
    //     console.log(newRequestList);
    //     console.log('Logs every minute');
    //   }, MINUTE_MS ); 
 
    //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    // }, [])

   
    return (
        <div>
            <h1>Matching Active Requests:</h1>
            <Grid>
              <Grid item>
                  <ActiveRequestCard name ='Marina' createdAt='today' from = 'English' to='Russian'></ActiveRequestCard>
              </Grid>
              <Grid item>
                  <ActiveRequestCard name ='Stanley' createdAt='today' from = 'English' to='Polish'></ActiveRequestCard>
              </Grid>
            </Grid>
        </div>
        

    );
  }

