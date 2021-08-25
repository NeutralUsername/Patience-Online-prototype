import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable   } from 'react-beautiful-dnd';


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
                <Sequence cards = {this.state.stacks.playermalus} name ="pmalus" ></Sequence>
                <Pile cards = {this.state.stacks.playerstock} name = "pstock" ></Pile>
                <Pile cards = {this.state.stacks.playerwaste} name = "pwaste" ></Pile>
                
                <Sequence cards = {this.state.stacks.playertableau0} name = "ptableau0"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation0} name = "pfoundation0"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation0} name = "ofoundation0"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau0} name = "otableau0"></Sequence>
                
                <Sequence cards = {this.state.stacks.playertableau1} name = "ptableau1"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation1} name = "pfoundation1"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation1} name = "ofoundation1"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau1} name = "otableau1"></Sequence>

                <Sequence cards = {this.state.stacks.playertableau2} name = "ptableau2"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation2} name = "pfoundation2"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation2} name = "ofoundation2"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau2} name = "otableau2"></Sequence> 

                <Sequence cards = {this.state.stacks.playertableau3} name = "ptableau3"></Sequence>
                <Pile cards = {this.state.stacks.playerfoundation3} name = "pfoundation3"></Pile>
                <Pile cards = {this.state.stacks.opponentfoundation3} name = "ofoundation3"></Pile>
                <Sequence cards = {this.state.stacks.opponenttableau3} name = "otableau3"></Sequence>

                <Sequence cards = {this.state.stacks.opponentmalus} name = "omalus"></Sequence>
                <Pile cards = {this.state.stacks.opponentstock} name = "ostock"></Pile>
                <Pile cards = {this.state.stacks.opponentwaste} name = "owaste"></Pile>
            </div>
        )
    }
} 

class Pile extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnDragEnd = this.handleOnDragEnd.bind (this);
    }

    handleOnDragEnd(result) {
        console.log(result);
    }
    
    render () {
        return (
            <DragDropContext onDragEnd={this.handleOnDragEnd}>
                <Droppable droppableId={"Pile "+this.props.name}>
                    {(provided) => ( 
                        <ul className ={"Pile "+this.props.name} {...provided.droppableProps} ref={provided.innerRef}>{this.props.name}
                            {this.props.cards ? Object.keys(this.props.cards).map( (card, index) =>
                                <Draggable key = {card} draggableId={card} index={index}> 
                                    {(provided) => (
                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}> 
                                            <Card 
                                                faceup = {this.props.cards[card].faceup}
                                                color = {this.props.cards[card].color} 
                                                suit = {this.props.cards[card].suit} 
                                                value = {this.props.cards[card].value}
                                                cardnr = {this.props.cards[card].cardnr}
                                            ></Card>
                                        </li>
                                    )}
                                </Draggable>
                            ):''}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}
class Sequence extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnDragEnd = this.handleOnDragEnd.bind (this);
    }

    handleOnDragEnd(result) {
        console.log(result);
    }

    render () {
        return (
            
            <DragDropContext onDragEnd={this.handleOnDragEnd}>
                <Droppable droppableId={"Sequence "+this.props.name}>
                    {(provided) => ( 
                        <ul className ={"Sequence "+this.props.name} {...provided.droppableProps} ref={provided.innerRef}>{this.props.name}
                            {this.props.cards ? Object.keys(this.props.cards).map( (card, index) =>
                                <Draggable key = {card} draggableId={card}  index={index}> 
                                    {(provided) => (
                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}> 
                                            <Card 
                                                faceup = {this.props.cards[card].faceup}
                                                color = {this.props.cards[card].color} 
                                                suit = {this.props.cards[card].suit} 
                                                value = {this.props.cards[card].value}
                                                cardnr = {this.props.cards[card].cardnr}
                                            ></Card>
                                        </li>
                                    )}
                                </Draggable>
                            ):''}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

function Card (props) {
    return (
        <div className ={'card '+ props.color +' '+ (props.faceup?'faceup':'facedown')+ (props.faceup?' '+props.suit:'') +(props.faceup?' '+ props.value:'')}>
            {props.suit} {props.value}
        </div>
    )
}

