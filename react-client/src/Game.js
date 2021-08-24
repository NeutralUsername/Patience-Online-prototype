import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, useDrop } from "react-dnd";



export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.state = {
            stacks : '',
            playertimer : '',
            opponenttimer : '',
            turntimer : '',
            turncolor : '',
        };
        this.props.socket.on("UpdateGameState", data => {
            if (this.mounted) {
                this.setState (data);
            }
        });
    }
    
    componentDidMount () {
        this.mounted = true;
        this.props.socket.emit("GameMounted", {id : this.props.id});
    }

    render(){
        return (
            <div className="game">
                <Sequence cards = {this.state.stacks.playermalus} ></Sequence>
                <Pile cards = {this.state.stacks.playerstock} ></Pile>
                <Pile cards = {this.state.stacks.playerwaste} ></Pile>
                
                <Sequence cards = {this.state.stacks.playertableau0} ></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation0} ></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation0} ></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau0} ></Sequence>
                
                <Sequence cards = {this.state.stacks.playertableau1} ></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation1} ></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation1} ></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau1} ></Sequence>

                <Sequence cards = {this.state.stacks.playertableau2} ></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation2} ></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation2} ></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau2} ></Sequence> 

                <Sequence cards = {this.state.stacks.playertableau3} ></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation3} ></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation3} ></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau3} ></Sequence>

                <Sequence cards = {this.state.stacks.opponentmalus} ></Sequence>
                <Pile cards = {this.state.stacks.opponentstock} ></Pile>
                <Pile cards = {this.state.stacks.opponentwaste} ></Pile>
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
            <ul className ="Pile">{this.props.name}
                {this.props.cards ? Object.keys(this.props.cards).map( (card) =>
                    <Card key = {card}
                        faceup = {this.props.cards[card].faceup}
                        color = {this.props.cards[card].color} 
                        suit = {this.props.cards[card].suit} 
                        value = {this.props.cards[card].value}
                    ></Card>
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
            <ul className ="Sequence">{this.props.name}
                {this.props.cards ? Object.keys(this.props.cards).map( (card) =>
                    <Card key = {card}
                        faceup = {this.props.cards[card].faceup}
                        color = {this.props.cards[card].color} 
                        suit = {this.props.cards[card].suit} 
                        value = {this.props.cards[card].value}
                    ></Card>
                ):''}
            </ul>
        )
    }
}

function Card (props) {
    return (
        <div className ={'card '+ props.color +' '+ (props.faceup?'faceup':'facedown')+ (props.faceup?' '+props.suit:'') +(props.faceup?' '+ props.value:'')}>
            <div>{props.suit} </div>
            <div>{props.value} </div>
        </div>
    )
}

