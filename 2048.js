import Game from "./engine/game.js";

$(document).ready(() => {

    // $('#sizeLabel').empty().html($('#sizeSlider').val());
    // $('#sizeSlider').on('input', () => {$('#sizeLabel').empty().html($('#sizeSlider').val());});
    
    let game = new Game(0);
    setupGame(game);
    $('#newGameBtn').on('click', () => {setupGame(game);});

    $('.modal-close').on('click', (e) => {
        $('.modal').toggleClass('is-active');
    });

    $('.modal-background').on('click', (e) => {
        $('.modal').toggleClass('is-active');
    });

});

let setupGame = (game) => {
    if (game.size != 0) {
        // game.size = parseInt($('#sizeSlider').val());
        game.size = 4;
        game.setupNewGame();
        renderBoard(game.gameState);
        return;
    }
    // game.size = parseInt($('#sizeSlider').val());
    game.size = 4;
    game.setupNewGame();
    // game.loadGame({
        // board: [4, 32, 64, 128, 4, 4, 32, 256, 0, 0, 8, 512, 2, 0, 4, 1024],
        // board: [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 0],
        // score: 1000,
        // won: false,
        // over: false
    // });
    
    game.onMove(handleMove);
    game.onWin(handleWin);
    game.onLose(handleLose);

    renderBoard(game.gameState);

    $(document).on('keydown', function(e) {
        switch(e.which) {
            case 37:
                // console.log("Left");
                game.move('left');
                break;
            case 38:
                // console.log("Up");
                game.move('up');
                break;
            case 39:
                // console.log("Right");
                game.move('right');
                break;
            case 40:
                // console.log("Down");
                game.move('down');
                break;
        }
    });
}

let renderBoard = (gameState) => {
    $('#score').empty().html(gameState.score);
    let board_div = $('#board');
    let gameSize = Math.sqrt(gameState.board.length);
    board_div.empty();
    for (let x = 0; x < gameSize; x++) {
        let row = $('<div class="columns is-centered"></div>');
        for (let y = 0; y < gameSize; y++) {
            let value = gameState.board[x*gameSize + y];
            let tile_div = $(`<div class="column is-1 has-text-centered"><div class="box">&nbsp;</div></div>`);
            if (value != 0) {
                let color_spec = `rgb(255, ${2 / value * 130 + 99}, 99)`;
                tile_div.find('.box').html(value);
                // tile_div.find('.box').css('background-color', color_spec);
                tile_div.find('.box').removeClass().addClass(`box tile-${value}`);
                if (value>2048) {table_div.find('.box').removeClass().addClass('box tile-super');}
            }
            row.append(tile_div);
        }
        board_div.append(row);
    }
}

let handleMove = (gameState) => {
    // console.log(gameState);
    renderBoard(gameState);

    let gameSize = Math.sqrt(gameState.board.length);
    for (let x = 0; x < gameSize; x++) {
        let out = "";
        for (let y = 0; y < gameSize; y++) {
            out += `[${gameState.board[x*gameSize + y]}] `;
        }
        // console.log(`${out}\n`);
    }
}

let handleWin = (gameState) => {
    // console.log(gameState);
    $('#status').html("You Win!!");
    $('.modal').toggleClass('is-active');

    let gameSize = Math.sqrt(gameState.board.length);
    for (let x = 0; x < gameSize; x++) {
        let out = "";
        for (let y = 0; y < gameSize; y++) {
            out += `[${gameState.board[x*gameSize + y]}] `;
        }
        // console.log(`${out}\n`);
    }
}

let handleLose = (gameState) => {
    // console.log(gameState);
    $('#status').html("You Lose!!");
    $('.modal').toggleClass('is-active');

    let gameSize = Math.sqrt(gameState.board.length);
    for (let x = 0; x < gameSize; x++) {
        let out = "";
        for (let y = 0; y < gameSize; y++) {
            out += `[${gameState.board[x*gameSize + y]}] `;
        }
        // console.log(`${out}\n`);
    }
}