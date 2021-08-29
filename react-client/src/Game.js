import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, DndProvider, useDrop  } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default class Game extends React.Component{
    constructor(props) {
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
   
    handleDrop(result) {

        
        
        

        this.state.stacks[result.to.stack].cards.push(this.state.stacks[result.from.stack].cards.find(x=>x.cardid === result.from.id));
        this.state.stacks[result.from.stack].cards.pop();


        this.setState({stacks : this.state.stacks})
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
    const [{hover  }, drop] = useDrop(() => ({
        accept: "card",
        drop: monitor => {
            handleDrop(monitor, {stack : props.stack.name});
        },
        hover: monitor => {
            console.log(monitor)
        },
      }))
  
      function handleDrop(from, to) {
          props.onDrop({from,to});
      }

    function bottomValues () {
        if(props.player) {
            if(props.stack.name.includes('malus'))
                return '0%'
            if(props.stack.name.includes('stock'))
                return '0%'
            if(props.stack.name.includes('waste'))
                return '0%'
        }
        if(!props.player) {
            if(props.stack.name.includes('malus'))
                return '82%'
            if(props.stack.name.includes('stock'))
                return '82%'
            if(props.stack.name.includes('waste'))
                return '82%'
        }
        if(props.stack.name.includes('tableau0' || props.stack.name.includes('foundation0')))
            return '16%'
        if(props.stack.name.includes('tableau1'|| props.stack.name.includes('foundation1')))
            return '32%'
        if(props.stack.name.includes('tableau2'|| props.stack.name.includes('foundation2')))
            return '48%'
        if(props.stack.name.includes('tableau3'|| props.stack.name.includes('foundation3')))
            return '64%'
    }
    
      function leftValue() {
        if(props.stack.name.includes('stock'))
            return '0%'
        if(props.stack.name.includes('malus'))
            return '35%'
        if(props.stack.name.includes('waste'))
            return '12%'  
      
        if(!props.player) {
            if(props.stack.name.includes('tableau0'))
                return '55%'
            if(props.stack.name.includes('tableau1'))
                return '55%'
            if(props.stack.name.includes('tableau2'))
                return '55%'
            if(props.stack.name.includes('tableau3'))
                return '55%'
        }
        if(!props.player) {
            if(props.stack.name.includes('foundation0'))
                return '39%'
            if(props.stack.name.includes('foundation1'))
                return '39%'
            if(props.stack.name.includes('foundation2'))
                return '39%'
            if(props.stack.name.includes('foundation3'))
                return '39%'
        }
        if(props.player) {
            if(props.stack.name.includes('foundation0'))
                return '47%'
            if(props.stack.name.includes('foundation1'))
                return '47%'
            if(props.stack.name.includes('foundation2'))
                return '47%'
            if(props.stack.name.includes('foundation3'))
                return '47%'
        }
      }
      function rightValue () {
      
        if(props.player) {
            if(props.stack.name.includes('tableau0'))
                return '65%'
            if(props.stack.name.includes('tableau1'))
                return '65%'
            if(props.stack.name.includes('tableau2'))
                return '65%'
            if(props.stack.name.includes('tableau3'))
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
                    left : leftValue(),
                    right : rightValue(),
                    display: 'flex',
                    flexDirection: (props.player && props.stack.name.includes('tableau')) ? 'row-reverse' : '',
                    minWidth : '4vw',
                    minHeight : '14vh',
                
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

    const [{ isDragging, canDrag }, drag] = useDrag(() => ({
        type: "card",
        item : {id : props.cardid, stack : props.stack} ,
        canDrag : props.uppermost,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    
    function height () {
        return 10+"vh"
    }
    function width () {
        return 3.3+"vw"
    }
    return (
        <div 
            ref={drag} 
            style={{
                transform : 'inherit',
                fontSize: '1.2vw',
                lineHeight :'1vw',
                fontWeight: 'bold',
                cursor: 'grab',
                borderRadius: '.7vw',
                padding : '.4vw',
                marginRight : '-2vw',
                marginBottom : '.4vw',
                textAlign : 'end',
                height: height(),
                width: width(),
                zIndex : '1',
                background : props.faceup?'white':props.color==='red'?'url("https://opengameart.org/sites/default/files/card%20back%20red.png")':'url("https://lh3.googleusercontent.com/proxy/HZI6kYVdeqtmP1t3G4sUdNmj0u8PJxqCxswHuI9Qv7swKgLigikY_RqENxnrTSIqW3qvrTxuKDs4b0rYNHXpt_Jx0sJcK14")',
                backgroundSize : "stretch",
                backgroundPosition :'center',
                opacity: isDragging ? 0.3 : 1,
                color: props.color === 'red'?'red':'black',
                border: '.15vw  solid black',
          
                
            }}
            className = {'card '+"cards-"+ props.stack+' '+ props.color +' '+ (props.faceup ? 'faceup' : 'facedown')+ (props.faceup ? ' '+props.suit : '') +(props.faceup ? ' '+ props.value : '')} >
              <div>{props.suit}<br/>{props.value }</div>
              <div className="cardCenter"> <br/>{props.suit}</div>
        </div>
    )
}

