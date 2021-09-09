import React,{useState} from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, DndProvider, useDrop  } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

var GameContext = {
    id : {},
    playercolor : {},
    opponentcolor : {},
    throwOnWaste : {},
    throwOnMalus : {},
    variant : {},
    turntimer : {},
    isturn : {},
    mounted : {},
    lastmovefrom : {},
    lastmoveto : {},
    stockflipped : {},
    socket : {},
}

export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        GameContext.id = props.id
        GameContext.playercolor = props.playercolor
        GameContext.opponentcolor = props.opponentcolor
        GameContext.throwOnWaste = props.throwOnWaste
        GameContext.throwOnMalus = props.throwOnMalus
        GameContext.variant = props.variant
        GameContext.isturn = props.initialState.turnplayer === props.socket.id ? true : false
        GameContext.lastmovefrom = {}
        GameContext.lastmoveto = {}
        GameContext.stockflipped = false
        GameContext.socket = props.socket
        this.state = {
            redmalus : props.initialState.stacks.redmalus.cards,
            redstock : props.initialState.stacks.redstock.cards,
            redwaste : props.initialState.stacks.redwaste.cards,
            redtableau0 : props.initialState.stacks.redtableau0.cards,
            redtableau1 : props.initialState.stacks.redtableau1.cards,
            redtableau2 : props.initialState.stacks.redtableau2.cards,
            redtableau3 : props.initialState.stacks.redtableau3.cards,
            redfoundation0 : props.initialState.stacks.redfoundation0.cards,
            redfoundation1 : props.initialState.stacks.redfoundation1.cards,
            redfoundation2 : props.initialState.stacks.redfoundation2.cards,
            redfoundation3 : props.initialState.stacks.redfoundation3.cards,
            blackmalus : props.initialState.stacks.blackmalus.cards,
            blackstock : props.initialState.stacks.blackstock.cards,
            blackwaste : props.initialState.stacks.blackwaste.cards,
            blacktableau0 : props.initialState.stacks.blacktableau0.cards,
            blacktableau1 : props.initialState.stacks.blacktableau1.cards,
            blacktableau2 : props.initialState.stacks.blacktableau2.cards,
            blacktableau3 : props.initialState.stacks.blacktableau3.cards,
            blackfoundation0 : props.initialState.stacks.blackfoundation0.cards,
            blackfoundation1 : props.initialState.stacks.blackfoundation1.cards,
            blackfoundation2 : props.initialState.stacks.blackfoundation2.cards,
            blackfoundation3 : props.initialState.stacks.blackfoundation3.cards,
            playertimer: GameContext.playercolor === 'red' ? props.initialState.redtimer : props.initialState.blacktimer,
            opponenttimer: GameContext.playercolor === 'black' ? props.initialState.redtimer : props.initialState.blacktimer
        };
        this.props.socket.on("actionMoveRES", data => {
            if (this.state.mounted) {
                GameContext.stockflipped = false
                GameContext.isturn = data.turn === this.props.socket.id ? true : false
                if( !data.stacks[0].name.includes('stock') && ! data.stacks[1].name.includes('waste'))  {
                    GameContext.lastmovefrom = data.stacks[0].name
                    GameContext.lastmoveto = data.stacks[1].name
                }
                this.setState({[data.stacks[0].name] : data.stacks[0].cards})
                this.setState({[data.stacks[1].name] : data.stacks[1].cards})
            }
        });
        this.props.socket.on("actionFlipRES", data => {
            if (this.state.mounted) {
                GameContext.lastmovefrom = data.name
                GameContext.lastmoveto = GameContext.lastmovefrom
                GameContext.stockflipped = true
                this.setState({[data.name] : data.cards})
            }
        });
        this.props.socket.on("timerRES", data => {
            if (this.state.mounted) {
                this.setState (data);
            }
        });
        this.props.socket.on("updatetimerRES", data => {
            if(this.state.mounted)
              this.setState({ playertimer: data.playertimer })
              this.setState({ opponenttimer: data.opponenttimer })
          });
    }
    
    componentDidMount() {
        this.setState({mounted : true})
    }

    render(){
        return (
            <DndProvider backend={HTML5Backend}>
                <div 
                    className="game"
                    style = {{
                        position: 'fixed',
                    }}>
                    <div  style = {{
                        position: 'fixed',
                        marginTop : '41vmax'
                    }}>{this.state.playertimer}</div>
                    <div  style = {{
                        position: 'fixed',
                    }}>{this.state.opponenttimer}</div>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"malus"]} 
                        stackname = {this.props.playercolor+"malus"}
                        stacktype = "sequence"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"stock"]} 
                        stackname = {this.props.playercolor+"stock"}
                        stacktype = "pile"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"waste"]} 
                        stackname = {this.props.playercolor+"waste"}
                        stacktype = "pile"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"tableau0"]} 
                        stackname = {this.props.playercolor+"tableau0"}
                        stacktype = "sequence"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"foundation0"]}
                        stackname = {this.props.playercolor+"foundation0"}
                        stacktype = "pile" 
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"tableau0"]} 
                        stackname = {this.props.opponentcolor+"tableau0"}
                        stacktype = "sequence"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"foundation0"]} 
                        stackname = {this.props.opponentcolor+"foundation0"}
                        stacktype = "pile"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"tableau1"]} 
                        stackname = {this.props.playercolor+"tableau1"}
                        stacktype = "sequence"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"foundation1"]} 
                        stackname = {this.props.playercolor+"foundation1"}
                        stacktype = "pile"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"tableau1"]} 
                        stackname = {this.props.opponentcolor+"tableau1"}
                        stacktype = "sequence"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"foundation1"]} 
                        stackname = {this.props.opponentcolor+"foundation1"}
                        stacktype = "pile"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"tableau2"]} 
                        stackname = {this.props.playercolor+"tableau2"}
                        stacktype = "sequence"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"foundation2"]} 
                        stackname = {this.props.playercolor+"foundation2"}
                        stacktype = "pile"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"tableau2"]} 
                        stackname = {this.props.opponentcolor+"tableau2"}
                        stacktype = "sequence"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"foundation2"]} 
                        stackname = {this.props.opponentcolor+"foundation2"}
                        stacktype = "pile"
                        player = {false}
                    ></Stack>
                     <Stack 
                        stack = {this.state[this.props.playercolor+"tableau3"]} 
                        stackname = {this.props.playercolor+"tableau3"}
                        stacktype = "sequence"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.playercolor+"foundation3"]} 
                        stackname = {this.props.playercolor+"foundation3"}
                        stacktype = "pile"
                        player = {true}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"tableau3"]} 
                        stackname = {this.props.opponentcolor+"tableau3"}
                        stacktype = "sequence"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"foundation3"]} 
                        stackname = {this.props.opponentcolor+"foundation3"}
                        stacktype = "pile"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"waste"]} 
                        stackname = {this.props.opponentcolor+"waste"}
                        stacktype = "pile"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"stock"]} 
                        stackname = {this.props.opponentcolor+"stock"}
                        stacktype = "pile"
                        player = {false}
                    ></Stack>
                    <Stack 
                        stack = {this.state[this.props.opponentcolor+"malus"]} 
                        stackname = {this.props.opponentcolor+"malus"}
                        stacktype = "sequence"
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
            handleDrop(monitor, props.stackname);
        },
      //  hover: monitor => {
      //      console.log(monitor)
      // },
    }))
    function handleDrop(card, stack) {
        if(card.stack != stack)
            GameContext.socket.emit('actionMoveREQ', {gameid : GameContext.id , card : card, to : stack})
    }
    
    function topValues (){
        if(!props.player) {
            if(props.stackname.includes('malus'))
                return '0vmin'
            if(props.stackname.includes('stock'))
                return '0vmin'
            if(props.stackname.includes('waste'))
                return '0vmin'
        }
        if(props.player) {
            if(props.stackname.includes('malus'))
                return '82vmin'
            if(props.stackname.includes('stock'))
                return '82vmin'
            if(props.stackname.includes('waste'))
                return '82vmin'
        }
        if(props.stackname.includes('tableau0') || props.stackname.includes('foundation0'))
            return '17vmin'
        if(props.stackname.includes('tableau1')|| props.stackname.includes('foundation1'))
            return '33vmin'
        if(props.stackname.includes('tableau2')|| props.stackname.includes('foundation2'))
            return '49vmin'
        if(props.stackname.includes('tableau3')|| props.stackname.includes('foundation3'))
            return '65vmin'
    }
    function leftValue() {
        if(props.stackname.includes('stock'))
            return '20.5vmax'
        if(props.stackname.includes('malus'))
            return '34.5vmax'
        if(props.stackname.includes('waste'))
            return '12.5vmax'   
        if(!props.player) {
            if(props.stackname.includes('tableau0'))
                return '59.5vmax'
            if(props.stackname.includes('tableau1'))
                return '59.5vmax'
            if(props.stackname.includes('tableau2'))
                return '59.5vmax'
            if(props.stackname.includes('tableau3'))
                return '59.5vmax'
        }
        if(!props.player) {
            if(props.stackname.includes('foundation0'))
                return '41vmax'
            if(props.stackname.includes('foundation1'))
                return '41vmax'
            if(props.stackname.includes('foundation2'))
                return '41vmax'
            if(props.stackname.includes('foundation3'))
                return '41vmax'
        }
        if(props.player) {
            if(props.stackname.includes('foundation0'))
                return '51.7vmax'
            if(props.stackname.includes('foundation1'))
                return '51.7vmax'
            if(props.stackname.includes('foundation2'))
                return '51.7vmax'
            if(props.stackname.includes('foundation3'))
                return '51.7vmax'
        }
    }
    function rightValue () {
        if(props.player) {
            if(props.stackname.includes('tableau0'))
                return '-39.5vmax'
            if(props.stackname.includes('tableau1'))
                return '-39.5vmax'
            if(props.stackname.includes('tableau2'))
                return '-39.5vmax'
            if(props.stackname.includes('tableau3'))
                return '-39.5vmax'
        }
    }
    function backgroundcolor() {
        if ( GameContext.lastmovefrom)  
            if(GameContext.lastmovefrom != GameContext.lastmoveto) {
                if(!GameContext.isturn)
                    if(props.stackname === GameContext.lastmovefrom)
                        return '#e7fffe' 
                if(!GameContext.isturn)
                    if(props.stackname ===GameContext.lastmoveto)
                        return  '#00ffef'
            }
            else if(props.stackname === GameContext.lastmovefrom)
                if(GameContext.stockflipped)
                    return '#ff6770 '
                
        if(((props.stackname === GameContext.playercolor+"stock" ||props.stackname === GameContext.playercolor+"waste"||props.stackname === GameContext.playercolor+"malus") && GameContext.isturn )) 
            return '#c0ffb4 '
        else if ((props.stackname === GameContext.opponentcolor+"stock" ||props.stackname ===  GameContext.opponentcolor+"waste"||props.stackname ===  GameContext.opponentcolor+"malus"  )&& !GameContext.isturn ) 
            return '#fdffb4'
        return '#EEEEEE'
    }
    return (
        <ul 
            ref={drop}
            className ={props.stacktype+" "+props.stackname}  
            style = {{
                border: '.01vmax  solid Silver',
                backgroundColor: backgroundcolor(),
                position : 'absolute',
                left : leftValue(),
                right : rightValue(),
                top : topValues(),
                display: 'flex',
                alignItems :'center',
                flexDirection: props.player && props.stackname.includes("tableau") ? 'row-reverse' : '',
                overflow:'hidden',
                paddingLeft : '.5vmax',
                paddingRight : '.5vmax',
                paddingTop : '.01vmin',
                paddingBottom : '.01vmin',
                width : 2.6 + (props.stacktype != 'pile' ? (props.stack.length>0?(props.stack.length*2.5) : 2.5) : 2.5 )+'vmax' ,
                height : '14vmin',
            }}> 
            {props.stack.map( (card,index) => 
                <Card 
                    key = {card.number+" "+(index === (props.stack.length-1))+" "+GameContext.isturn+" "+!GameContext.stockflipped}
                    card = {card}
                    stack = {props.stackname}
                    playerStack = {props.player}
                    uppermost = {index === (props.stack.length-1)}
                    onClick = {props.onDrop}
                ></Card>
            )}
        </ul>
    )
}

function Card (props) {
    var dragRef ;
    var isdragging;
    if(props.card.faceup && props.uppermost && GameContext.isturn){
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
    function handleClick() {
        GameContext.socket.emit('actionFlipREQ', {gameid : GameContext.id , stack: props.stack})
    }
    function height () {
        return 10+"vmin"
    }
    function width () {
        return 4+"vmax"
    }
    function cursor () {
        if( (GameContext.stockflipped && ! props.stack.includes('stock') ) || !props.uppermost || props.stack.includes('foundation')  || props.stack.includes(GameContext.opponentcolor+"waste") || props.stack.includes(GameContext.opponentcolor+"malus")|| props.stack.includes(GameContext.opponentcolor+"stock") ||  props.stack.includes(GameContext.playercolor+"waste")  || ! GameContext.isturn )
            return "cursor"
        else if(props.stack.includes(GameContext.playercolor+"stock") && !props.card.faceup)
            return "grabbing"
        else
            return "grab"
    }

    return (
        <div 
            onDragStart ={e=> {
                if( GameContext.stockflipped && ! props.stack.includes('stock') || !props.uppermost  || props.stack.includes(GameContext.opponentcolor+"waste") || props.stack.includes('foundation')  || props.stack.includes(GameContext.opponentcolor+"malus")||
                        props.stack.includes(GameContext.opponentcolor+"stock") ||  props.stack.includes(GameContext.playercolor+"waste")  || ! GameContext.isturn  ||
                        (props.stack === GameContext.playercolor+"stock" && !props.card.faceup))
                    e.preventDefault()
            }}
            ref = { dragRef } 
            onClick = {()=> props.stack === GameContext.playercolor+'stock' && !props.card.faceup && GameContext.isturn ? handleClick(): ''}
            style={{
                fontSize: '1.5vmax',
                lineHeight :'1.5vmax',
                position : 'inherit',
                fontWeight: 'bold',
                cursor: cursor ()  ,
                borderRadius: '.7vmax',
                padding : '.4vmax',
                position : props.stack.includes('stock') || props.stack.includes('foundation') || props.stack.includes('waste') ?'absolute':'',
                marginRight : !props.stack.includes('tableau') ? !props.uppermost ?'-2.6vmax':'0' : props.stack.includes('tableau') && ! props.playerStack && ! props.uppermost? '-2.6vmax':'0',
                marginLeft : props.stack.includes('tableau')  && props.playerStack ? !props.uppermost ? '-2.6vmax' :'0' : '0',
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
                    className="cardsmallright"
                    style={{
                        letterSpacing :'-.1vmax',
                        position : 'absolute',
                        textAlign : 'center',
                        marginTop :'1.5vmin'  ,
                        marginLeft : (props.card.value == "1" || props.card.value == "10" || props.card.value == "12" || props.card.value == "13 ")?'3vmax' : '3.3vmax'
                    }} >
                    {props.card.suit}<br/>{props.card.value === '1' ? 'A' : props.card.value === '11' ? 'J' : props.card.value === '12' ? 'Q' : props.card.value === '13' ? 'K' : props.card.value}
                </div>
                <div
                    className="cardsmallleft"
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
                    className="cardbigcenter"
                    style={{
                        fontSize: props.suit != '♣' ? '3.4vmax' : '2.9vmax',
                        position : 'absolute',
                        textAlign : 'center',
                        marginTop : '3.5vmin',
                        marginLeft : '1.1vmax',
                    }}> 
                    {props.card.suit}
                </div>
        </div>
    )
}
