![ui game](https://user-images.githubusercontent.com/39095721/131256257-0c655946-4b3d-4d20-bbd2-ea65f2614418.JPG)


gregaire is a 2 player solitaire type card game.

it consists of two 52 card decks and is played in alternating turns against each other.

at the beginning of the game each player receives X malus cards. the player that is first able to play all of his malus cards wins.

each turn players try to stack cards from the malus and tableau to the foundation. if no possible move is found the player repeatedly flips the upper most card of his stock and tries to play it. if no possible move is found the card goes to the waste and the turn ends. once the stock card is flipped, no other card can be touched until the card is played.

only one card can be moved at once.
- on the foundation cards are stacked from ace to king with all cards being the same suit (heart 1, heart 2, heart 3,...)
- on the tableau cards are stacked from highest value to lowest with repeating colors (black Q, red J, black 10, red 9,...)
- cards can also be stacked on the opponents malus and waste with alternating colors and the value being 1 higher OR lower (red 8, black 7, red 8, black 9, red 10 ,...)



_______
install mysql, nodejs



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
