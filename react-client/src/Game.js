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
                <Player 
                    malus = {this.state.stacks.redmalus}
                    stock = {this.state.stacks.redstock}
                    waste = {this.state.stacks.redwaste}
                ></Player>
                <Field 
                    tableauP = {this.state.stacks.tableau0r}
                    foundationP = {this.state.stacks.foundation0r}
                    tableauO = {this.state.stacks.tableau0b}
                    foundationO = {this.state.stacks.foundation0b}
                ></Field>
                <Field 
                    tableauP = {this.state.stacks.tableau1r}
                    foundationP = {this.state.stacks.foundation1r}
                    tableauO = {this.state.stacks.tableau1b}
                    foundationO = {this.state.stacks.foundation1b}
                ></Field>
                 <Field 
                    tableauP = {this.state.stacks.tableau2r}
                    foundationP = {this.state.stacks.foundation2r}
                    tableauO = {this.state.stacks.tableau2b}
                    foundationO = {this.state.stacks.foundation2b}
                ></Field>
                 <Field 
                    tableauP = {this.state.stacks.tableau3r}
                    foundationP = {this.state.stacks.foundation3r}
                    tableauO = {this.state.stacks.tableau3b}
                    foundationO = {this.state.stacks.foundation3b}
                ></Field>
                <Player 
                    malus = {this.state.stacks.blackmalus}
                    stock = {this.state.stacks.blackstock}
                    waste = {this.state.stacks.blackwaste}
                ></Player>
            </div>
        )
    }
} 

class Player extends React.Component {
    constructor(props) {
        super(props);
        
    }
    
    render () {
        return (
            <div>
                <Sequence 
                    stack = {this.props.malus}
                ></Sequence>
                <Pile 
                    stack = {this.props.stock}
                ></Pile>
                <Pile 
                    stack = {this.props.waste}
                ></Pile>
            </div>
        )
    }
}
class Field extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render () {
        return (
           <div>
                <Sequence 
                    stack = {this.props.tableauP}
                ></Sequence>
                <Pile 
                    stack = {this.props.foundationP}
                ></Pile>
                <Pile 
                    stack = {this.props.tableauO}
                ></Pile>
                <Sequence 
                    stack = {this.props.foundationO}
                ></Sequence>
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
            <ul> 
                { this.props.stack != undefined ? Object(this.props.stack).map( (card) =>
                    <li key = {card.nr}>
                        <Card  
                            color = {card.color} 
                            suit = {card.suit} 
                            value = {card.value}
                        > </Card>
                    </li>
                ):''}
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
            <ul> 
                { this.props.stack != undefined ? Object(this.props.stack).map( (card) =>
                    <li key = {card.nr}>
                        <Card  
                            color = {card.color} 
                            suit = {card.suit} 
                            value = {card.value}
                        > </Card>
                    </li>
                ):''}
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

