// create ship with specific length and its coordinates
function Ship(shipLength, coordinates){
    function hit(n){
        if(this.positionHit.includes(n)) return false
        this.positionHit.push(n);
        return true;
    }
    function isSunk(){
        return this.positionHit.length === this.length;
    }
    return {
        length: shipLength,
        coords: coordinates,
        hit,
        isSunk,
        positionHit: []
    };
}

function createShips(){
    let takenCoords = [];
    let ships = [];
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 5-i; j++) {
            let coords = createCoords(i, takenCoords);
            ships.push(new Ship(i, coords));
            takenCoords = [...takenCoords, ...coords];
        }
    }
    return ships;
}

function createCoords(length, takenCoords) {
    let temp = [];
    while(true){
        let pos = randomCoord(length);

        temp = [];
        for (let i = 0; i <length; i++) {
            temp.push(pos + i);
        }
        if(!temp.some(n => takenCoords.includes(n))) break;

        temp = [];
        for (let i = 0; i <length; i++) {
            temp.push(pos + (10*i));
        }
        if(!temp.some(n => takenCoords.includes(n))) break;
    }
    return temp;
}

function randomCoord(length){
    let x = Math.floor(Math.random() * (10 - length)) + 1;
    let y = Math.floor(Math.random() * (10 - length + 1)) + 1;
    return (x*10 + y);
}

// GameBoard can recieve attack at a cordinate
 function GameBoard(ships){
     // hardcoded placement of ships
    // let ships = [Ship(4,[12,13,14,15]), Ship(3,[7,8,9]), Ship(3,[67,77,87]), Ship(2,[34,35]), Ship(2,[55,65]),
    //     Ship(2,[42,52]), Ship(1,[95]), Ship(1,[69]), Ship(1,[38]), Ship(1,[29])];
    let missed = [];
    let sankedShips = 0;
    // check for hit and miss
    function recieveAttack(n){
        let attacked = checkForHit(n);
        if(attacked === -1) {
            if(this.missed.includes(n)) return;
            this.missed.push(n);
            return "miss";
        }else{
            if(!attacked.hit(n)) return;
                if(attacked.isSunk()){
                     this.sankedShips++;
                 }
                return "hit";
        }
    }
    // checking if any ship present at attacked coordinates
    function checkForHit(n){
        for (let i = 0; i < 10; i++) {
            if(ships[i].coords.includes(n)){
                return ships[i];
            }
        }
        return -1;
    }
    // checking all ships sanked
    function allSank(){
        return this.ships.length === this.sankedShips;
    }
    return {recieveAttack, allSank, ships, missed, sankedShips};
 }

// computed player has to create random attacks
function ComputedPlayer(randomPosition){
    const attackedPos = [];
    let player = 'user';

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

function randomPosition(){
    return Math.floor(Math.random()*100) + 1;
}

function Game(){
    const computer = ComputedPlayer(randomPosition);
    let winner;

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
            gameBoard.ships[i].coords.forEach((item, n) => {
                divs[item-1].classList.add('ship');
            });
        }
    }
    function start(e){
        // user's chance
        play(e.target, computerGameBoard);
        if(winner) return;
        deactivatePlayer();

        // computer's chance
        let choice = computer.createAttack();
        let divs = board1.querySelectorAll('div');
        setTimeout(function(){
            play(divs[choice-1], playerGameBoard);
            if(winner) return;
            activatePlayer();
        }, 500);
    }
    function play(clickedDiv, currentGameBoard){
        let position = clickedDiv.getAttribute('data-coord');
        let result = currentGameBoard.recieveAttack(Number(position));

        if(result) {
            clickedDiv.classList.add(result);
            // check for win
            if(currentGameBoard.allSank()){
                winner = currentGameBoard === computerGameBoard ? 'Player': 'Computer';
                gameOver();
                return;
            };
        }
    }
    function deactivatePlayer(){
        heading.textContent = "Computer's turn";
        board2.classList.remove('active');
        board1.style.opacity = '1';
        board2.style.opacity = '.6';
        board2.removeEventListener('click', start);
    }

    function activatePlayer(){
        heading.textContent = "Player's turn";
        board2.classList.add('active');
        board1.style.opacity = '.6';
        board2.style.opacity = '1';
        board2.addEventListener('click', start);
    }

    function gameOver(){
        deactivatePlayer();
        board1.style.opacity = '.6';
        heading.textContent = winner + ' Wins!';
    }
    return {createGameBoard, placeShips, activatePlayer, winner};
}
// module.exports = {
//     Ship,
//     GameBoard,
//     ComputedPlayer,
//     createCoords,
//     createShips,
// };

// Game loop starts here

const board1 = document.querySelector('.gameBoard1');
const board2 = document.querySelector('.gameBoard2');
const heading = document.querySelector('h1');

const computerGameBoard = GameBoard(createShips());
const playerGameBoard = GameBoard(createShips());

const game = Game();
// displaying gameBoard on screnn
game.createGameBoard(board1);
game.createGameBoard(board2);

// displayig ships on the gameBoard
game.placeShips(board1, playerGameBoard);

// responding to attack when user click on board
game.activatePlayer()
