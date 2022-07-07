const {Ship, GameBoard, ComputedPlayer} = require('./index.js');

describe('testing ship function', () => {
    test('testing coordinates of ships', () => {
        const ship1 = Ship(3,[4,5,6]);
        expect(ship1.length).toBe(3);
        expect(ship1.coords).toEqual([4,5,6]);
    });
    test('coords remain same', () => {
        const ship1 = Ship(3,[4,5,6]);
        ship1.hit(4);
        expect(ship1.positionHit).toEqual([4]);
    });
    test('must not hit same coordinates twice', () =>{
        const ship1 = Ship(3,[4,5,6]);
        expect(ship1.hit(5)).toBe(true);
        expect(ship1.hit(5)).toBe(false);
        expect(ship1.positionHit).toEqual([5]);
    });
    test('test isSunk function', () => {
        const ship1 = Ship(3,[4,5,6]);
        expect(ship1.isSunk()).toBe(false);
        ship1.hit(4);
        ship1.hit(5);
        ship1.hit(6);
        expect(ship1.isSunk()).toBe(true);
    });
});

// test will fail on changing function to accept coordinates from user of selectin random coordinates
describe('testing gameBoard function with predefined coordinates of ships', () => {
    const ships = [Ship(4,[12,13,14,15]), Ship(3,[7,8,9]), Ship(3,[67,77,87]), Ship(2,[34,35]), Ship(2,[55,65]),
             Ship(2,[42,52]), Ship(1,[95]), Ship(1,[69]), Ship(1,[38]), Ship(1,[29])];
    let gameBoard1 = GameBoard();
    test('getting hit when attacked at ship coordinate', () => {
        expect(gameBoard1.recieveAttack(12)).toBe("hit");
        expect(gameBoard1.recieveAttack(14)).toBe("hit");
        expect(gameBoard1.recieveAttack(95)).toBe("hit");
    });
    test('getting miss when attacked at empty coordinate', () => {
        expect(gameBoard1.recieveAttack(3)).toBe("miss");
        expect(gameBoard1.recieveAttack(22)).toBe("miss");
        expect(gameBoard1.recieveAttack(88)).toBe("miss");
    });
    test('store missed coordinates', () => {
        expect(gameBoard1.missed).toEqual([3,22,88]);
    });
    test('do not store same coordinate for hit twice', () => {
        expect(gameBoard1.recieveAttack(12)).toBeUndefined();
        expect(gameBoard1.missed).toEqual([3,22,88]);
        expect(gameBoard1.ships[0].positionHit).toEqual([12,14]);
    });
    test('do not store same coordinate for miss twice', () => {
        expect(gameBoard1.recieveAttack(22)).toBeUndefined();
        expect(gameBoard1.missed).toEqual([3,22,88]);
    });

    test('store number of sanked ships', () => {
        gameBoard1.recieveAttack(13);
        gameBoard1.recieveAttack(15);
        expect(gameBoard1.sankedShips).toBe(2);
    });

    test('do not increment sankedShips number for already sankedShip', () => {
        gameBoard1.recieveAttack(69);
        expect(gameBoard1.sankedShips).toBe(3);
        gameBoard1.recieveAttack(69);
        expect(gameBoard1.sankedShips).toBe(3);
    });

    test('allSank function return false for new gameBoard', () => {
        expect(gameBoard1.allSank()).toBe(false);
    });

    test('report if all ships sank', () => {
        ships.forEach( ship => {
            ship.coords.forEach(coord => {
                gameBoard1.recieveAttack(coord);
            });
        });
        expect(gameBoard1.sankedShips).toBe(10);
        expect(gameBoard1.allSank()).toBe(true);
    });
});

describe('computer should not generate same attack twice', () => {
    const mockRandom = jest.fn()
    mockRandom.mockReturnValueOnce(23).mockReturnValueOnce(30).mockReturnValueOnce(30).mockReturnValueOnce(45);
    const player = ComputedPlayer(mockRandom);

    test('create unique attack coordinates', () => {
        expect(player.createAttack()).toBe(23);
        expect(player.createAttack()).toBe(30);
        expect(player.createAttack()).toBe(45);
    });
});
