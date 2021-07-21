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

console.log(freshDeck("R"));
console.log(document.getElementById('root'));

function Index() {

    const[name, setName] = useState("");
    console.log(name);
    
   function handleClick(param) {
        if(param === "Hot-join-AI") {
            ReactDOM.render(<Game playerName = {name}/>, document.getElementById('root'));
        }
        if(param === "Red-AI") {
            ReactDOM.render(<Game playerName = {name} />, document.getElementById('root'));
        }
        if(param === "Black-AI") {
            ReactDOM.render(<Game playerName = {name} />, document.getElementById('root'));
        }   
        if(param === "Hot-join-Human") {
            ReactDOM.render(<Game />, document.getElementById('root'));
        }   
        if(param === "New-Human") {
            ReactDOM.render(<Game />, document.getElementById('root'));
        }   
        if(param === "Join-Human") {
            ReactDOM.render(<Game />, document.getElementById('root'));
        }   
    }
    return (
        <div className={"LandingPage"}>
            <label htmlFor="Name">Display Name</label>
            <input type="text" name="nameField" onChange={ event => setName(event.target.value)} value={name}></input>

            <button className={"vsAI-Hot-join"} onClick={ () => handleClick("Hot-join-AI") }>AI Hot-Join</button>
            <button className={"vsAI-Black"} onClick={ () => handleClick("Black-AI") }>AI Black-Side</button>
            <button className={"vsAI-Red"} onClick={ () => handleClick("Red-AI") }>AI Red-Side</button>
            <button className={"vsHuman-Hot-join"} onClick={ () => handleClick("Hot-join-Human") }>Human Hot-Join</button>
            <button className={"vsHuman-New"} onClick={ () => handleClick("New-Human") }>Human New Game</button>
            <button className={"vsHuman-Join"} onClick={ () => handleClick("Join-Human") }>Human Join Game</button>
        </div>)       
        
}

function Card(props) {
    return (
    <div 
        className={props.suit+' '+props.value+' '+props.set+' '+(props.faceUp ? "faceUp" : "faceDown")} 
        draggable ="true" 
        onDragStart={props.onDragStart} 
        onDrop={props.onDrop}
    ></div>
    )
}

function Stack(props) {

}

function Sequence(props) {
    
}

function Player(props) {
    return (
        <div className="Player">
            <Stack></Stack>
            <Stack></Stack>
            <Sequence></Sequence>
        </div>
    )
}

function Opponent(props) {
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

function Stacks(props) {
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

function Sequences(props) {
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
ReactDOM.render(<Index />, document.getElementById('root'));

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
