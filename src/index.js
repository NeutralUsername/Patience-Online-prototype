import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import  { useState } from 'react';

const Suits = ["♠", "♥", "♦", "♣"];
const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

console.log(freshDeck("R"));
console.log(document.getElementById('root'));

ReactDOM.render(<Index />, document.getElementById('root'));

function Index (props) {
    return (
        <div className={"Index"}>
            <Options></Options>
            <Human></Human>
            <AI></AI>
        </div>
    )          
}

function Options (props) {
    return (
        <form className="Options">
            <MalusSize></MalusSize>
            <SecquenceSize></SecquenceSize>
            <ThrowOnStock></ThrowOnStock>
            <ThrowOnMalus></ThrowOnMalus>
            <Time></Time>
            <Name></Name>
        </form>
    )
}

function MalusSize (props) {
    const [input, setInput] = useState(14);
    console.log(input);
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
                <option  value = "14">14</option>
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
    console.log(input);
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
    console.log(input);
    return (
        <div className={"ThrowStock"}>
             <label htmlFor="ThrowStockCB" >Throw on Opponent Stock</label>
             <input  checked={input} onChange={e => setInput(e.target.checked)} id={"ThrowStockCB"} type={"checkbox"}></input>
        </div>
    )
}

function ThrowOnMalus (props) {
    const [input, setInput] = useState(true);
    console.log(input);
    return (
        <div className={"ThrowMalus"}>
            <label htmlFor="ThrowMalusCB" >Throw on Opponent Malus</label>
            <input  defaultChecked={true} value={input} onChange={e => setInput(e.target.checked)} id={"ThrowMalusCB"} type={"checkbox"}></input>
        </div>
    )
}

function Time (props) {
    return (
        <div>
            <TimeTurn></TimeTurn>
            <TimeRound></TimeRound>
        </div>
    )
}

function TimeTurn (props) {
    const [enabled, setEnabled] = useState(false);
    const [input, setInput] = useState(60);
    console.log(enabled);
    console.log(input);
    return (
        <div>
            <label htmlFor="TurnTimeCB">Limit time for each turn</label>
            <input value={enabled} onChange={e => setEnabled(e.target.checked)} id={"TurnTimeCB"} type = "checkbox" ></input>  
            <label htmlFor="TurnTimeValue">Duration:</label> 
            <input value={input} onChange={e => setInput(e.target.value)} id={"TurnTimeValue"} type="text" ></input>
        </div>
    )
}

function TimeRound (props) {
    const [enabled, setEnabled] = useState(false);
    const [input, setInput] = useState(1200);
    console.log(enabled);
    console.log(input);
    return (
        <div>
            <label htmlFor="RoundTimeCB">Limit time for each round</label>
            <input value={enabled} onChange={e => setEnabled(e.target.checked)} id={"RoundTimeCB"} type = "checkbox" ></input>  
            <label htmlFor="RoundTimeValue">Duration:</label> 
            <input value={input} onChange={e => setInput(e.target.value)}  id={"RoundTimeValue"} type="text" ></input>
        </div>
    )
}

function Name (props) {
    const[name, setName] = useState('Username');
    console.log(name);
    return (
        <div className={"Name"}>
            <label htmlFor="Name">Display Name</label>
            <input id = "Name" type="text" onChange={ event => setName(event.target.value)} value={name}></input>  
        </div>
    )
}

function AI (props) {
    return (
        <div className={"AI"}>
            <button type="submit" className={"AI-black"} >AI Black-Side</button>
            <button type="submit" className={"AI-red"} >AI Red-Side</button>
        </div>
    )
}

function Human (props) {
    return (
        <div className={"Human"}>
            <button className={"hotjoin"} onClick={ () => props.handleClick("hotjoin") }>Find</button>
            <button className={"Human-join"} onClick={ () => props.handleClick("Human-join") }>Join</button>
            <button className={"Human-new"} onClick={ () => props.handleClick("Human-new") }>Create</button>
            <input type="checkbox" id ="privateGame"></input>
            <label htmlFor="privateGame">private Lobby</label>
        </div>
    )
}

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

// =====================================================================================================================

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
