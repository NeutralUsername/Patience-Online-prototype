
![ui game](https://user-images.githubusercontent.com/39095721/133003090-fb23adb0-8ef3-4128-bc73-e435564c5b9c.JPG)


gregaire is a 2 player solitaire type card game.

it consists of two 52 card decks and is played in alternating turns against each other.

at the beginning of the game each player receives X malus cards. the player that is first able to play all of his malus cards wins.

each turn players try to stack cards from the malus and tableau to the foundation. if no possible move is found the player repeatedly flips the upper most card of his stock and tries to play it. if no possible move is found the card goes to the waste and the turn ends.

only one card can be moved at once.

- on the foundation cards are stacked from ace to king with all cards being the same suit (heart 1, heart 2, heart 3,...)
- on the tableau cards are stacked from highest to lowest value with repeating colors (black Q, red J, black 10, red 9,...)
- cards can also be stacked on the opponents malus and waste with the same suit and colors and the value being 1 higher or lower (spades 3, spades 2, spades 3, spades 4,....)



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
