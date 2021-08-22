import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';

export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.state = {
            field :{},
            redtimer : 0,
            blacktimer : 0,
            turntimer : 0,
            turncolor : ' '
        };
    }

    componentDidMount () {
        this.mounted = true;
        this.props.socket.emit('GameMountedREQ', {
            id : this.props.id,
        });
        this.props.socket.on("GameMountedRES", data => {
            if (this.mounted) {
                this.setState ({
                    field : data.field, 
                    redtimer : data.redtimer, 
                    blacktimer : data.blacktimer, 
                    turntimer : data.turntimer,
                    turncolor : data.turncolor  
                });
            }
        });

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


