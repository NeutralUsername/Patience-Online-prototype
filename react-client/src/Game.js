import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, DndProvider, useDrop  } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default class Game extends React.Component{
    constructor(props) {
        console.log(props)
        super(props); 
        this.mounted = false;
        this.opponent = props.color ==='red'?'black':'red'
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
        
    }

    handleDrop(result) {
       console.log(result);
    }

    render(){
        return (
            <DndProvider backend={HTML5Backend}>
                <div className="game">
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"malus"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"stock"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"waste"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau0"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation0"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau0"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation0"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau1"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation1"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau1"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation1"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau2"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation2"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau2"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation2"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                     <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau3"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation3"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau3"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation3"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"waste"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"stock"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"malus"]} 
                        onDrop = {this.handleDrop}
                    ></Stack>
                </div>
            </DndProvider>
        )
    }
} 

function Stack (props) {
    console.log(props.stack.name)
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

      function bottomValue () {
        if(props.stack.name ==='redmalus')
            return '0%'
        if(props.stack.name === 'blackmalus')
            return '80%'
         if(props.stack.name ==='redstock')
            return '0%'
        if(props.stack.name === 'blackstock')
            return '80%'
        return '20%'
      }

      function leftValue() {
        if(props.stack.name ==='redstock')
            return '0%'
        if(props.stack.name === 'blackstock')
            return '0%'
        return '20%'
      }

        return (
            <ul 
                ref={drop}
                className ={props.stack.type+" "+props.stack.name}  
                style = {{
                    position : 'fixed',
                    bottom : bottomValue(),
                    left : leftValue(),
                    display: 'flex',
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

