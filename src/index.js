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


class SolitaireApp extends React.Component {
    render() {
        return (
            <input className="Player">

            </input>
        );
    }
}
// ========================================

ReactDOM.render(
    <SolitaireApp />,
    document.getElementById('root')
);
