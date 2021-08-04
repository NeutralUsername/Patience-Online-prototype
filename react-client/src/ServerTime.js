import React from 'react';
import './ServerTime.css';
import socketIOClient from 'socket.io-client';

class ServerTime extends React.Component {
  constructor() {
    super();
    this.mounted = false;
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:3000"
    };
  }
  componentDidMount() {
    this.mounted = true;
    //const  endpoint  = this.state.endpoint; ==
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit('serverTimeReq', { data: 'some sample data'});
    socket.on("serverTimeRes", data => {
      if(this.mounted === true)
        this.setState({ response: data.data })
    });
  }
 componentWillUnmount() {
   this.mounted = false;
 }
  render() {
    return (
      <div className="ServerTime">
        <p className="ServerTime-intro">
          The current time from socket backend is <b>{this.state.response}</b>.
        </p>
      </div>
    );
  }
}
export default ServerTime;
