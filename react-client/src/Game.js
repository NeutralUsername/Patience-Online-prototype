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
                <Sequence cards = {this.state.stacks.playermalus} name ="playermalus" ></Sequence>
                <Pile cards = {this.state.stacks.playerstock} name = "playerstock" ></Pile>
                <Pile cards = {this.state.stacks.playerwaste} name = "playerwaste" ></Pile>
                
                <Sequence cards = {this.state.stacks.playertableau0} name = "playertableau0"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation0} name = "playerfoundation0"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation0} name = "opponentfoundation0"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau0} name = "opponenttableau0"></Sequence>
                
                <Sequence cards = {this.state.stacks.playertableau1} name = "playertableau1"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation1} name = "playerfoundation1"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation1} name = "opponentfoundation1"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau1} name = "opponenttableau1"></Sequence>

                <Sequence cards = {this.state.stacks.playertableau2} name = "playertableau2"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation2} name = "playerfoundation2"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation2} name = "opponentfoundation2"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau2} name = "opponenttableau2"></Sequence> 

                <Sequence cards = {this.state.stacks.playertableau3} name = "playertableau3"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation3} name = "playerfoundation3"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation3} name = "opponentfoundation3"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau3} name = "opponenttableau3"></Sequence>

                <Sequence cards = {this.state.stacks.opponentmalus} name = "opponentmalus"></Sequence>
                <Pile cards = {this.state.stacks.opponentstock} name = "opponentstock"></Pile>
                <Pile cards = {this.state.stacks.opponentwaste} name = "opponentwaste"></Pile>
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
            <ul className ={"Pile "+this.props.name}>{this.props.name}
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
            <ul className ={"Sequence "+this.props.name}>{this.props.name}
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

