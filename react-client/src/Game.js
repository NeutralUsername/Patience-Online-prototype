import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, useDrop } from "react-dnd";


export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.state = {
            stacks : this.props.initialstate.stacks,
            redtimer : this.props.initialstate.redtimer,
            blacktimer : this.props.initialstate.blacktimer,
            turn : this.props.initialstate.turn,
            turntimer : this.props.initialstate.turntimer,
            turncolor : this.props.initialstate.turncolor,
        };
        
    }

    componentDidMount () {
        this.mounted = true;

        this.props.socket.on("UpdateFieldRES", data => {
            if (this.mounted) {
                this.setState ({stacks : data.stacks });
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
                <Pile cards = {this.state.stacks.redstock} name = "redstock" ></Pile>
                <Pile cards = {this.state.stacks.blackstock} name = "blackstock" ></Pile>
                <Pile cards = {this.state.stacks.redwaste} name = "redwaste" ></Pile>
                <Pile cards = {this.state.stacks.blackwaste}  name = "blackwaste"></Pile>
                <Sequence cards = {this.state.stacks.redmalus}  name = "redmalus"></Sequence>
                <Sequence cards = {this.state.stacks.blackmalus}  name = "blackmalus"></Sequence>

                <Sequence cards = {this.state.stacks.tableau0r} name = "tableau0r"></Sequence>
                <Sequence cards = {this.state.stacks.tableau1r} name = "tableau1r"></Sequence>
                <Sequence cards = {this.state.stacks.tableau2r} name = "tableau2r"></Sequence>
                <Sequence cards = {this.state.stacks.tableau3r} name = "tableau3r"></Sequence>
                <Sequence cards = {this.state.stacks.tableau0b} name = "tableau0b"></Sequence>
                <Sequence cards = {this.state.stacks.tableau1b} name = "tableau1b"></Sequence>
                <Sequence cards = {this.state.stacks.tableau2b} name = "tableau2b"></Sequence>
                <Sequence cards = {this.state.stacks.tableau3b} name = "tableau3b"></Sequence>

                <Pile cards = {this.state.stacks.foundation0r} name = "foundation0r"></Pile>
                <Pile cards = {this.state.stacks.foundation1r} name = "foundation1r"></Pile>
                <Pile cards = {this.state.stacks.foundation2r} name = "foundation2r"></Pile>
                <Pile cards = {this.state.stacks.foundation3r} name = "foundation3r"></Pile>
                <Pile cards = {this.state.stacks.foundation0b} name = "foundation0b"></Pile>
                <Pile cards = {this.state.stacks.foundation1b} name = "foundation1b"></Pile>
                <Pile cards = {this.state.stacks.foundation2b} name = "foundation2b"></Pile>
                <Pile cards = {this.state.stacks.foundation3b} name = "foundation3b"></Pile>      
            </div>
        )
    }
} 

class Pile extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render () {
        return (
            <ul> {this.props.name}
                { Object(this.props.cards).map( (card) =>
                    <Card key = {card.nr}
                        faceup = {card.faceup}
                        color = {card.color} 
                        suit = {card.suit} 
                        value = {card.value}
                    > </Card>
                )}
            </ul>
        )
    }
}
class Sequence extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <ul> {this.props.name}
                { Object(this.props.cards).map( (card) =>
                    <Card key = {card.nr}
                        faceup = {card.faceup}
                        color = {card.color} 
                        suit = {card.suit} 
                        value = {card.value}
                    > </Card>
                )}
            </ul>
        )
    }
}

function Card (props) {
    return (
        <div>
            <div>{props.color} </div>
            <div>{props.suit} </div>
            <div>{props.value} </div>
        </div>
    )
}

