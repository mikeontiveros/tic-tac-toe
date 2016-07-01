game = {

//  control specifies which side has control of the board.
//  -1 = oh, +1 = ex. ex goes first.
    control: 1,

//  dead indicates if the game is over.
    dead: false,

//  Positioning of array indexes 0-8 in 3x3 grid:
//  5 | 0 | 7
//  ---------
//  6 | 4 | 2
//  ---------
//  1 | 8 | 3
//  Winning triples and only winning triples satisfy sum = 12.

//  Populate state with -1 for oh, 0 for empty, 1 for ex.
    state: [0, 0, 0, 0, 0, 0, 0, 0, 0],

};

var restart = document.getElementById('restart');
restart.addEventListener('click', newGame);

var board = document.querySelector(".board");
board.addEventListener('click', function(evt) {
  if (evt.target.classList.contains("cell")) {
    process(evt.target);
  }
});

var cells = document.querySelectorAll(".cell");

var gameLog = document.getElementById('gamelog');

//  winLine()[0] = lowest index in winning line.
//  winLine()[1] = middle index in winning line.
//  Impossible winLine of [0, 0] indicates no winner yet.
function winLine() {

    wL = [0, 0];

//  Nested for loop iterates over all and only winning triples.
    var i, j, LB, UB ;
    for (i = 0; i < 4; i++) {

        LB = Math.max(i + 1, 4 - i);
        UB = Math.floor((13 - i) / 2);

        for (j = LB; j < UB; j++) {

            if (Math.abs(   game.state[i] +
                            game.state[j] +
                            game.state[12 - i - j]  ) == 3) {

//              Found winning line.  Log winner and exit loops.
                wL = [i, j];
                i = 6; j = 6;
            }
        }
    }
        return wL;
}

function newGame() {
    game.control = 1;
    game.dead = false;
    game.state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    clearBoard();
    gameLog.textContent = "X's turn";
}

function clearBoard() {
  for (var k = 0; k < 9; k++) {
    cells[k].textContent = "";
    cells[k].classList.remove("winner");
  }
}

function process(choice) {
    if (choice.textContent == "" && !game.dead) {
        moveOn(choice);
        assessBoard();
    }
}

function moveOn(targetCell) {
    var index = Number(targetCell.id.substring(1));
    game.state[index] = game.control;
    targetCell.textContent = ["O","X"][(1 + game.control) / 2];
}

function assessBoard() {
    if (winLine()[1] !=0) {
        game.dead = true;
        colorWin();
        gameLog.textContent = ["O","X"][(1 + game.control) / 2] + " WINS!";
    } else if (tieGame()) {
        game.dead = true;
        gameLog.textContent = "Tie game.";
    } else {
        game.control = - game.control;
        gameLog.textContent = ["O","X"][(1 + game.control) / 2] + "'s turn."
    }
}

function colorWin() {
    toColor = document.getElementById('c' + winLine()[0]);
    toColor.classList.toggle('winner')

    toColor = document.getElementById('c' + winLine()[1]);
    toColor.classList.toggle('winner')

    toColor = document.getElementById('c' +
                (12 - winLine()[0] - winLine()[1]).toString());
    toColor.classList.toggle('winner')
}

function tieGame() {
    var tie = true;
    for (var i = 0; i < 9; i++) {
        if (game.state[i] == 0) {
            tie = false;
        }
    }
    return tie;
}
