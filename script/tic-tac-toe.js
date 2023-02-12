const statusDisplay = document.querySelector('.status');

let gameActive = true;
let currentPlayer;
let gameState = ["", "", "", "", "", "", "", "", ""];
let PlayerOScore = 0;
let PlayerXScore = 0;
let DrawScore = 0;

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
const cells = document.querySelectorAll('.cell');

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
/*function findWinningCombo() {
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
for (const combination of winningConditions) {
    const [a,b,c] = combination;

    if(this.gameBoard[a] && (this.gameBoard[a] === this.gameBoard[b] && this.gameBoard[a] === this.gameBoard[c])){
        return combination;
}
}
return null;
}
*/
  
function PickRandomPlayer() {
    if (Math.random() < 0.5){
        currentPlayer = "X";
    }
    else {
        currentPlayer = "O";
    }
    statusDisplay.innerHTML = currentPlayerTurn();
    console.log("Starting Player is :" + currentPlayer)
}
PickRandomPlayer()


function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    if(CheckWin()){ // Calling Our CheckWin Function
        let winCondition = winningConditions.find(condition=> {  //Find the Winning Combo
            return gameState[condition[0]] === currentPlayer && 
                   gameState[condition[1]] === currentPlayer && 
                   gameState[condition[2]] === currentPlayer;
        });

        winCondition.forEach(index => {  //Once Found, Make them Green.
            cells[index].style.backgroundColor = 'green';
        });
        console.log("The Winning Combination is " + winCondition);
    }
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    console.log("It is now " + currentPlayer + " turn.")
}

function UpdateStatusBar() {
    document.getElementById("Oscore").innerHTML = "Player 'O': " + PlayerOScore + " |";
    document.getElementById("Xscore").innerHTML = "Player 'X': " + PlayerXScore + " |";
    document.getElementById("Turn").innerHTML = "Turn:  " + currentPlayer + " |";
    document.getElementById("Draw").innerHTML = "Draws:  " + DrawScore + " |";
}

function CheckWin() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        IncreasePoints()
        UpdateStatusBar()
        console.log("The Winner of this round is " + currentPlayer);
        return roundWon;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        DrawScore += 1;
        UpdateStatusBar()
        console.log("Game has ended in a Draw!");
        return roundDraw;
    }

}

function IncreasePoints(){
    if(currentPlayer === "X"){
        PlayerXScore += 1;
        console.log("Player X has Gained 1 Point");
        console.log("Player X has a Total of " + PlayerXScore + " points.");
    }
    else if(currentPlayer === "O"){
        PlayerOScore += 1;
        console.log("Player O has Gained 1 Point");
        console.log("Player O has a Total of " + PlayerOScore + " points.");
    }
    
}

function handleResultValidation() {
    
    if (gameActive) {
        handlePlayerChange();
        handleComputerMove();
        CheckWin();
    }
}

function handleComputerMove() {
    ChooseMove()
    if (!CheckWin()){
        handlePlayerChange()
    }
}

function ChooseMove() {
    while (true) {
        var m = Math.floor(Math.random() * 8)
        if (gameState[m]=='') // Looking for Empty Spot
            break;
    }
    //m is the spot computer is moving
    gameState[m] = currentPlayer
    document.getElementById(m).innerHTML = currentPlayer
    //document.querySelectorAll('.cell').getAttributeNode(m).value = currentPlayer


}

/*function UpdateWinnerBoard(game)
{
    const winningConditions = game.findWinningCombo();

    for (let i = 0; i < game.gameBoard.length; i++) {
        const tile = this.root.querySelector(`.cell[data-cell-index="${i}"]`);


        tile.classList.add("cell--Winner");
        tile.textContent = game.gameBoard[i];

        if (winningConditions && winningConditions.includes(i)) {
            tile.classList.add("cell--Winner");
        }
    }
}
*/
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.style.backgroundColor = "transparent";
    })

    statusDisplay.style.color = "rgb(65, 65, 65)";
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    PickRandomPlayer()
    UpdateStatusBar()
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.restart').addEventListener('click', handleRestartGame);