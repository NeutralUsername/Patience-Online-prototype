import React from 'react';
import ReactDOM from 'react-dom';
import ServerTime from './ServerTime';
import Game from './Game';

export default class Options extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            malusSize : 14,
            sequenceSize : 3,
            throwOnStock : true,
            throwOnMalus : true,
            variant : "Patience",
            turnsTimed : false,
            timePerTurn : 60,
            roundsTimed : false,
            timePerRound : 1800,
            roomName : '',
            pendingRooms : [],
        };
        this.mounted = false;
        this.handleMalusSizeChange = this.handleMalusSizeChange.bind (this);
        this.handleSequenceSizeChange = this.handleSequenceSizeChange.bind (this);
        this.handleThrowOnStockChange = this.handleThrowOnStockChange.bind (this);
        this.handleThrowOnMalusChange = this.handleThrowOnMalusChange.bind (this);
        this.handleVariantChange = this.handleVariantChange.bind (this);
        this.handleTurnsTimedChange = this.handleTurnsTimedChange.bind (this);
        this.handleTimePerTurnChange = this.handleTimePerTurnChange.bind (this);
        this.handleRoundsTimedChange = this.handleRoundsTimedChange.bind (this);
        this.handleTimePerRoundChange = this.handleTimePerRoundChange.bind (this);
        this.handleTimePerRoundChange = this.handleTimePerRoundChange.bind (this);
        this.handleRoomNameChange = this.handleRoomNameChange.bind (this);
        this.handleAIClick = this.handleAIClick.bind (this);
        this.handleCreateClick = this.handleCreateClick.bind (this);
        this.handleJoinClick = this.handleJoinClick.bind (this);
        this.handleOptionClick = this.handleOptionClick.bind (this);

        this.props.socket.on("UpdatePendingRoomsRES", data => {
            if(this.mounted){
                this.setState ({pendingRooms : data.pendingRooms });
            }
        });

        this.props.socket.on("joinOnlineGameRES", data => {
            return (
                ReactDOM.render (
                    <Game
                        color = {data.color}
                        gameid = {data.gameid}
                        socket = {this.props.socket}              
                    ></Game>,
                    document.getElementById ('root')
                )
            )
        });

        this.props.socket.on("AIgameRES", data => {
            return (
                ReactDOM.render (
                    <Game
                        gameid = {data.gameid}
                        socket = {this.props.socket}
                    ></Game>,
                    document.getElementById ('root')
                )
            )
        });
    }

    componentDidMount () {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
    }
   
    handleMalusSizeChange (malusSize) {
        this.setState ({malusSize : malusSize })
    }
    handleSequenceSizeChange (sequenceSize) {
        this.setState ({sequenceSize : sequenceSize })
    }
    handleThrowOnStockChange (throwOnStock) {
        this.setState ({throwOnStock : throwOnStock })
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
    handleRoundsTimedChange (roundsTimed) {
        this.setState ({roundsTimed : roundsTimed })
    }
    handleTimePerRoundChange (timePerRound) {
        this.setState ({timePerRound : timePerRound })
    }
    handleRoomNameChange (roomName) {
        this.setState ({roomName : roomName })
    }

    handleCreateClick () {
        this.props.socket.emit('newOnlineRoomREQ', {
            options : this.state
        });
    };

    handleJoinClick (event) {
        this.props.socket.emit('joinOnlineRoomREQ', {
            roomkey : event.target.value
        });
    }

    handleAIClick () {
        this.props.socket.emit('AIgameREQ', {
            options : this.state,
        });
    }

    handleOptionClick(event) {
        var options = this.state.pendingRooms.find(e=> e.socketid === event.target.value).options
        this.setState({
            malusSize : options.malusSize ,
            sequenceSize : options.sequenceSize,
            throwOnStock : options.throwOnStock,
            throwOnMalus : options.throwOnMalus,
            variant : options.variant,
            turnsTimed : options.turnsTimed,
            timePerTurn : options.timePerTurn,
            roundsTimed : options.roundsTimed,
            timePerRound : options.timePerRound,
        })
     }
     
    render () {
        return (
            <div
                className = {"options"} >
                <ServerTime
                    socket = {this.props.socket}
                ></ServerTime>
                <MalusSize
                    malusSize = {this.state.malusSize}
                    onChange = {this.handleMalusSizeChange}
                ></MalusSize>
                <SequenceSize
                    sequenceSize = {this.state.sequenceSize}
                    onChange = {this.handleSequenceSizeChange}
                ></SequenceSize>
                <ThrowOnStock
                    throwOnStock = {this.state.throwOnStock}
                    onChange = {this.handleThrowOnStockChange}
                ></ThrowOnStock>
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
                <TimedRounds
                    roundsTimed = {this.state.roundsTimed}
                    onBoolChange = {this.handleRoundsTimedChange}
                    timePerRound = {this.state.timePerRound}
                    onValueChange = {this.handleTimePerRoundChange}
                ></TimedRounds>
                <AI
                    handleClick = {this.handleAIClick}
                ></AI>
                <Online
                    handleNewClick = {this.handleCreateClick}
                    roomName = {this.state.roomName}
                    onChange = {this.handleRoomNameChange}
                ></Online>
                <PendingRooms
                    pendingRooms = {this.state.pendingRooms}
                    handleJoinClick = {this.handleJoinClick}
                    handleOptionClick = {this.handleOptionClick}
                ></PendingRooms>
            </div>
        );
    }
}


class PendingRooms extends React.Component {
    constructor ( props ) {
        super (props);
    }
    render () {
        return (
            <div className ="pendingrooms">
                <label>{this.props.pendingRooms.length > 0 ? "Pending Rooms :" : ""}</label>
                <ul> {this.props.pendingRooms.map( (room) =>
                    <li
                        key = {room.socketid} >
                        <button 
                            value = {room.socketid}
                            onClick = {this.props.handleJoinClick} >
                            Join
                        </button>
                        <button 
                            className="pendingrooms-roomname" 
                            value = {room.socketid}
                            onClick = {this.props.handleOptionClick} >
                            {(!room.options.roomName.replace(/\s/g, '').length) ? room.socketid : room.options.roomName  }
                        </button>
                    </li>)}
                </ul>
            </div>
        )
    }
}

class MalusSize extends React.Component {
    constructor (props) {
        super (props);
        this.handleChange = this.handleChange.bind (this);
    }
    handleChange (event) {
        this.props.onChange (event.target.value);
    }
    render () {
        return (
            <div
                className = "malussize">
                <label
                    htmlFor = {"maluscountselect"} >
                    Malus Size
                </label>
                <select
                    value = { this.props.malusSize}
                    onChange = {this.handleChange}
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
}
class SequenceSize extends React.Component {
    constructor (props) {
        super (props);
        this.handleChange = this.handleChange.bind (this);
    }
    handleChange (event) {
        this.props.onChange (event.target.value);
    }
    render () {
        return (
            <div
                className = "sequencesize" >
                <label
                    htmlFor = {"sequencesizeselect"} >
                    Sequence Size
                </label>
                <select
                    value = { this.props.sequenceSize}
                    onChange = {this.handleChange}
                    id = {"sequencesizeselect"} >
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
}
class ThrowOnStock extends React.Component {
    constructor (props) {
        super (props);
        this.handleChange = this.handleChange.bind (this);
    }
    handleChange (event) {
        this.props.onChange (event.target.checked);
    }
    render () {
        return (
            <div
                className = {"throwonstock"} >
                <label
                    htmlFor = "throwstockcb" >
                    Throw on Opponent Stock
                </label>
                <input
                    checked = { this.props.throwOnStock}
                    onChange = {this.handleChange}
                    id = {"throwstockcb"}
                    type = {"checkbox"}
                ></input>
            </div>
        )
    }
}
class ThrowOnMalus extends React.Component {
    constructor (props) {
        super (props);
        this.handleChange = this.handleChange.bind (this);
    }
    handleChange (event) {
        this.props.onChange (event.target.checked);
    }
    render () {
        return (
            <div
                className = {"throwonmalus"} >
                <label
                    htmlFor = "throwmaluscb" >
                    Throw on Opponent Malus
                </label>
                <input
                    checked = { this.props.throwOnMalus}
                    onChange = {this.handleChange}
                    id = {"throwmaluscb"}
                    type = {"checkbox"}
                ></input>
            </div>
        )
    }
}
class Variant extends React.Component {
    constructor (props) {
        super (props);
        this.handleChange = this.handleChange.bind (this);
    }
    handleChange (event) {
        this.props.onChange (event.target.value);
    }
    render () {
        return (
            <div
                className = {"variant"} >
                <label>
                    Patience Variant
                </label>
                <input
                    name = 'variant'
                    value = 'Patience'
                    type = {"radio"}
                    onChange = {this.handleChange}
                    checked = {this.props.variant === "Patience"}
                ></input>
                <label>
                    Klondike Variant
                </label>
                <input
                    name = 'variant'
                    value = 'Klondike'
                    type = {"radio"}
                    onChange = {this.handleChange}
                    checked = {this.props.variant === "Klondike"}
                ></input>
            </div>
        )
    }
}
class TimedTurns extends React.Component {
    constructor (props) {
        super (props);
        this.handleBoolChange = this.handleBoolChange.bind (this);
        this.handleValueChange = this.handleValueChange.bind (this);
    }
    handleBoolChange (event) {
        this.props.onBoolChange (event.target.checked);
    }
    handleValueChange (event) {
        this.props.onValueChange (event.target.value);
    }
    render () {
        return (
            <div
                className = {"turnstimed"} >
                <label
                    htmlFor="turnstimed" >
                    Limit time for each turn
                </label>
                <input
                    checked = { this.props.turnsTimed}
                    onChange = {this.handleBoolChange}
                    id = {"turnstimed"}
                    type = "checkbox" ></input>
                <label
                    htmlFor = "timeperturn" >
                    Duration
                </label>
                <select
                    value = { this.props.timePerTurn}
                    onChange = {this.handleValueChange}
                    id = {"timeperturn"} >
                    <option value = {15} >15s</option>
                    <option value = {30} >30s</option>
                    <option value = {45} >45s</option>
                    <option value = {60} >60s</option>
                    <option value = {90} >90s</option>
                    <option value = {120} >120s</option>
                    <option value = {180} >180s</option>
                    <option value = {300} >300s</option>
                </select>
            </div>
        )
    }
}
class TimedRounds extends React.Component {
    constructor (props) {
        super (props);
        this.handleBoolChange = this.handleBoolChange.bind (this);
        this.handleValueChange = this.handleValueChange.bind (this);
    }
    handleBoolChange (event) {
        this.props.onBoolChange (event.target.checked);
    }
    handleValueChange (event) {
        this.props.onValueChange (event.target.value);
    }
    render () {
        return (
            <div
                className = {"turnstimed"} >
                <label
                    htmlFor = "roundstimed" >
                    Limit time for each round
                </label>
                <input
                    checked = { this.props.roundsTimed}
                    onChange = {this.handleBoolChange}
                    id = {"roundstimed"}
                    type = "checkbox"
                ></input>
                <label
                    htmlFor="timeperround">
                    Duration
                </label>
                <select
                    value = { this.props.timePerRound}
                    onChange = {this.handleValueChange}
                    id = {"timeperround"} >
                    <option value = {600} >10min</option>
                    <option value = {900} >15min</option>
                    <option value = {1200} >20min</option>
                    <option value = {1500} >25min</option>
                    <option value = {1800} >30min</option>
                    <option value = {2700} >45min</option>
                    <option value = {3600} >60min</option>
                </select>
            </div>
        )
    }
}

class Online extends React.Component {
    constructor (props) {
        super (props);
        this.handleChange = this.handleChange.bind (this);
    }
    handleChange (event) {
        this.props.onChange (event.target.value);
    }
    render () {
        return (
            <div
                className = {"online"} >
                <label>
                    vs. Player
                </label>
                <button
                    onClick = {this.props.handleNewClick} >
                    New
                </button>
                <label>
                    Roomname
                </label>
                <input
                    id = 'roomName'
                    type = 'text'
                    onChange = {this.handleChange}
                    value = { this.props.roomName}
                ></input>
            </div>
        )
    }
}
function AI (props) {
    return (
        <div
            className = {"ai"} >
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