//first we need to attach event (submit) listener to the form to get user data

//attach event listeners to each "game box"

//then, intinialize game

//the, we need to check whcch gamemode we're playing

//need to set win condition

//need to determing current player

//after each move, check win conditions and if not men, set other player as active

//human vs human, easy ai, impossibl ai

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const form = document.querySelector("#myForm");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // prevents page from refreshing and losing the user form
  const formData = new FormData(form); // initialize user form data
  const data = Object.fromEntries(formData); // converts user data into an object
  document.querySelector(".modal-wrapper").setAttribute("hidden", true); // hides the form
  // console.log(data);
  initializeGame(data);
});

const initializeVariables = (data) => {
  data.choice = +data.choice; // convert string to a number if it is possible
  //console.log(data);
  // corresponds to the id | this will change the index; for example: data.board([3]) can turn into "X"
  data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  data.player1 = "X";
  data.player2 = "O";
  data.round = 0;
  data.currentPlayer = "X";
  data.gameOver = false;
  // this makes it easier for me to add things later(easy to find) | we'll always have access wherever I put the "data" variable
  // if I wanted to pass any of the data.choice/data.player1 etc., to a function, i would only need to pass the "data" variable
  // the goal is to not use as many global variables
};

const addEventListenerToGameBoard = (data) => {
  document.querySelectorAll(".box").forEach((box) => {
    // loop through each box and adds event listener
    box.addEventListener("click", (event) => {
      playMove(event.target, data); // can be used to mark the gameboard, check win condition, change players etc.,
    });
  });
};

const initializeGame = (data) => {
  adjustDom('displayTurn', `${data.player1Name}'s turn`)
  // initialize game variables
  initializeVariables(data);
  //console.log(data);

  // add event listeners to the gameboard
  addEventListenerToGameBoard(data);
};

const playMove = (box, data) => {
  // is game over? if game over, don't do anything
  if (data.gameOver || data.round > 8) {
    return;
  }
  // check if game box has a letter in it, if so, don't do anything
  if (data.board[box.id] === "X" || data.board[box.id] === "O") {
    return;
  }
  // adjusts the DOM for player move, then check win condition
  data.board[box.id] = data.currentPlayer;
  box.textContent = data.currentPlayer;

  // let className = "player1"
  // if(data.currentPlayer === "O") {
  //     className = "player2"
  // same code below
  // }
  box.classList.add(data.currentPlayer === "X" ? "player1" : "player2"); // changes class name | setting class name, if the current player is "X" then add player1
  // increase the round #
  data.round++;
  //console.log(box, data);

  // check end conditions
  if (endConditions(data)) {
    return;
    // adjust DOM to reflect end condition
  }
  // change current player
  // change the DOM, and change data.currentPlayer
  if (data.choice === 0) {
    changePlayer(data)
  } else if (data.choice === 1) {
    // easy ai
    easyAiMove(data);
    data.currentPlayer = "X"
    // change back to player1
  }

};

const endConditions = (data) => {
  // 3 options,
  // winner
  // tie
  // game not over yet
  if (checkWinner(data)) {
    // adjust the DOM to reflect win
    // display winner name 
    let winnerName = data.currentPlayer === "X" ? data.player1Name : data.player2Name
    adjustDom("displayTurn", winnerName  + " has won the game");
    return true;
  } else if (data.round === 9) {
    adjustDom("displayTurn", "It's a Tie");
    data.gameOver = true;
    // adjust the DOM to reflect tie
    return true;
  }
  return false;
};

const checkWinner = (data) => {
  let result = false;
  // loops over the winningConditions | each condition has 3 indexes
  winningConditions.forEach((condition) => {
    if (
      data.board[condition[0]] === data.board[condition[1]] &&
      data.board[condition[1]] === data.board[condition[2]]
    ) {
      //console.log("player has won");
      data.gameOver = true;
      result = true;
    }
  });
  return result;
};

const adjustDom = (className, textContent) => {
    const elem = document.querySelector(`.${className}`)
    elem.textContent = textContent;
};

// assigning new value to current player
const changePlayer = (data) => {
    data.currentPlayer = data.currentPlayer === "X" ? "O" : "X"; // if currentPlayer is "X", change to "O", otherwise "X"
    // adjust DOM
    let displayTurnText = data.currentPlayer === "X" ? data.player1Name : data.player2Name // if X's turn, display player1Name, otherwise player2Name
    adjustDom('displayTurn', `${displayTurnText}'s turn`)
};

const easyAiMove = (data) => {
    changePlayer(data)
    setTimeout(() => {
    let availableSpaces = data.board.filter((space) => space !== "X" && space !== "O");
    let move = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    data.board[move] = data.player2
    let box = document.getElementById(`${move}`)
    box.textContent = data.player2;
    box.classList.add("player2");
    }, 200)
    if (endConditions(data)) {
        adjustDom("displayTurn", `${data.player2Name} has won the game`)
    }
    changePlayer(data);
    // let randomNumber = Math.floor(math.random() * 9)
    // while (data.board[randomNumber] === "X" || data.board[randomNumber] === "O") {
    //     randomNumber = Math.floor(math.random() * 9)
    // }
}