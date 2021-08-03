import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import ServerTime from './ServerTime';
import Game from './Game';

export default class Options extends React.Component {

    constructor(props) {
        super(props);
        this.handleMalusSizeChange = this.handleMalusSizeChange.bind(this);
        this.handleSecquenceSizeChange = this.handleSecquenceSizeChange.bind(this);
        this.handleThrowOnStockChange = this.handleThrowOnStockChange.bind(this);
        this.handleThrowOnMalusChange = this.handleThrowOnMalusChange.bind(this);
        this.handleVariantChange = this.handleVariantChange.bind(this);
        this.handleTurnsTimedChange = this.handleTurnsTimedChange.bind(this);
        this.handleTimePerTurnChange = this.handleTimePerTurnChange.bind(this);
        this.handleRoundsTimedChange = this.handleRoundsTimedChange.bind(this);
        this.handleTimePerRoundChange = this.handleTimePerRoundChange.bind(this);
        this.handleTimePerRoundChange = this.handleTimePerRoundChange.bind(this);
        this.handleAIClick = this.handleAIClick.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this)
        this.handleJoinClick = this.handleJoinClick.bind(this)
        this.state = {
            malusSize: 14, 
            secquenceSize: 3,
            throwOnStock:true, 
            throwOnMalus: true, 
            variant:"Patience",
            turnsTimed:false,
            timePerTurn:60, 
            roundsTimed:false, 
            timePerRound:1800, 
            name:'',    
        };
    }

    handleTimePerRoundChange(state){

    }

    handleRoundsTimedChange(state){

    }

    handleTimePerTurnChange(state){

    }

    handleTurnsTimedChange(state){

    }

    handleVariantChange(state){

    }

    handleThrowOnMalusChange(state){

    }

    handleThrowOnStockChange(state){

    }

    handleSecquenceSizeChange(state){

    }

    handleMalusSizeChange(state){

    }

    handleCreateClick(state){

    }

    handleJoinClick(state) {

    }

    handleAIClick(state) {

    }
   
    render(){
        return (
            <div className={"options"}> 
                <ServerTime></ServerTime>
                <MalusSize 
                    malusSize={this.state.malusSize} 
                    onChange={this.handleMalusSizeChange} 
                ></MalusSize>
                <SecquenceSize 
                    secquenceSize={this.state.secquenceSize} 
                    onChange={this.handleMalusSizeChange}
                ></SecquenceSize>
                <ThrowOnStock 
                    throwOnStock={this.state.throwOnStock} 
                    onChange={this.handleMalusSizeChange}
                ></ThrowOnStock>
                <ThrowOnMalus 
                    throwOnMalus={this.state.throwOnMalus} 
                    onChange={this.handleMalusSizeChange}
                ></ThrowOnMalus>
                <Variant 
                    variant={this.state.variant} 
                    onChange={this.handleMalusSizeChange}
                ></Variant>
                <TimedTurns 
                    turnsTimed={this.state.turnsTimed} 
                    timePerTurn={this.state.timePerTurn} 
                    onBoolChange={this.handleMalusSizeChange} 
                    onValueChange={this.handleMalusSizeChange}
                ></TimedTurns>
                <TimedRounds 
                    roundsTimed={this.state.roundsTimed} 
                    timePerRound={this.state.timePerRound} 
                    onBoolChange={this.handleMalusSizeChange} 
                    onValueChange={this.handleMalusSizeChange}
                ></TimedRounds>
                <Name 
                    name={this.state.name} 
                    onChange={this.handleMalusSizeChange}
                ></Name>
                <Online 
                    handleCreateClick = {this.handleCreateClick} 
                    handleJoinClick = {this.handleJoinClick}
                ></Online>
                <AI 
                    handeClick={this.handleAIClick}
                ></AI>
            </div>
        );
    }
}
 
class MalusSize extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.malusSize(e.target.value);
    }

    render(){
        return (
            <div className="malussize">
                <label htmlFor={"MalusCountSelect"}> Malus Size</label>
                <select  value={ this.props.malusSize} onChange={this.handleChange} id={"MalusCountSelect"}>
                    <option value = "5">5</option>
                    <option value = "6">6</option>
                    <option value = "7">7</option>
                    <option value = "8">8</option>
                    <option value = "9">9</option>
                    <option value = "10">10</option>
                    <option value = "11">11</option>
                    <option value = "12">12</option>
                    <option value = "13">13</option>
                    <option value = "14">14</option>
                    <option value = "15">15</option>
                    <option value = "16">16</option>
                    <option value = "17">17</option>
                    <option value = "18">18</option>
                    <option value = "19">19</option>
                    <option value = "20">20</option>
                </select>
            </div>
        )
    }
}

class SecquenceSize extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.secquenceSize(e.target.value);
    }

    render(){
        return (
            <div className="sequencesize">
                <label htmlFor={"SequenceSizeSelect"}> Sequence Size</label>
                <select value={ this.props.secquenceSize}  onChange={this.handleChange} id={"SequenceSizeSelect"} >
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                    <option value = "5">5</option>
                    <option value = "6">6</option>
                </select>
                </div>
        )
    }
}

class ThrowOnStock extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.throwOnStock(e.target.value);
    }

    render(){
        return (
            <div className={"throwonstock"}>
                <label htmlFor="ThrowStockCB" >Throw on Opponent Stock</label>
                <input  value={ this.props.throwOnStock}  onChange={this.handleChange} id={"ThrowStockCB"} type={"checkbox"}></input>
            </div>
        )
    }
}

class ThrowOnMalus extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.throwOnMalus(e.target.value);
    }

    render(){
        return (
            <div className={"throwonmalus"}>
                <label htmlFor="ThrowMalusCB" >Throw on Opponent Malus</label>
                <input  value={ this.props.throwOnMalus}  onChange={this.handleChange} id={"ThrowMalusCB"} type={"checkbox"}></input>
            </div>
        )
    }
}

class Variant extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.variant(e.target.value);
    }

    render(){
        return (
            <div className={"variant"}  >
                <label>Patience Variant</label>
                <input defaultChecked name="variant" value = 'Patience' type ={"radio"} onChange={this.handleChange} />
                <label>Klondike Variant</label>
                <input  name="variant" value ='Klondike' type ={"radio"} onChange={this.handleChange} />
            </div>
        )
    }
}

class TimedTurns extends React.Component{

    constructor(props) {
        super(props);
        this.handleBoolChange = this.handleBoolChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleBoolChange(e) {
        this.props.turnsTimed(e.target.value);
    }

    handleValueChange(e) {
        this.props.timePerTurn(e.target.value);
    }

    render(){
        return (
            <div className={"turnstimed"}>
                <label htmlFor="TurnsTimed">Limit time for each turn</label>
                <input value={ this.props.turnsTimed}  onChange={this.handleBoolChange} id={"TurnsTimed"} type = "checkbox" ></input>  
                <label htmlFor="TimePerTurn">Duration:</label> 
                <select value={ this.props.timePerTurn}  onChange={this.handleValueChange} id={"TimePerTurn"} >
                    <option value = "15">15s</option>
                    <option value = "30">30s</option>
                    <option value = "45">45s</option>
                    <option value = "60">60s</option>
                    <option value = "90">90s</option>
                    <option value = "120">120s</option>
                    <option value = "180">180s</option>
                    <option value = "300">300s</option>
                </select>
            </div>
        )
    }
}

class TimedRounds extends React.Component{

    constructor(props) {
        super(props);
        this.handleBoolChange = this.handleBoolChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleBoolChange(e) {
        this.props.roundsTimed(e.target.value);
    }

    handleValueChange(e) {
        this.props.timePerRound(e.target.value);
    }

    render(){
        return (
            <div className={"turnstimed"}>
                <label htmlFor="RoundsTimed">Limit time for each round</label>
                <input value={ this.props.roundsTimed}  onChange={this.handleBoolChange} id={"RoundsTimed"} type = "checkbox" ></input>
                <label htmlFor="TimePerRound">Duration:</label> 
                <select value={ this.props.timePerRound}  onChange={this.handleValueChange} id={"TimePerRound"} >
                    <option value = "600">10min</option>
                    <option value = "900">15min</option>
                    <option value = "1200">20min</option>
                    <option value = "1500">25min</option>
                    <option value = "1800">30min</option>
                    <option value = "2700">45min</option>
                    <option value = "3600">60min</option>
                </select>  
            </div>
        )
    }
}

class RoundsTimed extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.roundsTimed(e.target.value);
    }

    render(){
        return (
            <div className={"roundstimed"}>
                <label htmlFor="RoundsTimed">Limit time for each round</label>
                <input value={ this.props.roundsTimed}  onChange={this.handleChange} id={"RoundsTimed"} type = "checkbox" ></input>  
            </div>
        )
    }
}

class TimePerRound extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.timePerRound(e.target.value);
    }

    render(){
        return (
            <div className={"timeperround"}>
                <label htmlFor="TimePerRound">Duration:</label> 
                <select value={ this.props.timePerRound}  onChange={this.handleChange} id={"TimePerRound"} >
                    <option value = "600">10min</option>
                    <option value = "900">15min</option>
                    <option value = "1200">20min</option>
                    <option value = "1500">25min</option>
                    <option value = "1800">30min</option>
                    <option value = "2700">45min</option>
                    <option value = "3600">60min</option>
                </select>
            </div>
        )
    }
}

class Name extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.name(e.target.value);
    }

    render(){
        return (
            <div className={"name"}>
                <label htmlFor="NameTF">Display Name</label>
                <input id = "NameTF" type="text"  onChange={this.handleChange} value={ this.props.name}></input>  
            </div>
        )
    }
}

function AI (props) {
    function startGame() {

    }

    return (
        <div className={"ai"}>
            <label> vs. AI:</label>
            <button  >Start</button>
        </div>
    )
}

function Online (props) {
    function startGame() {
        
    }

    function joinGame() {

    }

    return (
        <div className={"online"}>
            <label> vs. Player:</label>
            <button  >Create</button>
            <button  >Join</button>
        </div>
    )
}

//__________________________________________________________________________________________________
//__________________________________________________________________________________________________
//__________________________________________________________________________________________________
//__________________________________________________________________________________________________


//=========================================================================================

class Calculator extends React.Component {

    constructor(props) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {temperature: '', scale: 'c'};
    }
  
    handleCelsiusChange(temperature) {
        this.setState({scale: 'c', temperature});
    }
  
    handleFahrenheitChange(temperature) {
        this.setState({scale: 'f', temperature});
    }
  
    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
        return (
            <div>
                <TemperatureInput
                    scale="c"
                    temperature={celsius}
                    onTemperatureChange={this.handleCelsiusChange} />
                <TemperatureInput
                    scale="f"
                    temperature={fahrenheit}
                    onTemperatureChange={this.handleFahrenheitChange} />
                <BoilingVerdict
                    celsius={parseFloat(celsius)} />
            </div>
        );
    }
}

class TemperatureInput extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTemperatureChange(e.target.value);
    }
  
    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input 
                    value={temperature} 
                    onChange={this.handleChange} />
            </fieldset>
        );
    }
}
  
//=========================================================================================



const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
  };
  
  function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
  
  function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
  }
  
  function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
      return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
  }
  
  function BoilingVerdict(props) {
    if (props.celsius >= 100) {
      return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
  }
  



  
ReactDOM.render(
    <Calculator />,
    document.getElementById('root')
);
 