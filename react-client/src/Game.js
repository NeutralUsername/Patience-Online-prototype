import React,{useState} from 'react';
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
       console.log(result)
    }

    render(){
        return (
            <DndProvider backend={HTML5Backend}>
                <div 
                    className="game"
                    style = {{
                        position: 'fixed',
                    }}>
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
    const [{ hover }, drop] = useDrop(() => ({
        accept: "card",
        drop: monitor => {
            handleDrop(monitor, {stack : props.stack.name});
        },
        hover: monitor => {
            console.log(monitor)
        },
    }))
 
    function handleDrop(card, toStack) {
          props.onDrop({card,toStack});
    }

    function topValues (){
        if(!props.player) {
            if(props.stack.name.includes('malus'))
                return '0vmin'
            if(props.stack.name.includes('stock'))
                return '0vmin'
            if(props.stack.name.includes('waste'))
                return '0vmin'
        }
        if(props.player) {
            if(props.stack.name.includes('malus'))
                return '82vmin'
            if(props.stack.name.includes('stock'))
                return '82vmin'
            if(props.stack.name.includes('waste'))
                return '82vmin'
        }
        if(props.stack.name.includes('tableau0') || props.stack.name.includes('foundation0'))
            return '17vmin'
        if(props.stack.name.includes('tableau1')|| props.stack.name.includes('foundation1'))
            return '33vmin'
        if(props.stack.name.includes('tableau2')|| props.stack.name.includes('foundation2'))
            return '49vmin'
        if(props.stack.name.includes('tableau3')|| props.stack.name.includes('foundation3'))
            return '65vmin'
    }
    function leftValue() {
        if(props.stack.name.includes('stock'))
            return '20.5vmax'
        if(props.stack.name.includes('malus'))
            return '34.5vmax'
        if(props.stack.name.includes('waste'))
            return '12.5vmax'   
        if(!props.player) {
            if(props.stack.name.includes('tableau0'))
                return '59.5vmax'
            if(props.stack.name.includes('tableau1'))
                return '59.5vmax'
            if(props.stack.name.includes('tableau2'))
                return '59.5vmax'
            if(props.stack.name.includes('tableau3'))
                return '59.5vmax'
        }
        if(!props.player) {
            if(props.stack.name.includes('foundation0'))
                return '41vmax'
            if(props.stack.name.includes('foundation1'))
                return '41vmax'
            if(props.stack.name.includes('foundation2'))
                return '41vmax'
            if(props.stack.name.includes('foundation3'))
                return '41vmax'
        }
        if(props.player) {
            if(props.stack.name.includes('foundation0'))
                return '51.5vmax'
            if(props.stack.name.includes('foundation1'))
                return '51.5vmax'
            if(props.stack.name.includes('foundation2'))
                return '51.5vmax'
            if(props.stack.name.includes('foundation3'))
                return '51.5vmax'
        }
    }
    function rightValue () {
        if(props.player) {
            if(props.stack.name.includes('tableau0'))
                return '-39.5vmax'
            if(props.stack.name.includes('tableau1'))
                return '-39.5vmax'
            if(props.stack.name.includes('tableau2'))
                return '-39.5vmax'
            if(props.stack.name.includes('tableau3'))
                return '-39.5vmax'
        }
    }
    return (
        <ul 
            ref={drop}
            className ={props.stack.type+" "+props.stack.name}  
            style = {{
                border: '.01vmax  solid Silver',
                backgroundColor: '#EEEEEE',
                position : 'absolute',
                left : leftValue(),
                right : rightValue(),
                top : topValues(),
                display: 'flex',
                alignItems :'center',

                flexDirection: props.player && props.stack.name.includes("tableau") ? 'row-reverse' : '',
                
                overflow:'hidden',
              
                paddingLeft : '.5vmax',
                paddingRight : '.5vmax',
                paddingTop : '.01vmin',
                paddingBottom : '.01vmin',

                width : 2.6 + (props.stack.type != 'pile' ? (props.stack.cards.length>0?(props.stack.cards.length*2.5) : 2.5) : 2.5 )+'vmax' ,
                height : '14vmin',
            }}> 
            {props.stack.cards.map( (card,index) => 
                <Card 
                    faceup = {card.faceup}
                    color = {card.color} 
                    suit = {card.suit} 
                    value = {card.value}

                    stack = {props.stack.name}
                    player = {props.player}
                    uppermost = {index === (props.stack.cards.length-1)}
                ></Card>
            )}
        </ul>
    )
}

function Card (props) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        item : {color : props.color, suit : props.suit, value : props.value, stack : props.stack} ,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    function height () {
        return 10+"vmin"
    }
    function width () {
        return 4+"vmax"
    }
    return (
        <div 
            onDragStart ={e=> {
                if(!props.uppermost)
                    e.preventDefault()
            }}
            ref={drag} 
            style={{
                fontSize: '1.5vmax',
                lineHeight :'1.2vmax',
                position : 'inherit',
                fontWeight: 'bold',
                cursor: props.uppermost? 'grab' :'mouse',
                borderRadius: '.7vmax',
                padding : '.4vmax',
                position : props.stack.includes('stock') || props.stack.includes('foundation') || props.stack.includes('waste') ?'absolute':'',
                marginRight : !props.stack.includes('tableau') ? !props.uppermost ?'-2.6vmax':'0' : props.stack.includes('tableau') && ! props.player && ! props.uppermost? '-2.6vmax':'0',
                marginLeft : props.stack.includes('tableau')  && props.player ? !props.uppermost ? '-2.6vmax' :'0' : '0',
                
                height: height(),
                width: width(),

                zIndex : '1',
                background : props.faceup?'white':props.color==='red'?'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-red-sticker-1600042082.903987.png")':'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-blue-sticker-1600041775.9919636.png")',
                backgroundSize : '10vmax',
                backgroundPosition :'center',
                opacity: isDragging ? 0.3 : 1,
                color: props.suit === '♥' || props.suit === '♦'?'red':'black',
                border: '.15vmax  solid black',            
            }}
            className = {'card '+"cards-"+ props.stack+' '+ props.color +' '+ (props.faceup ? 'faceup' : 'facedown')+ (props.faceup ? ' '+props.suit : '') +(props.faceup ? ' '+ props.value : '')} >
                <div
                    className="cardCorner"
                    style={{
                        letterSpacing :'-.2vmax',
                        position : 'absolute',
                        marginTop :'1.5vmin'  ,
                        marginLeft : '3.1vmax',
                    }} >
                    {props.suit}<br/>{props.value === '1' ? 'A' : props.value === '11' ? 'J' : props.value === '12' ? 'Q' : props.value === '13' ? 'K' : props.value}
                </div>
                <div
                    className="cardCorner"
                    style={{
                        letterSpacing :'-.2rem',
                        position : 'absolute',
                        marginTop : '4vmin',
                        marginLeft : '-.2vmax'
                    }} >
                    {props.suit}<br/>{props.value === '1' ? 'A' : props.value === '11' ? 'J' : props.value === '12' ? 'Q' : props.value === '13' ? 'K' : props.value}
                </div>
                <div 
                    className="cardCenter"
                    style={{
                        fontSize: props.suit != '♣' ? '3.4vmax' : '2.9vmax',
                        position : 'absolute',
                        marginTop : '3.5vmin',
                        marginLeft : '1.1vmax',
                    }}> 
                    {props.suit}
                </div>
        </div>
    )
}

