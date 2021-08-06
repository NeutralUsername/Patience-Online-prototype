import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
import socketIOClient from 'socket.io-client';
import './index.css';



ReactDOM.render(
  <Options socket = {socketIOClient ("http://127.0.0.1:3000")}/>,
  document.getElementById('root')
);
