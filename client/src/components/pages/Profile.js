import React, { useEffect, useState } from 'react'
import Footer from '../Footer';

import axios from "axios";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import EmailIcon from '@material-ui/icons/Email';
import TranslateIcon from '@material-ui/icons/Translate';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Image from 'material-ui-image';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";

const Profile = () => {

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
      <Grid container spacing={3} style={{
          marginTop:50,
          marginLeft:200,
          marginBottom:50
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
                        <WorkIcon />
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
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <TranslateIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="LANGUAGE TO" secondary={user && user.languageTo}/>
                  </ListItem>
                  </Box>
                  }
                </List>
              </CardContent>
            <CardActions>
            <Button size="large" color="primary">
              Update
            </Button>
          </CardActions>
        </Card>
        </Grid>
        <Grid item xs={8} >
        { (user && user.languageFrom != "")
          ? <div><Box> Your past translations -- will be a component -- </Box></div>
          : <div><Box> Your past requests -- will be a component -- </Box></div>
        }
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
}

export default Profile
