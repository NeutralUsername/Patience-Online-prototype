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
                <Stock 
                    name =  {this.props.color+'stock'  } 
                    stack = {this.state.stacks.find(x=>x.name === this.props.color+'stock') }
                ></Stock>
                <Waste 
                    name =  {this.props.color+'waste'  } 
                    stack = {this.state.stacks.find(x=>x.name === this.props.color+'waste') }
                ></Waste>
                <Malus 
                    name =  {this.props.color+'malus'  } 
                    stack = {this.state.stacks.find(x=>x.name === this.props.color+'malus') }
                ></Malus>
               
                <Tableau 
                    name = { 'tableau0'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='tableau0'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                ></Tableau>
                <Foundation 
                    name = {'foundation0'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation0' + (this.props.color ==='red' ? 'r' : 'b')) }
                ></Foundation>
                <Foundation 
                    name = {'foundation0'+ (this.props.color ==='red' ? 'b' : 'r')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation0' + (this.props.color ==='red' ? 'b' : 'r')) }
                ></Foundation>
                <Tableau 
                   name = { 'tableau0'+ (this.props.color ==='red' ? 'b' : 'r')} 
                   stack = {this.state.stacks.find(x=>x.name ==='tableau0'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                ></Tableau>

                <Tableau 
                    name = { 'tableau1'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='tableau1'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                ></Tableau>
                <Foundation 
                    name = {'foundation1'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation1' + (this.props.color ==='red' ? 'r' : 'b')) }
                ></Foundation>
                <Foundation 
                    name = {'foundation1'+ (this.props.color ==='red' ? 'b' : 'r')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation1' + (this.props.color ==='red' ? 'b' : 'r')) }
                ></Foundation>
                <Tableau 
                   name = { 'tableau1'+ (this.props.color ==='red' ? 'b' : 'r')} 
                   stack = {this.state.stacks.find(x=>x.name ==='tableau1'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                ></Tableau>

                <Tableau 
                    name = { 'tableau2'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='tableau2'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                ></Tableau>
                <Foundation 
                    name = {'foundation2'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation2' + (this.props.color ==='red' ? 'r' : 'b')) }
                ></Foundation>
                <Foundation 
                    name = {'foundation2'+ (this.props.color ==='red' ? 'b' : 'r')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation2' + (this.props.color ==='red' ? 'b' : 'r')) }
                ></Foundation>
                <Tableau 
                   name = { 'tableau2'+ (this.props.color ==='red' ? 'b' : 'r')} 
                   stack = {this.state.stacks.find(x=>x.name ==='tableau2'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                ></Tableau>

                <Tableau 
                    name = { 'tableau3'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='tableau3'+ ( this.props.color ==='red' ? 'r' : 'b')) }
                ></Tableau>
                <Foundation 
                    name = {'foundation3'+ (this.props.color ==='red' ? 'r' : 'b')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation3' + (this.props.color ==='red' ? 'r' : 'b')) }
                ></Foundation>
                <Foundation 
                    name = {'foundation3'+ (this.props.color ==='red' ? 'b' : 'r')} 
                    stack = {this.state.stacks.find(x=>x.name ==='foundation3' + (this.props.color ==='red' ? 'b' : 'r')) }
                ></Foundation>
                <Tableau 
                   name = { 'tableau3'+ (this.props.color ==='red' ? 'b' : 'r')} 
                   stack = {this.state.stacks.find(x=>x.name ==='tableau3'+ ( this.props.color ==='red' ? 'b' : 'r')) }
                ></Tableau>

                <Stock 
                    name = {(this.props.color === 'red' ? 'black' : 'red' )+'stock'} 
                    stack = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'stock') }
                ></Stock>
                <Waste 
                    name = {(this.props.color === 'red' ? 'black' : 'red' )+'waste'} 
                    stack = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'waste') }
                ></Waste>
                <Malus 
                      name = {(this.props.color === 'red' ? 'black' : 'red' )+'malus'} 
                      stack = {this.state.stacks.find(x=>x.name === (this.props.color === 'red' ? 'black' : 'red' )+ 'malus') }
                ></Malus>
            </div>
        )
    }
} 


class Stock extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render () {
        return (
            <ul>
                { this.props.stack != undefined ? this.props.stack.cards.map( (card) =>
                    <li key = {card.nr}>
                        <Card  
                            color = {card.color} 
                            suit = {card.suit} 
                            value = {card.value}
                        > </Card>
                    </li>
                ):<label>empty {this.props.name}</label>}
            </ul>
        )
    }
}

class Waste extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <ul>
                { this.props.stack != undefined ? this.props.stack.cards.map( (card) =>
                    <li key = {card.nr}>
                        <Card  
                            color = {card.color} 
                            suit = {card.suit} 
                            value = {card.value}
                        > </Card>
                    </li>
                ):<label>empty {this.props.name}</label>}
            </ul>
        )
    }
}

class Malus extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <ul>
                { this.props.stack != undefined ? this.props.stack.cards.map( (card) =>
                    <li key = {card.nr}>
                        <Card  
                            color = {card.color} 
                            suit = {card.suit} 
                            value = {card.value}
                        > </Card>
                    </li>
                ):<label>empty {this.props.name}</label>}
            </ul>
        )
    }
}

class Tableau extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <ul>
                { this.props.stack != undefined ? this.props.stack.cards.map( (card) =>
                    <li key = {card.nr}>
                        <Card  
                            color = {card.color} 
                            suit = {card.suit} 
                            value = {card.value}
                        > </Card>
                    </li>
                ):<label>empty {this.props.name}</label>}
            </ul>
        )
    }
}


class Foundation extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <ul>
                { this.props.stack != undefined ? this.props.stack.cards.map( (card) =>
                    <li key = {card.nr}>
                        <Card  
                            color = {card.color} 
                            suit = {card.suit} 
                            value = {card.value}
                        > </Card>
                    </li>
                ):<label>empty {this.props.name}</label>}
            </ul>
        )
    }
}

function Card (props) {
    return (
        <div>
            <label>{props.color} {props.suit} {props.value}</label>
        </div>
    )
}

