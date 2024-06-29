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
    }

    // renders the element. includes a hover and click check for enlarging the
    // element and then viewing it in greater detail with other properties.
    // element appears as a rectangle with number, atomic mass, symbol, and
    // maybe name. changes color based on category. the element has to be
    // displayed translated by x and y if the periodic table needs to be moved.
    render(x, y) {
        const SYMBOL_SHIFT_Y = 10
        let xPos = x + (this.p - 1) * this.w
        let yPos = y + (this.g - 1) * this.h

        // element shell
        rectMode(CORNER)
        stroke(0, 0, 80)
        strokeWeight(2)
        noFill()
        rect(xPos,
            yPos,
            this.w,
            this.h
        )

        // chemical symbol
        let symbolYPos = yPos + this.h/2 - SYMBOL_SHIFT_Y
        let xMid = xPos + this.w/2
        strokeWeight(1)
        fill(0, 0, 80)
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
        // symbol to the bottom of the element
        textSize(10)
        let cSBottom = symbolYPos + textAscent()/2 + textDescent()
        let eBottom = yPos + this.h
        let namePosY = (eBottom - cSBottom) * (1/3) + cSBottom
        text(
            this.name,
            xMid,
            namePosY
        )

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
