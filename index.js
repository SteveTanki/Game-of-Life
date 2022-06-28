const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var animate;
var population = 0
let number = 0
var First_Passthrough = 0

// The time in 'ms' that the code must wait before running the next frame
let speed = 50
// The width and height of each square cell
const resolution = 10;
canvas.width = 800;
canvas.height = 500;
var TotalCells = (canvas.width/resolution) * (canvas.height/resolution)

// Finds the number of columns and rows based on resolution
const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

// Function will create a grid with the relative dimensions and
// fill them with the state declared (1: all dead, 2: 50% alive)
function buildGrid(cellState) { 
  console.log("Build:", cellState)
  return new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(null)
      .map(() => Math.floor(Math.random() * (cellState + 1))));
  }

// Calls function to build the initial clear grid
// and renders the grid on the canvas
let grid = buildGrid(1);
single_FrameUpdate();

function randomise_Grid() {
  First_Passthrough = 0
  grid = buildGrid(1);
  single_FrameUpdate();
}

// Used to show only the next generation of cells
function single_FrameUpdate() {
  console.log("Next Frame")
  grid = nextGen(grid);
  render(grid);
}

// Used to animate the canvas by running through each generation
// and displaying the cell state at a fast rate
function loop_Frames(time) {
  // Function will wait for the difference in time to be the
  // value of speed or greater before generating the next frame
  let diff = time - number;
  if (diff >= speed) {
    document.getElementById("frames").innerHTML = 'FPS: ' + Math.round(1000/diff) + '\xa0\xa0\xa0\xa0|\xa0\xa0\xa0';
    console.log("Time: ", diff)
    number = time
    grid = nextGen(grid);
    document.getElementById("pop").innerHTML = 'Population: ' + population;
    render(grid);
  }

  animate = requestAnimationFrame(loop_Frames);
}

// Acts a toggle for the Run button, 
function run_stop() {
  value = document.getElementById("RunAndStopButton").innerHTML
  console.log(value)
  // If button says 'Run' and grid is not empty, button is toggled
  if (value === "Run" & grid != undefined) {
    requestAnimationFrame(loop_Frames)
    document.getElementById("RunAndStopButton").innerHTML = "Stop";
    return
  }
  // If button says 'Stop', this code will run and toggle the button
  cancelAnimationFrame(animate)
  document.getElementById("RunAndStopButton").innerHTML = "Run";
}

// This function will build an empty grid, render the array,
// and cancel the animation of the loop() function
function clear_grid() {
  console.log("Clear")
  // Create a empty 2D array
  grid = buildGrid(0); 
  render(grid);
  // Switches button from 'Stop' to 'Run' and stops animation
  document.getElementById("RunAndStopButton").innerHTML = "Run";
  if(animate) {
    cancelAnimationFrame(animate)
  }
}
// This function creates a new array with the grid properties of
// the next generation and gives each cell its respective
// state, (0: dead) or (1: alive)
function nextGen(grid) {
  population = 0
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
      population += cell
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

function setRGB(hexRGB) {
  // 'ColorPicker' widget gives a string with format #rrggbb
  light.set_rgb(parseInt(hexRGB.replace('#', '0x'), 16));
  properties.rgb = hexRGB;
  vizibles.update({rgb: properties.rgb});
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
      if (First_Passthrough <= TotalCells) {
        ctx.fillStyle = cell ? '#9898FF' : '#f3f3f3';
        First_Passthrough++
      } else {
        // If cell is "true" or (1) the new fill colour is #9898FF (Light Blue / Purple)
        // If cell is "false" or (2) the new fill colour is #f3f3f3 (Light Grey)
        ctx.fillStyle = cell ? 'rgb(152,152,255, 0.5)' : '#f3f3f3'; 
      }
      ctx.fill();
      ctx.strokeStyle = '#666666'
      ctx.lineWidth = resolution * 0.01;
      ctx.stroke()    }
  }
}