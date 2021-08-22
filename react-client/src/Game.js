import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';

export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.state = {
            field :{},
            turn : -1337,
            red : -1337,
            black : -1339,
        };
    }


    componentDidMount () {
        this.mounted = true;
        this.props.socket.emit('updateREQ', {
            id : this.props.id,
        });

        this.props.socket.on("UpdateFieldRES", data => {
            if (this.mounted) {
                this.setState ({field : data });
            }
        });

        this.props.socket.on("UpdateTimerRES", data => {
            if (this.mounted) {
                this.setState ({field : data });
            }
        });
    }

    render(){
        return (
            <div className="game">
                
            </div>
        )
    }
} 


