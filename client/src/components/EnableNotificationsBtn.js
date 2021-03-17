import React, { useEffect, useState } from 'react'
import axios from "axios";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";

const EnableNotificationsBtn = (props) => {

    const [visible, setVisibility] = useState(("serviceWorker" in navigator) && ("Notification" in window));

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
      
        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);
      
        for (var i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

    const configurePushSub = () => {
    if (!('serviceWorker' in navigator)) {
        return;
    } 
    let reg;
    navigator.serviceWorker.ready
        .then(function(swreg) {
        reg = swreg;
        swreg.pushManager.getSubscription();
        }).then(function (sub){
        if (sub === null) {
            //Create new subscription
            let vapidPublicKey = 'BLeogzDBodY_tQFm-HGNxdttRxLIsW-NMLW6AUhFWpj7EYcGWodIQDjFwh4MIFkI3sPTafdgfflRV0DVZBjOb9E';
            let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
            reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidPublicKey
            });
        } else {
            // we already have a subscription
        }
        })
        .then(function(newSub) {
        return fetch('', { /////////////////////////  how to use mongodb to store subscr.
            method: 'POST',
            headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify(newSub)
        })
        }).then(function(res){
        console.log('Push notification subscription successfully configured!');
        });
    };

    // if user grants notifications make all the btns invisible
    const handleRequestNotificationPermission = () => {
        setVisibility(false);
        Notification.requestPermission(function(result){
        if(result !== 'granted') {
            console.log('No notification permission granted');
        } else {
            console.log('Notification permission was granted');
            // subscribe to push-notifications
            // configurePushSub();  
        }
        });
    }
    

    return (
        <div >
            {visible ? 
                <Button variant="outlined" color="secondary" onClick={handleRequestNotificationPermission}>
                    Enable Notifications
                </Button>
            :
            <div> </div>}
            
        </div>
    );
}

export default EnableNotificationsBtn;