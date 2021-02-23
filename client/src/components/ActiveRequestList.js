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

  const [data, setData] = useState({
    // user: "",
    // languageFrom: "",
    // languageTo: "",
    // femaleTranslatorBool: false,
    // urgentTranslatorBool: false,
    // documentProofReadingBool: false,
    // isActive: true
    requests: ""
  });

  const getRequests = async () => {
    const reqs = await axios.get("/api/requests");
    setData({ ...data, requests: reqs.data});
  };

  useEffect(() => {
    getRequests();
  }, []);


  let list = data.requests;
  if (typeof list === 'string'){
    list = [];
  }
  const result = list.map(request => 
    <Grid item key = {request._id}>
          <ActiveRequestCard name ='Marina' createdAt= {request.createdAt} from = {request.languageFrom} to={request.languageTo}></ActiveRequestCard>
      </Grid>
      )

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
              {result}
            </Grid>
        </div>
        

    );
  }

