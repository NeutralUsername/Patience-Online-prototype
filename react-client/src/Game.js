import React,{useState} from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, DndProvider, useDrop  } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Options from './Options';

var GameContext = {
    id : {},
    playercolor : {},
    opponentcolor : {},
    throwOnWaste : {},
    throwOnMalus : {},
    variant : {},
    isturn : {},
    lastmovefrom : {},
    lastmoveto : {},
    stockflipped : {},
    socket : {},
    tableaumove : {},
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
        GameContext.isturn = props.initialState.turncolor === props.playercolor
        GameContext.lastmovefrom = {}
        GameContext.lastmoveto = {}
        GameContext.stockflipped = false
        GameContext.socket = props.socket
        GameContext.tableaumove = false
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
            mounted : false,
            playertimer: props.initialState.redtimer,  //doesnt matter which one since value is initially the same 
            opponenttimer: props.initialState.redtimer
        };
      
    }
    
    componentDidMount() {
        this.setState({mounted : true})
        this.props.socket.on("actionMoveRES", data => {
            if (this.state.mounted) {
                GameContext.stockflipped = false
                if( !GameContext.isturn ) 
                 {
                    GameContext.lastmovefrom = data.stacks[0].name
                    GameContext.lastmoveto = data.stacks[1].name
                }
                GameContext.isturn = data.turncolor === GameContext.playercolor ? true : false
                GameContext.tableaumove = data.turntableaumove
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
        this.props.socket.on("updateTimerRES", data => {
            if (this.state.mounted) {
                this.setState({ playertimer: data[GameContext.playercolor+'timer'] })
                this.setState({ opponenttimer: data[GameContext.opponentcolor+'timer'] })
            }
        });
        this.props.socket.on("gameAbortedRES", data => {
            if (this.state.mounted) {
                return (
                    ReactDOM.render (
                        <Options
                            status = {"other player disconnected. aborted game"}      
                        ></Options>,
                        document.getElementById ('root')
                    )
                )
            }
        });
        this.props.socket.on("gameEndedRES", data => {
            if (this.state.mounted) {
                alert("the winner is " + data.result)
                return (
                    ReactDOM.render (
                        <Options
                            status = {"the winner is " + data.result}      
                        ></Options>,
                        document.getElementById ('root')
                    )
                )
            }
        });
        this.props.socket.on("surrenderHandshakeRES", data => {
            
        })
    }
    
    componentWillUnmount() {
        this.setState({mounted : false})
    }
    render(){
        return (
            <DndProvider backend={HTML5Backend}>
                <div 
                    className="game"
                    style = {{
                        position: 'absolute',
                        textAlign:'center',
                        backgroundColor : '#EDEBE9'
                    }}>
                    <div style = {{
                        position: 'fixed',
                        textAlign:'center',
                        top : '87vmin',
                        left : '28.9vmax',
                        
                    }}>
                        <div  style = {{
                            fontSize : '1.5vmax',
                            textAlign:'center',
                            minWidth : '4vmax',
                            border : '1px solid black',
                            borderRadius : '5px',
                            backgroundColor : 'white'
                            }}>{this.state.playertimer.toFixed(0)}
                        </div>
                        <div  style = {{
                            marginTop : '10px',
                            display : 'inline-block',  
                            padding : '.5vmax',
                            //backgroundColor : '#FF8C00',
                            borderRadius : '10px'
                            }}><button>
                                Abort
                            </button>
                        </div>
                    </div >
                    <div style = {{
                        position: 'fixed',
                        textAlign:'center',
                        top : '10vmin',
                        left : '28.9vmax',
                    }}>
                        <div  style = {{
                            position: 'relative',
                            fontSize : '1.5vmax',
                            textAlign :'center',
                            minWidth : '4vmax',
                            border : '1px solid black',
                            borderRadius : '5px',
                            backgroundColor : 'white'
                            }}>{this.state.opponenttimer.toFixed(0)}
                        </div>
                    </div>
                    <div  style = {{
                        position: 'fixed',
                        textAlign:'center',
                        top : '92vmin',
                        left : '28.5vmax',
                        
                    }}>
                      
                    </div>
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
                return '-1vmin'
            if(props.stackname.includes('stock'))
                return '-1vmin'
            if(props.stackname.includes('waste'))
                return '-1vmin'
        }
        if(props.player) {
            if(props.stackname.includes('malus'))
                return '81vmin'
            if(props.stackname.includes('stock'))
                return '81vmin'
            if(props.stackname.includes('waste'))
                return '81vmin'
        }
        if(props.stackname.includes('tableau0') || props.stackname.includes('foundation0'))
            return '16vmin'
        if(props.stackname.includes('tableau1')|| props.stackname.includes('foundation1'))
            return '32vmin'
        if(props.stackname.includes('tableau2')|| props.stackname.includes('foundation2'))
            return '48vmin'
        if(props.stackname.includes('tableau3')|| props.stackname.includes('foundation3'))
            return '64vmin'
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
      
        if(props.player) {
            if(props.stackname.includes('foundation0'))
                return '41.3vmax'
            if(props.stackname.includes('foundation1'))
                return '41.3vmax'
            if(props.stackname.includes('foundation2'))
                return '41.3vmax'
            if(props.stackname.includes('foundation3'))
                return '41.3vmax'
        }
        if(!props.player) {
            if(props.stackname.includes('foundation0'))
                return '52vmax'
            if(props.stackname.includes('foundation1'))
                return '52vmax'
            if(props.stackname.includes('foundation2'))
                return '52vmax'
            if(props.stackname.includes('foundation3'))
                return '52vmax'
        }
    }
    function rightValue () {
        if(props.player) {
            if(props.stackname.includes('tableau0'))
                return '-40vmax'
            if(props.stackname.includes('tableau1'))
                return '-40vmax'
            if(props.stackname.includes('tableau2'))
                return '-40vmax'
            if(props.stackname.includes('tableau3'))
                return '-40vmax'
        }
    }
    function backgroundcolor() {
        if ( GameContext.lastmovefrom)  
            if(GameContext.lastmovefrom != GameContext.lastmoveto) {
                if(!GameContext.isturn)
                    if(props.stackname === GameContext.lastmovefrom)
                        return '#FFA07A'
                if(!GameContext.isturn)
                    if(props.stackname ===GameContext.lastmoveto)
                        return  '#FFA07A'
            }
            else if(props.stackname === GameContext.lastmovefrom)
                if(GameContext.stockflipped)
                    return '#ff6770 '
                
        if(((props.stackname === GameContext.playercolor+"stock" ||props.stackname === GameContext.playercolor+"waste"||props.stackname === GameContext.playercolor+"malus") && GameContext.isturn )) 
            return '#90EE90'
        else if ((props.stackname === GameContext.opponentcolor+"stock" ||props.stackname ===  GameContext.opponentcolor+"waste"||props.stackname ===  GameContext.opponentcolor+"malus"  )&& !GameContext.isturn ) 
            return '#90EE90'
        return '#f1debe'
    }
    //#d7d3cd
    return (
        <ul 
            ref={drop}
            className ={props.stacktype+" "+props.stackname}  
            style = {{
                border: '1px  solid #636363',
                borderRadius : '2px',
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
                paddingTop : 'auto',
                paddingBottom : 'auto',
               
                height : '7.6vmax',
                maxHeight : '15vmin',
            }}> 
            {props.stack.length ? props.stack.map( (card,index) => 
                <Card 
                    key = {card.number+" "+(index === (props.stack.length-1))+" "+GameContext.isturn+" "+!GameContext.stockflipped + GameContext.tableaumove}
                    card = {card}
                    stack = {props.stackname}
                    playerStack = {props.player}
                    uppermost = {index === (props.stack.length-1)}
                    onClick = {props.onDrop}
                ></Card>
            ) : <div style = {{
                    fontSize: '1.5vmax',
                    lineHeight :'1.5vmax',
                    position : 'inherit',
                    fontWeight: 'bold',
                    padding : '.4vmax',
                    position :'',
                    height: 6+"vmax",
                    width: 4+"vmax",
                    maxHeight : '11vmin',
                    maxWidth : '8.0vmin',
                    zIndex : '1',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
            }}></div>}
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
 
    function cursor () {
        if( (GameContext.stockflipped && ! props.stack.includes('stock') ) || !props.uppermost || props.stack.includes('foundation') && GameContext.tableaumove || props.stack.includes(GameContext.opponentcolor+"waste") || props.stack.includes(GameContext.opponentcolor+"malus")|| props.stack.includes(GameContext.opponentcolor+"stock") ||  props.stack.includes(GameContext.playercolor+"waste")  || ! GameContext.isturn )
            return "cursor"
        else if(props.stack.includes(GameContext.playercolor+"stock") && !props.card.faceup)
            return "grabbing"
        else
            return "grab"
    }

    function backgroundImage() {
        if(!props.card.faceup)
            if(props.card.color ==='red')
                return 'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-red-sticker-1600042082.903987.png")'
            else
                return 'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-blue-sticker-1600041775.9919636.png")'
        else {
            if(props.card.suit === "♠") {
                if(props.card.value === "1")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Cards-A-Spade.svg/500px-Cards-A-Spade.svg.png")'
                if(props.card.value === "2")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Cards-2-Spade.svg/500px-Cards-2-Spade.svg.png")'
                if(props.card.value === "3")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Cards-3-Spade.svg/500px-Cards-3-Spade.svg.png")'
                if(props.card.value === "4")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cards-4-Spade.svg/500px-Cards-4-Spade.svg.png")'
                if(props.card.value === "5")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Cards-5-Spade.svg/500px-Cards-5-Spade.svg.png")'
                if(props.card.value === "6")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Cards-6-Spade.svg/500px-Cards-6-Spade.svg.png")'
                if(props.card.value === "7")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Cards-7-Spade.svg/500px-Cards-7-Spade.svg.png")'
                if(props.card.value === "8")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cards-8-Spade.svg/500px-Cards-8-Spade.svg.png")'
                if(props.card.value === "9")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cards-9-Spade.svg/500px-Cards-9-Spade.svg.png")'
                if(props.card.value === "10")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Cards-10-Spade.svg/500px-Cards-10-Spade.svg.png")'
                if(props.card.value === "11")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Cards-J-Spade.svg/500px-Cards-J-Spade.svg.png")'
                if(props.card.value === "12")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Cards-Q-Spade.svg/500px-Cards-Q-Spade.svg.png")'
                if(props.card.value === "13")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Cards-K-Spade.svg/500px-Cards-K-Spade.svg.png")'  
            }
            if(props.card.suit === "♥") {
                if(props.card.value === "1")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cards-A-Heart.svg/500px-Cards-A-Heart.svg.png")'
                if(props.card.value === "2")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Cards-2-Heart.svg/500px-Cards-2-Heart.svg.png")'
                if(props.card.value === "3")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Cards-3-Heart.svg/500px-Cards-3-Heart.svg.png")'
                if(props.card.value === "4")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Cards-4-Heart.svg/500px-Cards-4-Heart.svg.png")'
                if(props.card.value === "5")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Cards-5-Heart.svg/500px-Cards-5-Heart.svg.png")'
                if(props.card.value === "6")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cards-6-Heart.svg/500px-Cards-6-Heart.svg.png")'
                if(props.card.value === "7")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Cards-7-Heart.svg/500px-Cards-7-Heart.svg.png")'
                if(props.card.value === "8")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cards-8-Heart.svg/500px-Cards-8-Heart.svg.png")'
                if(props.card.value === "9")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Cards-9-Heart.svg/500px-Cards-9-Heart.svg.png")'
                if(props.card.value === "10")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Cards-10-Heart.svg/500px-Cards-10-Heart.svg.png")'
                if(props.card.value === "11")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Cards-J-Heart.svg/500px-Cards-J-Heart.svg.png")'
                if(props.card.value === "12")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Cards-Q-Heart.svg/500px-Cards-Q-Heart.svg.png")'
                if(props.card.value === "13")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cards-K-Heart.svg/500px-Cards-K-Heart.svg.png")'  
            }
            if(props.card.suit === "♦") {
                if(props.card.value === "1")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Cards-A-Diamond.svg/500px-Cards-A-Diamond.svg.png")'
                if(props.card.value === "2")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Cards-2-Diamond.svg/500px-Cards-2-Diamond.svg.png")'
                if(props.card.value === "3")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cards-3-Diamond.svg/500px-Cards-3-Diamond.svg.png")'
                if(props.card.value === "4")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cards-4-Diamond.svg/500px-Cards-4-Diamond.svg.png")'
                if(props.card.value === "5")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cards-5-Diamond.svg/500px-Cards-5-Diamond.svg.png")'
                if(props.card.value === "6")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cards-6-Diamond.svg/500px-Cards-6-Diamond.svg.png")'
                if(props.card.value === "7")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Cards-7-Diamond.svg/500px-Cards-7-Diamond.svg.png")'
                if(props.card.value === "8")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cards-8-Diamond.svg/500px-Cards-8-Diamond.svg.png")'
                if(props.card.value === "9")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Cards-9-Diamond.svg/500px-Cards-9-Diamond.svg.png")'
                if(props.card.value === "10")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cards-10-Diamond.svg/500px-Cards-10-Diamond.svg.png")'
                if(props.card.value === "11")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Cards-J-Diamond.svg/500px-Cards-J-Diamond.svg.png")'
                if(props.card.value === "12")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cards-Q-Diamond.svg/500px-Cards-Q-Diamond.svg.png")'
                if(props.card.value === "13")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cards-K-Diamond.svg/500px-Cards-K-Diamond.svg.png")'  
            }
            if(props.card.suit === "♣") {
                if(props.card.value === "1")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cards-A-Club.svg/500px-Cards-A-Club.svg.png")'
                if(props.card.value === "2")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Cards-2-Club.svg/500px-Cards-2-Club.svg.png")'
                if(props.card.value === "3")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cards-3-Club.svg/500px-Cards-3-Club.svg.png")'
                if(props.card.value === "4")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Cards-4-Club.svg/500px-Cards-4-Club.svg.png")'
                if(props.card.value === "5")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cards-5-Club.svg/500px-Cards-5-Club.svg.png")'
                if(props.card.value === "6")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cards-6-Club.svg/500px-Cards-6-Club.svg.png")'
                if(props.card.value === "7")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cards-7-Club.svg/500px-Cards-7-Club.svg.png")'
                if(props.card.value === "8")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Cards-8-Club.svg/500px-Cards-8-Club.svg.png")'
                if(props.card.value === "9")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Cards-9-Club.svg/500px-Cards-9-Club.svg.png")'
                if(props.card.value === "10")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Cards-10-Club.svg/500px-Cards-10-Club.svg.png")'
                if(props.card.value === "11")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Cards-J-Club.svg/500px-Cards-J-Club.svg.png")'
                if(props.card.value === "12")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Cards-Q-Club.svg/500px-Cards-Q-Club.svg.png")'
                if(props.card.value === "13")
                    return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cards-K-Club.svg/500px-Cards-K-Club.svg.png")'  
            }
        }
    }
    return (
        <div 
            onDragStart ={e=> {
                if( GameContext.stockflipped && ! props.stack.includes('stock') || !props.uppermost  || props.stack.includes(GameContext.opponentcolor+"waste") || props.stack.includes('foundation') && GameContext.tableaumove || props.stack.includes(GameContext.opponentcolor+"malus")||
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
                borderRadius: '7px',
                padding : '.4vmax',
                position :'',
                marginRight : !props.stack.includes('tableau') ? !props.uppermost ?'-2.9vmax':'0' : props.stack.includes('tableau') && ! props.playerStack && ! props.uppermost? '-2.9vmax':'0',
                marginLeft : props.stack.includes('tableau')  && props.playerStack ? !props.uppermost ? '-2.9vmax' :'0' : '0',
                
                
                height: 6+"vmax",
                width: 4+"vmax",
                maxHeight : '11vmin',
                maxWidth : '8.0vmin',
                zIndex : '1',
                background : backgroundImage(),
                backgroundSize : props.card.faceup ? 'contain' :'',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundColor : 'white',
                opacity: props.card.faceup ? isdragging ? 0.3 : 1 : 1,
                color: props.card.suit === '♥' || props.card.suit === '♦'?'red':'black',
                border: '1px  solid grey',    
                        
            }}
            className = {'card '+"cards-"+ props.stack+' '+ props.card.color +' '+ (props.card.faceup ? 'faceup' : 'facedown')+ (props.card.faceup ? ' '+props.card.suit : '') +(props.card.faceup ? ' '+ props.card.value : '')} >
              
        </div>
    )
}
