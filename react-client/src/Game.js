import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';

export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.state = {
            field : this.props.initialState.field,
            redtimer : this.props.initialState.redtimer,
            blacktimer : this.props.initialState.blacktimer,
            turntimer : this.props.initialState.turntimer,
            turncolor : this.props.initialState.turncolor,
        };
    }

    componentDidMount () {
        this.mounted = true;

        this.props.socket.on("UpdateFieldRES", data => {
            if (this.mounted) {
                this.setState ({field : data.field });
            }
        });

        this.props.socket.on("UpdateTimerRES", data => {
            if (this.mounted) {
                this.setState ({
                    redtimer : data.redtimer, 
                    blacktimer : data.blacktimer, 
                    turntimer : data.turntimer 
                });
            }
        });

        this.props.socket.on("UpdateTurnColorRES", data => {
            if (this.mounted) {
                this.setState ({turncolor : data.turncolor });
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


