# Battleship
Remember that battleship game we used to play as kids, wanna play it against computer.

## Table of Contents
+ [General Info](#general-info)
+ [Skills](#skills)
+ [Setup](#setup)
+ [Demo](#demo)
+ [Features](#features)
+ [Sources](#sources)

## General Info
This is primarily a javascript project. You can place your 10 ships (1 Carrier ship, 2 Battleships, 3 Submariens and 4 Petrol Boats)
on the game board. Once all ships are positioned, the game starts and you need to attact the other board (computer's board) by guessing where ships might be as you cannot see your opponent's ships. You and the computer alternatively get chance to hit each other's board. Each hit is marked as red and miss is marked as yellow. First player to sink all the ships ofhis/her opponent wins.

## Skills
+ Factory functions
+ DOM manipulation
+ Jest (javascript testing library)

## Setup
To run this project locally,
```
# clone this repository
git clone https://github.com/Tanishka-2000/battleship.git

# go into repository
cd battleship

# install dependencies
npm install

# To run test
npm run test
```

## Demo
You can play battleship yourself on [https://tanishka-2000.github.io/battleship/](https://tanishka-2000.github.io/battleship/)

## Features
+ You can place your ships as you like, either horizontally or vertically using buttons on top of the game board.
+ You cannot see the opponent's board's ships and have to guess their position to attack.
+ Each hit is marked as red.
+ Each miss is marked as yellow.
+ Computer makes intelligent guess, based on the previous guesses.
+ Once the player has sank all the ships of opponent, the player wins.
+ All functions are tested using jest.

## Sources
+ Wikipedia link for the battleship is [here](https://en.wikipedia.org/wiki/Battleship_(game))
+ You can also play an online version of battleship [here](http://en.battleship-game.org/)