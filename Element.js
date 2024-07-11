// a single element in the periodic table of elements. handles its own hover
// checks and can display itself.
class Element {
    // the JSON includes far more properties than this, but this is a basic
    // periodic table and I can always add them throughout development
    constructor(symbol, name, number, category, atomicMass, period, group, w=70, h=90) {
        this.symbol = symbol
        this.name = name
        this.number = number
        this.category = category
        this.atomicMass = atomicMass
        this.p = period
        this.g = group
        this.w = w
        this.h = h
        this.padding = 5 // pads contents

        // determine fill via category
        this.colorsDict = {
            "noble gas": [256, 73, 88],
            "alkaline earth metal": [203, 100, 54],
            "alkali metal": [189, 95, 87],
            "transition metal": [209, 3, 23],
            "post-transition metal": [30, 100, 92],
            "metalloid": [353, 82, 67],
            "halogen": [240, 39, 75],
            "nonmetal": [274, 58, 42],
            "lanthanide": [207, 100, 66],
            "actinide": [106, 99, 84],
            "unknown": [0, 0, 20],
            "": [0, 0, 0]
        }
    }

    // renders the element. includes a hover and click check for enlarging the
    // element and then viewing it in greater detail with other properties.
    // element appears as a rectangle with number, atomic mass, symbol, and
    // maybe name. changes color based on category. the element has to be
    // displayed translated by x and y if the periodic table needs to be moved.
    render(x, y, filtered) {
        const SYMBOL_SHIFT_Y = 10
        let xPos = x + (this.p - 1) * this.w
        let yPos = y + (this.g - 1) * this.h

        // controls alpha value of all items. filtered is true, or 1, if the
        // element is included
        let alpha = filtered*80 + 20

        // the color list I used for the current dictionary of colors
        let cColor = this.colorsDict[this.category]

        // element shell
        rectMode(CORNER)
        stroke(backgroundColor[0], backgroundColor[1], backgroundColor[2], alpha)
        strokeWeight(2)
        fill(cColor[0], cColor[1], cColor[2], alpha)
        rect(xPos,
            yPos,
            this.w,
            this.h
        )

        // chemical symbol
        let symbolYPos = yPos + this.h/2 - SYMBOL_SHIFT_Y
        let xMid = xPos + this.w/2
        strokeWeight(1 * filtered)
        stroke(0, 0, 100, alpha)
        fill(0, 0, 100, alpha)
        textSize(30)
        textAlign(CENTER, CENTER)
        text(this.symbol,
            xMid,
            symbolYPos
        )

        // atomic number
        // y coordinate should be halfway from textAscent to the top of this
        // element's display
        textSize(14)
        noStroke()
        let atomicNumberPos = (yPos + (symbolYPos-textAscent()))/2
        text(this.number,
            xMid,
            atomicNumberPos
        )

        // name
        // positioned at the 1/3 mark from the bottom of the chemical
        // symbol to the bottom of the element. uses a while loop to
        // determine the largest possible text size that still fits in the box
        let currentSize = 12
        textSize(currentSize)
        while (textWidth(this.name) >= this.w - this.padding*2) {
            currentSize -= .1
            textSize(currentSize)
        }

        let cSBottom = symbolYPos + textAscent()/2 + textDescent()
        let eBottom = yPos + this.h
        let namePosY = (eBottom - cSBottom) * (1/3) + cSBottom
        text(
            this.name,
            xMid,
            namePosY
        )

        textSize(10)
        // atomic mass
        // same as above, but at the 2/3 mark
        let massPosY = (eBottom - cSBottom) * (2/3) + cSBottom
        text(
            this.atomicMass,
            xMid,
            massPosY
        )
    }

    // displays the same as above, except with all the attributes doubled
    hoverRender(x, y) {
        const SYMBOL_SHIFT_Y = 10
        let xPos = x + (this.p - 1) * this.w
        let yPos = y + (this.g - 1) * this.h

        // the color list I used for the current dictionary of colors
        let cColor = this.colorsDict[this.category]

        // element shell
        rectMode(CORNER)
        stroke(0, 0, 100)
        strokeWeight(4)
        fill(cColor)
        rect(xPos,
            yPos,
            this.w*1.5,
            this.h*1.5
        )

        // chemical symbol
        let symbolYPos = yPos + this.h/2 * 1.5 - SYMBOL_SHIFT_Y
        let xMid = xPos + this.w/2 * 1.5
        strokeWeight(1)
        fill(0, 0, 100)
        textSize(45)
        textAlign(CENTER, CENTER)
        text(this.symbol,
            xMid,
            symbolYPos
        )

        // atomic number
        // y coordinate should be halfway from textAscent to the top of this
        // element's display
        textSize(21)
        noStroke()
        let atomicNumberPos = (yPos + (symbolYPos-textAscent()))/2
        text(this.number,
            xMid,
            atomicNumberPos
        )

        // name
        // positioned at the 1/3 mark from the bottom of the chemical
        // symbol to the bottom of the element. uses a while loop to
        // determine the largest possible text size that still fits in the box
        let currentSize = 18
        textSize(currentSize)
        while (textWidth(this.name) >= this.w*1.5 - this.padding*2) {
            currentSize -= .1
            textSize(currentSize)
        }

        let cSBottom = symbolYPos + textAscent()/2 + textDescent()
        let eBottom = yPos + this.h*1.5
        let namePosY = (eBottom - cSBottom) * (1/3) + cSBottom
        text(
            this.name,
            xMid,
            namePosY
        )

        textSize(15)
        // atomic mass
        // same as above, but at the 2/3 mark
        let massPosY = (eBottom - cSBottom) * (2/3) + cSBottom
        text(
            this.atomicMass,
            xMid,
            massPosY
        )
    }
}
