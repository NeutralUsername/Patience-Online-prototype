import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//                                    Constants
//---------------------------------------------------------------------------------------
const Suits = ["♠", "♥", "♦", "♣"];
const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const sets = ["R", "B"];
//                                      RULES
//---------------------------------------------------------------------------------------
const nrFieldSequenceCards = 3;
const nrMalusCards = 14;

const canThrowOnStock = true;
const canThrowOnWaste = true;
//----------------------------------------------------------------------------------------


class Card {
    constructor(suit, value, set, faceUp) {
        this.suit = suit;
        this.value = value;
        this.faceUp = faceUp;
        this.set = set;
    }
}

class Sequence {
    constructor(cards) {
        this.sequence = cards;
    }
}

class Stack {
    constructor(cards) {
        this.stack = cards;
    }
}

console.log(shuffledDeck());

function shuffledDeck() {
    return shuffle(sets.map(set => {
        return Suits.flatMap(suit => {
            return Values.map(value => {
                return new Card(suit, value,set, false)
            });
        });
    }));
}


  
function dealCards(decks) {
    for(var i = 0 ; i< decks.length; i++) {

    }
}

class LandingPage extends React.Component {
    render() {
        return (
            <form className={"LandingPage"}>
                <input className="Chose-Name"></input>

                <button className={"vsAI-Hot-join"}>AI Hot-Join</button>
                <button className={"vsAI-Black"}>AI Black-Side</button>
                <button className={"vsAI-Red"}>AI Red-Side</button>
                
                <button className={"vsHuman-Hot-join"}>Human Hot-Join</button>
                <button className={"vsHuman-New"}>Human New Game</button>
                <button className={"vsHuman-Join"}>Human Join Game</button>
            </form>)
    }
}

class NewGame extends React.Component {
    render() {
        return (
            <div className="NewGame">
                <input type ="text" className={"game-Seed"} readOnly ></input>
                <input type="radio" className={"radio-black"}></input>
                <input type="radio" className={"radio-red"}></input>
                <input type="button"className={"game-ready"} value="Ready" disabled = {true}></input> 
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="Game">
                <div className="Player-Side">
                    <div className={"Player-Waste-Stack Stack"}></div>
                    <div className={"Player-Stock-Stack Stack"}></div>
                    <div className={"Player-Malus-Sequence Right Sequence"}></div>
                </div>
                <div className="Stack-Field">
                    <div className={"Left-Stack-Field-One Stack"}></div>
                    <div className={"Left-Stack-Field-Two  Stack"}></div>
                    <div className={"Left-Stack-Field-Three Stack"}></div>
                    <div className={"Left-Stack-Field-Four Stack"}></div>
                    <div className={"Right-Stack-Field-One Stack"}></div>
                    <div className={"Right-Stack-Field-Two Stack"}></div>
                    <div className={"Right-Stack-Field-Three Stack"}></div>
                    <div className={"Right-Stack-Field-Four Stack"}></div>
                </div>
                <div className="Sequence-Field">
                    <div className={"Left-Sequence-Field-One Left Sequence"}></div>
                    <div className={"Left-Sequence-Field-Two Left Sequence"}></div>
                    <div className={"Left-Sequence-Field-Three Left Sequence"}></div>
                    <div className={"Left-Sequence-Field-Four Left Sequence"}></div>
                    <div className={"Right-Sequence-Field-One Right Sequence"}></div>
                    <div className={"Right-Sequence-Field-Two Right Sequence"}></div>
                    <div className={"Right-Sequence-Field-Three Right Sequence"}></div>
                    <div className={"Right-Sequence-Field-Four Right Sequence"}></div>
                </div>
                <div className="Opponent-Side">
                    <div className={"Opponent-Malus-Sequence Left Sequence"}></div>  
                    <div className={"Opponent-Stock-Stack Stack"}></div>
                    <div className={"Opponent-Waste-Stack Stack"}></div>
                </div>
                <div className="Game-info">
                    <div className={"Player-Turn"}></div>
                    <div className={"Time"}></div>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">

                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                </div>
            </div>
        );
    }
}
// =====================================================================================================================

ReactDOM.render(
    <LandingPage />,
    document.getElementById('root')
);


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