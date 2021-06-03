/*
 * Author: Ian Fowler
 * CS 101 Spring 2021
 * Date: May 1st, 2021
 * CP 2: Rectangle game
 * JS for managing dragging circles and game state.
 */

(function () {
  "use strict";
  let draggedCircle;
  let isPlayingGame;

  /* Variables for keeping and displaying score */
  let timeElapsedMs;
  let highScore = 0;
  const TICK = 200;
  const ROUND_DECIMALS = 1;
  let interval;

  /* Values used in derived styles for border and circles */
  const FRAME_BORDER_PIXELS = 3;

  const SHARED_CIRCLE_PROPS = {
    radiusPixels: 16,
    borderWidthPixels: 2,
    topInitialPct: 0.5,
  };

  const CIRCLE_PROPS = [
    {
      ...SHARED_CIRCLE_PROPS,
      leftInitialPct: 0.25,
      id: "circle-a",
    },
    {
      ...SHARED_CIRCLE_PROPS,
      leftInitialPct: 0.75,
      id: "circle-b",
    },
  ];

  // Distance from the circle's left to the center.
  const STYLE_OFFSET =
    FRAME_BORDER_PIXELS +
    SHARED_CIRCLE_PROPS.radiusPixels +
    SHARED_CIRCLE_PROPS.borderWidthPixels;

  /**
   * Updates circles to respond to a dragover event
   * @param {object} e - the dragover event
   */
  function updateCircleLocation(e) {
    const parentRect = id("game-frame").getBoundingClientRect();
    const parentTop = window.pageYOffset + parentRect.top;
    const parentLeft = window.pageXOffset + parentRect.left;
    let newX = e.clientX - STYLE_OFFSET - parentLeft;
    newX = Math.max(newX, -STYLE_OFFSET);
    newX = Math.min(newX, parentRect.width - STYLE_OFFSET);
    let newY = e.clientY - STYLE_OFFSET - parentTop;
    newY = Math.max(newY, -STYLE_OFFSET);
    newY = Math.min(newY, parentRect.height - STYLE_OFFSET);

    draggedCircle.style.left = newX + "px";
    draggedCircle.style.top = newY + "px";
  }

  /**
   * Adds listener callbacks to drag events on draggable objects.
   * These objects are circles. These methods are similar to detecting
   * mouse events, but are more fluid in Safari.
   *
   * Referenced from MDN:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
   */
  function addDragListeners() {
    document.addEventListener("dragstart", function (e) {
      draggedCircle = e.target;
      e.target.classList.add("dragging");

      // Set the drag preview to be invisible
      let elem = document.createElement("div");
      elem.id = "drag-ghost";
      elem.style.position = "absolute";
      document.body.appendChild(elem);
      e.dataTransfer.setDragImage(elem, 0, 0);
    });

    document.addEventListener("dragend", function (e) {
      e.target.classList.remove("dragging");
    });

    document.addEventListener("dragover", function (e) {
      e.preventDefault();
      updateCircleLocation(e);
      drawReaderFrame();
      endGame();
    });
  }

  /**
   * Calculates circle coordinates between which to draw a line and draws the line.
   */
  function drawReaderFrame() {
    const circles = qsa(".circle");
    const getCoord = function (str) {
      return (
        STYLE_OFFSET - SHARED_CIRCLE_PROPS.borderWidthPixels + parseFloat(str)
      );
    };
    const points = [0, 1].map((idx) => {
      return {
        x: getCoord(circles[idx].style.left),
        y: getCoord(circles[idx].style.top),
      };
    });
    drawLine(points[0], points[1]);
  }

  /**
   * Draws a line on the canvas between two points
   * Points have an x and a y Number. Example: {x: 0, y: 30.2};
   * @param {object} p1 - first point in the line
   * @param {object} p2 - second point in the line
   */
  function drawLine(p1, p2) {
    const canvas = id("reader-canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (canvas.getContext) {
      let ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  /**
   * Adds circles to the screen as according to the props
   */
  function initCircles() {
    CIRCLE_PROPS.forEach((props) => {
      let ele = id(props.id);
      const length = props.radiusPixels * 2.0 + "px";
      ele.style.height = length;
      ele.style.width = length;
      ele.style.borderWidth = props.borderWidthPixels + "px";
      const parentWidth = id("game-frame").getBoundingClientRect().width;
      const parentHeight = id("game-frame").getBoundingClientRect().height;
      ele.style.left = parentWidth * props.leftInitialPct - STYLE_OFFSET + "px";
      ele.style.top = parentHeight * props.topInitialPct - STYLE_OFFSET + "px";
    });
    setCircleVisibility(true);
    addDragListeners();
  }

  /**
   * Uses the global time variable to update the scores
   */
  function updateTime() {
    const toSecondStr = (ms) => (ms / 1000).toFixed(ROUND_DECIMALS);
    if (!isPlayingGame) return;
    id("score").innerHTML = `Score: ${toSecondStr(timeElapsedMs)} seconds`;
    if (timeElapsedMs > highScore) {
      highScore = timeElapsedMs;
    }
    id("high-score").innerHTML = `High score: ${toSecondStr(
      highScore
    )} seconds`;
  }

  /**
   * Add the lose message to the DOM, remove scores
   */
  function showLose() {
    let loseP = document.createElement("p");
    loseP.setAttribute("id", "lose-message");
    loseP.innerHTML = "You lose!!!";

    qs("main").appendChild(loseP);
    qs("main").removeChild(id("high-score"));
    qs("main").removeChild(id("score"));
  }

  /**
   * Add the score elements to the DOM, remove lose message
   */
  function showScore() {
    let scoreP = document.createElement("p");
    scoreP.setAttribute("id", "score");
    let highScoreP = document.createElement("p");
    highScoreP.setAttribute("id", "high-score");

    qs("main").appendChild(scoreP);
    qs("main").appendChild(highScoreP);
    const loseButton = id("lose-message");
    if (loseButton) {
      qs("main").removeChild(loseButton);
    }
  }

  /**
   * Set the game state to be started and display scores
   */
  function startGame() {
    isPlayingGame = true;
    timeElapsedMs = 0;
    initCircles();
    drawReaderFrame();
    showScore();
    id("start-button").innerHTML = "Please make it stop";

    interval = setInterval(() => {
      timeElapsedMs += TICK;
      updateTime();
    }, TICK);
  }

  /**
   * Set the game state to be over and display lose message
   */
  function endGame() {
    isPlayingGame = false;
    timeElapsedMs = 0;
    id("start-button").innerHTML = "Play again";
    if (!isPlayingGame && !id("lose-message")) {
      showLose();
    }
    clearInterval(interval);
  }

  /**
   * Hide or shows circles on the screen
   * @param {boolean} isVisible - true if circles should be visible
   */
  function setCircleVisibility(isVisible) {
    let circles = qsa(".circle");
    circles.forEach((circle) => {
      if (isVisible) {
        circle.classList.remove("hidden");
      } else {
        circle.classList.add("hidden");
      }
    });
  }

  /**
   * Initialize game state and configure page elements
   */
  function init() {
    setCircleVisibility(false);
    isPlayingGame = false;
    id("start-button").addEventListener("click", () => {
      isPlayingGame = !isPlayingGame;
      if (isPlayingGame) {
        startGame();
      } else {
        endGame();
      }
    });
    id("game-frame").style.borderWidth = FRAME_BORDER_PIXELS + "px";
  }

  /** ------------------------------ Helper Shorthand Functions ------------------------------ */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if none).
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  init();
})();
