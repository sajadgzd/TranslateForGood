import React from "react";

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import SwipeableViews from 'react-swipeable-views'

import SubmittedRequestList from './SubmittedRequestList';
import MatchedRequestList from './MatchedRequestList';
import AcceptedRequestList from "./AcceptedRequestList";
 
function TabPanel(props) {

    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  const useStylesTabs = makeStyles((theme) => ({
    root: {
      backgroundColor: "#e8eaf6"
    },
  }));

  const RequestsTabs = (props) => {
    const user = props.user;

    const classesTabs = useStylesTabs();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setValue(index);
    };

    return (
        <div>
        <AppBar position="static" color="default">
            {
              user.languageFrom === undefined || user.languageFrom.length == 0 ?
              <Tabs
                  className={classesTabs.root}
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
              >
                <Tab label="Submitted Requests" {...a11yProps(0)} /> 
              </Tabs>
              :
              <Tabs
                  className={classesTabs.root}
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  >
                  <Tab label="Matched Requests" {...a11yProps(0)} />
                  <Tab label="Accepted Requests" {...a11yProps(1)} />  
                  <Tab label="Submitted Requests" {...a11yProps(2)} />   
              </Tabs>        
          }
        </AppBar>
          {
          user.languageFrom === undefined || user.languageFrom.length == 0 ?
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <SubmittedRequestList user={user}/>
                </TabPanel>
              </SwipeableViews>
            :
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <MatchedRequestList user={user}/>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <AcceptedRequestList user={user}/>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <SubmittedRequestList user={user}/>
              </TabPanel>
            </SwipeableViews>
          }
        </div>
    )
}

export default RequestsTabs;