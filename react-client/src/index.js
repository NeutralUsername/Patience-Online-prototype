import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
import socketIOClient from 'socket.io-client';
import './index.css';

var socket = socketIOClient ("http://127.0.0.1:3000");

socket.on('connect', () => {
  ReactDOM.render(
    <Options 
      socket = {socket}
    ></Options>,
    document.getElementById('root')
  );
  
})

