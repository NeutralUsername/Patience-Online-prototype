import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


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

class Deck  {
    constructor() {
        this.cards =  freshDeck();
    }
}

function freshDeck() {
    const Suits = ["♠", "♥", "♦", "♣"];
    const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const Sets = ["R", "B"];
    return Suits.map(suit => {
        return Values.map(value => {
            return Sets.map(set => {
                return new Card(suit, value, set, false)
            });
        });
    });
}

function shuffle(deck) {
    let currentIndex = deck.length,  randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [deck[currentIndex], deck[randomIndex]] = [
            deck[randomIndex], deck[currentIndex]];
    }
    return deck;
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
            <form className="NewGame">
                <input type ="text" className={"game-Seed"} readOnly ></input>
                <input type="radio" className={"radio-black"}></input>
                <input type="radio" className={"radio-red"}></input>
                <input type="button"className={"game-ready"} value="Ready" disabled = {true}></input> 
            </form>
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
                    <div className={"Left-Stack-Field-One Left Stack"}></div>
                    <div className={"Left-Stack-Field-Two Left Stack"}></div>
                    <div className={"Left-Stack-Field-Three Left Stack"}></div>
                    <div className={"Left-Stack-Field-Four Left Stack"}></div>
                    <div className={"Right-Stack-Field-One Right Stack"}></div>
                    <div className={"Right-Stack-Field-Two Right Stack"}></div>
                    <div className={"Right-Stack-Field-Three Right Stack"}></div>
                    <div className={"Right-Stack-Field-Four Right Stack"}></div>
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

