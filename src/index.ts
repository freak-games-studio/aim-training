//@ts-nocheck
import {splashScreen} from './splash-screen'
import "@/style.scss";

const startButton = document.querySelector("#start");
const screens = document.querySelectorAll(".screen");
const timeList = document.querySelector("#time-list");
const timeEl = document.querySelector("#time");
const board = document.querySelector("#board");
let time = 0;
let score = 0;
let intervalId; // Variable to store setInterval ID


splashScreen.init()
splashScreen.onInit(() => {
main()
})

function main() {
    startButton.addEventListener("click", (e) => {
        e.preventDefault();
        screens[0].classList.add("up");
    });

    timeList.addEventListener("click", (e) => {
        if (e.target.classList.contains("time-btn")) {
            time = parseInt(e.target.getAttribute("data-time"));
            screens[1].classList.add("up");
            startGame();
        }
    });

    board.addEventListener("click", (e) => {
        if (e.target.classList.contains("circle")) {
            score++;
            e.target.remove();
            createRandomCircle();
        }
    });

    function startGame() {
        score = 0; // Reset score
        timeEl.parentNode.classList.remove("hide"); // Show time counter
        board.innerHTML = ''; // Clear game board
        createRandomCircle();
        intervalId = setInterval(decreaseTime, 1000); // Store interval ID
        setTime(time);
    }

    function decreaseTime() {
        if (time === 0) {
            finishGame();
        } else {
            let current = --time;
            if (current < 10) {
                current = `0${current}`;
            }
            setTime(current);
        }
    }

    function setTime(value) {
        timeEl.innerHTML = `00:${value}`;
    }

    function finishGame() {
        clearInterval(intervalId); // Clear interval
        timeEl.parentNode.classList.add("hide");
        board.innerHTML = `<div>
        <h1>Score: <span class="primary">${score}</span></h1>
        <button id="restart" class="time-btn">Restart</button>
       </div>`;
        const restartButton = document.querySelector("#restart");
        restartButton.addEventListener("click", restartGame);
    }

    function restartGame() {
        screens[1].classList.remove("up");
        // screens[0].classList.remove("up");
        board.innerHTML = ''; // Clear game board
        time = 0; // Reset time
        score = 0; // Reset score
    }

    function createRandomCircle() {
        const circle = document.createElement("div");
        const size = getRandomNumber(20, 60);
        const {width, height} = board.getBoundingClientRect();
        const x = getRandomNumber(0, width - size);
        const y = getRandomNumber(0, height - size);
        circle.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        circle.classList.add("circle");
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.top = `${y}px`;
        circle.style.left = `${x}px`;
        circle.style.position = "absolute";
        circle.style.border = "1px solid black";
        board.append(circle);
    }

    function getRandomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}

