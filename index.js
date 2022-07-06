// create ship with specific length and its coordinates
function Ship(shipLength, coordinates){
    const positionHit = [];
    function hit(n){
        positionHit.push(n);
    }
    function isSunk(){
        return positionHit.length === shipLength;
    }
    return {
        length: () => shipLength,
        coords: () => [...coordinates],
        hit,
        isSunk
    };
}

// GameBoard can recieve attack at a cordinate
 function GameBoard(){
     // hardcoded placement of ships
    ships = [Ship(4,[12,13,14,15]), Ship(3,[7,8,9]), Ship(3,[67,77,87]), Ship(2,[34,35]), Ship(2,[55,65]),
        Ship(2,[42,52]), Ship(1,[95]), Ship(1,[69]), Ship(1,[38]), Ship(1,[29])];
    missed = [];
    sunkedShips = 0;
    // check for hit and miss
    function recieveAttack(n){
        let attacked = checkForHit(n);
        if(attacked === -1) {
            missed.push(n);
            return "miss";
        }else{
            attacked.hit(n);
            if(attacked.isSunk()) sunkedShips++;
            return "hit";
        }
    }
    // checking if any ship present at attacked coordinates
    function checkForHit(n){
        for (let i = 0; i < 10; i++) {
            if(ships[i].coords().includes(n)) return ships[i];
        }
        return -1;
    }
    // checking all ships sanked
    function allSank(){
        return ships.length === sunkedShips;
    }
    return {recieveAttack, allSank, ships};
 }

// create genuine player with its gameBoard
// function RealPlayer(){
//     const gameBoard = GameBoard();
//     return{ gameBoard};
// }

// a computed player has to create random attacks
function ComputedPlayer(){
    const attackedPos = [];
    function randomPosition(){
        return Math.floor(Math.random()*100) + 1;
    }
    function createAttack(){
        let n = randomPosition();
        while(attackedPos.includes(n)){
            n = randomPosition();
        }
        attackedPos.push(n);
        return n;
    }
    return {createAttack};
}
function Game(){
    function createGameBoard(board){
        for (let i = 1; i <= 100; i++) {
            let div = document.createElement('div');
            div.setAttribute('data-coord',i);
            board.appendChild(div);
        }
    }
    function placeShips(board, gameBoard){
        divs = board.querySelectorAll('div');
        for (var i = 0; i < 10; i++) {
            ships[i].coords().forEach((item, i) => {
                divs[item-1].classList.add('ship');
            });
        }
    }
    return {createGameBoard, placeShips};
}
// module.exports = {
//     Ship,
//     GameBoard,
// };
//
// Game loop starts here
const board1 = document.querySelector('.gameBoard1');
const board2 = document.querySelector('.gameBoard2');
const game = Game();
// displaying gameBoard on screnn
game.createGameBoard(board1);
game.createGameBoard(board2);

const gameBoard1 = GameBoard();
const gameBoard2 = GameBoard();
const computer = ComputedPlayer();

// displayig ships on the gameBoard
game.placeShips(board1, gameBoard1);

// responding to attack when user click on board
board2.addEventListener('click', function(e){
    let position = e.target.getAttribute('data-coord');
    let result = gameBoard1.recieveAttack(Number(position));
    e.target.classList.add(result);
});
