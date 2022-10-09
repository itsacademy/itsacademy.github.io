var board = [];
var rows = 8;
var columns = 8;
var minesCount = 8;
var minesLocation = [];
var tilesClicked = 0;
var flagEnabled = false;
var gameOver = false;
let hr = 0;
let min = 0;
let sec = 0;
var totalSeconds = 0;
var timerVar;
var audio = new Audio("./sound/mixkit-high-tech-bleep-confirmation-2520.wav");
var resetgame = new Audio("./sound/mixkit-tech-break-fail-2947.wav")
var gameOvermus = new Audio("./sound/GHS4XWR-game-over-cartoon-4.mp3")
var winnerMusic = new Audio ("./sound/JKL83NH-video-game-win.mp3")



window.onload = function () {
    window.addEventListener("contextmenu", e => e.preventDefault());
    // startGame();
}

function easy() {
    audio.play();
    rows=7;
    columns=7;
    minesCount=8;

    let board = document.getElementById("board");
    board.style.width= "356px";
    board.style.height= "356px";
    reset();
}
function medium() {
    audio.play();
    rows=8;
    columns=8;
    minesCount=12;
    let board = document.getElementById("board");
    board.style.width= "404px";
    board.style.height= "404px";
    reset();
}
function hard() {
    audio.play();
    rows=9;
    columns=9;
    minesCount=16;

    let board = document.getElementById("board");
    board.style.width= "452px";
    board.style.height= "452px";
    reset();
}
function setMines() {
    let mineLeft = minesCount;
    while (mineLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            mineLeft -= 1;
        }
    }
}
function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    setMines();
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("mousedown", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    timerVar = setInterval(countTimer, 1000);

}
function countTimer() {

    if (!gameOver) {
        ++totalSeconds;
        var hour = Math.floor(totalSeconds / 3600);
        var minute = Math.floor((totalSeconds - hour * 3600) / 60);
        var seconds = totalSeconds - (hour * 3600 + minute * 60);
        if (hour < 10)
            hour = "0" + hour;
        if (minute < 10)
            minute = "0" + minute;
        if (seconds < 10)
            seconds = "0" + seconds;
        document.getElementById("timer").innerHTML = "🕰️ " + hour + ":" + minute + ":" + seconds;
    }
}

function clickTile(e) {
   
    let tile = this;
    if (e.button === 0) {
        console.log("left")
        if (tile.innerText == "🚩") {
            return;
        }
        if (gameOver || this.classList.contains("tile-clicked")) {
            return;
        }

        if (minesLocation.includes(tile.id)) {
            // alert("Game Over");
            document.getElementById("wl").innerHTML = "game over";
            document.getElementById("hidden").click();

            gameOver = true;
            gameOvermus.play();
            revealMines();
            return;
        }
        let coords = tile.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        checkMines(r, c);

    }
    if (e.button === 2) {
        console.log("right")

        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

}
function checkMines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;
    let mineFound = 0;

    mineFound += checkTile(r - 1, c - 1); // top left
    mineFound += checkTile(r - 1, c); // top
    mineFound += checkTile(r - 1, c + 1); // top right
    mineFound += checkTile(r, c - 1); // left
    mineFound += checkTile(r, c + 1); // right
    mineFound += checkTile(r + 1, c - 1); // bottom left
    mineFound += checkTile(r + 1, c); // bottom
    mineFound += checkTile(r + 1, c + 1); // bottom right

    if (mineFound > 0) {
        board[r][c].innerText = mineFound;
        board[r][c].classList.add("x" + mineFound.toString());
    } else {
        checkMines(r - 1, c - 1); // top left
        checkMines(r - 1, c); // top
        checkMines(r - 1, c + 1); // top right
        checkMines(r, c - 1); // left
        checkMines(r, c + 1); // right
        checkMines(r + 1, c - 1); // bottom left
        checkMines(r + 1, c); // bottom
        checkMines(r + 1, c + 1); // bottom right
    }
    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "clear";
        document.getElementById("wl").innerHTML = "you are the winner !"
        document.getElementById("hidden").click();
        winnerMusic.play();
        gameOver = true;
    }
}
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "❌";
                tile.classList.add("bombColor");
            }
        }
    }
}
function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";

    }
}
function reset() {
    resetgame.play();

    let x = document.getElementById("board");
    x.innerHTML = "";
    gameOver = false;
    board = [];
    minesLocation = [];
    flagEnabled = false;
    tilesClicked = 0;
    startGame();
    totalSeconds = 0;
    hour = 0;
    minute = 0;
    seconds = 0;
    clearInterval(timerVar);

}