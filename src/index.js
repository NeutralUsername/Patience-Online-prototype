import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DragEvent } from 'react';
import { DragEventHandler } from 'react';

//                                    Constants
//---------------------------------------------------------------------------------------
const Suits = ["♠", "♥", "♦", "♣"];
const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const Sets = ["R", "B"];
var ActiveComponent ="Index"; // Starting Page

//                                      RULES
//---------------------------------------------------------------------------------------
const nrFieldSequenceCards = 3;
const nrMalusCards = 14;

const canThrowOnStock = true;
const canThrowOnWaste = true;
//----------------------------------------------------------------------------------------


console.log(freshDecks());
console.log(ActiveComponent);

function Card(props) {
    this.suit = props.suit;
    this.value = props.value;
    this.set = props.set;
    this.faceUp = props.faceUp;
   
    return (
    <div className={this.suit+' '+this.value+' '+this.set+' '+this.faceUp}> 
        
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

  function freshDecks() {
    return shuffle(Sets.map(set => {
        return Suits.flatMap(suit => {
            return Values. map(value => {
                return (
                    <Card suit={suit} value={value} set={set} faceUp={false}></Card>
                )
            });
        });
    }));
}

function dealCards() {
    for(var deck of freshDecks()) {
        
    }
}

function Index() {
    return (
        <div className={"LandingPage"}>
            <input className="Chose-Name"></input>

            <button className={"vsAI-Hot-join"} onClick={Game} >AI Hot-Join</button>
            <button className={"vsAI-Black"}>AI Black-Side</button>
            <button className={"vsAI-Red"}>AI Red-Side</button>
                
            <button className={"vsHuman-Hot-join"}>Human Hot-Join</button>
            <button className={"vsHuman-New"}>Human New Game</button>
            <button className={"vsHuman-Join"}>Human Join Game</button>
        </div>
    )
}

function NewGame() {
    return (
        <div className="NewGame">
            <input type ="text" className={"game-Seed"} readOnly ></input>
            <input type="radio" className={"radio-black"}></input>
            <input type="radio" className={"radio-red"}></input>
            <input type="button"className={"game-ready"} value="Ready" disabled = {true}></input> 
        </div>
    );
}

class Game extends React.Component {
    ActiveComponent ="Game";
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

