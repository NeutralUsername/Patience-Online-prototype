import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, DndProvider, useDrop  } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.handleDrop = this.handleDrop.bind (this);
        this.state = {
            stacks : props.initialState.stacks,
            playertimer : props.initialState.redtimer,
            opponenttimer : props.initialState.blacktimer,
            turntimer : props.initialState.turntimer,
            turncolor : props.initialState.turncolor,
        };
        this.props.socket.on("UpdateGameState", data => {
            if (this.mounted) {
                this.setState (data);
                console.log(data);
            }
        });
    }
    
    componentDidMount () {
        this.mounted = true;
        console.log(this.state);
    }

    handleDrop(result) {
       console.log(result);
    }

    render(){
        return (
            <DndProvider backend={HTML5Backend}>
                <div className="game">
                        <Stack 
                            stack = {this.state.stacks.playermalus} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playerstock} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playerwaste} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playertableau0} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playerfoundation0} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponentfoundation0} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponenttableau0} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playertableau1} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playerfoundation1} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponentfoundation1} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponenttableau1}  
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playertableau2} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playerfoundation2}  
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponentfoundation2} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponenttableau2} 
                            onDrop = {this.handleDrop}
                        ></Stack> 
                        <Stack 
                            stack = {this.state.stacks.playertableau3} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.playerfoundation3} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponentfoundation3} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponenttableau3} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponentwaste} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponentstock} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                        <Stack 
                            stack = {this.state.stacks.opponentmalus} 
                            onDrop = {this.handleDrop}
                        ></Stack>
                </div>
            </DndProvider>
        )
    }
} 

function Stack (props) {

    const [{hover  }, drop] = useDrop(() => ({
        accept: "card",
        drop: monitor => {
            handleDrop(monitor, props.stack.name);
        },
        hover: monitor => {
            console.log(monitor)
        },
      }))
  
      function handleDrop(card, to) {
          props.onDrop({card,to});
      }
      
        return (
            <ul 
                ref={drop}
                className ={props.stack.type+" "+props.stack.name}  
                style = {{
            
                }}> 
                {props.stack.cards.map( (card) => 
                    <Card 
                        key = {card.cardid}
                        cardid = {card.cardid}
                        faceup = {card.faceup}
                        color = {card.color} 
                        suit = {card.suit} 
                        value = {card.value}
                        stack = {props.stack.name}
                    ></Card>
                )}
            </ul>
        )
    }

function Card (props) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        item : {id : props.cardid, stack : props.stack} ,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
 
    return (
        <div 
            ref={drag} 
            style={{
                opacity: isDragging ? 0.3 : 1,
                fontSize: 25,
                fontWeight: 'bold',
                cursor: 'grab',
                border : '1px solid lightgrey',
                borderRadius: '.5rem',
                padding : '8px',
                marginRight : '8px',
                marginBottom : '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems : 'center',
                height: '110px',
                width: '75px',
                color: props.color === 'red'?'red':'black',
                border: '3px solid '+(props.color==='red'?'red':'black'),
            }}
            className = {'card '+"cards-"+ props.stack+' '+ props.color +' '+ (props.faceup ? 'faceup' : 'facedown')+ (props.faceup ? ' '+props.suit : '') +(props.faceup ? ' '+ props.value : '')} >
                {props.suit} {props.value}
        </div>
    )
}

