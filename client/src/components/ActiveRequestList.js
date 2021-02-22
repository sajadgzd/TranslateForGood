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

