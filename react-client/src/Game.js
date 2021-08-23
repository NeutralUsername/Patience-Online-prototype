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
                    name = {this.props.color === 'red' ? 'redstock' : 'blackstock' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='redstock') : this.state.stacks.find(x=>x.name ==='blackstock') }
                ></Stock>
                <Waste 
                    name = {this.props.color === 'red' ? 'redwaste' : 'blackwaste' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='redwaste') : this.state.stacks.find(x=>x.name ==='blackwaste') }
                ></Waste>
                <Malus 
                    name = {this.props.color === 'red' ? 'redmalus' : 'blackmalus' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='redmalus') : this.state.stacks.find(x=>x.name ==='blackmalus')}
                ></Malus>
               
                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau0r' : 'tableau0b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau0r') : this.state.stacks.find(x=>x.name ==='tableau0b') }
                ></Tableau>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation0r' : 'foundation0b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation0r') : this.state.stacks.find(x=>x.name ==='foundation0b') }
                ></Foundation>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation0b' : 'foundation0r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation0b') : this.state.stacks.find(x=>x.name ==='foundation0r') }
                ></Foundation>
                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau0b' : 'tableau0r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau0b') : this.state.stacks.find(x=>x.name ==='tableau0r') }
                ></Tableau>

                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau1r' : 'tableau1b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau1r') : this.state.stacks.find(x=>x.name ==='tableau1b') }
                ></Tableau>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation1r' : 'foundation1b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation1r') : this.state.stacks.find(x=>x.name ==='foundation1b') }
                ></Foundation>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation1b' : 'foundation1r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation1b') : this.state.stacks.find(x=>x.name ==='foundation1r') }
                ></Foundation>
                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau1b' : 'tableau1r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau1b') : this.state.stacks.find(x=>x.name ==='tableau1r') }
                ></Tableau> 

                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau2r' : 'tableau2b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau2r') : this.state.stacks.find(x=>x.name ==='tableau2b') }
                ></Tableau>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation2r' : 'foundation2b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation2r') : this.state.stacks.find(x=>x.name ==='foundation2b') }
                ></Foundation>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation2b' : 'foundation2r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation2b') : this.state.stacks.find(x=>x.name ==='foundation2r') }
                ></Foundation>
                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau2b' : 'tableau2r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau2b') : this.state.stacks.find(x=>x.name ==='tableau2r') }
                ></Tableau>

                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau3r' : 'tableau3b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau3r') : this.state.stacks.find(x=>x.name ==='tableau3b') }
                ></Tableau>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation3r' : 'foundation3b' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation3r') : this.state.stacks.find(x=>x.name ==='foundation3b') }
                ></Foundation>
                <Foundation 
                    name = {this.props.color === 'red' ? 'foundation3b' : 'foundation3r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='foundation3b') : this.state.stacks.find(x=>x.name ==='foundation3r') }
                ></Foundation>
                <Tableau 
                    name = {this.props.color === 'red' ? 'tableau3b' : 'tableau3r' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='tableau3b') : this.state.stacks.find(x=>x.name ==='tableau3r') }
                ></Tableau>

                <Stock 
                    name = {this.props.color === 'red' ? 'blackstock' : 'redstock' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='blackstock') : this.state.stacks.find(x=>x.name ==='redstock') }
                ></Stock>
                <Waste 
                    name = {this.props.color === 'red' ? 'blackwaste' : 'redwaste' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='blackwaste') : this.state.stacks.find(x=>x.name ==='redwaste') }
                ></Waste>
                <Malus 
                    name = {this.props.color === 'red' ? 'blackmalus' : 'redmalus' } 
                    stack = {this.props.color === 'red' ? this.state.stacks.find(x=>x.name ==='blackmalus') : this.state.stacks.find(x=>x.name ==='redmalus') }
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

