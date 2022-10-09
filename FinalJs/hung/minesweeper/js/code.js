var board = [];
var rows = 8;
var columns = 8;

var minesCount = 8;
var minesLocation = [];

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

var totalSeconds = 301;
var sound = new Audio("Boom.wav");
window.onload = function () {
    window.addEventListener("contextmenu", e => e.preventDefault());
    startGame();
}

function setMines() {

    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
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
    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
    }
    else {
        flagEnabled = true;
    }
}

function clickTile(e) {
    let tile = this;
    if (gameOver || tile.classList.contains("tile-clicked")) {
        return;
    }
    if (e.button === 2) {

        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    if (e.button === 0) {
        if (tile.innerText == "🚩") {
            return;
        }

        if (minesLocation.includes(tile.id)) {
            document.getElementById("wl").innerHTML = "game over";
            document.getElementById("hidden").click();
            gameOver = true;
            revealMines();
            // alert("you lose");
            return;
        }

        let coords = tile.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        checkMine(r, c);
    }
}

function revealMines() {
    sound.play();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💥";
                tile.style.backgroundColor = "grey";
                tile.classList.add("animation");
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r - 1, c - 1);
    minesFound += checkTile(r - 1, c);
    minesFound += checkTile(r - 1, c + 1);

    minesFound += checkTile(r, c - 1);
    minesFound += checkTile(r, c + 1);

    minesFound += checkTile(r + 1, c - 1);
    minesFound += checkTile(r + 1, c);
    minesFound += checkTile(r + 1, c + 1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString(), "animation");
    }
    else {

        checkMine(r - 1, c - 1);
        checkMine(r - 1, c);
        checkMine(r - 1, c + 1);

        checkMine(r, c - 1);
        checkMine(r, c + 1);

        checkMine(r + 1, c - 1);
        checkMine(r + 1, c);
        checkMine(r + 1, c + 1);
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        document.getElementById("wl").innerHTML = "you are the winner !"
        document.getElementById("hidden").click();
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


function reset() {
    board = [];
    rows = 8;
    columns = 8;
    minesCount = 10;
    minesLocation = [];
    tilesClicked = 0;
    flagEnabled = false;
    gameOver = false;

    let x = document.getElementById("board");
    x.innerHTML = "";
    startGame();
    clearInterval(timerVar);
    totalSeconds = 301;
}

function countTimer() {
    if (!gameOver) {
        --totalSeconds;
        if(totalSeconds==0){
            gameOver = true;
            document.getElementById("wl").innerHTML = "game over";
            document.getElementById("hidden").click();
            revealMines();
            // alert("you lose");
            return;
        }
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