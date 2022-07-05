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

 function GameBoard(){
     // hardcoded placement of ships
    ships = [Ship(4,[12,13,14,15]), Ship(3,[5,6,7]), Ship(3,[67,77,87]), Ship(2,[34,35]), Ship(2,[45,55]),
        Ship(2,[23,24]), Ship(1,[95]), Ship(1,[69]), Ship(1,[38]), Ship(1,[29])];
    missed = [];
    sunkenShips = 0;
    // check for hit and miss
    function recieveAttack(n){
        let attacked = checkForHit(n);
        if(attacked === -1) {
            missed.push(n);
            return "Miss";
        }else{
            attacked.hit(n);
            if(attacked.isSunk()) sunkenShips++;
            return "Hit";
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
        return ships.length === sunkenShips;
    }
    return {recieveAttack, allSank};
 }

module.exports = {
    Ship,
    GameBoard
};
