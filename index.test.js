const {Ship, GameBoard} = require('./index.js');

describe('testing ship function', () => {
    test('ship length always remian same', () => {
        const ship1 = Ship(3,[4,5,6]);
        expect(ship1.length()).toBe(3);
        ship1.hit(4);
        expect(ship1.length()).toBe(3);
    });
    test('coords remain same', () => {
        const ship1 = Ship(3,[4,5,6]);
        expect(ship1.coords()).toEqual([4,5,6]);
        ship1.hit(4);
        expect(ship1.coords()).toEqual([4,5,6]);
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
    test('getting hit when attacked at ship coordinate', () => {
        let gameBoard1 = GameBoard();
        expect(gameBoard1.recieveAttack(14)).toBe("Hit");
    });
    test('getting miss when attacked at empty coordinate', () => {
        let gameBoard1 = GameBoard();
        expect(gameBoard1.recieveAttack(3)).toBe("Miss");
    });
    test('allSank function return false for new gameBoard', () => {
        let gameBoard1 = GameBoard();
        expect(gameBoard1.allSank()).toBe(false);
    })
});
