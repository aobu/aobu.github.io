const BOARD_SIZE = 12;
const CELL_SIZE = 30;
const NUM_MINES = 30;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

let revealedCells = 0;
let isFirstClick = true;
let minePositions = [];
let visitedCells = [];
let gameOver = false;

let timerInterval;
let elapsedTime = 0;
const maxTime = 9999;

const colorMap = {
    1: '#343434',
    2: '#008c3f',
    3: '#00078c',
    4: '#85008c',
    5: '#bd7e08',
    6: '#cd271c',
    7: '#cd1c9f',
    8: '#FFFFFF',
    default: '#343434'
};

function createBoard() {
    const board = document.getElementById('board');
    if (!board) {
        console.error('Board element not found!');
        return;
    }

    board.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = createCell(row, col);
            board.appendChild(cell);
        }
    }
}

function createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = `cell ${getCellClass(row, col)}`;
    cell.dataset.row = row;
    cell.dataset.col = col;

    cell.addEventListener('click', handleLeftClick);
    cell.addEventListener('contextmenu', handleRightClick);

    return cell;
}

function getCellClass(row, col, revealed = false) {
    const isLight = (row + col) % 2 === 0;
    return revealed ? (isLight ? 'cell-revealed-light' : 'cell-revealed-dark') : (isLight ? 'cell-light' : 'cell-dark');
}

function handleLeftClick(event) {
    if (gameOver) return;

    const cell = event.currentTarget;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.classList.contains('revealed') || cell.textContent === '!') return;

    if (isFirstClick) {
        placeMines(row, col);
        isFirstClick = false;
        startTimer();
    }

    visitedCells = [];
    revealCell(row, col);
}

function handleRightClick(event) {
    event.preventDefault();
    if (gameOver) return;

    const cell = event.currentTarget;

    console.log('Right-clicked cell:', cell);


    if (cell.classList.contains('revealed')) {
        console.log('This cell is already revealed. You cannot flag it.');
        return;
    }

    cell.textContent = cell.textContent === '!' ? '' : '!';
}

function revealCell(row, col) {
    if (isOutOfBounds(row, col) || isVisited(row, col)) return;

    const cell = getCell(row, col);
    if (!cell || cell.classList.contains('revealed')) return;

    markVisited(row, col);

    if (isMine(row, col)) {
        revealMine(cell);
        endGame();
        return;
    }

    revealSafeCell(cell, row, col);
    checkWinCondition();

    const adjacentMines = countAdjacentMines(row, col);
    if (adjacentMines > 0) {
        displayMineCount(cell, adjacentMines);
    } else {
        revealAdjacentCells(row, col);
    }
}

function countAdjacentMines(row, col) {
    let count = 0;
    iterateAdjacentCells(row, col, (newRow, newCol) => {
        if (isMine(newRow, newCol)) count++;
    });
    return count;
}

function revealAdjacentCells(row, col) {
    iterateAdjacentCells(row, col, (newRow, newCol) => {
        revealCell(newRow, newCol);
    });
}

function placeMines(firstClickRow, firstClickCol) {
    const safeZone = getSurroundingCells(firstClickRow, firstClickCol);
    safeZone.push({ row: firstClickRow, col: firstClickCol });

    while (minePositions.length < NUM_MINES) {
        const randRow = getRandomInt(BOARD_SIZE);
        const randCol = getRandomInt(BOARD_SIZE);

        if (!isSafeZone(safeZone, randRow, randCol) && !isMine(randRow, randCol)) {
            minePositions.push({ row: randRow, col: randCol });
        }
    }
}

function revealAllMines() {
    minePositions.forEach(({ row, col }) => {
        const cell = getCell(row, col);
        if (cell && !cell.classList.contains('revealed')) {
            cell.textContent = '◆';
            styleMineCell(cell, row, col);
        }
    });
}

function resetGame() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    revealedCells = 0;
    isFirstClick = true;
    minePositions = [];
    visitedCells = [];
    gameOver = false;

    resetTimer();  //  timer
    createBoard();
}

// util

function isOutOfBounds(row, col) {
    return row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE;
}

function isVisited(row, col) {
    return visitedCells.some(pos => pos.row === row && pos.col === col);
}

function markVisited(row, col) {
    visitedCells.push({ row, col });
}

function isMine(row, col) {
    return minePositions.some(pos => pos.row === row && pos.col === col);
}

function getCell(row, col) {
    return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
}

function revealMine(cell) {
    cell.textContent = '◆';
    revealAllMines();
}

function endGame() {
    gameOver = true;
    stopTimer(); 
}

function revealSafeCell(cell, row, col) {
    // ??
    cell.classList.remove('cell-light', 'cell-dark');
    cell.classList.add('revealed', getCellClass(row, col, true));
    console.log('Revealed cell:', cell);
    revealedCells++;
}

function checkWinCondition() {
    if (revealedCells === TOTAL_CELLS - NUM_MINES) {
        console.log('Win');
        revealAllMines();
        endGame();
    }
}

function displayMineCount(cell, count) {
    cell.textContent = count;
    cell.style.color = getColorForNumber(count);
}

function getColorForNumber(number) {
    return colorMap[number] || colorMap.default;
}

function iterateAdjacentCells(row, col, callback) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
                const newRow = row + i;
                const newCol = col + j;
                if (!isOutOfBounds(newRow, newCol)) {
                    callback(newRow, newCol);
                }
            }
        }
    }
}

function getSurroundingCells(row, col) {
    const cells = [];
    iterateAdjacentCells(row, col, (newRow, newCol) => {
        cells.push({ row: newRow, col: newCol });
    });
    return cells;
}

function isSafeZone(safeZone, row, col) {
    return safeZone.some(pos => pos.row === row && pos.col === col);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function styleMineCell(cell, row, col) {
    const adjacentMines = countAdjacentMines(row, col);
    cell.style.backgroundColor = colorMap[adjacentMines + 1] || colorMap.default;
    cell.style.color = '#FFFFFF';
}

function startTimer() {
    timerInterval = setInterval(() => {
        elapsedTime++;
        if (elapsedTime > maxTime) {
            elapsedTime = maxTime; // cap 9999
        }
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = elapsedTime.toString().padStart(4, '0');
}

document.getElementById('resetButton').addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', createBoard);

