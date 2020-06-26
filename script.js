const canvas = document.querySelector('canvas');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const refreshButton = document.getElementById('refresh');
const randomizeButton = document.getElementById('randomize');

// subtracting 20 because of the margin=10px
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight * 0.85;

const ctx = canvas.getContext('2d');

let cols = 100;
let rows = Math.floor(cols * (canvas.height / canvas.width));
let nodeSize = canvas.width / cols;
let animationID;

let mouse = {
    x: undefined,
    y: undefined
};

startButton.addEventListener('click', () => {
    animation();
});

stopButton.addEventListener('click', () => {
    cancelAnimationFrame(animationID);
});

refreshButton.addEventListener('click', () => {
    cancelAnimationFrame(animationID);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0;
            drawNode(grid, i, j);
        }
    }
});

randomizeButton.addEventListener('click', () => {
    cancelAnimationFrame(animationID);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = Math.random() < 0.5 ? 0 : 1;
            drawNode(grid, i, j);
        }
    }
});

canvas.addEventListener('click', event => {
    mouse.x = event.x;
    mouse.y = event.y;
    let i = Math.floor((mouse.x - 10) / nodeSize);
    let j = Math.floor((mouse.y - 10)/ nodeSize);
    grid[i][j] = 1;
    drawNode(grid, i, j);
});

let create2DArray = function(cols, rows) {
    let array = new Array(cols);
    for (let i = 0; i < cols; i++) {
        array[i] = new Array(rows);
    }
    return array;
}

let countNeighbors = function(grid, i, j) {
    let sum = 0;
    if (i > 0) {
        sum += grid[i-1][j];
    }
    if (i < cols-1) {
        sum += grid[i+1][j];
    }
    if (j > 0) {
        sum += grid[i][j-1];
    }
    if (j < rows-1) {
        sum += grid[i][j+1];
    }
    if (i > 0 && j > 0) {
        sum += grid[i-1][j-1];
    }
    if (i > 0 && j < cols-1) {
        sum += grid[i-1][j+1];
    }
    if (i < cols-1 && j > 0) {
        sum += grid[i+1][j-1];
    }
    if (i < cols-1 && j < rows-1) {
        sum += grid[i+1][j+1];
    }

    return sum;
}

let drawNode = function(grid, i, j) {
    ctx.fillStyle = grid[i][j] ? '#3190C5' : '#B0E1F9';
    ctx.fillRect(i * nodeSize, j * nodeSize, nodeSize, nodeSize);
    ctx.strokeRect(i * nodeSize, j * nodeSize, nodeSize, nodeSize);
}

grid = create2DArray(cols, rows);

for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        grid[i][j] = 0;
        drawNode(grid, i, j);
    }
}

let animation = function() {
    animationID = requestAnimationFrame(animation);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            drawNode(grid, i, j);
        }
    }

    let nextGeneration = create2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (countNeighbors(grid, i, j) == 3) {
                nextGeneration[i][j] = 1;
            } else if (countNeighbors(grid, i, j) < 2 || countNeighbors(grid, i, j) > 3) {
                nextGeneration[i][j] = 0;
            } else {
                nextGeneration[i][j] = grid[i][j];
            }
        }
    }
    grid = nextGeneration;
}