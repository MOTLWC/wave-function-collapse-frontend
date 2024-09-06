// Global Vars that seem to work so far 
const sides = [null,]

const tilesToFill = []

const canvasRef = []

let outputWidth = 0
let outputHeight = 0

// Cell Constructor
function Cell(imageData, bitmap, row, column) {
  this.bitmap = bitmap;
  this.imageData = imageData;
  this.derivedFrom = [row, column]
  this.top = 0;
  this.right = 0;
  this.bottom = 0;
  this.left = 0;

  this.getSides = function () {
    const tempSidesArray = [];
    tempSidesArray.push(String(this.imageData.data.slice(0, 12)));
    tempSidesArray.push(String(this.imageData.data.slice(8, 12)) + "," + String(this.imageData.data.slice(20, 24)) + "," + String(this.imageData.data.slice(32, 36)))
    tempSidesArray.push(String(this.imageData.data.slice(24, 36)))
    tempSidesArray.push(String(this.imageData.data.slice(0, 4)) + "," + String(this.imageData.data.slice(12, 16)) + "," + String(this.imageData.data.slice(24, 28)))
    tempSidesArray.forEach((side, index) => {
      if (sides.indexOf(side) === -1) {
        sides.push(side)
      }
      switch (index) {
        case (0):
          this.top = sides.indexOf(side);
          break;
        case (1):
          this.right = sides.indexOf(side);
          break;
        case (2):
          this.bottom = sides.indexOf(side);
          break;
        case (3):
          this.left = sides.indexOf(side);
          break;
      }
    })
  }

}

function PossibleCells(OriginalCell) {
  this.origin = OriginalCell
  this.frequency = 0
  // Will store them in imageData as it is the Chad storage method
  this.possibleOrientaions = []

  function getMatrix(imageData, imageDataWidth, imageDataHeigth) {
    const matrix = []
    for (let y = 0; y < imageDataHeigth; y++) {
      const row = []
      for (let x = 0; x < imageDataWidth; x++) {
        row.push([
          imageData[(((y * imageDataWidth) + x) * 4)],
          imageData[(((y * imageDataWidth) + x) * 4) + 1],
          imageData[(((y * imageDataWidth) + x) * 4) + 2],
          imageData[(((y * imageDataWidth) + x) * 4) + 3]
        ])
      }
      matrix.push(row)
    }
    return matrix
  }

  this.addToPO = function (matrixArray) {
    matrixArray.forEach((matrix) => {
      const returnArray = []
      matrix.forEach((row) => {
        row.forEach((bit) => {
          returnArray.push(...bit)
        })
      })
      this.possibleOrientaions.push(returnArray)
    })
  }

  this.getMirror = async function () {
    const imageData = this.origin.imageData.data
    const imageDataWidth = this.origin.imageData.width
    const imageDataHeigth = this.origin.imageData.height
    const matrix = getMatrix(imageData, imageDataWidth, imageDataHeigth)

    const flippedValues = []
    // Get the Horizontal Flip
    const horFlipArray = matrix.map((row) => {
      return [...row].reverse()
    })
    flippedValues.push(horFlipArray)

    // Get the Vertical Flip
    const verFlipArray = [...matrix].reverse()
    flippedValues.push(verFlipArray)

    this.addToPO(flippedValues)
  }
  this.getRotations = function () {
    const imageData = this.origin.imageData.data
    const imageDataWidth = this.origin.imageData.width
    const imageDataHeigth = this.origin.imageData.height
    const matrix = getMatrix(imageData, imageDataWidth, imageDataHeigth)

    const rotatedValues = []
    // Get 90 Degrees
    rotatedValues.push([[matrix[2][0], matrix[1][0], matrix[0][0]], [matrix[2][1], matrix[1][1], matrix[0][1]], [matrix[2][2], matrix[1][2], matrix[0][2]]])
    // Get 180 Degrees
    rotatedValues.push([...matrix].map((row) => {
      return [...row].reverse()
    }).reverse()
    )

    // Get 270 Degrees
    rotatedValues.push(rotatedValues[0].map((row) => {
      return [...row].reverse()
    }).reverse()
    )
    this.addToPO(rotatedValues)
  }
}

function CellRelation(sideDirection, sidePattern, newCellId) {
  this.side = sideDirection;
  this.sideValue = sidePattern;
  this.cellId = newCellId;
}

async function initPromptSelected(imageData, promptWidth, promptHeight) {

  const promptCanvas = document.getElementById("promptDisplay")
  promptCanvas.width = promptWidth
  promptCanvas.height = promptHeight
  const promptContext = await  promptCanvas.getContext("2d")
  await promptContext.putImageData(new ImageData(new Uint8ClampedArray(imageData), promptWidth, promptHeight, {colorSpace:"srgb"}),0,0)

  async function createCells() {
    const cellsToReturn = []
    for (let row = 0; row < promptContext.canvas.height - 4; row++) {
      for (let column = 0; column < promptContext.canvas.width - 4; column++) {
        const imageData = await promptContext.getImageData(row, column, 3, 3)
        cellsToReturn.push(new Cell(imageData, await createImageBitmap(imageData), row, column))
      }
    }
    return cellsToReturn
  }
  const Cells = await createCells()
  // TESTCREATECANVAS(Cells, "TestDisplayForCells")
  return Cells
}

// Functions To Get Repeating Patterns

function compareTwoArrays(Array1, Array2) {
  if (Array1.length !== Array2.length) { return false }

  return Array1.every((element, index) => (element === Array2[index]))
}

async function getPatternCells(Cells, SymmetrySelector) {
  // Get possible cells
  const possibleCellsArray = Cells.map((Cell) => {
    return (new PossibleCells(Cell))
  })
  // For Mirroring
  if (SymmetrySelector > 0) {
    possibleCellsArray.forEach((possibleCell) => {
      possibleCell.getMirror();
    })
  }
  // For Rotations
  if (SymmetrySelector > 1) {
    possibleCellsArray.forEach((possibleCell) => {
      possibleCell.getRotations();
    })
  }
  possibleCellsArray.forEach((possibleCell) => {
    possibleCell.possibleOrientaions.forEach((orientation) => {
      for (const comparisonCell of possibleCellsArray) {
        if (compareTwoArrays(orientation, comparisonCell.origin.imageData.data)) {
          possibleCell.frequency += 1
          break
        }
      }
    })
  })

  const returnData = []
  await possibleCellsArray.forEach(async (possibleCell) => {
    if (possibleCell.frequency >= Number(SymmetrySelector)) {
      returnData.push(possibleCell.origin)
      await possibleCell.possibleOrientaions.forEach(async (Data) => {
        const utfData = new Uint8ClampedArray(Data)
        const newImageData = new ImageData(utfData, 3, 3)
        const newCell = new Cell(newImageData, await createImageBitmap(newImageData), possibleCell.origin.derivedFrom[0], possibleCell.origin[1])
        newCell.getSides()
        returnData.push(newCell)
      })
    }
  })
  // TESTCREATECANVAS(returnData, "TestDisplayForPatternCells")
  return returnData
}

// ! DEBUGGING DISPLAY FUNCTION


// TestDisplayForCells

function TESTCREATECANVAS(cellsToDisplay, parentElement) {
  const container = document.getElementById(parentElement)
  container.innerHTML = ""
  cellsToDisplay.map((tileData) => {
    const newTile = document.createElement("canvas")
    newTile.width = 3
    newTile.height = 3
    newTile.style.transform = "scale(10)"
    newTile.style.margin = "15px"
    newTile.style.background = "gray"
    newTile.style.imageRendering = "pixelated"

    container.appendChild(newTile)

    const ctx = newTile.getContext("2d")
    ctx.putImageData(tileData.imageData, 0, 0)
  })
}


// Output Stuff
// Legacy Code
async function initGenerate(cells, width, height) {
  clearDisplay()
  outputWidth = width
  outputHeight = height
  const display = document.getElementById("outputCanvas");
  const displayContext = display.getContext("2d");
  const input = document.getElementById("promptDisplay");
  const inputContext = input.getContext("2d");
  display.width = outputWidth * 2
  display.height = outputHeight * 2
  await placeTile(displayContext, cells[Math.floor(Math.random() * cells.length)], Math.floor(Math.random() * outputWidth), Math.floor(Math.random() * outputHeight));
  WFCMainLoop(displayContext, cells);
}

async function placeTile(context, cell, x, y) {
  try {
    await context.drawImage(cell.bitmap, x * 2, y * 2)
    canvasRef[(y * outputWidth + x)] = cell
    getEmptyTiles(x, y)
  } catch (error) {
    console.log(error)
    console.log(cell)
    console.log(cell.bitmap)
  }
}

async function WFCMainLoop(context, cells) {
  // for (let i = 0; i< 10; i++){
  //     console.log(i)
  while (tilesToFill.length > 0) {
    let nextCell = await getLowestEntropy(cells)
    if (nextCell.entropy.length === 0) {
      console.log("FAILED")
      // context.fillStyle = "red"
      // context.globalAlpha = 0.5
      // context.fillRect((nextCell.currentCell % outputWidth) * 2, Math.floor(nextCell.currentCell / outputWidth) * 2, 3, 3)
      // break
      initGenerate(cells, outputWidth, outputHeight)
    } else {
      const chosenCell = nextCell.entropy[Math.floor(Math.random() * nextCell.entropy.length)]
      await placeTile(context, chosenCell, nextCell.currentCell % outputWidth, Math.floor(nextCell.currentCell / outputWidth))
    }
    for (let condition of nextCell.conditions) {
      tilesToFill.splice(tilesToFill.indexOf(condition), 1)
    }
  }
}

async function getLowestEntropy(cells) {
  const possibleCells = tilesToFill.map((possibleCell) => {
    return possibleCell.cellId;
  })
    .filter((possibleCell, index, possibleCells) => {
      return possibleCells.indexOf(possibleCell) === index
    })
  return await possibleCells.reduce(async (lowestEntropyPromise, currentCell) => {
    const lowestEntropy = await lowestEntropyPromise
    const conditions = tilesToFill.filter((relation) => {
      return (relation.cellId === currentCell)
    })
    let entropy = cells
    for (let condition of conditions) {
      entropy = entropy.filter((cell) => {
        return (cell[condition.side] === condition.sideValue)
      })
    }
    if ((entropy.length < lowestEntropy.entropy.length) || (!lowestEntropy.currentCell)) {
      lowestEntropy.currentCell = currentCell
      lowestEntropy.entropy = entropy
      lowestEntropy.conditions = conditions
    }
    return Promise.resolve(lowestEntropy)

  }, Promise.resolve({ currentCell: null, entropy: [], conditions: [] }))
}

function clearDisplay() {
  for (let i = 0; i < outputHeight * outputWidth; i++) {
    canvasRef[i] = null;
  }
  tilesToFill.length = 0
}

function getEmptyTiles(x, y) {
  // foreach blank adjacent tile make relation object and put it in the relations array (TilesToFill?)

  // UP
  if (canvasRef[((y - 1) * outputWidth) + x] === null) {
    tilesToFill.push(new CellRelation("bottom", canvasRef[y * outputWidth + x].top, ((y - 1) * outputWidth) + x))
  }
  // Right
  if ((canvasRef[(y * outputWidth) + x + 1] === null) && (x + 1 !== outputWidth)) {
    tilesToFill.push(new CellRelation("left", canvasRef[y * outputWidth + x].right, (y * outputWidth) + x + 1))
  }
  // Down
  if (canvasRef[((y + 1) * outputWidth) + x] === null) {
    tilesToFill.push(new CellRelation("top", canvasRef[y * outputWidth + x].bottom, ((y + 1) * outputWidth) + x))
  }
  // Left
  if ((canvasRef[(y * outputWidth) + x - 1] === null) && (x !== 0)) {
    tilesToFill.push(new CellRelation("right", canvasRef[y * outputWidth + x].left, (y * outputWidth) + x - 1))
  }
}



export { initPromptSelected, getPatternCells, initGenerate }