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
            <input type="text" name="nameField" onChange={ e => setName(e.target.value)} value={name}></input>

            <button className={"vsAI-Hot-join"} onClick={ () => handleClick("Hot-join-AI") }>AI Hot-Join</button>
            <button className={"vsAI-Black"} onClick={ () => handleClick("Black-AI") }>AI Black-Side</button>
            <button className={"vsAI-Red"} onClick={ () => handleClick("Red-AI") }>AI Red-Side</button>
            <button className={"vsHuman-Hot-join"} onClick={ () => handleClick("Hot-join-Human") }>Human Hot-Join</button>
            <button className={"vsHuman-New"} onClick={ () => handleClick("New-Human") }>Human New Game</button>
            <button className={"vsHuman-Join"} onClick={ () => handleClick("Join-Human") }>Human Join Game</button>
        </div>)       
        
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.color = props.color;
        this.malus = props.malus;
        this.sequence = props.sequence;   
    }
    render() {
        return (
            <div className="Game">
                <div className="Player-Side">
                    {this.renderWaste("Player")}
                    {this.renderStock("Player")}
                    {this.renderMalus("Player")}
                </div>
                <div className="Opponent-Side">
                    {this.renderWaste("Opponent")}
                    {this.renderStock("Opponent")}
                    {this.renderMalus("Opponent")}
                </div>
                <div className="Field-Stacks">
                    {this.renderFieldStack(1)}
                    {this.renderFieldStack(2)}
                    {this.renderFieldStack(3)}
                    {this.renderFieldStack(4)}
                    {this.renderFieldStack(5)}
                    {this.renderFieldStack(6)}
                    {this.renderFieldStack(7)}
                    {this.renderFieldStack(8)}
                </div>
                <div className="Field-Sequences">
                    {this.renderFieldSequence(1)}
                    {this.renderFieldSequence(2)}
                    {this.renderFieldSequence(3)}
                    {this.renderFieldSequence(4)}
                    {this.renderFieldSequence(5)}
                    {this.renderFieldSequence(6)}
                    {this.renderFieldSequence(7)}
                    {this.renderFieldSequence(8)}
                </div>
                <div className="Game-info">
                    <div className={"Player-Turn"}></div>
                    <div className={"Time"}></div>
                </div>
            </div>
        )
    } 
    renderMalus(who)
    {
        
    }

    renderStock(who)
    {
        if(who =="Player") {

        }
    }

    renderWaste(who)
    {
        
    }

    renderFieldStack(which)
    {
        
    }

    renderFieldSequence(which)
    {
       
    }
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

  