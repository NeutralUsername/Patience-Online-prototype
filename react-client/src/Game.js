import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';

export default class Game extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            red : {
                drawpile : 'stack',
                discardpile : 'stack',
                malussequence : 'sequence',
            },
            black : {
                drawpile : 'stack',
                discardpile : 'stack',
                malussequence : 'sequence',
            },
            field : {
                foundation1 : 'stack',
                foundation2 : 'stack',
                foundation3 : 'stack',
                foundation4 : 'stack',
                foundation5 : 'stack',
                foundation6 : 'stack',
                foundation7 : 'stack',
                foundation8 : 'stack',
                tableau1 : 'sequence',
                tableau2 : 'sequence',
                tableau3 : 'sequence',
                tableau4 : 'sequence',
                tableau5 : 'sequence',
                tableau6 : 'sequence',
                tableau7 : 'sequence',
                tableau8 : 'sequence',
            },
            timer : {}
        };
    }
    render(){
        return (
            <div className="game">
                <Player  ></Player>
                <Opponent  ></Opponent>
                <Field  ></Field>
            </div>
        )
    }
} 

function Player (props) {
    var deck = freshDeck();
    return (
        <div className="player">
            <Stack></Stack>
            <Stack></Stack>
            <Sequence></Sequence>
        </div>
    )
}

function Opponent (props) {
    var deck = freshDeck();
    return (
        <div className="opponent">
            <Stack></Stack>
            <Stack></Stack>
            <Sequence></Sequence>
        </div>
    )
}

function Field (props) {
    return (
        <div className="field">
            <Stacks></Stacks>
            <Sequences></Sequences>
        </div>
    )
}

function Stacks (props) {
    return (
        <div className="stacks">
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
        <div className="sequences">
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

