const bombLocation = []
const everyButtonVar = []
let totalLand
let totalBomb
const location0 = []
const preLocation0 = []
const nearBombLocation = [];
var shakingElements = [];
const ob = []
let resetYet = true;
const even = []
const odd = []
let q = 0;
let stopPlay = false;
let flags
window.addEventListener("contextmenu", e => e.preventDefault());

const click = new Audio()
click.src = "Sounds/click.wav"
click.volume = 0.5
const lose = new Audio()
lose.src = "Sounds/lose.mp3"
const win = new Audio()
win.src = "Sounds/win.mp3"
const pop = new Audio()
pop.src = "Sounds/pop.wav"
const start = new Audio()
start.src = "Sounds/start.wav"

function randomBombLocation(u) {
    let repeated = false;
    for (let a = 0; a < u; a++) {
        let m = Math.floor(Math.random() * (ob[0][0])) + 1;
        let n = Math.floor(Math.random() * (ob[0][0])) + 1;
        let bomb = [m,n]
        for (let i = 0; i < bombLocation.length; i++) {
            if (bombLocation[i].length === bomb.length && bombLocation[i].every(function(value, index) { return value === bomb[index]})) {
                repeated = true
            }
        }
        bombLocation.push(bomb);
    }
    if (repeated === true) {
        bombLocation.length = 0
        randomBombLocation(ob[0][0] * ob[0][1])
    }
}

var shake = function (element, magnitude = 16, angular = false) {
    var tiltAngle = 1;
    var counter = 1;
    var numberOfShakes = 15;
    var startX = 0,
        startY = 0,
        startAngle = 0;
    var magnitudeUnit = magnitude / numberOfShakes;
    var randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    if(shakingElements.indexOf(element) === -1) {
        shakingElements.push(element);
        if(angular) {
            angularShake();
        } else {
            upAndDownShake();
        }
    }

    function upAndDownShake() {
        if (counter < numberOfShakes) {
            element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';
            magnitude -= magnitudeUnit;
            var randomX = randomInt(-magnitude, magnitude);
            var randomY = randomInt(-magnitude, magnitude);
            element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
            counter += 1;
            requestAnimationFrame(upAndDownShake);
        }
        if (counter >= numberOfShakes) {
            element.style.transform = 'translate(' + startX + ', ' + startY + ')';
            shakingElements.splice(shakingElements.indexOf(element), 1);
        }
    }
    function angularShake() {
        if (counter < numberOfShakes) {
            console.log(tiltAngle);
            element.style.transform = 'rotate(' + startAngle + 'deg)';
            magnitude -= magnitudeUnit;
            var angle = Number(magnitude * tiltAngle).toFixed(2);
            console.log(angle);
            element.style.transform = 'rotate(' + angle + 'deg)';
            counter += 1;
            tiltAngle *= -1;
            requestAnimationFrame(angularShake);
        }
        if (counter >= numberOfShakes) {
            element.style.transform = 'rotate(' + startAngle + 'deg)';
            shakingElements.splice(shakingElements.indexOf(element), 1);
        }
    }
};

function reset() {
    stopTimer()
    resetTimer()
    document.getElementById("myTable").innerHTML = "";
    bombLocation.length = 0
    everyButtonVar.length = 0
    location0.length = 0
    preLocation0.length = 0
    nearBombLocation.length = 0
    ob.length = 0
    resetYet = true
    q = 0
    stopPlay = false
    lose.pause();
    lose.currentTime = 0;
    win.pause();
    win.currentTime = 0;
    sec -= 1
    document.getElementById("flags").innerText = ""
}

function myLoop() {
    setTimeout(function() {
        let idOfButton = bombLocation[q][0] + "-" + bombLocation[q][1];
        document.getElementById(idOfButton).textContent = "⚫"
        document.getElementById(idOfButton).style.fontSize = "20px"
        document.getElementById(idOfButton).style.paddingTop = "5px"
        document.getElementById(idOfButton).style.display = "flex"
        document.getElementById(idOfButton).style.justifyContent = "center"
        pop.play()
        let bombNumberColor = Math.floor(Math.random() * 6)
        if (bombNumberColor === 0) {
            document.getElementById(idOfButton).style.background = "red"
        } else if (bombNumberColor === 1) {
            document.getElementById(idOfButton).style.background = "blue"
        } else if (bombNumberColor === 2) {
            document.getElementById(idOfButton).style.background = "cyan"
        } else if (bombNumberColor === 3) {
            document.getElementById(idOfButton).style.background = "orange"
        } else if (bombNumberColor === 4) {
            document.getElementById(idOfButton).style.background = "purple"
        } else {
            document.getElementById(idOfButton).style.background = "green"
        }
        q++;
        if (q < bombLocation.length) {
            shake(document.getElementById("mainTable"));
            myLoop();
        } else {
            setTimeout(function () {
                lose.play()
                document.getElementById("hidden").click()
            }, 1000)
        }
    }, Math.floor(Math.random() * 300) + 200)
}

let hr = 0;
let min = 0;
let sec = 0;
let stoptime = true;

function startTimer() {
    if (stoptime === true) {
        stoptime = false;
        timerCycle();
    }
}
function stopTimer() {
    if (stoptime === false) {
        stoptime = true;
    }
}

function timerCycle() {
    if (stoptime === false) {
        setTimeout(function() {
            sec = parseInt(sec);
            min = parseInt(min);
            hr = parseInt(hr);

            sec = sec + 1;

            if (sec === 60) {
                min = min + 1;
                sec = 0;
            }
            if (min === 60) {
                hr = hr + 1;
                min = 0;
                sec = 0;
            }

            if (sec < 10 || sec === 0) {
                sec = '0' + sec;
            }
            if (min < 10 || min === 0) {
                min = '0' + min;
            }
            if (hr < 10 || hr === 0) {
                hr = '0' + hr;
            }
            document.getElementById('stopwatch').innerText =  "🕰️ " + hr + ":" + min + ":" + sec;
            timerCycle();
        }, 1000)
    }
}

function resetTimer() {
    document.getElementById('stopwatch').innerHTML = "🕰️ 00:00:00";
    stoptime = true;
    hr = 0;
    sec = 0;
    min = 0;
}

function minesweeper(o, b) {
    if (resetYet) {
        start.play()
        resetYet = false
        ob.push([o,b])
        totalLand = o * o - (o * b);
        totalBomb = o * b;
        flags = totalBomb
        document.getElementById("flags").innerText = "🚩 " + flags
        console.log(totalLand, totalBomb)
        for (let i = 1; i < o + 1; i++) {
            if (i % 2) {
                odd.push(i)
            } else {
                even.push(i)
            }
        }

        randomBombLocation(o * b)
        startTimer()
        let table = document.createElement('table');
        table.id = "mainTable"
        for (let j = 1; j < o + 1; j++) {
            let tr = document.createElement('tr');
            for (let i = 1; i < o + 1; i++) {
                let td = document.createElement('td');
                td.style.height = "40px"
                let button = document.createElement("button");
                button.style.border = "none";
                button.style.width = "40px"
                button.style.height = "40px"
                button.style.padding = "0"
                button.style.contain = "strict"
                button.style.overflow = "hidden"
                button.style.verticalAlign = "middle";
                for (let k = 0; k < even.length; k++) {
                    if (i === even[k]) {
                        for (let f = 0; f < odd.length; f++) {
                            if (j === odd[f]) {
                                button.style.backgroundColor = "#aad751"
                            }
                        }
                        for (let f = 0; f < even.length; f++) {
                            if (j === even[f]) {
                                button.style.backgroundColor = "#9cc946"
                            }
                        }
                    }
                }
                for (let k = 0; k < odd.length; k++) {
                    if (i === odd[k]) {
                        for (let f = 0; f < even.length; f++) {
                            if (j === even[f]) {
                                button.style.backgroundColor = "#aad751"
                            }
                        }
                        for (let f = 0; f < odd.length; f++) {
                            if (j === odd[f]) {
                                button.style.backgroundColor = "#9cc946"
                            }
                        }
                    }
                }
                button.id = i + "-" + j;
                const buttonVar = {
                    location: [i,j],
                    nearBomb: 0,
                    color: false,
                    flagON: false
                }
                button.addEventListener('contextmenu', function () {
                    click.play()
                    if (!stopPlay) {
                        if (!buttonVar.flagON) {
                            if (flags !== 0) {
                                buttonVar.flagON = true
                                if (!buttonVar.color) {
                                    flags -= 1
                                    document.getElementById("flags").innerText = "🚩 " + flags
                                    this.style.fontSize = "25px"
                                    this.innerText = "🚩"
                                    if (buttonVar.isBomb) {
                                        totalBomb -= 1
                                        console.log(totalBomb)
                                        if (totalBomb === 0 && totalLand === 0) {
                                            win.play()
                                            document.getElementById("timeEnd").innerText = document.getElementById("stopwatch").innerText
                                            document.getElementById("wl").innerText = "🎆 You Win! 🎆"
                                            document.getElementById("hidden").click()
                                            stopPlay = true;
                                            stopTimer()
                                        }
                                    }
                                }
                            }
                        } else {
                            if (!buttonVar.color) {
                                buttonVar.flagON = false
                                this.innerText = ""
                                this.style.fontSize = "25px"
                                flags += 1
                                document.getElementById("flags").innerText = "🚩 " + flags
                                buttonVar.flagON = falwse
                                if (buttonVar.isBomb) {
                                    totalBomb += 1
                                    console.log(totalBomb)
                                }
                            }
                        }
                    }
                });
                button.addEventListener('click', function () {
                    if (stopPlay === false) {
                        click.play()
                        if (!buttonVar.flagON) {
                            let bombON = false;
                            for (let i = 0; i < bombLocation.length; i++) {
                                let stringLocation = bombLocation[i].toString()
                                if (buttonVar.location == stringLocation) {
                                    bombON = true;
                                    stopPlay = true;
                                    stopTimer()
                                    myLoop();
                                    document.getElementById("timeEnd").innerText = document.getElementById("stopwatch").innerText
                                    document.getElementById("wl").innerText = "⚠ You Lose! ⚠"

                                }
                            }
                            if (!bombON && !buttonVar.color) {
                                if (buttonVar.nearBomb === 0) {
                                    for (let k = 0; k < even.length; k++) {
                                        if (buttonVar.location[0] === even[k]) {
                                            for (let f = 0; f < odd.length; f++) {
                                                if (buttonVar.location[1] === odd[f]) {
                                                    this.style.backgroundColor = "#e5c29f"
                                                }
                                            }
                                            for (let f = 0; f < even.length; f++) {
                                                if (buttonVar.location[1] === even[f]) {
                                                    this.style.backgroundColor = "#d7b899"
                                                }
                                            }
                                        }
                                    }
                                    for (let k = 0; k < odd.length; k++) {
                                        if (buttonVar.location[0] === odd[k]) {
                                            for (let f = 0; f < even.length; f++) {
                                                if (buttonVar.location[1] === even[f]) {
                                                    this.style.backgroundColor = "#e5c29f"
                                                }
                                            }
                                            for (let f = 0; f < odd.length; f++) {
                                                if (buttonVar.location[1] === odd[f]) {
                                                    this.style.backgroundColor = "#d7b899"
                                                }
                                            }
                                        }
                                    }
                                    this.textContent = ""
                                    this.style.fontSize = null;
                                    this.style.display = "inline"
                                    for (i = buttonVar.location[0] - 1; i < buttonVar.location[0] + 2; i++) {
                                        for (j = buttonVar.location[1] - 1; j < buttonVar.location[1] + 2; j++) {
                                            if (i < 1 || j < 1 || i > o || j > o) {
                                            } else {
                                                let myObj = everyButtonVar.find(obj => obj.id == i + "," + j)
                                                if (myObj.nearBomb === 0) {
                                                    let idOfButton = myObj.location[0] + "-" + myObj.location[1];
                                                    location0.push(myObj.location)
                                                    document.getElementById(idOfButton).textContent = ""
                                                    document.getElementById(idOfButton).style.fontSize = null
                                                    document.getElementById(idOfButton).style.display = "inline"
                                                    for (let k = 0; k < even.length; k++) {
                                                        if (i === even[k]) {
                                                            for (let f = 0; f < odd.length; f++) {
                                                                if (j === odd[f]) {
                                                                    document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                }
                                                            }
                                                            for (let f = 0; f < even.length; f++) {
                                                                if (j === even[f]) {
                                                                    document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                }
                                                            }
                                                        }
                                                    }
                                                    for (let k = 0; k < odd.length; k++) {
                                                        if (i === odd[k]) {
                                                            for (let f = 0; f < even.length; f++) {
                                                                if (j === even[f]) {
                                                                    document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                }
                                                            }
                                                            for (let f = 0; f < odd.length; f++) {
                                                                if (j === odd[f]) {
                                                                    document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                }
                                                            }
                                                        }
                                                    }
                                                    myObj.color = true
                                                    totalLand -= 1
                                                    console.log(totalLand)
                                                } else {
                                                    let notSame = true
                                                    for (let z = 0; z < nearBombLocation.length; z++) {
                                                        if (nearBombLocation[z] === myObj.location) {
                                                            notSame = false
                                                        }
                                                    }
                                                    if (notSame) {
                                                        let idOfButton = myObj.location[0] + "-" + myObj.location[1];
                                                        document.getElementById(idOfButton).textContent = myObj.nearBomb
                                                        if (myObj.nearBomb === 1) {
                                                            document.getElementById(idOfButton).style.color = "blue"
                                                        } else if (myObj.nearBomb === 2) {
                                                            document.getElementById(idOfButton).style.color = "green"
                                                        } else if (myObj.nearBomb === 3) {
                                                            document.getElementById(idOfButton).style.color = "red"
                                                        } else if (myObj.nearBomb === 4) {
                                                            document.getElementById(idOfButton).style.color = "purple"
                                                        } else if (myObj.nearBomb === 5) {
                                                            document.getElementById(idOfButton).style.color = "cyan"
                                                        } else if (myObj.nearBomb === 6) {
                                                            document.getElementById(idOfButton).style.color = "white"
                                                        } else if (myObj.nearBomb === 7) {
                                                            document.getElementById(idOfButton).style.color = "yellow"
                                                        } else if (myObj.nearBomb === 8) {
                                                            document.getElementById(idOfButton).style.color = "orange"
                                                        }
                                                        document.getElementById(idOfButton).style.fontSize = null
                                                        document.getElementById(idOfButton).style.display = "inline"
                                                        document.getElementById(idOfButton).style.justifyContent = "center"
                                                        for (let k = 0; k < even.length; k++) {
                                                            if (i === even[k]) {
                                                                for (let f = 0; f < odd.length; f++) {
                                                                    if (j === odd[f]) {
                                                                        document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                    }
                                                                }
                                                                for (let f = 0; f < even.length; f++) {
                                                                    if (j === even[f]) {
                                                                        document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        for (let k = 0; k < odd.length; k++) {
                                                            if (i === odd[k]) {
                                                                for (let f = 0; f < even.length; f++) {
                                                                    if (j === even[f]) {
                                                                        document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                    }
                                                                }
                                                                for (let f = 0; f < odd.length; f++) {
                                                                    if (j === odd[f]) {
                                                                        document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        totalLand -= 1
                                                        console.log(totalLand)
                                                        myObj.color = true
                                                        nearBombLocation.push(myObj.location)
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    for (let i = 0; i < location0.length; i++){
                                        if (location0[i] === buttonVar.location) {
                                            preLocation0.push(location0[i])
                                            location0.splice(i, 1);
                                        }
                                    }

                                    let notSame = true
                                    while (location0.length !== 0) {
                                        for (let k = 0; k < preLocation0.length; k++) {
                                            if (preLocation0[k] === location0[0]) {
                                                notSame = false
                                            }
                                        }
                                        if (notSame) {
                                            preLocation0.push(location0[0])
                                            for (i = preLocation0[preLocation0.length - 1][0] - 1; i < preLocation0[preLocation0.length - 1][0] + 2; i++) {
                                                for (j = preLocation0[preLocation0.length - 1][1] - 1; j < preLocation0[preLocation0.length - 1][1] + 2; j++) {
                                                    if (i < 1 || j < 1 || i > o || j > o) {
                                                    } else {
                                                        let myObj = everyButtonVar.find(obj => obj.id == i + "," + j)
                                                        if (myObj.nearBomb === 0) {
                                                            let notSame = true
                                                            for (let l = 0; l < preLocation0.length; l++) {
                                                                for (let m = 0; m < location0.length; m++) {
                                                                    if (preLocation0[l] === myObj.location || location0[m] === myObj.location) {
                                                                        notSame = false
                                                                    }
                                                                }
                                                            }
                                                            if (notSame) {
                                                                location0.push(myObj.location)
                                                                let idOfButton = myObj.location[0] + "-" + myObj.location[1];
                                                                document.getElementById(idOfButton).textContent = ""
                                                                document.getElementById(idOfButton).style.fontSize = null
                                                                document.getElementById(idOfButton).style.display = "inline"
                                                                document.getElementById(idOfButton).style.justifyContent = "center"
                                                                for (let k = 0; k < even.length; k++) {
                                                                    if (i === even[k]) {
                                                                        for (let f = 0; f < odd.length; f++) {
                                                                            if (j === odd[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                            }
                                                                        }
                                                                        for (let f = 0; f < even.length; f++) {
                                                                            if (j === even[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                for (let k = 0; k < odd.length; k++) {
                                                                    if (i === odd[k]) {
                                                                        for (let f = 0; f < even.length; f++) {
                                                                            if (j === even[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                            }
                                                                        }
                                                                        for (let f = 0; f < odd.length; f++) {
                                                                            if (j === odd[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                myObj.color = true
                                                                totalLand -= 1
                                                                console.log(totalLand)
                                                            }
                                                        } else {
                                                            let notSame = true
                                                            for (let z = 0; z < nearBombLocation.length; z++) {
                                                                if (nearBombLocation[z] === myObj.location) {
                                                                    notSame = false
                                                                }
                                                            }
                                                            if (notSame) {
                                                                let idOfButton = myObj.location[0] + "-" + myObj.location[1];
                                                                document.getElementById(idOfButton).textContent = myObj.nearBomb
                                                                if (myObj.nearBomb === 1) {
                                                                    document.getElementById(idOfButton).style.color = "blue"
                                                                } else if (myObj.nearBomb === 2) {
                                                                    document.getElementById(idOfButton).style.color = "green"
                                                                } else if (myObj.nearBomb === 3) {
                                                                    document.getElementById(idOfButton).style.color = "red"
                                                                } else if (myObj.nearBomb === 4) {
                                                                    document.getElementById(idOfButton).style.color = "purple"
                                                                } else if (myObj.nearBomb === 5) {
                                                                    document.getElementById(idOfButton).style.color = "cyan"
                                                                } else if (myObj.nearBomb === 6) {
                                                                    document.getElementById(idOfButton).style.color = "white"
                                                                } else if (myObj.nearBomb === 7) {
                                                                    document.getElementById(idOfButton).style.color = "yellow"
                                                                } else if (myObj.nearBomb === 8) {
                                                                    document.getElementById(idOfButton).style.color = "orange"
                                                                }
                                                                document.getElementById(idOfButton).style.fontSize = null
                                                                document.getElementById(idOfButton).style.display = "inline"
                                                                for (let k = 0; k < even.length; k++) {
                                                                    if (i === even[k]) {
                                                                        for (let f = 0; f < odd.length; f++) {
                                                                            if (j === odd[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                            }
                                                                        }
                                                                        for (let f = 0; f < even.length; f++) {
                                                                            if (j === even[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                for (let k = 0; k < odd.length; k++) {
                                                                    if (i === odd[k]) {
                                                                        for (let f = 0; f < even.length; f++) {
                                                                            if (j === even[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#e5c29f"
                                                                            }
                                                                        }
                                                                        for (let f = 0; f < odd.length; f++) {
                                                                            if (j === odd[f]) {
                                                                                document.getElementById(idOfButton).style.backgroundColor = "#d7b899"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                totalLand -= 1
                                                                console.log(totalLand)
                                                                myObj.color = true
                                                                nearBombLocation.push(myObj.location)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        location0.shift()
                                    }
                                } else {
                                    for (let k = 0; k < even.length; k++) {
                                        if (buttonVar.location[0] === even[k]) {
                                            for (let f = 0; f < odd.length; f++) {
                                                if (buttonVar.location[1] === odd[f]) {
                                                    this.style.backgroundColor = "#e5c29f"
                                                }
                                            }
                                            for (let f = 0; f < even.length; f++) {
                                                if (buttonVar.location[1] === even[f]) {
                                                    this.style.backgroundColor = "#d7b899"
                                                }
                                            }
                                        }
                                    }
                                    for (let k = 0; k < odd.length; k++) {
                                        if (buttonVar.location[0] === odd[k]) {
                                            for (let f = 0; f < even.length; f++) {
                                                if (buttonVar.location[1] === even[f]) {
                                                    this.style.backgroundColor = "#e5c29f"
                                                }
                                            }
                                            for (let f = 0; f < odd.length; f++) {
                                                if (buttonVar.location[1] === odd[f]) {
                                                    this.style.backgroundColor = "#d7b899"
                                                }
                                            }
                                        }
                                    }
                                    this.textContent = buttonVar.nearBomb
                                    this.style.fontSize = null;
                                    this.style.display = "inline"
                                    if (buttonVar.nearBomb === 1) {
                                        this.style.color = "blue"
                                    } else if (buttonVar.nearBomb === 2) {
                                        this.style.color = "green"
                                    } else if (buttonVar.nearBomb === 3) {
                                        this.style.color = "red"
                                    } else if (buttonVar.nearBomb === 4) {
                                        this.style.color = "purple"
                                    } else if (buttonVar.nearBomb === 5) {
                                        this.style.color = "cyan"
                                    } else if (buttonVar.nearBomb === 6) {
                                        this.style.color = "white"
                                    } else if (buttonVar.nearBomb === 7) {
                                        this.style.color = "yellow"
                                    } else if (buttonVar.nearBomb === 8) {
                                        this.style.color = "orange"
                                    }
                                    totalLand -= 1
                                    console.log(totalLand)
                                    buttonVar.color = true
                                    nearBombLocation.push(buttonVar.location)
                                }
                            }
                            if (totalBomb === 0 && totalLand === 0) {
                                win.play()
                                document.getElementById("timeEnd").innerText = document.getElementById("stopwatch").innerText
                                document.getElementById("wl").innerText = "🎆 You Win! 🎆"
                                document.getElementById("hidden").click()
                                stopPlay = true;
                                stopTimer()
                            }
                        }
                    }
                    buttonVar.color = true;
                });
                for (let i = 0; i < bombLocation.length; i++) {
                    let c = bombLocation[i][0];
                    let d = bombLocation[i][1];
                    for (let i = c - 1; i < c + 2; i++) {
                        for (let j = d - 1; j < d + 2; j++) {
                            if (!i < 1 && !j < 1) {
                                i.toString()
                                j.toString()
                                if (buttonVar.location == i + "," + j) {
                                    for (let i = 0; i < bombLocation.length; i++) {
                                        let stringLocation = bombLocation[i].toString()
                                        if (buttonVar.location == stringLocation) {
                                            buttonVar.isBomb = true;
                                        }
                                    }
                                    buttonVar.nearBomb += 1
                                }
                            }
                        }
                    }
                }
                buttonVar.id = i + "," + j
                everyButtonVar.push(buttonVar)
                td.appendChild(button);
                tr.appendChild(td);
            }
            table.prepend(tr)
        }
        document.getElementById("myTable").appendChild(table);
        console.log(bombLocation,"BL");
        shake(document.getElementById("mainTable"));
    }
}