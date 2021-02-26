import React, { useEffect, useState } from 'react'
import Footer from '../Footer';

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

import ProfileCard from '../ProfileCard';

const Profile = () => {

  return (
    <div >
      <ProfileCard />
      <Footer />
    </div>
  );
}

export default Profile
