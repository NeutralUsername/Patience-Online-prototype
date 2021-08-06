import React from 'react';
import './ServerTime.css';
import socketIOClient from 'socket.io-client';

class ServerTime extends React.Component {
  constructor(props) {
    super(props);
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
    this.props.socket.emit('serverTimeREQ', { data: 'some sample data'});
    this.props.socket.on("serverTimeRES", data => {
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
