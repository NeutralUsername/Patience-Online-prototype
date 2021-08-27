import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, DndProvider, useDrop  } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.handleOnDragEnd = this.handleOnDragEnd.bind (this);
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

    handleOnDragEnd(result) {
        this.state.stacks[result.destination.droppableId].push( this.state.stacks[result.source.droppableId][result.source.index]);
        this.state.stacks[result.source.droppableId].splice(result.source.index ,1);
        
    }

    render(){
        return (
            <DndProvider backend={HTML5Backend}>
                <div className="game">
                        <Stack 
                            cards = {this.state.stacks.playermalus} 
                            name ="playermalus" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playerstock} 
                            name = "playerstock" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playerwaste} 
                            name = "playerwaste" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playertableau0} 
                            name = "playertableau0" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playerfoundation0} 
                            name = "playerfoundation0" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponentfoundation0} 
                            name = "opponentfoundation0" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponenttableau0} 
                            name = "opponenttableau0" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playertableau1} 
                            name = "playertableau1" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playerfoundation1} 
                            name = "playerfoundation1" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponentfoundation1} 
                            name = "opponentfoundation1" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponenttableau1} 
                            name = "opponenttableau1" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playertableau2} 
                            name = "playertableau2" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playerfoundation2} 
                            name = "playerfoundation2" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponentfoundation2} 
                            name = "opponentfoundation2" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponenttableau2} 
                            name = "opponenttableau2" 
                            type ="pile" 
                        ></Stack> 
                        <Stack 
                            cards = {this.state.stacks.playertableau3} 
                            name = "playertableau3" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.playerfoundation3} 
                            name = "playerfoundation3" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponentfoundation3} 
                            name = "opponentfoundation3" 
                            type ="sequence" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponenttableau3} 
                            name = "opponenttableau3" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponentwaste} 
                            name = "opponentwaste" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponentstock} 
                            name = "opponentstock" 
                            type ="pile" 
                        ></Stack>
                        <Stack 
                            cards = {this.state.stacks.opponentmalus} 
                            name = "opponentmalus" 
                            type ="sequence" 
                        ></Stack>
                </div>
            </DndProvider>
        )
    }
} 

function Stack (props) {
    const [{  }, drop] = useDrop(() => ({
        accept: "card",
        drop: () => {},
        collect: monitor => ({
          isOver: !!monitor.isOver(),
        }),
      }), [])
    
  
        return (
            <div  ref={drop} className={"stack"} >
                <ul className ={props.type+" "+props.name}  > 
                    {props.cards ? Object.keys(props.cards).map( (card, index) => 
                    <div  key = {String(props.cards[card].cardid)}> 
                        <Card 
                            cardid = {props.cards[card].cardid}
                            faceup = {props.cards[card].faceup}
                            color = {props.cards[card].color} 
                            suit = {props.cards[card].suit} 
                            value = {props.cards[card].value}
                            stack = {props.name}
                        ></Card>
                    </div>
                    ):''}
                </ul>
            </div>
        )
    }


function Card (props) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }))
    return (
        <div ref={drag}  className = {'card '+"cards-"+ props.stack+' '+ props.color +' '+ (props.faceup ? 'faceup' : 'facedown')+ (props.faceup ? ' '+props.suit : '') +(props.faceup ? ' '+ props.value : '')} >
            {props.suit} {props.value}
        </div>
    )
}

