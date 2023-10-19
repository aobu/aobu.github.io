const cells = document.querySelectorAll('.cell');
let board = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'X';
const winCondition = [[0, 1, 2],
                      [3, 4, 5],
                      [6, 7, 8],
                      [0, 3, 6],
                      [1, 4, 7],
                      [2, 5, 8],
                      [0, 4, 8],
                      [2, 4, 6]];

const messageElement = document.getElementById('message');
const gridElement = document.getElementById('grid');
const resetButton = document.getElementById('resetButton');

let gameWon = false;

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (!gameWon && !cell.textContent && board[index] === null) {
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);

            if (checkWinCondition()) {
                messageElement.textContent = `Player ${currentPlayer} wins!`;
            } else if (isBoardFull() && !gameWon) {
                messageElement.textContent = "It's a draw!";
            } else {
                currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
                messageElement.textContent = `Player ${currentPlayer}'s Turn`;
            }
        }
    });
});

resetButton.addEventListener('click', () => {
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
        board[index] = null;
    });
    currentPlayer = 'X'; 
    gameWon = false;
    messageElement.textContent = "Player X's Turn";
});

function checkWinCondition() {
    for (const condition of winCondition) {
        const [a, b, c] = condition;
        if (board[a] === board[b] && board[a] === board[c] && board[b] === board[c] && board[a] !== null) {
            gameWon = true;
            return true;
        }
    }
    return false;
}

function isBoardFull() {
    return board.every(cell => cell !== null);
}
