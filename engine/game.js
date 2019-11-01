/*
Add your code for Game here
 */
export default class Game {

    constructor(size) {
        this.size = size;
        this.gameState = {
            board: new Array(size*size).fill(0),
            score: 0,
            won: false,
            over: false
        };
        this.listeners = {'move': [], 'win': [], 'lose': []};
        this.addTile();
        this.addTile();
    }

    addTile() {
        let emptySpots = this.gameState.board.reduce((arr, x, s) => {
            if (x == 0) {
                arr.push(s);
            }
            return arr;
        }, [])
        let pos = Math.floor(Math.random() * emptySpots.length);
        let value = Math.random();
        if (value <= 0.1) {
            value = 4;
        } else {
            value = 2;
        }
        this.gameState.board[emptySpots[pos]] = value;
    }

    setupNewGame() {
        this.gameState = {
            board: new Array(this.size*this.size).fill(0),
            score: 0,
            won: false,
            over: false
        };
        this.addTile();
        this.addTile();
    }

    loadGame(gameState) {
        this.gameState = gameState;
    }

    move(direction) {
        let didMove = false;
        let won = false;
        switch(direction) {
            case 'up':
                for (let i = 0; i < this.size; i++) {
                    let array = new Array(this.size);
                    for (let y = 0; y < this.size; y++) {
                        array[y] = this.gameState.board[i + y*this.size];
                    }
                    let result = this.moveUp(array.slice(0));
                    for (let y = 0; y < this.size; y++) {
                        this.gameState.board[i + y*this.size] = result[y];
                        if (result[y] == 2048) {won = true;}
                    }
                    didMove = didMove || (JSON.stringify(result) != JSON.stringify(array));
                }
                break;
            case 'down':
                for (let i = 0; i < this.size; i++) {
                    let array = new Array(this.size);
                    for (let y = 0; y < this.size; y++) {
                        array[y] = this.gameState.board[i + (this.size-y-1)*this.size];
                    }
                    let result = this.moveUp(array.slice(0));
                    for (let y = 0; y < this.size; y++) {
                        this.gameState.board[i + (this.size-y-1)*this.size] = result[y];
                        if (result[y] == 2048) {won = true;}
                    }
                    didMove = didMove || (JSON.stringify(result) != JSON.stringify(array));
                }
                break;
            case 'left':
                for (let i = 0; i < this.size; i++) {
                    let array = new Array(this.size);
                    for (let x = 0; x < this.size; x++) {
                        array[x] = this.gameState.board[x + i*this.size];
                    }
                    let result = this.moveUp(array.slice(0));
                    for (let x = 0; x < this.size; x++) {
                        this.gameState.board[x + i*this.size] = result[x];
                        if (result[x] == 2048) {won = true;}
                    }
                    didMove = didMove || (JSON.stringify(result) != JSON.stringify(array));
                }
                break;
            case 'right':
                for (let i = 0; i < this.size; i++) {
                    let array = new Array(this.size);
                    for (let x = 0; x < this.size; x++) {
                        array[x] = this.gameState.board[(this.size-x-1) + i*this.size];
                    }
                    let result = this.moveUp(array.slice(0));
                    for (let x = 0; x < this.size; x++) {
                        this.gameState.board[(this.size-x-1) + i*this.size] = result[x];
                        if (result[x] == 2048) {won = true;}
                    }
                    didMove = didMove || (JSON.stringify(result) != JSON.stringify(array));
                }
                break;
        }
        if (didMove) {
            this.addTile();
            this.listeners['move'].forEach(callback => callback(this.gameState));
            if (won && !this.gameState.won) {
                this.gameState.won = true;
                this.listeners['win'].forEach(callback => callback(this.gameState));
            }
            if (!this.isMoveable() && !this.gameState.over) {
                this.gameState.over = true;
                this.listeners['lose'].forEach(callback => callback(this.gameState));
            }
        }
    }

    moveUp(array) {
        let arrayState = new Array(this.size).fill(true);
        for (let i = 0; i < array.length; i++) {
            let x = i;
            let combined = false;
            if (array[x] == 0) {continue;}
            while (x-1 >= 0) {
                if (array[x-1] == 0) {
                    array[x-1] = array[x];
                    array[x] = 0;
                } else if (array[x-1] == array[x] && arrayState[x-1] == true && combined == false) {
                    array[x-1] = array[x]*2;
                    array[x] = 0;
                    arrayState[x-1] = false;
                    combined = true;
                    this.gameState.score += array[x-1];
                } else if (arrayState[x-1] == false) {
                    break;
                }
                x--;
            }
        }
        return array;
    }

    isMoveable() {
        let board = this.gameState.board;
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                let i = x*this.size + y;
                let iUp = (x-1)*this.size + y;
                let iDown = (x+1)*this.size + y;
                let iLeft = x*this.size + y-1;
                let iRight = x*this.size + y+1;
                if (x-1 >= 0 && (board[i] == board[iUp] || board[i] == 0)) {
                    return true;
                }
                if (x+1 < this.size && (board[i] == board[iDown] || board[i] == 0)) {
                    return true;
                }
                if (y-1 >= 0 && board[i] == (board[iLeft] || board[i] == 0)) {
                    return true;
                }
                if (y+1 < this.size && (board[i] == board[iRight] || board[i] == 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    toString() {
        for (let x = 0; x < this.size; x++) {
            let out = "";
            for (let y = 0; y < this.size; y++) {
                out += `[${this.gameState.board[x*this.size + y]}] `;
            }
            // console.log(`${out}\n`);
        }
    }

    onMove(callback) {
        this.listeners['move'].push(callback);
    }

    onWin(callback) {
        this.listeners['win'].push(callback);
    }

    onLose(callback) {
        this.listeners['lose'].push(callback);
    }

    getGameState() {
        return this.gameState;
    }

}