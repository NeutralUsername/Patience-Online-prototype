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
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"stock"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"waste"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau0"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation0"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau0"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation0"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau1"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation1"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau1"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation1"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau2"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation2"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau2"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation2"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                     <Stack 
                        stack = {this.state.stacks[this.props.color+"tableau3"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.props.color+"foundation3"]} 
                        onDrop = {this.handleDrop}
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"tableau3"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"foundation3"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"waste"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"stock"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state.stacks[this.opponent+"malus"]} 
                        onDrop = {this.handleDrop}
                        player = {false}
                    ></Stack>
                </div>
            </DndProvider>
        )
    }
} 

function Stack (props) {
    console.log(props.stack.name)
    const [{hover  }, drop] = useDrop(() => ({
        accept: "cards",
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

      function topValues () {
        if(!props.player) {
            if(props.stack.name === 'malus')
                return '0%'
            if(props.stack.name === 'stock')
                return '0%'
            if(props.stack.name ==='waste')
                return '0%'
        }
    }
    function bottomValues () {
        if(props.player) {
            if(props.stack.name ==='malus')
                return '0%'
            if(props.stack.name ==='stock')
                return '0%'
            if(props.stack.name ==='waste')
                return '0%'
        }
        if(props.stack.name === 'tableau0' || props.stack.name ===  'foundation0')
            return '16%'
        if(props.stack.name === 'tableau1'|| props.stack.name === 'foundation1')
            return '32%'
        if(props.stack.name === 'tableau2'|| props.stack.name === 'foundation2')
            return '48%'
        if(props.stack.name === 'tableau3'|| props.stack.name === 'foundation3')
            return '64%'
    }
    
      function leftValue() {
        if(props.stack.name ==='stock')
            return '0%'
        if(props.stack.name === 'malus')
            return '35%'
        if(props.stack.name === 'waste')
            return '12%'  
      
        if(!props.player) {
            if(props.stack.name ==='tableau0')
                return '55%'
            if(props.stack.name ==='tableau1')
                return '55%'
            if(props.stack.name ==='tableau2')
                return '55%'
            if(props.stack.name ==='tableau3')
                return '55%'
        }
        if(!props.player) {
            if(props.stack.name ==='foundation0')
                return '39%'
            if(props.stack.name ==='foundation1')
                return '39%'
            if(props.stack.name ==='foundation2')
                return '39%'
            if(props.stack.name ==='foundation3')
                return '39%'
        }
        if(props.player) {
            if(props.stack.name ==='foundation0')
                return '47%'
            if(props.stack.name ==='foundation1')
                return '47%'
            if(props.stack.name ==='foundation2')
                return '47%'
            if(props.stack.name ==='foundation3')
                return '47%'
        }
      }
      function rightValue () {
      
        if(props.player) {
            if(props.stack.name ==='tableau0')
                return '65%'
            if(props.stack.name ==='tableau1')
                return '65%'
            if(props.stack.name ==='tableau2')
                return '65%'
            if(props.stack.name ==='tableau3')
                return '65%'
        }
      }
        return (
            <ul 
                ref={drop}
                className ={props.stack.type+" "+props.stack.name}  
                style = {{
                    border: '.15rem  solid black',
                    position : 'fixed',
                    bottom : bottomValues(),
                    top : topValues() ,
                    left : leftValue(),
                    right : rightValue(),
                    display: 'flex',
                    flexDirection: (props.player && props.stack.name.includes('tableau')) ? 'row-reverse' : '',
                    minWidth : '5rem',
                    minHeight : '7.5rem'
                }}> 
                {props.stack.cards.map( (card,index) => 
                    <Card 
                        key = {card.cardid}
                        cardid = {card.cardid}
                        faceup = {card.faceup}
                        color = {card.color} 
                        suit = {card.suit} 
                        value = {card.value}
                        stack = {props.stack.name}
                        uppermost = {index === (props.stack.cards.length-1)}
                    ></Card>
                )}
            </ul>
        )
    }

function Card (props) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "cards",
        item : {cardid : props.cardid} ,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
 
    return (
        <div 
            ref={drag} 
            style={{
                transform : 'inherit',
                fontSize: '1.2rem',
                lineHeight :'1rem',
                fontWeight: 'bold',
                cursor: 'grab',
                borderRadius: '.7rem',
                padding : '.4rem',
                marginRight : '-2rem',
                marginBottom : '.4rem',
                textAlign : 'end',
                height: '6rem',
                width: '4rem',
                zIndex : '1',
                background : props.faceup?'white':props.color==='red'?'url("https://opengameart.org/sites/default/files/card%20back%20red.png")':'url("https://lh3.googleusercontent.com/proxy/HZI6kYVdeqtmP1t3G4sUdNmj0u8PJxqCxswHuI9Qv7swKgLigikY_RqENxnrTSIqW3qvrTxuKDs4b0rYNHXpt_Jx0sJcK14")',
                backgroundSize : "stretch",
                backgroundPosition :'center',
                opacity: isDragging ? 0.3 : 1,
                color: props.color === 'red'?'red':'black',
                border: '.15rem  solid black',
            }}
            className = {'card '+"cards-"+ props.stack+' '+ props.color +' '+ (props.faceup ? 'faceup' : 'facedown')+ (props.faceup ? ' '+props.suit : '') +(props.faceup ? ' '+ props.value : '')} >
              <div>{props.suit}<br/>{props.value }</div>
              <div className="cardCenter"> <br/>{props.suit}</div>
        </div>
    )
}

