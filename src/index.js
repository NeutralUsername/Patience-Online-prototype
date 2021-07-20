import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//                                    Constants
//---------------------------------------------------------------------------------------
const Suits = ["♠", "♥", "♦", "♣"];
const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const sets = ["R", "B"];


//                                 Changeable Rules
//---------------------------------------------------------------------------------------
const fieldSequenceCards = 3;
const malusSequenceCards = 14;

const canThrowOnMalus = true;
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

class Deck{
    constructor(set) {
        this.cards = Suits.flatMap(suit => {
            return Values.map(value => {
                return new Card(suit, value, set, false)
            });
        });
    }
    shuffle()
    {
        var currentIndex = this.cards.length,  randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [this.cards[currentIndex], this.cards[randomIndex]] = [
            this.cards[randomIndex], this.cards[currentIndex]];
        }
        return this.cards;
    }
}

class PlayerBlack{
    constructor()
    {
        this.deck = new Deck("B").shuffle();
        console.log(this.deck);
    }
}

class PlayerRed{
    constructor()
    {
        this.deck = new Deck("R").shuffle();
        console.log(this.deck);
    }
}

new PlayerBlack();
new PlayerRed();

var cards = {a :new Card(), b: new Card() }
class Field{
    constructor()
    {
        this.BlackSequenceOne = cards;
        this.BlackSequenceTwo = cards;
        this.BlackSequenceThree = cards;
        this.BlackSequenceFour = cards;

        this.RedSequenceOne = cards;
        this.RedSequenceTwo = cards;
        this.RedSequenceThree = cards;
        this.RedSequenceFour = cards;

        this.stackOne = null;
        this.stackTwo = null;
        this.stackThree = null;
        this.stackFour = null;
        this.stackFive = null;
        this.stackSix = null;
        this.stackSeven = null;
        this.stackEight = null;
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

            </div>
        );
    }
}
// =====================================================================================================================

ReactDOM.render(
    <LandingPage />,
    document.getElementById('root')
);

