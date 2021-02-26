import React, { useEffect, useState } from 'react'

import axios from "axios";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import EmailIcon from '@material-ui/icons/Email';
import TranslateIcon from '@material-ui/icons/Translate';
import CheckIcon from '@material-ui/icons/Check';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

const ProfileCard = () => {

  const [user, setUser] = useState(null);

  const getUser = async () => {
    const res = await axios.get("/api/auth", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUser(res.data);
  };

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <div >
      <Grid container spacing={12} style={{
          marginTop:50,
          marginLeft:200,
          marginBottom:50,
          display: "center"
        }}>
        <Grid item xs={4} style={{
          display: "center",
          marginTop:10
        }}>
        <Card
            style={{
              maxWidth: 400,
              maxHeight:1000,
            }}>
              <div
                style={{
                  display: "center",
                  alignItem: "center",
                  justifyContent: "center"
                }}
              >
              <CardMedia
                style={{
                  maxWidth: "250px",
                  maxHeight: "250px",
                  marginTop:"15px",
                  borderRadius:"200px",
                }}
                component="img"
                image="images/default_photo.png"
              />
              </div>
              <CardContent>
                <List >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="NAME" secondary= {user && user.name} />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <EmailIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="EMAIL" secondary={user && user.email} />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  { user && user.languageFrom != "" &&
                  <Box>
                    <ListItem>
                        <ListItemAvatar>
                        <Avatar>
                            <GTranslateIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="LANGUAGE FROM" secondary={user && user.languageFrom} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                        <ListItemAvatar>
                        <Avatar>
                            <TranslateIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="LANGUAGE TO" secondary={user && user.languageTo}/>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                  }
                   { user && user.languageFrom != "" &&
                  <Box>
                    <ListItem>
                        <ListItemAvatar>
                        <Avatar>
                            <CheckIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="FEMALE TRANSLATOR" />
                    </ListItem>
                    </Box>}
                </List>
              </CardContent>
            <CardActions>
            <Button size="large" color="primary">
              Update
            </Button>
          </CardActions>
        </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProfileCard;
