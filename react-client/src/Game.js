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
                <div className = "player">
                    <Pile 
                        name =  {this.props.color+'stock'  } 
                        stack = {this.state.stacks.find(x=>x.name === this.props.color+'stock') }
                    ></Pile>
                    <Pile 
                        name =  {this.props.color+'waste'  } 
                        stack = {this.state.stacks.find(x=>x.name === this.props.color+'waste') }
                    ></Pile>
                    <Sequence 
                        name =  {this.props.color+'malus'  } 
                        stack = {this.state.stacks.find(x=>x.name === this.props.color+'malus') }
                        orientation = {'right'}
                    ></Sequence>
                </div>
                <div className = "field 1">
                    <Sequence 
                        name = { 'tableau0'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau0'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                        orientation = {'left'}
                    ></Sequence>
                    <Pile 
                        name = {'foundation0'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation0' + (this.props.color ==='red' ? 'r' : 'b')) }
                    ></Pile>
                    <Pile 
                        name = {'foundation0'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation0' + (this.props.color ==='red' ? 'b' : 'r')) }
                    ></Pile>
                    <Sequence 
                        name = { 'tableau0'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau0'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                        orientation = {'right'}
                    ></Sequence>
                </div>
                <div className = "field 2">
                    <Sequence 
                        name = { 'tableau1'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau1'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                        orientation = {'left'}
                    ></Sequence>
                    <Pile 
                        name = {'foundation1'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation1' + (this.props.color ==='red' ? 'r' : 'b')) }
                    ></Pile>
                    <Pile 
                        name = {'foundation1'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation1' + (this.props.color ==='red' ? 'b' : 'r')) }
                    ></Pile>
                    <Sequence 
                        name = { 'tableau1'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau1'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                        orientation = {'right'}
                    ></Sequence>
                </div>
                <div className ="field 3">
                    <Sequence 
                        name = { 'tableau2'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau2'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                        orientation = {'left'}
                    ></Sequence>
                    <Pile 
                        name = {'foundation2'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation2' + (this.props.color ==='red' ? 'r' : 'b')) }
                    ></Pile>
                    <Pile 
                        name = {'foundation2'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation2' + (this.props.color ==='red' ? 'b' : 'r')) }
                    ></Pile>
                    <Sequence 
                        name = { 'tableau2'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau2'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                        orientation = {'right'}
                    ></Sequence>
                </div>
                <div className ="field 4">
                    <Sequence 
                        name = { 'tableau3'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau3'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                        orientation = {'left'}
                    ></Sequence>
                    <Pile 
                        name = {'foundation3'+ (this.props.color ==='red' ? 'r' : 'b')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation3' + (this.props.color ==='red' ? 'r' : 'b')) }
                    ></Pile>
                    <Pile 
                        name = {'foundation3'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='foundation3' + (this.props.color ==='red' ? 'b' : 'r')) }
                    ></Pile>
                    <Sequence 
                        name = { 'tableau3'+ (this.props.color ==='red' ? 'b' : 'r')} 
                        stack = {this.state.stacks.find(x=>x.name ==='tableau3'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                        oorientation = {'right'}
                    ></Sequence>
                </div>
                <div className ="opponent">
                    <Sequence 
                        name = {(this.props.color === 'red' ? 'black' : 'red' )+'malus'} 
                        stack = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'malus') }
                        orientation = {'left'}
                    ></Sequence>
                    <Pile 
                        name = {(this.props.color === 'red' ? 'black' : 'red' )+'waste'} 
                        stack = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'waste') }
                    ></Pile>
                    <Pile 
                        name = {(this.props.color === 'red' ? 'black' : 'red' )+'stock'} 
                        stack = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'stock') }
                    ></Pile>
                </div>
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

