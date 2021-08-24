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
                    malus = {this.state.stacks.find(x=>x.name === this.props.color+'malus')}
                    stock = {this.state.stacks.find(x=>x.name === this.props.color+'stock')}
                    waste = {this.state.stacks.find(x=>x.name === this.props.color+'waste')}
                ></Player>
                <Field 
                    tableauP = {this.state.stacks.find(x=>x.name ==='tableau0'+ ( this.props.color ==='red' ? 'r' : 'b'))}
                    foundationP = {this.state.stacks.find(x=>x.name ==='foundation0' + (this.props.color ==='red' ? 'r' : 'b'))}
                    tableauO = {this.state.stacks.find(x=>x.name ==='foundation0' + (this.props.color ==='red' ? 'b' : 'r'))}
                    foundationO = {this.state.stacks.find(x=>x.name ==='tableau0'+ ( this.props.color ==='red' ? 'b' : 'r'))}
                ></Field>
                <Field 
                    tableauP = {this.state.stacks.find(x=>x.name ==='tableau1'+ ( this.props.color ==='red' ? 'r' : 'b'))}
                    foundationP = {this.state.stacks.find(x=>x.name ==='foundation1' + (this.props.color ==='red' ? 'r' : 'b'))}
                    tableauO = {this.state.stacks.find(x=>x.name ==='foundation1' + (this.props.color ==='red' ? 'b' : 'r'))}
                    foundationO = {this.state.stacks.find(x=>x.name ==='tableau1'+ ( this.props.color ==='red' ? 'b' : 'r'))}
                ></Field>
                <Field 
                    tableauP = {this.state.stacks.find(x=>x.name ==='tableau2'+ ( this.props.color ==='red' ? 'r' : 'b'))}
                    foundationP = {this.state.stacks.find(x=>x.name ==='foundation2' + (this.props.color ==='red' ? 'r' : 'b'))}
                    tableauO = {this.state.stacks.find(x=>x.name ==='foundation2' + (this.props.color ==='red' ? 'b' : 'r'))}
                    foundationO = {this.state.stacks.find(x=>x.name ==='tableau2'+ ( this.props.color ==='red' ? 'b' : 'r'))}
                ></Field>
                <Field 
                    tableauP = {this.state.stacks.find(x=>x.name ==='tableau3'+ ( this.props.color ==='red' ? 'r' : 'b'))}
                    foundationP = {this.state.stacks.find(x=>x.name ==='foundation3' + (this.props.color ==='red' ? 'r' : 'b'))}
                    tableauO = {this.state.stacks.find(x=>x.name ==='foundation3' + (this.props.color ==='red' ? 'b' : 'r'))}
                    foundationO = {this.state.stacks.find(x=>x.name ==='tableau3'+ ( this.props.color ==='red' ? 'b' : 'r'))}
                ></Field>
                <Opponent 
                    malus = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'malus')}
                    stock = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'stock')}
                    waste = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'waste')}
                ></Opponent>
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
                <Sequence stack = {this.props.malus}></Sequence>
                <Pile stack = {this.props.stock}></Pile>
                <Pile stack = {this.props.waste}></Pile>
            </div>
        )
    }
}
class Opponent extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render () {
        return (
            <div>
                <Sequence stack = {this.props.malus}></Sequence>
                <Pile stack = {this.props.stock}></Pile>
                <Pile stack = {this.props.waste}></Pile>
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
               <Sequence stack = {this.props.tableauP}></Sequence>
               <Pile stack = {this.props.foundationP}></Pile>
               <Pile stack = {this.props.tableauO}></Pile>
               <Sequence stack = {this.props.foundationO}></Sequence>
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
                { this.props.stack != undefined ? this.props.stack.cards.map( (card) =>
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
            <ul> {this.props.name}
                { this.props.stack != undefined ? this.props.stack.cards.map( (card) =>
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

