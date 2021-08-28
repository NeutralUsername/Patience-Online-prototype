import React from 'react';
import ReactDOM from 'react-dom';
import ServerTime from './ServerTime';
import Game from './Game';

export default class Options extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            malusSize : 14,
            tableauSize : 3,
            throwOnWaste : true,
            throwOnMalus : true,
            variant : "Patience",
            turnsTimed : false,
            timePerTurn : 90,
            timePerPlayer : 1800,
            roomName : '',
            roomPassword : '',
            pendingRooms : [],
        };
        this.mounted = false;
        this.handleMalusSizeChange = this.handleMalusSizeChange.bind (this);
        this.handleTableauSizeChange = this.handleTableauSizeChange.bind (this);
        this.handleThrowOnWasteChange = this.handleThrowOnWasteChange.bind (this);
        this.handleThrowOnMalusChange = this.handleThrowOnMalusChange.bind (this);
        this.handleVariantChange = this.handleVariantChange.bind (this);
        this.handleTurnsTimedChange = this.handleTurnsTimedChange.bind (this);
        this.handleTimePerTurnChange = this.handleTimePerTurnChange.bind (this);
        this.handleTimePerPlayerChange = this.handleTimePerPlayerChange.bind (this);
        this.handleRoomNameChange = this.handleRoomNameChange.bind (this);
        this.handleRoomPasswordChange = this.handleRoomPasswordChange.bind (this);
        this.handleAIClick = this.handleAIClick.bind (this);
        this.handleCreateClick = this.handleCreateClick.bind (this);
        this.handleJoinClick = this.handleJoinClick.bind (this);
        this.handleInspectOptionsClick = this.handleInspectOptionsClick.bind (this);
    }

    componentDidMount () {
        this.mounted = true;
        this.props.socket.on("startAIgameRES", data => {
            return (
                ReactDOM.render (
                    <Game
                        id = {data.props.id}
                        color = {data.color}
                        throwOnWaste = {data.props.throwOnWaste}
                        throwOnMalus = {data.props.throwOnMalus}
                        variant = {data.props.variant}
                        initialState = {data.initialState}
                        socket = {this.props.socket}       
                    ></Game>,
                    document.getElementById ('root')
                )
            )
        });

        this.props.socket.on("UpdatePendingRoomsRES", data => {
            if(this.mounted){
                this.setState ({pendingRooms : data.pendingRooms });
            }
        });

        this.props.socket.on("startOnlineGameRES", data => {
            return (
                ReactDOM.render (
                    <Game
                        id = {data.props.id}
                        color = {data.color}
                        throwOnWaste = {data.props.throwOnWaste}
                        throwOnMalus = {data.props.throwOnMalus}
                        variant = {data.props.variant}
                        initialState = {data.initialState}
                        socket = {this.props.socket}          
                    ></Game>,
                    document.getElementById ('root')
                )
            )
        });

        this.props.socket.on("roomPasswordREQ", (data) => {
            this.props.socket.emit('roomPasswordRES', {
                password : prompt("Enter Room Password"),
                roomkey : data.roomkey,
            });
        });
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    handleAIClick () {
        this.props.socket.emit('startAIgameREQ', {
            options : this.state,
        });
    };

    handleCreateClick () {
        this.props.socket.emit('createOnlineRoomREQ', {
            options : this.state
        });
    };

    handleJoinClick (roomkey) {
        this.props.socket.emit('joinOnlineRoomREQ', {
            roomkey : roomkey
        });
      
    }

    handleInspectOptionsClick(roomkey) {
        var options = this.state.pendingRooms.find(e=> e.roomkey === roomkey).options
        this.setState({
            malusSize : options.malusSize ,
            tableauSize : options.tableauSize,
            throwOnWaste : options.throwOnWaste,
            throwOnMalus : options.throwOnMalus,
            variant : options.variant,
            turnsTimed : options.turnsTimed,
            timePerTurn : options.timePerTurn,
            timePerPlayer : options.timePerPlayer,
            roomName : (!options.roomName.replace(/\s/g, '').length) ? roomkey : options.roomName.replace(/\s+/g,' ').trim() 
        })
     }

    handleMalusSizeChange (malusSize) {
        this.setState ({malusSize : malusSize })
    }
    handleTableauSizeChange (tableauSize) {
        this.setState ({tableauSize : tableauSize })
    }
    handleThrowOnWasteChange (throwOnWaste) {
        this.setState ({throwOnWaste : throwOnWaste })
    }
    handleThrowOnMalusChange (throwOnMalus) {
        this.setState ({throwOnMalus : throwOnMalus })
    }
    handleVariantChange (variant) {
        this.setState ({variant : variant })
    }
    handleTurnsTimedChange (turnsTimed) {
        this.setState ({turnsTimed : turnsTimed })
    }
    handleTimePerTurnChange (timePerTurn) {
        this.setState ({timePerTurn : timePerTurn })
    }
    handleTimePerPlayerChange (timePerPlayer) {
        this.setState ({timePerPlayer : timePerPlayer })
    }
    handleRoomNameChange (roomName) {
        if(roomName.length <= 20)
            this.setState ({roomName : roomName })
    }
    handleRoomPasswordChange (roomPassword) {
        if(roomPassword.length <= 20)
            this.setState ({roomPassword : roomPassword })
    }

    render () {
        return (
            <div className = {"options"} >
                <ServerTime
                    socket = {this.props.socket}
                ></ServerTime>
                <MalusSize
                    malusSize = {this.state.malusSize}
                    onChange = {this.handleMalusSizeChange}
                ></MalusSize>
                <TableauSize
                    tableauSize = {this.state.tableauSize}
                    onChange = {this.handleTableauSizeChange}
                ></TableauSize>
                <ThrowOnWaste
                    throwOnWaste = {this.state.throwOnWaste}
                    onChange = {this.handleThrowOnWasteChange}
                ></ThrowOnWaste>
                <ThrowOnMalus
                    throwOnMalus = {this.state.throwOnMalus}
                    onChange = {this.handleThrowOnMalusChange}
                ></ThrowOnMalus>
                <Variant
                    variant = {this.state.variant}
                    onChange = {this.handleVariantChange}
                ></Variant>
                <TimedTurns
                    turnsTimed = {this.state.turnsTimed}
                    timePerTurn = {this.state.timePerTurn}
                    onBoolChange = {this.handleTurnsTimedChange}
                    onValueChange = {this.handleTimePerTurnChange}
                ></TimedTurns>
                <TimedPlayers
                    timePerPlayer = {this.state.timePerPlayer}
                    onValueChange = {this.handleTimePerPlayerChange}
                ></TimedPlayers>
                <Room 
                    onNameChange = {this.handleRoomNameChange}
                    onPasswordChange = {this.handleRoomPasswordChange}
                    roomName = {this.state.roomName}
                    roomPassword = {this.state.roomPassword}>
                </Room>
                <Online
                    handleNewClick = {this.handleCreateClick}         
                ></Online>
                <AI
                    handleClick = {this.handleAIClick}
                ></AI>
                <PendingRooms
                    pendingRooms = {this.state.pendingRooms}
                    handleJoinClick = {this.handleJoinClick}
                    handleOptionClick = {this.handleInspectOptionsClick}
                ></PendingRooms>
            </div>
        );
    }
}

function MalusSize (props) {
    function handleChange (event) {
        props.onChange (event.target.value);
    }
    return (
        <div className = "malussize">
            <label htmlFor = {"maluscountselect"} >
                Malus Size
            </label>
            <select
                value = { props.malusSize}
                onChange = {handleChange}
                id = {"maluscountselect"} >
                <option value = {5} >5</option>
                <option value = {6} >6</option>
                <option value = {7} >7</option>
                <option value = {8} >8</option>
                <option value = {9} >9</option>
                <option value = {10} >10</option>
                <option value = {11} >11</option>
                <option value = {12} >12</option>
                <option value = {13} >13</option>
                <option value = {14} >14</option>
                <option value = {15} >15</option>
                <option value = {16} >16</option>
                <option value = {17} >17</option>
                <option value = {18} >18</option>
                <option value = {19} >19</option>
                <option value = {20} >20</option>
            </select>
        </div>
    )
}
function TableauSize(props) {
    function handleChange (event) {
        this.props.onChange (event.target.value);
    }
    return (
        <div className = "tableausize" >
            <label htmlFor = {"tableausizeselect"} >
                Tableau Size
            </label>
            <select
                value = { props.tableauSize}
                onChange = {handleChange}
                id = {"tableauizeselect"} >
                <option value = {1} >1</option>
                <option value = {2} >2</option>
                <option value = {3} >3</option>
                <option value = {4} >4</option>
                <option value = {5} >5</option>
                <option value = {6} >6</option>
            </select>
        </div>
    )

}
function ThrowOnWaste (props) {
    function handleChange (event) {
        this.props.onChange (event.target.checked);
    }
    return (
        <div className = {"throwonWaste"} >
            <label htmlFor = "throwonWaste-cb" >
                Throw on Opponent Waste Pile
            </label>
            <input
                checked = { props.throwOnWaste}
                onChange = {handleChange}
                id = {"throwonWastecb"}
                type = {"checkbox"}
            ></input>
        </div>
    )
}
function ThrowOnMalus (props) {
    function handleChange (event) {
        props.onChange (event.target.checked);
    }
    return (
        <div className = {"throwonmalus"} >
            <label htmlFor = "throwmaluscb" >
                Throw on Opponent Malus
            </label>
            <input
                checked = { props.throwOnMalus}
                onChange = {handleChange}
                id = {"throwmaluscb"}
                type = {"checkbox"}
            ></input>
        </div>
        )
}
function Variant (props) {
    function handleChange (event) {
        this.props.onChange (event.target.value);
    }
    return (
        <div className = {"variant"} >
            <label>
                Patience Variant
            </label>
            <input
                name = 'variant'
                value = 'Patience'
                type = {"radio"}
                onChange = {handleChange}
                checked = {props.variant === "Patience"}
            ></input>
            <label>
                Klondike Variant
            </label>
            <input
                name = 'variant'
                value = 'Klondike'
                type = {"radio"}
                onChange = {handleChange}
                checked = {props.variant === "Klondike"}
            ></input>
        </div>
    )
}
function TimedTurns (props) {
    function handleBoolChange (event) {
        this.props.onBoolChange (event.target.checked);
    }
    function handleValueChange (event) {
        this.props.onValueChange (event.target.value);
    }
    return (
        <div className = {"turnstimed"} >
            <label htmlFor="turnstimed" >
                Limit time for each turn
            </label>
            <input
                checked = { props.turnsTimed}
                onChange = {handleBoolChange}
                id = {"turnstimed"}
                type = "checkbox" ></input>
            <label htmlFor = "timeperturn" >
                Duration
            </label>
            <select
                value = { props.timePerTurn}
                onChange = {handleValueChange}
                id = {"timeperturn"} >
                <option value = {15} >15s</option>
                <option value = {30} >30s</option>
                <option value = {45} >45s</option>
                <option value = {60} >60s</option>
                <option value = {90} >90s</option>
                <option value = {120} >120s</option>
                <option value = {150} >150s</option>
                <option value = {180} >180s</option>
                <option value = {240} >240s</option>
                <option value = {300} >300s</option>
            </select>
        </div>
    )
}
function TimedPlayers (props) {
    function handleValueChange (event) {
        props.onValueChange (event.target.value);
    }
    return (
        <div className = {"timedplayers"} >
            <label htmlFor = "timedplayers" >
                Limit time for each player
            </label>
            <select
                value = { props.timePerPlayer}
                onChange = {handleValueChange}
                id = {"timeperplayer"} >
                <option value = {300} >5min</option>
                <option value = {600} >10min</option>
                <option value = {900} >15min</option>
                <option value = {1200} >20min</option>
                <option value = {1500} >25min</option>
                <option value = {1800} >30min</option>
                <option value = {2100} >35min</option>
                <option value = {2400} >40min</option>
                <option value = {2700} >45min</option>
                <option value = {3600} >60min</option>
            </select>
        </div>
    )
}
function  Room (props) {
    function handleRoomNameChange (event) {
        props.onNameChange (event.target.value);
    }
    function handleRoomPasswordChange (event) {
        props.onPasswordChange (event.target.value);
    }
    return (
        <div>
            <label>
                Room Name
            </label>
            <input
                id = 'roomname'
                type = 'text'
                onChange = {handleRoomNameChange}
                value = { props.roomName}
            ></input>
            <label>
                Room Password
            </label>
            <input
                id = 'roompassword'
                type = 'password'
                onChange = {handleRoomPasswordChange}
                value = { props.roomPassword}
            ></input>
        </div>
    )
}
function AI (props) {
    return (
        <div className = {"ai"} >
            <label>
                vs. AI
            </label>
            <button
                onClick = {props.handleClick} >
                Start
            </button>
        </div>
    )
}
function Online (props) {
    return (
        <div className = {"online"} >
            <label>
                vs. Player
            </label>
            <button className = {"create"}
                onClick = {props.handleNewClick} >
                Create
            </button>
        </div>
    )
}
function PendingRooms(props) {
 
    function handleJoinClick (event) {
        props.handleJoinClick (event.target.value);
    }
    function handleOptionClick (event) {
        props.handleOptionClick (event.target.value);
    }
        return (
            <div className ="pendingrooms">
                <label> 
                     <div><b>Pending Rooms : </b><article className="pendingrooms-info">(click <i>Room Name</i> to inspect options)</article></div> 
                </label>
                <ul className="pendingrooms-list" > 
                    {props.pendingRooms.map( (room) =>
                        <li className="pendingrooms-listitem" key = {room.roomkey} > 
                            <button 
                                className="pendingrooms-join" 
                                value = {room.roomkey}
                                onClick = {handleJoinClick} >
                                Join
                            </button>
                            <button 
                                className="pendingrooms-roomname" 
                                value = {room.roomkey}
                                onClick = {handleOptionClick} >
                                {(!room.options.roomName.replace(/\s/g, '').length) ? room.roomkey : room.options.roomName.replace(/\s+/g,' ').trim()}   
                            </button>
                            <label className="pendingrooms-lock" hidden = {! room.options.roomPassword > 0}>🔒</label>
                        </li>
                    )}
                </ul>
            </div>
        )
}