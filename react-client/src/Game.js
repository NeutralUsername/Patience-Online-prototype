import React from 'react';
import socketIOClient from 'socket.io-client';
import ReactDOM from 'react-dom';
import { useDrag, useDrop } from "react-dnd";


export default class Game extends React.Component{
    constructor(props) {
        super(props); 
        this.mounted = false;
        this.state = {
            stacks : this.props.initialstate.stacks,
            redtimer : this.props.initialstate.redtimer,
            blacktimer : this.props.initialstate.blacktimer,
            turntimer : this.props.initialstate.turntimer,
            turncolor : this.props.initialstate.turncolor,
        };
    }

    componentDidMount () {
        this.mounted = true;

        this.props.socket.on("UpdateFieldRES", data => {
            if (this.mounted) {
                this.setState ({stacks : data.stacks });
            }
        });

        this.props.socket.on("UpdateTimerRES", data => {
            if (this.mounted) {
                this.setState ({
                    redtimer : data.redtimer, 
                    blacktimer : data.blacktimer, 
                    turntimer : data.turntimer 
                });
            }
        });

        this.props.socket.on("UpdateTurnColorRES", data => {
            if (this.mounted) {
                this.setState ({turncolor : data.turncolor });
            }
        });
    }

    render(){
        return (
            <div className="game">
                <Stock></Stock>
                <Waste></Waste>
                <Malus></Malus>

                <Foundation></Foundation>
                <Foundation></Foundation>
                <Foundation></Foundation>
                <Foundation></Foundation>
                <Foundation></Foundation>
                <Foundation></Foundation>
                <Foundation></Foundation>
                <Foundation></Foundation>

                <Tableau></Tableau>
                <Tableau></Tableau>
                <Tableau></Tableau>
                <Tableau></Tableau>
                <Tableau></Tableau>
                <Tableau></Tableau>
                <Tableau></Tableau>
                <Tableau></Tableau>

                <Stock></Stock>
                <Waste></Waste>
                <Malus></Malus>
            </div>
        )
    }
} 

class Stock extends React.Component {
    constructor(props) {
        super(props);
    }
}

class Waste extends React.Component {
    constructor(props) {
        super(props);
    }
}

class Malus extends React.Component {
    constructor(props) {
        super(props);
    }
}

class Tableau extends React.Component {
    constructor(props) {
        super(props);
    }
}


class Foundation extends React.Component {
    constructor(props) {
        super(props);
    }
}

function Card () {

}

