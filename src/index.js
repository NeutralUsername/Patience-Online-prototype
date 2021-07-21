import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import  { useState } from 'react';

//                                    Constants
//---------------------------------------------------------------------------------------
const Suits = ["♠", "♥", "♦", "♣"];
const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

//                                      RULES
//---------------------------------------------------------------------------------------
const nrFieldSequenceCards = 3;
const nrMalusCards = 14;

const canThrowOnStock = true;
const canThrowOnWaste = true;
//----------------------------------------------------------------------------------------
ReactDOM.render(<Index />, document.getElementById('root'));

console.log(freshDeck("R"));
console.log(document.getElementById('root'));



function Index () {
    return (
        <div className={"Index"}>
            <Name></Name>
            <AI></AI>
            <Human></Human>
        </div>
    )          
}

function Name (props) {
    const[name, setName] = useState("");
    console.log(name);
    return (
        <div className={"Name"}>
            <label htmlFor="Name">Display Name</label>
            <input id = "Name" type="text" name="nameField" onChange={ event => setName(event.target.value)} value={name}></input>  
        </div>
    )
}

function AI (props) {
    return (
        <div className={"AI"}>
            <button className={"AI.rnd"} onClick={ () => props.handleClick("AI.rnd") }>AI Hot-Join</button>
            <button className={"AI-black"} onClick={ () => props.handleClick("AI-black") }>AI Black-Side</button>
            <button className={"AI-red"} onClick={ () => props.handleClick("AI-red") }>AI Red-Side</button>
        </div>
    )
}

function Human (props) {
    return (
        <div className={"Human"}>
            <button className={"Human-rnd"} onClick={ () => props.handleClick("Human-rnd") }>Human Hot-Join</button>
            <button className={"Human-new"} onClick={ () => props.handleClick("Human-new") }>Human New Game</button>
            <button className={"Human-join"} onClick={ () => props.handleClick("Human-join") }>Human Join Game</button>
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
        return Values. map(value => {
            return (
                <Card 
                    suit={suit} 
                    value={value} 
                    set={set} 
                    faceUp={false} 
                    onDragStart={() => handleDrag()} 
                    onDrop={() => handleDrop()} 
                ></Card>)
        });
    });
}  
