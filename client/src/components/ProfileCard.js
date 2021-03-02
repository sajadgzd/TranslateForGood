import React, { useEffect, useState } from 'react'

import axios from "axios";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Input from '@material-ui/core/Input';

import PersonPinIcon from '@material-ui/icons/PersonPin';
import EmailIcon from '@material-ui/icons/Email';
import TranslateIcon from '@material-ui/icons/Translate';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import GTranslateIcon from '@material-ui/icons/GTranslate';

import EditProfileCard from './EditProfileCard';


const ProfileCard = (props) => {

  const [user, setUser] = useState(null);
  const [fileName, setFileName] = useState(null);

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
  
  const handleImageChange = async (event) => {
      const image = event.target.files[0];
      setFileName(image);
      // send the image to the server
      const formData = new FormData();
      formData.append("image", image, image.name);
    //   props.history.push("/profile");
      console.log("clicked")
  }

  const handleEditPicture = () => {
      const fileInput = document.getElementById("imageInput");
      fileInput.click();
  }

  const handleUpdate = () => {

  }

  const [editMode, setEditMode] = useState(false);

  const changeToFalse = () => {
      setEditMode(false);
  }

  return (
    <div >
          {editMode ? (
            <Box>
                <EditProfileCard changeToFalse={changeToFalse} user={user}/>
            </Box>
            ) : (
            <Grid container spacing={10} direction="column" alignItems="center" justify="center">
                <Box>
                <Grid item xs={10} style={{
                display: "center",
                marginTop:50,
                marginBottom:50,
                }}>
                <Card
                    style={{
                    maxWidth: 700,
                    maxHeight: 1000,
                    }}>
                    <Box>
                    <CardMedia
                            style={{
                                maxWidth: "250px",
                                maxHeight: "250px",
                                marginTop:"15px",
                                borderRadius:"50%",
                                textAlign: "center",
                                position: "relative",
                            }}
                            component="img"
                            image={user && user.image}
                        />
                        <Input 
                            type="file" 
                            id="imageInput"
                            placeholder="Upload a picture" 
                            onChange={handleImageChange} 
                            hidden="hidden">
                        </Input>
                        <Tooltip title="Edit profile picture" placement="top">
                            <IconButton onClick={handleEditPicture}>
                                <EditIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                        </Box>
                    <CardContent>
                        <List>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <PersonPinIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="NAME" secondary= {user && user.name} />
                        </ListItem >
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
                            <ListItem component="div">
                                <ListItemAvatar>
                                <Avatar>
                                    <GTranslateIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="LANGUAGE FROM" secondary={
                                        user && user.languageFrom.map(
                                                (language) => 
                                                    <li key={language}>
                                                        {language}
                                                    </li>
                                            )
                                    } />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem component="div">
                                <ListItemAvatar >
                                <Avatar>
                                    <TranslateIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="LANGUAGE TO" secondary={
                                        user && user.languageTo.map(
                                                (language) => 
                                                    <li key={language}>
                                                        {language}
                                                    </li>
                                            )
                                    }/>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </Box>
                        }
                        { user && user.femaleTranslator == true &&
                        <Box>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <CheckIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="FEMALE TRANSLATOR" secondary="You agree to be matched with users who wish to work with a female translator"/>
                            </ListItem>
                            </Box>}
                        </List>
                    </CardContent>
                    <CardActions>
                    <Button size="large" color="primary" onClick={() => setEditMode(true)}>
                    Update
                    </Button>
                </CardActions>
                </Card>
                </Grid>
            </Box>
          </Grid>
        )}
    </div>
  );
}

export default ProfileCard;
