import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import socketIOClient from 'socket.io-client';
var socket
export default class Options extends React.Component {
    constructor (props) {
        
        socket = socketIOClient ("http://127.0.0.1:3000", { transports : ['websocket'] });
        console.log(socket)
        super (props);
        this.state = {
            malusSize : 20,
            tableauSize : 3,
            throwOnWaste : true,
            throwOnMalus : true,
            variant : "Patience",
            timePerPlayer : 900,
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
        socket.on("UpdatePendingRoomsRES", data => {
            if(this.mounted){
                this.setState ({pendingRooms : data.pendingRooms });
            }
        });

        socket.on("startGameRES", data => {
            if(this.mounted)
                return (
                    ReactDOM.render (
                        <Game
                            id = {data.id}
                            playercolor = {data.color}
                            opponentcolor = {data.color === 'red' ? 'black' : 'red'}
                            initialState = {data.initialState}
                            socket = {socket}          
                        ></Game>,
                        document.getElementById ('root')
                    )
                )
        });

        socket.on("roomPasswordREQ", (data) => {
            socket.emit('roomPasswordRES', {
                password : prompt("Enter Room Password"),
                roomkey : data.roomkey,
            });
        });
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    handleAIClick () {
        socket.emit('startAIgameREQ', {
            options : this.state,
        });
    };

    handleCreateClick () {
        socket.emit('createOnlineRoomREQ', {
            options : this.state
        });
    };

    handleJoinClick (roomkey) {
        socket.emit('joinOnlineRoomREQ', {
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
    handleTimePerPlayerChange (timePerPlayer) {
        this.setState ({timePerPlayer : parseInt(timePerPlayer)})
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
                <label><i><b>{this.props.status ? this.props.status : ""}</b></i></label>
                <MalusSize
                    malusSize = {this.state.malusSize}
                    onChange = {this.handleMalusSizeChange}
                ></MalusSize>
                <TableauSize
                    tableauSize = {this.state.tableauSize}
                    onChange = {this.handleTableauSizeChange}
                ></TableauSize>
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
        props.onChange (event.target.value);
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