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
                <Stock stack = {this.state.stacks.find(x=>x.name ==='redstock') }></Stock>
                <Waste stack = {this.state.stacks.find(x=>x.name ==='redwaste') }></Waste>
                <Malus stack = {this.state.stacks.find(x=>x.name ==='redmalus') }></Malus>

                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau0r') }></Tableau>
                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau1r') }></Tableau>
                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau2r') }></Tableau>
                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau3r') }></Tableau>
                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau0r') }></Tableau>
                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau1b') }></Tableau>
                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau2b') }></Tableau>
                <Tableau stack = {this.state.stacks.find(x=>x.name ==='tableau3b') }></Tableau>

                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation0r') }></Foundation>
                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation1r') }></Foundation>
                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation2r') }></Foundation>
                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation3r') }></Foundation>
                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation0b') }></Foundation>
                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation1b') }></Foundation>
                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation2b') }></Foundation>
                <Foundation stack = {this.state.stacks.find(x=>x.name ==='foundation3b') }></Foundation>

                <Stock stack = {this.state.stacks.find(x=>x.name ==='blackstock') }></Stock>
                <Waste stack = {this.state.stacks.find(x=>x.name ==='blackwaste') }></Waste>
                <Malus stack = {this.state.stacks.find(x=>x.name ==='blackmalus') }></Malus>
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
                    <Card 
                        key = {card.nr} 
                        color = {card.details.color} 
                        suit = {card.details.faceup?card.details.suit:'facedown'} 
                        value = {card.details.faceup?card.details.value:'facedown'}
                    > </Card>
                ):''}
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
                    <Card 
                        key = {card.nr} 
                        color = {card.details.color} 
                        suit = {card.details.faceup?card.details.suit:'facedown'} 
                        value = {card.details.faceup?card.details.value:'facedown'}
                    > </Card>
                ):''}
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
                    <Card 
                        key = {card.nr} 
                        color = {card.details.color} 
                        suit = {card.details.faceup?card.details.suit:'facedown'} 
                        value = {card.details.faceup?card.details.value:'facedown'}
                    > </Card>
                ):''}
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
                    <Card 
                        key = {card.nr} 
                        color = {card.details.color} 
                        suit = {card.details.faceup?card.details.suit:'facedown'} 
                        value = {card.details.faceup?card.details.value:'facedown'}
                    > </Card>
                ):''}
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
                    <Card 
                        key = {card.nr} 
                        color = {card.details.color} 
                        suit = {card.details.faceup?card.details.suit:'facedown'} 
                        value = {card.details.faceup?card.details.value:'facedown'}
                    > </Card>
                ):''}
            </ul>
        )
    }
}

function Card (props) {
    return (
        <div>
            <label>{props.color}</label>
            <label>{props.suit}</label>
            <label>{props.value}</label>
        </div>
    )
}

