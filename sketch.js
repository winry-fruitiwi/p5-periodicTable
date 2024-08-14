/**
 *  @author Winry
 *  @date 2024.6.26
 *
 *  Periodic table app, designed while referencing and/or using:
 *      Bowserinator's project, Periodic-Table-JSON
 *      Fisher Scientific's periodic table, used for testing
 *      Dark Reader, used to darken screens so that my eyes don't burn at night
 *
 *  This project is probably not going to find its way out of my editor, but
 *  I will still put products that I use here on the list of references.
 */

// where characters wrap
const CHAR_WRAP = 50

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

let testElement // Element instance, fictional and for testing
let periodicTable // testing for now
let tableJSON // JSON for the periodic table

let query = "" // used in periodicTable for the search bar
let backgroundColor
let colorsDict

let mouseJustReleased
let ifDarkenScreen
let selectedElement

let elementIMGs = {}
let bohrIMGs = {}

// the frame when the detailed display starts displaying. Useful for
// calculating the rotation of the bohr model.
let detailedDisplayFrame = 0

// toggles between Bohr and Lewis model display in the detailed element
// display window
let ifBohrModel = true

function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')

    tableJSON = loadJSON('elements.json', gotData)
}


function setup() {
    let cnv = createCanvas(1400, 900)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch
        created with bowserinator's Periodic Table JSON project in Github
        referenced Fisher Scientific periodic table during development
        can search for atomic number, name, and symbol</pre>`)

    // debugCorner = new CanvasDebugCorner(5)

    // testElement = new Element(
    //     "H",
    //     "Hydrogen",
    //     1,
    //     "noble gas",
    //     1.008,
    //     1,
    //     1
    // )

    backgroundColor = [234, 34, 24]

    colorsDict = {
        "nonmetal": [274, 58, 42],
        "alkali metal": [189, 95, 87],
        "alkaline earth metal": [203, 100, 54],
        "transition metal": [209, 3, 23],
        "post-transition metal": [30, 100, 92],
        "metalloid": [353, 82, 67],
        "halogen": [240, 39, 75],
        "lanthanide": [207, 100, 66],
        "actinide": [106, 99, 84],
        "noble gas": [256, 73, 88],
        // "unknown": [0, 0, 20],
        // "": [0, 0, 0]
    }

    noCursor()
}

function detectPress() {
    // margin between the left and right sides of the detailed view and the
    // window. stands for "horizontal margin"
    const H_MARGIN = 100
    // "vertical margin" for the top and bottom sides of the detailed view
    // and the window
    const V_MARGIN = 100
    // starting position for every piece in this display
    let startPos = new p5.Vector(H_MARGIN, V_MARGIN)

    if (mouseJustReleased && !(
        startPos.x < mouseX &&
        startPos.y < mouseY &&
        mouseX < width - H_MARGIN &&
        mouseY < height - V_MARGIN
    )) {
        ifDarkenScreen = false
    }
}


function draw() {
    background(234, 34, 24)

    detectPress()

    /* debugCorner needs to be last so its z-index is highest */
    // debugCorner.setText(`frameCount: ${frameCount}`, 2)
    // debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    // debugCorner.showBottom()

    // testElement.render(10, 10)
    if (periodicTable)
        periodicTable.render()

    if (ifDarkenScreen) {
        darkenScreen()
        displayDetailed(selectedElement)
    }

    displayMouseCursor()

    mouseJustReleased = false

    if (frameCount > 3000)
        noLoop()
}

function darkenScreen() {
    noStroke()
    fill(0, 0, 0, 30)
    rect(-10, -10, width + 10, height + 10)
}

function displayDetailed(element) {
    // margin between the left and right sides of the detailed view and the
    // window. stands for "horizontal margin"
    const H_MARGIN = 100
    // "vertical margin" for the top and bottom sides of the detailed view
    // and the window
    const V_MARGIN = 100
    // properties of the bohr model and element images
    const IMG_WIDTH = 300
    const IMG_MARGIN = 10
    // starting position for every piece in this display
    let startPos = new p5.Vector(H_MARGIN + 50, V_MARGIN + 50)

    // background
    fill(0, 0, 10)
    noStroke()
    rect(
        H_MARGIN, V_MARGIN,
        width - H_MARGIN*2, height - V_MARGIN*2,
        10 // corner radius
    )

    // name
    fill(0, 0, 100)
    stroke(0, 0, 100)
    strokeWeight(1)
    textAlign(LEFT, TOP)
    textSize(30)
    text(element["name"], startPos.x, startPos.y)

    // images - element image
    imageMode(CORNER)
    let elementIMG = elementIMGs[element.name]
    if (!(elementIMG instanceof p5.Image)) {
        elementIMG = loadImage(elementIMG)
        elementIMGs[element.name] = elementIMG
    }

    elementIMG.resize(IMG_WIDTH, 0)
    image(elementIMG, startPos.x + IMG_WIDTH+IMG_MARGIN, startPos.y + 60)

    // bohr/lewis model image
    // imageMode(CORNER)
    // let bohrIMG = bohrIMGs[element.name]
    // if (!(bohrIMG instanceof p5.Image)) {
    //     bohrIMG = loadImage(bohrIMG)
    //     bohrIMGs[element.name] = bohrIMG
    // }
    //
    // bohrIMG.resize(IMG_WIDTH, 0)
    //
    // image(bohrIMG, startPos.x, startPos.y + 60)
    let shells = element["shells"]

    fill(0, 0, 0)
    noStroke()
    rect(startPos.x, startPos.y + 60, IMG_WIDTH, IMG_WIDTH)

    if (ifBohrModel)
        displayBohrModel(element["number"], element["shells"],
            startPos.x + IMG_WIDTH/2,
            startPos.y + 60 + IMG_WIDTH/2,
            IMG_WIDTH
        )

    else
        displayLewisModel(element["symbol"],
            shells[shells.length-1],
            startPos.x + IMG_WIDTH/2,
            startPos.y + 60 + IMG_WIDTH/2,
            IMG_WIDTH/3
        )

    // displays a summary of the element's functions. needs to be
    // text-wrapped. uses monospace font
    textFont(fixedWidthFont, 14)
    textAlign(LEFT, TOP)
    fill(0, 0, 100)
    noStroke()

    let greatestImgHeight = max(IMG_WIDTH, elementIMG.height)

    // text wrapping for the element summary calculates the line by keeping
    // track of the beginning of the current line
    for (let i=0; i<element["summary"].length;) {
        let lastSpacePos = element["summary"].lastIndexOf(" ", i+CHAR_WRAP)

        if (i+CHAR_WRAP >= element["summary"].length) {
            lastSpacePos = element["summary"].length
        }

        text(element["summary"].slice(i, lastSpacePos),
            startPos.x,
            startPos.y+60 + textHeight()*(i/CHAR_WRAP)+greatestImgHeight+IMG_MARGIN
        )

        i = lastSpacePos + 1
    }

    if (startPos.x < mouseX &&
        startPos.y + 60 < mouseY &&
        mouseX < startPos.x + IMG_WIDTH &&
        mouseY < startPos.y + 60 + IMG_WIDTH
    ) {
        displayShellData(element, mouseX, mouseY)

        if (mouseJustReleased) {
            ifBohrModel = !ifBohrModel
            detailedDisplayFrame = frameCount
        }
    }
}

// takes in a bunch of electron shell data and spits it out, but in a neat
// format. includes data for electron shells, stable isotopes, etc. called
// when mousing over the element model, uses x and y to determine where to
// display
function displayShellData(element, x, y) {
    textSize(14)

    // define all variables required
    // padding between electron and proton/neutron counts
    let nucleusPadding = 30
    let padding = 5
    let shells = element["shells"]
    let atomicMass = element["atomic_mass"]
    let protons = element["number"] // protons = atomic number
    let protonString = `${protons} protons`

    // calculate number of neutrons based on the atomic mass
    let neutrons = round(atomicMass - protons)
    let neutronString = `${neutrons} neutrons`

    // let textHeight = textAscent() + textDescent()
    let rectHeight = padding + (textHeight()*(shells.length+1)) + padding
    let rectWidth = padding + textWidth("shells:") + padding
    rectWidth += max(textWidth(neutronString), textWidth(protonString)) + nucleusPadding

    // draw a rectangle for the background, size currently indeterminate
        // maybe instead add a shadow? decide later
    noStroke()
    fill(0, 0, 50)
    rect(x, y, rectWidth, rectHeight, 8)

    // Electrons - display shells in order
    fill(0, 0, 100)
    // text(shellString, x+padding + rectWidth, y+padding)
    text("shells:", x+padding, y+padding)
    for (let i = 1; i <= shells.length; i++) {
        text(shells[i-1], x+padding, y+padding + textHeight()*i)
    }

    // x-coordinate breakdown: starting position + padding + the width of
    // the electron shell widget + padding between shells and proton/neutron
    // display

    // Neutrons - reference average atomic mass
    // subtract the number of protons from the average atomic mass and
    // round. this should usually be the most abundant isotope
    text(neutronString,
        x+padding+textWidth("shells:")+nucleusPadding,
        y+padding
    )
    // Protons - display atomic number.
    text(protonString,
        x+padding+textWidth("shells:")+nucleusPadding,
        y+padding + textHeight()
    )
}

// takes in the atomic number and all the shells, then displays a bohr
// model of the element given. atomic number required to find neutral
// charged atom. dist means the maximum distance to display all shells
function displayBohrModel(aNumber, shells, x, y, dist) {
    let nucleusRadius = 50
    strokeWeight(nucleusRadius)
    stroke(251, 61, 82) // random purple hue

    point(x, y)

    let shellMargin = (dist-nucleusRadius)/9
    let firstShellRadius = nucleusRadius + 30
    angleMode(DEGREES)

    for (let i=0; i<shells.length; i++) {
        push()
        translate(x, y)
        let shell = shells[i]
        strokeWeight(1.5)
        stroke(0, 0, 80)
        noFill()
        circle(0, 0, firstShellRadius + i*shellMargin)

        if (i === shells.length - 1) {
            strokeWeight(10)
            stroke(360, 56, 98) // red
        }
        else {
            strokeWeight(7)
            stroke(90, 100, 100) // green
        }

        // display electrons and rotate them along their designated shell
        for (let j=0; j < shell; j++) {
            push()
            let frameDelta = frameCount-detailedDisplayFrame
            let rotationSpeed = frameDelta/((i+1)/5)*.5
            if (i % 2 === 1)
                rotate((j/shell)*360 - rotationSpeed)
            else
                rotate((j/shell)*360 + rotationSpeed)
            point(0, -(firstShellRadius + i*shellMargin)/2)
            pop()
        }
        pop()
    }
}


// takes in the chemical symbol and number of valence electrons and displays
// a Lewis diagram of an element
function displayLewisModel(symbol, valence, x, y, dist) {
    // draw the symbol in 50+ font size
    textSize(100)
    textAlign(CENTER, CENTER)
    fill(0, 0, 100)
    noStroke()
    text(symbol, x, y)

    // number of valence electrons determines layout - draw small 10px dots
        // 1-4 → single electron for all
        // 5 → double electron for 1
        // 6 → double electron for 1 + 2
        // 7 → double electron for 1 + 2 + 3
        // 8 → double electron for all
    stroke(0, 0, 100)
    strokeWeight(10)

    // the center of each point or pair of points that are displayed to
    // represent electrons
    let pointPositions = [
        new p5.Vector(x, y - dist),
        new p5.Vector(x + dist, y),
        new p5.Vector(x, y + dist),
        new p5.Vector(x - dist, y)
    ]

    for (let i=0; i<4; i++) {
        let pointPos = pointPositions[i]

        // if there are enough electrons, put the first x in pairs, where x
        // is the current position minus number of valence electrons
        if (valence - i >= 5) {
            point(pointPos.x - 10, pointPos.y)
            point(pointPos.x + 10, pointPos.y)
        }
        // always display one valence electron if there are enough electrons
        else if ((valence - i - 1) >= 0)
            point(pointPos.x, pointPos.y)
    }
}

function displayMouseCursor() {
    strokeWeight(10)
    stroke(0, 0, 100)

    if (mouseIsPressed) {
        stroke(30, 80, 80)
        strokeWeight(8)
    }

    point(mouseX, mouseY)
}

function gotData(data) {
    periodicTable = new PeriodicTable(10, 10, data)
}

// helper function, used for simplification
function textHeight() {
    return textAscent() + textDescent()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }

    if (key === '`') { /* toggle debug corner visibility */
        debugCorner.visible = !debugCorner.visible
        console.log(`debugCorner visibility set to ${debugCorner.visible}`)
    }

    if (key.length === 1) {
        query += key
    } else if (keyCode === BACKSPACE) {
        query = query.slice(0, query.length - 1)
    }
}

function mouseReleased() {
    mouseJustReleased = true
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.visible = true
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    showBottom() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */
            rect(
                0,
                height,
                width,
                DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            for (let index in this.debugMsgList) {
                const msg = this.debugMsgList[index]
                text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
            }
        }
    }

    showTop() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */

            /* offset from top of canvas */
            const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background, a console-like feel */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)

            rect( /* x, y, w, h */
                0,
                0,
                width,
                DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            textAlign(LEFT)
            for (let i in this.debugMsgList) {
                const msg = this.debugMsgList[i]
                text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
            }
        }
    }
}