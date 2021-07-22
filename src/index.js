import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import  { useState } from 'react';

ReactDOM.render(<Index />, document.getElementById('root'));


function Index (props) {
    return (
        <div className={"Index"}>
            <MalusSize ></MalusSize>
            <SecquenceSize></SecquenceSize>
            <ThrowOnStock></ThrowOnStock>
            <ThrowOnMalus></ThrowOnMalus>
            <Mode></Mode>
            <TurnsTimed></TurnsTimed>
            <TimePerTurn></TimePerTurn>
            <RoundsTimed></RoundsTimed>
            <TimePerRound></TimePerRound>
            <Name></Name>
            <PrivateLobby></PrivateLobby>
            <Human></Human>
            <AI></AI>
        </div>
    )          
}

function MalusSize (props) {
    const [input, setInput] = useState(14);
    window.MalusSize = input;
    return (
        <div className="MalusSize">
            <label htmlFor={"MalusCountSelect"}> Malus Size</label>
            <select value={input} onInput={e => setInput(e.target.value)} id={"MalusCountSelect"}>
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
        <div className="SequenceSize">
            <label htmlFor={"SequenceSizeSelect"}> Sequence Size</label>
            <select value={input} onInput={e => setInput(e.target.value)} id={"SequenceSizeSelect"} >
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
        <div className={"ThrowStock"}>
             <label htmlFor="ThrowStockCB" >Throw on Opponent Stock</label>
             <input  checked={input} onChange={e => setInput(e.target.checked)} id={"ThrowStockCB"} type={"checkbox"}></input>
        </div>
    )
}

function ThrowOnMalus (props) {
    const [input, setInput] = useState(true);
    window.ThrowOnMalus = input;
    return (
        <div className={"ThrowMalus"}>
            <label htmlFor="ThrowMalusCB" >Throw on Opponent Malus</label>
            <input  defaultChecked={true} value={input} onChange={e => setInput(e.target.checked)} id={"ThrowMalusCB"} type={"checkbox"}></input>
        </div>
    )
}

function Mode (props) {
    const [input, setInput] = useState('Patience');
    window.Mode = input;
    return (
        <div radioGroup={'radiogrp'} onChange={e => setInput(e.target.value)} >
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
        <div className={"ThrowMalus"}>
            <label htmlFor="TurnsTimed">Limit time for each turn</label>
            <input value={input} onChange={e => setInput(e.target.checked)} id={"TurnsTimed"} type = "checkbox" ></input>  
        </div>
    )
}

function TimePerTurn (props) {
    const [input, setInput] = useState(60);
    window.TimePerTurn=input;
    return (
        <div className={"ThrowMalus"}>
            <label htmlFor="TimePerTurn">Duration:</label> 
            <input value={input} onChange={e => setInput(e.target.value)} id={"TimePerTurn"} type="text" ></input>
        </div>
    )
}

function RoundsTimed (props) {
    const [input, setInput] = useState(false);
    window.RoundsTimed=input;
    return (
        <div className={"ThrowMalus"}>
            <label htmlFor="RoundsTimed">Limit time for each round</label>
            <input value={input} onChange={e => setInput(e.target.checked)} id={"RoundsTimed"} type = "checkbox" ></input>  
        </div>
    )
}

function TimePerRound (props) {
    const [input, setInput] = useState(1200);
    window.TimePerRound=input;
    return (
        <div className={"timeperround"}>
            <label htmlFor="TimePerRound">Duration:</label> 
            <input value={input} onChange={e => setInput(e.target.value)}  id={"TimePerRound"} type="text" ></input>
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

function PrivateLobby (props) {
    const [input, setInput] = useState(false);
    window.PrivateLobby = input;
    return (
        <div className={"privatelobby"}>
            <input value={input} onChange={e => setInput(e.target.checked)} type="checkbox" id ="PrivateGameCB"></input>
            <label htmlFor="PrivateGameCB">create private game</label>
        </div>
    )
}

function AI (props) {
    function getOptions() {
        console.log(window.MalusSize); 
        console.log(window.SecquenceSize);
        console.log(window.ThrowOnStock);
        console.log(window.ThrowOnMalus);
        console.log(window.TurnsTimed);
        console.log(window.TimePerTurn); 
        console.log(window.RoundsTimed);
        console.log(window.TimePerRound);
        console.log(window.Name);
        console.log(window.PrivateLobby);      
        console.log(window.Mode);    
    }
    return (
        <div className={"ai"}>
            <button onClick={e=> {getOptions()}} type="submit" className={"black-ai-button"} >AI</button>
        </div>
    )
}

function Human (props) {
    function getOptions() {
        console.log(window.MalusSize); 
        console.log(window.SecquenceSize);
        console.log(window.ThrowOnStock);
        console.log(window.ThrowOnMalus);
        console.log(window.TurnsTimed);
        console.log(window.TimePerTurn); 
        console.log(window.RoundsTimed);
        console.log(window.TimePerRound);
        console.log(window.Name);
        console.log(window.PrivateLobby);  
        console.log(window.Mode);      
    }
    return (
        <div className={"human"}>
            <button onClick={e=> {getOptions()}} className={"hotjoin-button"} >Online</button>
        </div>
    )
}

// =========================================================================================================================================================

function Card (props) {
    return (
        <div 
            className={props.suit+' '+props.value+' '+props.set+' '+(props.faceUp ? "faceUp" : "faceDown")} 
            draggable ="true" 
            onDragStart={props.onDragStart} 
            onDrop={props.onDrop}
        ></div>
    )
}

function Stack (props) {

}

function Sequence (props) {
    return React.createElement("div", {id: 'someId', className: "someClass"}, "")
}

function Player (props) {
    return (
        <div className="Player">
            <Stack></Stack>
            <Stack></Stack>
            <Sequence></Sequence>
        </div>
    )
}

function Opponent (props) {
    return (
        <div className="Opponent">
            <Stack></Stack>
            <Stack></Stack>
            <Sequence></Sequence>
        </div>
    )
}

function Field (props) {
    return (
        <div className="Field">
            <Stacks></Stacks>
            <Sequences></Sequences>
        </div>
    )
}

function Stacks (props) {
    return (
        <div className="Stacks">
            <Stack></Stack>
            <Stack></Stack>
            <Stack></Stack>
            <Stack></Stack>
            <Stack></Stack>
            <Stack></Stack>
            <Stack></Stack>
            <Stack></Stack>
        </div>
    )
}

function Sequences (props) {
    return (
        <div className="Stacks">
            <Sequence></Sequence>
            <Sequence></Sequence>
            <Sequence></Sequence>
            <Sequence></Sequence>
            <Sequence></Sequence>
            <Sequence></Sequence>
            <Sequence></Sequence>
            <Sequence></Sequence>
        </div>
    )
}

function Game (props) {
    return (
        <div className="Stacks">
            <Player></Player>
            <Opponent></Opponent>
            <Field></Field>
        </div>        
    )
} 

function shuffle(decks) {
    for(var i = 0; i< decks.length; i++) {
        var currentIndex = decks[i].length,  randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [decks[i][currentIndex], decks[i][randomIndex]] = [
            decks[i][randomIndex], decks[i][currentIndex]];
        }
    }
    return decks;
  }
 
  function freshDeck(set) {
    const Suits = ["♠", "♥", "♦", "♣"];
    const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    function handleDrag() {

    }
    function handleDrop() {

    }
    return Suits.flatMap(suit => {
        return Values.map(value => {
            return (
                <Card 
                    suit={suit} 
                    value={value} 
                    set={set} 
                    faceUp={false} 
                    onDragStart={() => handleDrag()} 
                    onDrop={() => handleDrop()} 
                ></Card>
            )
        });
    });
}  
