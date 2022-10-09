const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");
// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI / 180;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "img/sprite.png"

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// GAME STATE
const state = {
    current: 0, getReady: 0, game: 1, over: 2
}

// START BUTTON COORD
const startBtn = {
    x: 180, y: 394.5, w: 124.5, h: 43.5,
}

// CONTROL THE GAME
cvs.addEventListener("click", function (evt) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {

        switch (state.current) {
            case state.getReady:
                state.current = state.game;
                SWOOSHING.play();
                break;
            case state.game:
                bird.flap();
                FLAP.play();
                break;
        }

    }
});

// BACKGROUND
const bg = {
    sX: 0, sY: 0, w: 412.5, h: 339, x: 0, y: cvs.height - 339,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}

// FOREGROUND
const fg = {
    sX: 414, sY: 0, w: 336, h: 168, x: 0, y: cvs.height - 168,

    dx: 2,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }

}

// BIRD
const bird = {
    animation: [{sX: 414, sY: 168}, {sX: 414, sY: 208.5}, {sX: 414, sY: 246}, {sX: 414, sY: 208.5},],
    x: 75,
    y: 225,
    w: 51,
    h: 39,

    radius: 18,

    frame: 0,

    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0,

    draw: function () {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);

        ctx.restore();
    },

    flap: function () {
        this.speed = -this.jump;
    },

    update: function () {
        this.period = state.current == state.getReady ? 10 : 5;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150;
            this.rotation = 0 * DEGREE;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h / 2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h / 2;
                if (state.current == state.game) {
                    state.current = state.over;
                    DIE.play();
                }
            }

            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
            } else {
                this.rotation = -25 * DEGREE;
            }
        }
    },
    speedReset: function () {
        this.speed = 0;
    }
}

// GET READY MESSAGE
const getReady = {
    sX: 0, sY: 342, w: 259.5, h: 228, x: cvs.width / 2 - 259.5 / 2, y: 120,

    draw: function () {
        if (state.current == state.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// GAME OVER MESSAGE
const gameOver = {
    sX: 262.5, sY: 342, w: 337.5, h: 303, x: cvs.width / 2 - 337.5 / 2, y: 135,

    draw: function () {
        if (state.current == state.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}
const medal = {
    whiteMedal: {sX: 468, sY: 168},
    silverMedal: {sX: 538.5, sY:168},
    goldMedal: {sX: 468, sY: 237},
    bronzeMedal: {sX: 538.5, sY: 237},
    w:66,
    h:66,
    x: 110,
    y: 266,
    draw: function () {
        if(state.current === state.getReady || state.current === state.game) return;
        if (score.value >= 1)  {
            ctx.drawImage(sprite, this.whiteMedal.sX, this.whiteMedal.sY, this.w, this.h,this.x, this.y, this.w, this.h);
        } else if (score.value >= 2)  {
            ctx.drawImage(sprite, this.silverMedal.sX, this.silverMedal.sY, this.w, this.h,this.x, this.y, this.w, this.h);
        } else if (score.value >= 4) {
            ctx.drawImage(sprite, this.goldMedal.sX, this.goldMedal.sY, this.w, this.h,this.x, this.y, this.w, this.h);
        } else if (score.value >= 6) {
            ctx.drawImage(sprite, this.bronzeMedal.sX, this.bronzeMedal.sY, this.w,this.x, this.y, this.w, this.h);
        }
    }

}

// PIPES
const pipes = {
    position: [],

    top: {
        sX: 829.5, sY: 0
    }, bottom: {
        sX: 753, sY: 0

    },

    w: 79.5, h: 600, gap: 150, maxYPos: -225, dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;


            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    },

    update: function () {
        if (state.current !== state.game) return;

        if (frames % 160 == 0) {
            this.position.push({
                x: cvs.width, y: this.maxYPos * (Math.random() + 1)
            });
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let bottomPipeYPos = p.y + this.h + this.gap;

            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                state.current = state.over;
                HIT.play();
            }

            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
                state.current = state.over;
                HIT.play();
            }


            p.x -= this.dx;

            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }

    },

    reset: function () {
        this.position = [];
    }

}

// SCORE
const score = {
    best: parseInt(localStorage.getItem("best")) || 0, value: 0,

    draw: function () {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000"

        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "52.5px Teko";
            ctx.fillText(this.value, cvs.width / 2, 75);
            ctx.strokeText(this.value, cvs.width / 2, 75);

        } else if (state.current == state.over) {
            ctx.font = "37.5px Teko";
            ctx.fillText(this.value, 337.5, 279);
            ctx.strokeText(this.value, 337.5, 279);

            ctx.fillText(this.best, 337.5, 342);
            ctx.strokeText(this.best, 337.5, 342);
        }
    },

    reset: function () {
        this.value = 0;
    }

}

// DRAW
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    medal.draw();
}

// UPDATE
function update() {
    bird.update();
    fg.update();
    pipes.update();
}

// LOOP
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();
 
    
