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
    let set = new Set();
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 5-i; j++) {
            let coords = createCoords(i, takenCoords);
            ships.push(new Ship(i, coords));
            takenCoords = [...takenCoords, ...coords];
        }
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
    return ships;
}

// GameBoard can recieve attack at a cordinate
 function GameBoard(ships){
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
                     // updateDisplayBoard(attacked.length);
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
function ComputedPlayer(){
    const attackedPos = [];
    const values = {
        0:1,
        1:-1,
        2:10,
        3:-10
    }
    const last4moves = [];
    let m = 0;
    // let player = 'user';

    function createAttack(){
        for(let i = 0; i< 4; i++){
            let temp = getIntelligentHit();
            if(temp && !attackedPos.includes(temp)){
                attackedPos.push(temp);
                 return temp;
             }
             storeAttack('miss');
        }
        let n = randomPosition();
        while(attackedPos.includes(n)){
            n = randomPosition();
        }
        attackedPos.push(n);
        return n;
    }
    function getIntelligentHit(){
        if((attackedPos.length > 0) && (last4moves.length> 0)){
             if(last4moves[last4moves.length - 1] === 'hit'){
                 return (attackedPos[attackedPos.length - 1] + Number(values[m]));
            }
            if(last4moves.includes('hit')){
                m =( m+1)%4;
                return (attackedPos[attackedPos.length - 1] + Number(values[m]));
            }
        }
        return false;
    }
    function randomPosition(){
        return Math.floor(Math.random()*100) + 1;
    }

    function storeAttack(s){
        last4moves.push(s);
        if(last4moves.length > 4) last4moves.shift();
    }
    return {createAttack, storeAttack};
}

function Game(){
    const computer = ComputedPlayer();
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

        if(result){
            if(currentGameBoard === playerGameBoard) computer.storeAttack(result);
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



// Game loop starts here
// const withPlayer = document.querySelector('.withPlayer');
// const withComputer = document.querySelector('.withComputer');

// const computerdisplayBoard = document.querySelector('.ships.computer');
// const playerdisplayBoard = document.querySelector('.ships.player');

// const board1 = document.querySelector('.gameBoard1');
// const board2 = document.querySelector('.gameBoard2');
// const heading = document.querySelector('h1');
//
// const computerGameBoard = GameBoard(createShips());
// const playerGameBoard = GameBoard(createShips());
//
// const game = Game();
// // displaying gameBoard on screnn
// game.createGameBoard(board1);
// game.createGameBoard(board2);
//
// // displayig ships on the gameBoard
// game.placeShips(board1, playerGameBoard);
//
// // responding to attack when user click on board
// game.activatePlayer()

///////////////////////////////////////////////////////

// board 1 => playerGameBoard (place ships according to player game board) => recieve attack from player 2 (computer)
// board 2 => computerGameBoard (place ships according to computer game board) => recieve attack from player 1 (user)

const withPlayer = document.querySelector('.withPlayer');
const withComputer = document.querySelector('.withComputer');
const cover = document.querySelector('.cover');

const board1 = document.querySelector('.gameBoard1');
const board2 = document.querySelector('.gameBoard2');
const heading = document.querySelector('h1');

const game = Game();
game.createGameBoard(board1);
const divs = board1.querySelectorAll('div');

const computerGameBoard = GameBoard(createShips());
let playerGameBoard;

withComputer.addEventListener('click', function(){
    cover.style.display = 'none';
});

withPlayer.addEventListener('click', function(){
    cover.style.display = 'none';
});

let takenCoords = [];
const lengths = [4,3,3,2,2,2,1,1,1,1];
let n = 1;
shipNum = 0;
let coords = [];
const ships = [];
const shipType = {
    4:'Carrier Ship',
    3:'BattleShip',
    2:'Submarine',
    1:'Petrol Boat'
};

const horizontal = document.querySelector('.horizontal');
const vertical = document.querySelector('.vertical');

horizontal.addEventListener('click', () => n = 1);
vertical.addEventListener('click',() => n = 10);

board1.addEventListener('mouseover', showPossibleCoords);
board1.addEventListener('mouseout', hidePossibleCoords);
board1.addEventListener('click', placeShip);

heading.textContent = 'Place your '+ shipType[lengths[shipNum]];

function showPossibleCoords(e){
    coords = [];
    let pos = Number(e.target.getAttribute('data-coord'));

    for(let i = 0; i < lengths[shipNum]; i++){
        coords.push(pos + (n*i));
    }

    if(!validateCoords()) return;

    coords.forEach(i => {
        divs[i - 1].classList.add('hovered');
    });
}

function hidePossibleCoords(){
    if(!coords || !validateCoords()) return;
    coords.forEach(i => {
        divs[i - 1].classList.remove('hovered');
    });
}

function placeShip(){
    if(!validateCoords()) return;
    ships.push(new Ship(coords.length, coords));

    coords.forEach(i => {
        divs[i - 1].classList.add('ship');
    });
    takenCoords = [...takenCoords, ...coords];
    shipNum++;
    heading.textContent = 'Place your '+ shipType[lengths[shipNum]];
    if(shipNum === 10) startGame();
}

function validateCoords(){
    if(coords.some(i => takenCoords.includes(i))) return false;
    let x = parseInt(coords[0]/10);
    let y = coords[0]%10;
    if(y === 0){
        x--;
        y = 10;
    }
    if((n === 1) && (y > (10 - coords.length + 1))) return false;
    if((n === 10) && (x > (10 - coords.length))) return false;
    return true;
}

function startGame(){
    board1.removeEventListener('mouseover', showPossibleCoords);
    board1.removeEventListener('mouseout', hidePossibleCoords);
    board1.removeEventListener('click', placeShip);
    horizontal.parentElement.style.display = 'none';

    playerGameBoard = new GameBoard(ships);
    game.createGameBoard(board2);
    game.activatePlayer();
}
// module.exports = {
//     Ship,
//     GameBoard,
//     ComputedPlayer,
//     createCoords,
//     createShips,
//     validateCoords
// };
