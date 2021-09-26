import React from 'react';
import ReactDOM from 'react-dom';
import { useDrag, DndProvider, useDrop  } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Options from './Options';
var GameContext = {}
// injectGlobalHook.js:1648 Fetch API cannot load webpack:///./src/Game.js?. URL scheme "webpack" is not supported. error is caused by react-dnd. no noticeable effects besides the error in the console when i select drag/dropable components in  the react components viewer 
 export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        GameContext.id = props.id
        GameContext.socket = props.socket
        GameContext.playercolor = props.playercolor
        GameContext.opponentcolor = props.opponentcolor
        GameContext.isturn = props.initialState.turncolor === props.playercolor
        GameContext.stockflipped = props.initialState.stockflipped
        GameContext.turntableaumove = props.initialState.turntableaumove
        GameContext.lastmovefrom = {}
        GameContext.lastmoveto = {}
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
            playertimer: props.initialState[props.playercolor+"timer"],
            opponenttimer: props.initialState[props.opponentcolor+"timer"],
            abortrequest : props.initialState.abortrequest
        };
    }
    componentDidMount() {
        this.setState({mounted : true})
        this.props.socket.on("actionMoveRES", data => {
            if (this.state.mounted) {
                if(data.stacks[0].name.includes('stock') &&  data.stacks[1].name.includes('waste')) {
                    console.log("tes")
                    GameContext.turntableaumove = false
                }
                GameContext.stockflipped = data.stockflipped
                GameContext.lastmovefrom = ""
                GameContext.lastmoveto = ""
                GameContext.isturn = data.turncolor === GameContext.playercolor ? true : false
                if( ! data.stacks[0].name.includes('stock') && ! data.stacks[1].name.includes('waste') ) {
                    GameContext.lastmovefrom = data.stacks[0].name
                    GameContext.lastmoveto = data.stacks[1].name
                }
                if( data.stacks[0].name.includes("foundation") ) 
                    GameContext.turntableaumove = true
                if( this.state.abortrequest)
                    this.setState ({abortrequest : false})
                this.setState({[data.stacks[0].name] : data.stacks[0].cards})
                if( data.stacks[0].name != data.stacks[1].name) 
                    this.setState({[data.stacks[1].name] : data.stacks[1].cards})
            }
        })
        this.props.socket.on("updateTimerRES", data => {
            if( this.state.mounted) {
                this.setState({ playertimer: data[GameContext.playercolor+'timer'] })
                this.setState({ opponenttimer: data[GameContext.opponentcolor+'timer'] })
            }
        })
        this.props.socket.on("updateAbortRES", () => {
            if( this.state.mounted) 
                if( !this.state.abortrequest)
                     this.setState({abortrequest : true})   
        })
        this.props.socket.on("gameAbortedRES", () => {
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
        })
        this.props.socket.on("gameEndedRES", data => {
            if (this.state.mounted) {
                alert("the winner is " + data.result)
                return (
                    ReactDOM.render (
                        <Options
                            status = {"the winner is: " + data.result}      
                        ></Options>,
                        document.getElementById ('root')
                    )
                )
            }
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
                    }}>
                    <div style = {{
                        position: 'fixed',
                        textAlign:'center',
                        top : '87vmin',
                        left : '28.85vmax',
                        display : 'block',   
                    }}>
                        <div  style = {{
                            fontSize : '1.5vmax',
                            minWidth : '4vmax',
                            border : '1px solid black',
                            borderRadius : '3px',
                            backgroundColor : 'white',
                            letterSpacing : '1px'
                            }}> {parseInt(this.state.playertimer/60) < 10 ? "0"+parseInt(this.state.playertimer/60) : parseInt(this.state.playertimer/60) }:{this.state.playertimer % 60 <10 && this.state.playertimer % 60 >= 0  ? "0"+(this.state.playertimer-parseInt(this.state.playertimer/60)*60) : (this.state.playertimer-parseInt(this.state.playertimer/60)*60)} 
                        </div>
                        <div  style = {{
                            marginTop : '.15vmax',
                            paddingTop :'.3vmax',
                            paddingBottom : '.35vmax',
                            paddingLeft : '.3vmax',
                            paddingRight : '.3vmax',
                            backgroundColor : this.state.abortrequest ? '#ff7a7a' :"", 
                            }}>
                            <button  className = {"wrapButton"}
                                onClick = {() => GameContext.socket.emit('abortREQ', {gameid : GameContext.id})}>
                                end early
                            </button>
                        </div>
                        <div >
                            <button className = {"surrenderButton"}
                                onClick = {() => GameContext.socket.emit('surrenderREQ', {gameid : GameContext.id})}>
                                surrender
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
                            fontSize : '1.5vmax',
                            minWidth : '4vmax',
                            border : '1px solid black',
                            borderRadius : '3px',
                            backgroundColor : 'white',
                            letterSpacing : '1px'
                            }}>{parseInt(this.state.opponenttimer/60) < 10 ? "0"+parseInt(this.state.opponenttimer/60) : parseInt(this.state.opponenttimer/60) }:{this.state.opponenttimer % 60 <10 && this.state.opponenttimer % 60 >= 0  ? "0"+(this.state.opponenttimer-parseInt(this.state.opponenttimer/60)*60) : (this.state.opponenttimer-parseInt(this.state.opponenttimer/60)*60)}           
                        </div>
                    </div>
                    <Stack cards = {this.state[this.props.playercolor+"malus"]} stackname = {this.props.playercolor+"malus"} stacktype = "sequence" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"stock"]} stackname = {this.props.playercolor+"stock"} stacktype = "pile"     player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"waste"]} stackname = {this.props.playercolor+"waste"} stacktype = "pile"     player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"tableau0"]} stackname = {this.props.playercolor+"tableau0"} stacktype = "sequence" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"foundation0"]} stackname = {this.props.playercolor+"foundation0"} stacktype = "pile" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"tableau0"]} stackname = {this.props.opponentcolor+"tableau0"} stacktype = "sequence" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"foundation0"]} stackname = {this.props.opponentcolor+"foundation0"} stacktype = "pile" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"tableau1"]} stackname = {this.props.playercolor+"tableau1"} stacktype = "sequence" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"foundation1"]} stackname = {this.props.playercolor+"foundation1"} stacktype = "pile" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"tableau1"]} stackname = {this.props.opponentcolor+"tableau1"} stacktype = "sequence" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"foundation1"]} stackname = {this.props.opponentcolor+"foundation1"} stacktype = "pile" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"tableau2"]} stackname = {this.props.playercolor+"tableau2"} stacktype = "sequence" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"foundation2"]} stackname = {this.props.playercolor+"foundation2"} stacktype = "pile" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"tableau2"]} stackname = {this.props.opponentcolor+"tableau2"} stacktype = "sequence" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"foundation2"]} stackname = {this.props.opponentcolor+"foundation2"} stacktype = "pile" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"tableau3"]} stackname = {this.props.playercolor+"tableau3"} stacktype = "sequence" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.playercolor+"foundation3"]} stackname = {this.props.playercolor+"foundation3"} stacktype = "pile" player = {true} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"tableau3"]} stackname = {this.props.opponentcolor+"tableau3"} stacktype = "sequence" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"foundation3"]} stackname = {this.props.opponentcolor+"foundation3"} stacktype = "pile" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"waste"]} stackname = {this.props.opponentcolor+"waste"} stacktype = "pile" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"stock"]} stackname = {this.props.opponentcolor+"stock"} stacktype = "pile" player = {false} ></Stack>
                    <Stack cards = {this.state[this.props.opponentcolor+"malus"]} stackname = {this.props.opponentcolor+"malus"} stacktype = "sequence" player = {false} ></Stack>
                </div>
            </DndProvider>
        )
    }
} 
function Stack (props) {
    const [{ isOver,hover }, drop] = useDrop(() => ({
        accept: "card",
        drop: monitor => {
            handleDrop(monitor.stackname, props.stackname);
        },
        collect: (monitor) => ({
            isOver:  !!monitor.isOver(),
            hover : monitor.getItem()
        }),
    }))
    function handleDrop(stackfrom, stackto) {
        if (stackfrom != stackto)
            GameContext.socket.emit('actionMoveREQ', {gameid : GameContext.id , stackfrom : stackfrom, stackto : stackto})
    }
    function topValues (){
        if (!props.player) {
            if (props.stackname.includes('malus')) return '-1vmin'
            if (props.stackname.includes('stock')) return '-1vmin'
            if (props.stackname.includes('waste')) return '-1vmin'
            if (props.stackname.includes('tableau0') || props.stackname.includes('foundation0')) return '64vmin'
            if (props.stackname.includes('tableau1') || props.stackname.includes('foundation1')) return '48vmin'
            if (props.stackname.includes('tableau2') || props.stackname.includes('foundation2')) return '32vmin'
            if (props.stackname.includes('tableau3') || props.stackname.includes('foundation3')) return '16vmin'
        }
        if (props.player) {
            if (props.stackname.includes('malus')) return '81vmin'
            if (props.stackname.includes('stock'))  return '81vmin'
            if (props.stackname.includes('waste'))  return '81vmin'
            if (props.stackname.includes('tableau0') || props.stackname.includes('foundation0')) return '16vmin'
            if (props.stackname.includes('tableau1') || props.stackname.includes('foundation1')) return '32vmin'
            if (props.stackname.includes('tableau2') || props.stackname.includes('foundation2')) return '48vmin'
            if (props.stackname.includes('tableau3') || props.stackname.includes('foundation3')) return '64vmin'
        }
    }
    function leftValue() {
        if (props.stackname.includes('stock')) return '20.5vmax'
        if (props.stackname.includes('malus')) return '34.5vmax'
        if (props.stackname.includes('waste')) return '12.5vmax'   
        if (!props.player) {
            if (props.stackname.includes('tableau0')) return '59.5vmax'
            if (props.stackname.includes('tableau1')) return '59.5vmax'
            if (props.stackname.includes('tableau2')) return '59.5vmax'
            if (props.stackname.includes('tableau3')) return '59.5vmax'
        }
        if (props.player) {
            if (props.stackname.includes('foundation0')) return '42.3vmax'
            if (props.stackname.includes('foundation1')) return '42.3vmax'
            if (props.stackname.includes('foundation2')) return '42.3vmax'
            if (props.stackname.includes('foundation3')) return '42.3vmax'
        }
        if (!props.player) {
            if (props.stackname.includes('foundation0')) return '51vmax'
            if (props.stackname.includes('foundation1')) return '51vmax'
            if (props.stackname.includes('foundation2')) return '51vmax'
            if (props.stackname.includes('foundation3')) return '51vmax'
        }
    }
    function rightValue () {
        if (props.player) {
            if (props.stackname.includes('tableau0')) return '-40vmax'
            if (props.stackname.includes('tableau1')) return '-40vmax'
            if (props.stackname.includes('tableau2')) return '-40vmax'
            if (props.stackname.includes('tableau3')) return '-40vmax'
        }
    }
    function backgroundcolor() {
        if ( GameContext.lastmovefrom)  
            if (GameContext.lastmovefrom != GameContext.lastmoveto) {
                if (!GameContext.isturn)
                    if (props.stackname === GameContext.lastmovefrom) 
                        return '#b58965'
                if (!GameContext.isturn)
                    if (props.stackname ===GameContext.lastmoveto)
                        return  '#b58965'
            }
        if (GameContext.stockflipped) 
                if (props.stackname === (GameContext.isturn ? GameContext.playercolor + ("stock") : GameContext.opponentcolor+"stock"))
                    return '#ff6770 '       
        if (((props.stackname === GameContext.playercolor+"stock" ||props.stackname === GameContext.playercolor+"waste"||props.stackname === GameContext.playercolor+"malus") && GameContext.isturn )) 
            if (isOver && legalMove(hover, {stackname : props.stackname, suit : props.cards.length ? props.cards[props.cards.length-1].suit : undefined, value : props.cards.length ? props.cards[props.cards.length-1].value : undefined } ))
                return "#A6B176"
            else return '#90EE90'
        else if ((props.stackname === GameContext.opponentcolor+"stock" ||props.stackname ===  GameContext.opponentcolor+"waste"||props.stackname ===  GameContext.opponentcolor+"malus"  )&& !GameContext.isturn ) 
            return '#90EE90'
        if (isOver && legalMove(hover, {stackname : props.stackname, suit : props.cards.length ? props.cards[props.cards.length-1].suit : undefined, value : props.cards.length ? props.cards[props.cards.length-1].value : undefined } ) )
            return '#b58965'
        return '#f1debe'
    }
    function legalMove(movingCard, UppermostCard) {
        if ( ! (movingCard.stackname.includes("tableau") || movingCard.stackname.includes("foundation") || movingCard.stackname === GameContext.playercolor+"stock" || movingCard.stackname === GameContext.playercolor+"malus") ) return false
        if (GameContext.stockflipped && movingCard.stackname != GameContext.playercolor+"stock" && UppermostCard.stackname != GameContext.playercolor+"waste") return false
        if (UppermostCard.stackname === GameContext.playercolor + 'stock' ) return  false
        if (UppermostCard.stackname === GameContext.playercolor + 'malus' ) return  false
        if (UppermostCard.stackname === GameContext.playercolor + 'waste' )
            if (movingCard.stackname != GameContext.playercolor+'stock') return  false
        if (UppermostCard.stackname === GameContext.opponentcolor + 'stock' ) return  false
        if (UppermostCard.value){
            if (UppermostCard.stackname === GameContext.opponentcolor + 'malus' || UppermostCard.stackname === GameContext.opponentcolor + 'waste' )  
                if (UppermostCard.suit === movingCard.suit ) {
                    if (parseInt(UppermostCard.value) != parseInt(movingCard.value) + 1 )
                        if (parseInt(UppermostCard.value) != parseInt(movingCard.value) - 1 ) return false
                }
                else return false
            if (UppermostCard.stackname === GameContext.opponentcolor + "malus")
                if (props.cards.length > 28) return false
            if (UppermostCard.stackname.includes('foundation') ) 
                if (UppermostCard.suit != movingCard.suit ) return false
                else if (UppermostCard.value != movingCard.value-1 ) return false
            if(UppermostCard.stackname.includes('tableau')) {
                if ((UppermostCard.value -1 ) != movingCard.value ) return false
                if (movingCard.suit === '♥' || movingCard.suit === '♦') 
                    if (UppermostCard.suit  === '♥' || UppermostCard.suit  === '♦'  ) return false
                if (movingCard.suit === '♠' || movingCard.suit === '♣')
                    if (UppermostCard.suit  === '♠' || UppermostCard.suit  === '♣' ) return false
            }
        }
        else {
            if (UppermostCard.stackname.includes('foundation') )
                if (movingCard.value != 1) return false
            if (UppermostCard.stackname === GameContext.opponentcolor+'waste') return false
        }
        return true
    }
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
                overflow : 'hidden',
                paddingLeft : '.5vmax',
                paddingRight : '.5vmax',
                height : '7.6vmax',
                maxHeight : '15vmin',
            }}> 
            {props.cards.length ? props.cards.map( (card,index) => 
                <Card 
                    key = {index+props.stackname+" "+(index === (props.cards.length-1))+" "+GameContext.isturn+" "+!GameContext.stockflipped + GameContext.turntableaumove}
                    card = {card}
                    stackname = {props.stackname}
                    playerStack = {props.player}
                    uppermost = {index === (props.cards.length-1)}
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
    if(props.card.faceup && props.uppermost && GameContext.isturn){
        const [{ isDragging }, drag] = useDrag(() => ({
            type: "card",
            item : {
                stackname : props.stackname,
                suit : props.card.suit,
                value :props.card.value
            } ,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            })
        }))
        var dragRef  = drag;
        var isdragging = isDragging
    }
 
    function cursor () {
        if( (GameContext.stockflipped && ! props.stackname.includes('stock') ) 
        || !props.uppermost 
        || props.stackname.includes('foundation') && GameContext.turntableaumove 
        || props.stackname.includes(GameContext.opponentcolor+"waste") 
        || props.stackname.includes(GameContext.opponentcolor+"malus")
        || props.stackname.includes(GameContext.opponentcolor+"stock") 
        ||  props.stackname.includes(GameContext.playercolor+"waste")  
        || ! GameContext.isturn
        )  
            return "cursor"
        else if(props.stackname.includes(GameContext.playercolor+"stock") && !props.card.faceup) return "grabbing"
        else return "grab"
    }

    function backgroundImage() {
        if(!props.card.faceup)
            if(props.card.color ==='red') return 'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-red-sticker-1600042082.903987.png")'
            else return 'url("https://dejpknyizje2n.cloudfront.net/marketplace/products/playing-cards-back-design-in-blue-sticker-1600041775.9919636.png")'
        else {
            if(props.card.suit === "♠") {
                if(props.card.value === "1") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Cards-A-Spade.svg/500px-Cards-A-Spade.svg.png")'
                if(props.card.value === "2") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Cards-2-Spade.svg/500px-Cards-2-Spade.svg.png")'
                if(props.card.value === "3") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Cards-3-Spade.svg/500px-Cards-3-Spade.svg.png")'
                if(props.card.value === "4") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cards-4-Spade.svg/500px-Cards-4-Spade.svg.png")'
                if(props.card.value === "5") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Cards-5-Spade.svg/500px-Cards-5-Spade.svg.png")'
                if(props.card.value === "6") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Cards-6-Spade.svg/500px-Cards-6-Spade.svg.png")'
                if(props.card.value === "7") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Cards-7-Spade.svg/500px-Cards-7-Spade.svg.png")'
                if(props.card.value === "8") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cards-8-Spade.svg/500px-Cards-8-Spade.svg.png")'
                if(props.card.value === "9") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cards-9-Spade.svg/500px-Cards-9-Spade.svg.png")'
                if(props.card.value === "10") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Cards-10-Spade.svg/500px-Cards-10-Spade.svg.png")'
                if(props.card.value === "11") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Cards-J-Spade.svg/500px-Cards-J-Spade.svg.png")'
                if(props.card.value === "12") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Cards-Q-Spade.svg/500px-Cards-Q-Spade.svg.png")'
                if(props.card.value === "13") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Cards-K-Spade.svg/500px-Cards-K-Spade.svg.png")'  
            }
            if(props.card.suit === "♥") {
                if(props.card.value === "1") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cards-A-Heart.svg/500px-Cards-A-Heart.svg.png")'
                if(props.card.value === "2") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Cards-2-Heart.svg/500px-Cards-2-Heart.svg.png")'
                if(props.card.value === "3") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Cards-3-Heart.svg/500px-Cards-3-Heart.svg.png")'
                if(props.card.value === "4") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Cards-4-Heart.svg/500px-Cards-4-Heart.svg.png")'
                if(props.card.value === "5") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Cards-5-Heart.svg/500px-Cards-5-Heart.svg.png")'
                if(props.card.value === "6") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cards-6-Heart.svg/500px-Cards-6-Heart.svg.png")'
                if(props.card.value === "7") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Cards-7-Heart.svg/500px-Cards-7-Heart.svg.png")'
                if(props.card.value === "8") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cards-8-Heart.svg/500px-Cards-8-Heart.svg.png")'
                if(props.card.value === "9") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Cards-9-Heart.svg/500px-Cards-9-Heart.svg.png")'
                if(props.card.value === "10") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Cards-10-Heart.svg/500px-Cards-10-Heart.svg.png")'
                if(props.card.value === "11") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Cards-J-Heart.svg/500px-Cards-J-Heart.svg.png")'
                if(props.card.value === "12") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Cards-Q-Heart.svg/500px-Cards-Q-Heart.svg.png")'
                if(props.card.value === "13") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cards-K-Heart.svg/500px-Cards-K-Heart.svg.png")'  
            }
            if(props.card.suit === "♦") {
                if(props.card.value === "1") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Cards-A-Diamond.svg/500px-Cards-A-Diamond.svg.png")'
                if(props.card.value === "2") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Cards-2-Diamond.svg/500px-Cards-2-Diamond.svg.png")'
                if(props.card.value === "3") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cards-3-Diamond.svg/500px-Cards-3-Diamond.svg.png")'
                if(props.card.value === "4") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cards-4-Diamond.svg/500px-Cards-4-Diamond.svg.png")'
                if(props.card.value === "5") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cards-5-Diamond.svg/500px-Cards-5-Diamond.svg.png")'
                if(props.card.value === "6") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cards-6-Diamond.svg/500px-Cards-6-Diamond.svg.png")'
                if(props.card.value === "7") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Cards-7-Diamond.svg/500px-Cards-7-Diamond.svg.png")'
                if(props.card.value === "8") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cards-8-Diamond.svg/500px-Cards-8-Diamond.svg.png")'
                if(props.card.value === "9") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Cards-9-Diamond.svg/500px-Cards-9-Diamond.svg.png")'
                if(props.card.value === "10") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cards-10-Diamond.svg/500px-Cards-10-Diamond.svg.png")'
                if(props.card.value === "11") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Cards-J-Diamond.svg/500px-Cards-J-Diamond.svg.png")'
                if(props.card.value === "12") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cards-Q-Diamond.svg/500px-Cards-Q-Diamond.svg.png")'
                if(props.card.value === "13") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cards-K-Diamond.svg/500px-Cards-K-Diamond.svg.png")'  
            }
            if(props.card.suit === "♣") { if(props.card.value === "1") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cards-A-Club.svg/500px-Cards-A-Club.svg.png")'
                if(props.card.value === "2") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Cards-2-Club.svg/500px-Cards-2-Club.svg.png")'
                if(props.card.value === "3") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cards-3-Club.svg/500px-Cards-3-Club.svg.png")'
                if(props.card.value === "4") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Cards-4-Club.svg/500px-Cards-4-Club.svg.png")'
                if(props.card.value === "5") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cards-5-Club.svg/500px-Cards-5-Club.svg.png")'
                if(props.card.value === "6") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cards-6-Club.svg/500px-Cards-6-Club.svg.png")'
                if(props.card.value === "7") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cards-7-Club.svg/500px-Cards-7-Club.svg.png")'
                if(props.card.value === "8") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Cards-8-Club.svg/500px-Cards-8-Club.svg.png")'
                if(props.card.value === "9") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Cards-9-Club.svg/500px-Cards-9-Club.svg.png")'
                if(props.card.value === "10") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Cards-10-Club.svg/500px-Cards-10-Club.svg.png")'
                if(props.card.value === "11") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Cards-J-Club.svg/500px-Cards-J-Club.svg.png")'
                if(props.card.value === "12") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Cards-Q-Club.svg/500px-Cards-Q-Club.svg.png")'
                if(props.card.value === "13") return 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cards-K-Club.svg/500px-Cards-K-Club.svg.png")'  
            }
        }
    }
    return (
        <div 
            onDragStart ={e=> {
                if( GameContext.stockflipped && ! props.stackname.includes('stock') 
                || !props.uppermost  || props.stackname.includes(GameContext.opponentcolor+"waste") 
                || props.stackname.includes('foundation') && GameContext.turntableaumove 
                || props.stackname.includes(GameContext.opponentcolor+"malus")
                || props.stackname.includes(GameContext.opponentcolor+"stock") 
                || props.stackname.includes(GameContext.playercolor+"waste") 
                || ! GameContext.isturn  
                || (props.stackname === GameContext.playercolor+"stock" && !props.card.faceup)
                )
                    e.preventDefault()
            }}
            ref = { dragRef } 
            onClick = {()=> props.stackname === GameContext.playercolor+'stock' && !props.card.faceup && GameContext.isturn ?  GameContext.socket.emit('actionFlipREQ', {gameid : GameContext.id , stack: props.stackname}): ''}
            style={{
                cursor: cursor ()  ,
                borderRadius: '7px',
                padding : '.4vmax',
                marginRight : !props.stackname.includes('tableau') ? !props.uppermost ?'max(-2.9vmax, -5.5vmin)':'0' : props.stackname.includes('tableau') && ! props.playerStack && ! props.uppermost? 'max(-2.9vmax, -5.5vmin)':'0',
                marginLeft : props.stackname.includes('tableau')  && props.playerStack ? !props.uppermost ? 'max(-2.9vmax, -5.5vmin)' :'0' : '0', 
                height: 6+"vmax",
                width: 4+"vmax",
                maxHeight : '11vmin',
                maxWidth : '8.0vmin',
                zIndex : '1',
                background : "center / contain no-repeat "+backgroundImage()+" white",
                opacity:  isdragging ? 0.5 : 1,
                color: props.card.suit === '♥' || props.card.suit === '♦'?'red':'black',
                border: '1px  solid grey',                         
            }}
        >        
        </div>
    )
}
