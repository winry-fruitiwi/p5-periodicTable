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

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

let testElement // Element instance, fictional and for testing
let periodicTable // testing for now
let tableJSON // JSON for the periodic table

let query = "" // used in periodicTable for the search bar

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

    testElement = new Element(
        "H",
        "Hydrogen",
        1,
        "noble gas",
        1.008,
        1,
        1
    )

}


function draw() {
    background(234, 34, 24)

    /* debugCorner needs to be last so its z-index is highest */
    // debugCorner.setText(`frameCount: ${frameCount}`, 2)
    // debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    // debugCorner.showBottom()

    // testElement.render(10, 10)
    if (periodicTable)
        periodicTable.render()

    if (frameCount > 3000)
        noLoop()
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