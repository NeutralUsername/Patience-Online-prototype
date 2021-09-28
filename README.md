![ui game](https://user-images.githubusercontent.com/39095721/134721594-38d153e3-48af-45ae-b75c-bb3c708161d6.JPG)


gregaire is a 2 player solitaire type card game played in alternating turns.

both player have a full standard 52-card-deck.

at the beginning of the game each player deals 20 of his cards in sequential order as the "malus" and 4 x 3 cards as the "tableau".

the starting player is randomly determined.

**WIP**


only one card can be moved at once.

- to move a card on a "tableau" card, the suit colors need to be the opposite of each other and the card to be moved has a lower value by 1. 
if a tableau slot is empty every card can be placed there

- to move a card on a "foundation" card, the suits need to be similar and the card to be moved has a higher value by 1. 
if a foundation slot is empty every card with ace value can be placed there

- to move a card on an opponents "malus" or "waste" card, the suits need to be similar and the card to be moved has a higher OR lower value by 1. 
if either slot is empty, no card can be placed there

_______
install mysql, nodejs; 

create mysql user / password. (default: gregaire / password)



<b>start frontend</b> default port :4000

1) new terminal:

2) cd react-client

3) npm install (first time only)

4) npm start
  

<b>start backend</b> default port :3000

1) new terminal:

2) cd nodejs-server

3) npm install (first time only)

4) npm start
