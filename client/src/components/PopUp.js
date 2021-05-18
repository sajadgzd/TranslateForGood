import React from 'react';
import './PopUp.css';
import MicRecorder from 'mic-recorder-to-mp3';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import StopIcon from '@material-ui/icons/Stop';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class PopUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function(){
          let base64data = reader.result;
          this.setState({blobURL: base64data, isRecording: false});
          // console.log('base64', this.state.blobURL);
          // console.log('still recording', this.state.isRecording);
          this.props.sendData(this.state.blobURL);
        }.bind(this);
        // reader.readAsDataURL(blob);
        // const blobURL = URL.createObjectURL(blob)
        // this.setState({ blobURL, isRecording: false });
        // // console.log("Here is blobURL", blobURL);
        this.props.sendData(blob);
      }).catch((e) => console.log(e));
  };

    componentDidMount() {
        navigator.getUserMedia({ audio: true },
        () => {
            console.log('Permission Granted');
            this.setState({ isBlocked: false });
        },
        () => {
            console.log('Permission Denied');
            this.setState({ isBlocked: true })
        },
        );
    }

  render(){
    return (
      <div className="PopUp">
        <header className="PopUp-header">
        <Tooltip title="Start recording">
          <span><IconButton onClick={this.start} disabled={this.state.isRecording}><RecordVoiceOverIcon /></IconButton></span>
        </Tooltip>
        <Tooltip title="Stop recording">
          {/* <button onClick={this.start} disabled={this.state.isRecording}>Record</button> */}
          {/* <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button> */}
          <span><IconButton onClick={this.stop} disabled={!this.state.isRecording}><StopIcon /></IconButton></span>
        </Tooltip>
          
        </header>
      </div>
    );
  }
}
