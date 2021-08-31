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
            turn : props.initialState.turnplayer === props.socket.id ? true : false
        };

        this.props.socket.on("actionRES", data => {
            if (this.mounted) {
               this.setState(data) 
            }
        });
        this.props.socket.on("timerRES", data => {
            if (this.mounted) {
                this.setState (data);
            }
        });
    }
   
    handleDrop(card, stack) {
        this.props.socket.emit('actionREQ', {gameid : this.props.id , card : card, to : stack})
    }

    componentDidMount() {
        this.mounted = true;
        this.props.socket.emit('startREQ');
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
            props.onDrop(monitor, props.stack.name);
        },
      //  hover: monitor => {
      //      console.log(monitor)
      // },
    }))
 
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
                    key = {card.number}
                    card = {card}
                    stack = {props.stack.name}
                    player = {props.player}
                    uppermost = {index === (props.stack.cards.length-1)}
                ></Card>
            )}
        </ul>
    )
}

function Card (props) {
    var dragRef ;
    var isdragging;
    if(props.card.faceup) {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: "card",
            item : {
                color : props.card.color, 
                faceup : props.card.faceup, 
                number : props.card.number, 
                suit : props.card.suit, 
                value : props.card.value, 
                stack : props.stack
            } ,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            })
        }))
        dragRef = drag;
        isdragging = isDragging
    }
    function height () {
        return 10+"vmin"
    }
    function width () {
        return 4+"vmax"
    }
    return (
        <div 
            onDragStart ={e=> {
                if(!props.uppermost || !props.card.faceup)
                    e.preventDefault()
            }}
            ref={props.card.faceup? dragRef : React.createRef()} 
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
                background : (!props.card.faceup ?  props.card.color==='red' ? 'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-red-sticker-1600042082.903987.png")':'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-blue-sticker-1600041775.9919636.png")' : '') + 'center',
                backgroundColor : props.card.faceup ? 'white'  : ' ',
                opacity: props.card.faceup ? isdragging ? 0.3 : 1 : 1,
                color: props.card.suit === '♥' || props.card.suit === '♦'?'red':'black',
                border: '.15vmax  solid black',            
            }}
            className = {'card '+"cards-"+ props.stack+' '+ props.card.color +' '+ (props.card.faceup ? 'faceup' : 'facedown')+ (props.card.faceup ? ' '+props.card.suit : '') +(props.card.faceup ? ' '+ props.card.value : '')} >
                <div
                    className="cardCorner"
                    style={{
                        letterSpacing :'-.2vmax',
                        position : 'absolute',
                        textAlign : 'center',
                        marginTop :'1.5vmin'  ,
                        marginLeft : (props.card.value == "1" || props.card.value == "10" || props.card.value == "12" || props.card.value == "13 ")?'3.1vmax' : '3.3vmax'
                    }} >
                    {props.card.suit}<br/>{props.card.value === '1' ? 'A' : props.card.value === '11' ? 'J' : props.card.value === '12' ? 'Q' : props.card.value === '13' ? 'K' : props.card.value}
                </div>
                <div
                    className="cardCorner"
                    style={{
                        letterSpacing :'-.2rem',
                        position : 'absolute',
                        textAlign : 'center',
                        marginTop : '4vmin',
                        marginLeft : (props.card.value == "1" || props.card.value == "10" || props.card.value == "12" || props.card.value == "13 ")?'-.2vmax' : '-.3vmax'
                    }} >
                    {props.card.suit}<br/>{props.card.value === '1' ? 'A' : props.card.value === '11' ? 'J' : props.card.value === '12' ? 'Q' : props.card.value === '13' ? 'K' : props.card.value}
                </div>
                <div 
                    className="cardCenter"
                    style={{
                        fontSize: props.suit != '♣' ? '3.4vmax' : '2.9vmax',
                        position : 'absolute',
                        marginTop : '3.5vmin',
                        marginLeft : '1.1vmax',
                    }}> 
                    {props.card.suit}
                </div>
        </div>
    )
}
