import React from 'react';
import socketIOClient from 'socket.io-client';
import {useState} from 'react';
import ReactDOM from 'react-dom';
import ServerTime from './ServerTime';
import Game from './Game';
 /*
        ReactDOM.render(
            <Game 
                MalusSize = {window.MalusSize} 
                SecquenceSize={window.SecquenceSize} 
                ThrowOnStock={window.ThrowOnStock} 
                ThrowOnMalus={window.ThrowOnMalus} 
                Variant={window.Variant} 
                TurnsTimed={window.TurnsTimed} 
                TimePerTurn={window.TimePerTurn} 
                RoundsTimed={window.RoundsTimed} 
                TimePerRound={window.TimePerRound} 
                Name={window.Name} 
                PrivateLobby={window.PrivateLobby} 
            />, document.getElementById('root')
        );
        */

export default class GameSettings extends React.Component {

    constructor(props) {
        super(props);
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

    handleCreateClick(){

    }

    handleJoinClick() {

    }

    handleAIClick() {

    }

    render(){
        return (
            <div className={"GameSettings"}> 
                <ServerTime></ServerTime>
                <MalusSize malusSize={this.state.malusSize} ></MalusSize>
                <SecquenceSize secquenceSize={this.state.secquenceSize}></SecquenceSize>
                <ThrowOnStock throwOnStock={this.state.throwOnStock}></ThrowOnStock>
                <ThrowOnMalus throwOnMalus={this.state.throwOnMalus}></ThrowOnMalus>
                <Variant variant={this.state.variant}></Variant>
                <TurnsTimed turnsTimed={this.state.turnsTimed}></TurnsTimed>
                <TimePerTurn timePerTurn={this.state.timePerTurn}></TimePerTurn>
                <RoundsTimed roundsTimed={this.state.roundsTimed}></RoundsTimed>
                <TimePerRound timePerRound={this.state.timePerRound}></TimePerRound>
                <Name name={this.state.name}></Name>
                <Online handleCreateClick = {this.handleCreateClick} handleJoinClick = {this.handleJoinClick}></Online>
                <AI handeClick={this.handleAIClick}> </AI>
            </div>
        );
    }
}
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
 
function MalusSize (props) {
    const [input, setInput] = useState(14);
    window.MalusSize = input;
    return (
        <div className="malussize">
            <label htmlFor={"MalusCountSelect"}> Malus Size</label>
            <select value={input} onChange={e => setInput(e.target.value)} id={"MalusCountSelect"}>
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

function SecquenceSize (props) {
    const [input, setInput] = useState(3);
    window.SecquenceSize = input;
    return (
        <div className="sequencesize">
            <label htmlFor={"SequenceSizeSelect"}> Sequence Size</label>
            <select value={input} onChange={e => setInput(e.target.value)} id={"SequenceSizeSelect"} >
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

function ThrowOnStock (props) {
    const [input, setInput] = useState(true);
    window.ThrowOnStock = input;
    return (
        <div className={"throwonstock"}>
             <label htmlFor="ThrowStockCB" >Throw on Opponent Stock</label>
             <input  checked={input} onChange={e => setInput(e.target.checked)} id={"ThrowStockCB"} type={"checkbox"}></input>
        </div>
    )
}

function ThrowOnMalus (props) {
    const [input, setInput] = useState(true);
    window.ThrowOnMalus = input;
    return (
        <div className={"throwonmalus"}>
            <label htmlFor="ThrowMalusCB" >Throw on Opponent Malus</label>
            <input  defaultChecked={true} value={input} onChange={e => setInput(e.target.checked)} id={"ThrowMalusCB"} type={"checkbox"}></input>
        </div>
    )
}

function Variant (props) {
    const [input, setInput] = useState('Patience');
    window.Mode = input;
    return (
        <div className={"variant"} radioGroup={'radiogrp'} onChange={e => setInput(e.target.value)} >
            <label>Patience Variant</label>
            <input defaultChecked={true} name="radiogrp" value ='Patience' type ={"radio"} />
            <label>Klondike Variant</label>
            <input name="radiogrp" value ='Klondike' type ={"radio"} />
        </div>
    )
}

function TurnsTimed (props) {
    const [input, setInput] = useState(false);
    window.TurnsTimed=input;
    return (
        <div className={"turnstimed"}>
            <label htmlFor="TurnsTimed">Limit time for each turn</label>
            <input value={input} onChange={e => setInput(e.target.checked)} id={"TurnsTimed"} type = "checkbox" ></input>  
        </div>
    )
}

function TimePerTurn (props) {
    const [input, setInput] = useState(60);
    window.TimePerTurn=input;
    return (
        <div className={"timeperturn"}>
            <label htmlFor="TimePerTurn">Duration:</label> 
            <select value={input} onChange={e => setInput(e.target.value)} id={"TimePerTurn"} >
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

function RoundsTimed (props) {
    const [input, setInput] = useState(false);
    window.RoundsTimed=input;
    return (
        <div className={"roundstimed"}>
            <label htmlFor="RoundsTimed">Limit time for each round</label>
            <input value={input} onChange={e => setInput(e.target.checked)} id={"RoundsTimed"} type = "checkbox" ></input>  
        </div>
    )
}

function TimePerRound (props) {
    const [input, setInput] = useState(1800);
    window.TimePerRound=input;
    return (
        <div className={"timeperround"}>
            <label htmlFor="TimePerRound">Duration:</label> 
            <select value={input} onChange={e => setInput(e.target.value)} id={"TimePerRound"} >
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

function Name (props) {
    const[input, setInput] = useState('Username');
    window.Name=input;
    return (
        <div className={"name"}>
            <label htmlFor="NameTF">Display Name</label>
            <input id = "NameTF" type="text" onChange={ event => setInput(event.target.value)} value={input}></input>  
        </div>
    )
}


function AI (props) {
    function startGame() {

    }

    return (
        <div className={"ai"}>
            <label> vs. AI:</label>
            <button onClick={e=> {startGame()}} className={"ai-button"} >Start</button>
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
            <button onClick={e=> {startGame()}} className={"create-button"} >Create</button>
            <button onClick={e=> {joinGame()}} className={"join-button"} >Join</button>
        </div>
    )
}


//__________________________________________________________________________________________________





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
  