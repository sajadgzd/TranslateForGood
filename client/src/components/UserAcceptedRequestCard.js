import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { fade } from "@material-ui/core/styles/colorManipulator";

import CheckIcon from '@material-ui/icons/Check';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DescriptionIcon from '@material-ui/icons/Description';
import TranslateIcon from '@material-ui/icons/Translate';

import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      justifyContent: "center",
      marginBottom: 10
    },
    listItemStyle: {
        marginTop: '1rem',
        marginBottom:'1rem',
        color:"#616161"
    },
    boldLanguages : {
        fontWeight:"bold"
    },
    media: {
      height: 140
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        justifyContent: "center"
      },
    acceptButtonColor: {
        borderColor: '#4caf50',
        color: '#4caf50',
        '&:hover': {
            color: '#4caf50',
            borderColor: '#4caf50',
            boxShadow: 'none',
          },
      },
      textRed: {
        color: "#d50000",
        "&:hover": {
          backgroundColor: fade("#d50000", theme.palette.action.hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      },
      outlinedRed: {
        border: `1px solid ${fade("#d50000", 0.5)}`,
        "&:hover": {
          border: `1px solid ${"#d50000"}`
        },
      },
      textGreen: {
        color: "#4caf50",
        "&:hover": {
          backgroundColor: fade("#4caf50", theme.palette.action.hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      },
      outlinedGreen: {
        border: `1px solid ${fade("#4caf50", 0.5)}`,
        "&:hover": {
          border: `1px solid ${"#4caf50"}`
        },
      },
  }));

function UserAcceptedRequestCard(props) {
  const classes = useStyles();

  const dueDateTime = moment(props.due).format('LLL');

  const [chatrooms, setChatrooms] = React.useState([]);

  const getChatrooms = () => {
    axios
      .get("http://localhost:5000/chatroom", {
        headers : {
          Authorization: "Bearer" + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch(err=> {
        setTimeout(getChatrooms, 3000);
      });
  }

  React.useEffect(() => {
    getChatrooms();
  }, []);

  const handleClick = () => {
    console.log("Button Clicked");
};

  return (  
    <div>
        <ListItem button onClick={handleClick} alignItems="flex-start">
            <ListItemAvatar>
            <Avatar alt={props.image} src={props.image} />
            </ListItemAvatar>
            <ListItemText
                primary={props.name}
                secondary={ 
            <React.Fragment>
                <Typography
                    component="span"
                    variant="body2"
                    display="block"
                    fontWeight="bold"
                    style={{marginTop:15}}
                    className={classes.listItemStyle, classes.boldLanguages}
                >
                    <TranslateIcon/>
                    {" " + props.from + " to " + props.to}
                </Typography>
                <Typography
                    component="span"
                    variant="body2"
                    display="block"
                    className={classes.listItemStyle}
                >
                    <ScheduleIcon/>
                    { " " + dueDateTime}
                </Typography>
                { props.femaleTranslator ? 
                    <Typography
                        component="span"
                        variant="body2"
                        display="block"
                        className={classes.listItemStyle}
                    >
                        <CheckIcon/>
                        {" You requested a female translator"}
                    </Typography>
                    :
                    <></>
                }
                { props.documentProofreading ? 
                    <Typography
                        component="span"
                        variant="body2"
                        display="block"
                        className={classes.listItemStyle}
                    >
                        <DescriptionIcon/>
                        {" You requested document proofreading"}
                    </Typography>
                    :
                    <></>
                }
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider/>
      {/* <div>
        TEST
        {chatrooms.map((chatroom) => (
          <div key = {chatroom._id} className = "chatroom">
            <Link to={"chatroom/chatroom/" + chatroom._id}>
              <div>Join</div>
            </Link>
            </div>
        ))}
      </div> */}
    </div>
  );
}

export default UserAcceptedRequestCard;
