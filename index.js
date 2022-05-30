const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var animate;

const resolution = 25;
canvas.width = 750;
canvas.height = 500;
 
// Finds the number of columns and rows based on resolution
const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;
 
// Function will create a grid with the relative dimensions and
// fill them with the state declared (1: all dead, 2: 50% alive)
function buildGrid(cellState) {
  return new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(null)
      .map(() => Math.floor(Math.random() * (cellState + 1))));
  }
// Calls function to build the initial clear grid
// and renders the grid on the canvas
let grid = buildGrid(1);
single_FrameUpdate();
// Used to show only the next generation of cells
function single_FrameUpdate() {
  console.log("single")
  grid = nextGen(grid);
  render(grid);
}
// Used to animate the canvas by running through each generation
// and displaying the cell state at a fast rate
function multi_FrameUpdate() {
  grid = nextGen(grid);
  console.log("multi")
  render(grid);
  animate = requestAnimationFrame(multi_FrameUpdate);
}
 
function clear_grid() {
  grid = buildGrid(0); 
  render(grid);
  if(animate) {
  cancelAnimationFrame(animate)
  }
}
// This function creates a new array with the grid properties of
// the next generation and gives each cell its respective
// state, (0: dead) or (1: alive)
function nextGen(grid) {
  // Copies the entered 2D array to maintain the initial cell states
  // when updating each cell relative to it's neighbours without changing
  // the number of  neighbouring cells of another cell
  const nextGen = [];
  for (let i = 0; i < grid.length; i++)
    nextGen[i] = grid[i].slice();
 
  // This loop goes through each element, and loops back again to check
  // the surrounding 8 cells, if such cell is alive (1) then it is
  // added to the variable "numNeighbours"
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          // If the cell is in the centre, it is ignored as
          // it is not a neighbouring cell
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;
 
          // Ignores any cells outside of the grid edge so
          // the code doesn't try access an undefined value
          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            // Finds the value of the cell at a specific point, (0 or 1)
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }
 
      // Rules & cell state declaration
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}
 
// Renders the grid on the canvas by drawing a small
// square of dimensions declared by the resolution
// for each element in the 2D array
function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
 
      ctx.beginPath();
      // Draws dimensions of square
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      // If cell is "true" or (1) the new fill colour is #9898FF (Light Blue)
      // If cell is "false" or (2) the new fill colour is #f3f3f3 (Light Grey)
      ctx.fillStyle = cell ? '#9898FF' : '#f3f3f3';
      ctx.fill();
      ctx.strokeStyle = '#666666'
      ctx.stroke()
    }
  }
}