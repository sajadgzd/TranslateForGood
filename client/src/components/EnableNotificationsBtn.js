import React, { useEffect, useState } from 'react'
import axios from "axios";
import Button from "@material-ui/core/Button";

const webpush = require("web-push");
const publicVapidKey = "BLeogzDBodY_tQFm-HGNxdttRxLIsW-NMLW6AUhFWpj7EYcGWodIQDjFwh4MIFkI3sPTafdgfflRV0DVZBjOb9E";
const privateVapidKey = "uvwXQFqV6DQbNs-4G7qX8dJY8n3-Hs7HbkFHp6RW9QA";

// converts public key string to a required format
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

const convertedVapidPublicKey = urlBase64ToUint8Array(publicVapidKey);

const EnableNotificationsBtn = (props) => {

    const [visible, setVisibility] = useState(("serviceWorker" in navigator) && ("Notification" in window));

    const configurePushSub = () => {
        if (!('serviceWorker' in navigator)) {
            console.log('No service worker.');
            return;
        } 

        let reg;
        navigator.serviceWorker.ready
            .then(function(swreg) {
            reg = swreg;
            return swreg.pushManager.getSubscription();
            }).then(function (sub){
            if (sub) {
                // we already have a subscription
                console.log('already subscribed');
            } else {

                //Create new subscription
                return reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidPublicKey
                        });
            }
            })
            .then(function(subscription) {
                console.log('Subscribed', subscription.endpoint);
                return fetch('/api/users/subscribe', {
                  method: 'post',
                  headers: {
                    'Content-type': 'application/json'
                  },
                  body: JSON.stringify({
                    subscription: subscription
                  })
                });
              }).catch(function(err){
                console.log(err);
            });
    };

    // if user clicks the btn show pop-up asking to grant notifications permission
    // make the btns invisible
    const handleRequestNotificationPermission = () => {
        setVisibility(false);
        Notification.requestPermission(function(result){
        if(result !== 'granted') {
            console.log('No notification permission granted');
        } else {
            console.log('Notification permission was granted');
            // subscribe to push-notifications
            configurePushSub();  
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