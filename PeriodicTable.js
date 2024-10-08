// container for Elements in Element.js. handles tasks concerning larger
// sections of the periodic table app, like filtering elements based on group.
class PeriodicTable {
    constructor(x, y, json) {
        // contains a list of all elements in the periodic table. requires
        // access to elements.json
        this.elements = []

        // the position where elements are first displayed
        this.x = x
        this.y = y

        // which element categories are not supposed to be displayed
        this.filters = []

        // construct a number of test elements
        // this.constructTestElements()
        this.constructElements(json, 75, 75)

        print(json)
    }

    // create a legend with the colors of different element categories
    renderCategoryLegend() {
        const X_START = width/4
        const Y_START = 10
        const W = 30 // width
        const H = 15 // height
        const MARGIN = 10 // margin between each color sample

        // helpers
        let categories = Object.keys(colorsDict)
        let colors = Object.values(colorsDict)

        textSize(14)
        textAlign(LEFT, CENTER)

        for (let i = 0; i < categories.length; i++) {
            let color = colors[i]
            let category = categories[i]

            // simplifies code
            let yPos = Y_START + i*(H + MARGIN)

            // color sample
            noStroke()
            fill(color[0], color[1], color[2])
            rect(
                X_START, yPos,
                W, H
            )

            // color label
            fill(0, 0, 100)
            text(category, X_START + W + MARGIN, yPos + H/2)
        }
    }

    constructTestElements() {
        for (let i = 1; i < 6; i++) {
            for (let j = 1; j < 4; j++) {
                this.elements.push(
                    new Element(
                        "H",
                        "Hydrogen",
                        1,
                        "noble gas",
                        1.008,
                        i,
                        j
                    )
                )
            }
        }
    }

    constructElements(json, w, h) {
        let elements = json["elements"]
        // keeps track of where to display lanthanides and actinides
        let lGroup = 3
        let aGroup = 3

        for (let i = 0; i < elements.length; i++) {

            let element = elements[i]

            // since atomic mass is rarely rounded already (due to isotope
            // abundance being very random, except man-made elements and
            // simpler elements), we have to do it ourselves
            let atomicMass = element["atomic_mass"]
            // most elements seem to have at least 2 place values, sometimes
            // three in the case of hydrogen, so we want to round that down
            atomicMass *= 1000
            atomicMass = round(atomicMass)
            // convert it into a string so that we can reintroduce the decimal
            atomicMass = str(atomicMass)
            let len = atomicMass.length

            if (atomicMass.slice(len-3) === "000") {
                atomicMass = atomicMass.slice(0, len-3)
                atomicMass = "(" + atomicMass + ")"
            }
            else {
                atomicMass = atomicMass.slice(0, len-3) + "." + atomicMass.slice(len-3)
            }

            // abbreviations to shorten code
            let g = element["group"]
            let p = element["period"]

            // determine the element category via switch-case statements
            let eCategory = element["category"] // category of element in JSON
            let category // category of element for use in object initiation

            switch (true) {
                // case eCategory.includes("unknown, predicted"):
                //     category = "unknown"
                //     break;
                // case eCategory.includes("unknown, but predicted"):
                //     category = "unknown"
                //     break;
                case eCategory.includes("noble gas"):
                    category = "noble gas"
                    break;
                case eCategory.includes("alkali metal"):
                    category = "alkali metal"
                    break;
                case eCategory.includes("alkaline earth metal"):
                    category = "alkaline earth metal"
                    break;
                case eCategory.includes("post-transition metal"):
                    category = "post-transition metal"
                    break;
                case eCategory.includes("transition metal"):
                    category = "transition metal"
                    break;
                case eCategory.includes("metalloid"):
                    category = "metalloid"
                    break;
                case eCategory.includes("halogen"):
                    category = "halogen"
                    break;
                case eCategory.includes("nonmetal"):
                    category = "nonmetal"
                    break;
                case eCategory.includes("lanthanide"):
                    category = "lanthanide"
                    break;
                case eCategory.includes("actinide"):
                    category = "actinide"
                    break;
            }

            // handles lanthanides by putting them in their own row,
            // although this does leave a gap in the periodic table where
            // they are supposed to be (will be fixed soon)
            if (p === 6 && g === 3) {
                // creates a placeholder element to patch up the hole in the
                // periodic table and make it look cleaner
                if (lGroup === 3) {
                    this.elements.push(
                        new Element(
                            null,
                            "",
                            "lanthanides",
                            "",
                            "lanthanide",
                            "",
                            g,
                            p,
                            w,
                            h
                        )
                    )
                }

                this.elements.push(
                    new Element(
                        element,
                        element["symbol"],
                        element["name"],
                        element["number"],
                        category,
                        atomicMass,
                        lGroup,
                        10,
                        w,
                        h
                    )
                )

                lGroup += 1
            }

            // same for here, but with the actinides
            else if (p === 7 && g === 3) {
                if (aGroup === 3) {
                    this.elements.push(
                        new Element(
                            null,
                            "",
                            "actinides",
                            "",
                            "actinide",
                            "",
                            g,
                            p,
                            w,
                            h
                        )
                    )
                }

                this.elements.push(
                    new Element(
                        element,
                        element["symbol"],
                        element["name"],
                        element["number"],
                        category,
                        atomicMass,
                        aGroup,
                        11,
                        w,
                        h
                    )
                )

                aGroup += 1
            }

            else {
                this.elements.push(
                    new Element(
                        element,
                        element["symbol"],
                        element["name"],
                        element["number"],
                        category,
                        atomicMass,
                        element["group"],
                        element["period"],
                        w,
                        h
                    )
                )
            }
        }
    }

    // renders all elements at their respective locations, starting from the
    // x and y coordinates of this class. also displays the search bar,
    // which is updated in keyPressed() but is displayed and used here.
    render() {
        this.renderCategoryLegend()

        textSize(14)
        rectMode(CORNER)

        const SEARCH_PADDING = 3
        const SEARCH_MARGIN = 10
        let textBoxHeight = textHeight() + SEARCH_PADDING * 2

        fill(0, 0, 25)
        rect(this.x, this.y, textWidth(" ")*32, textBoxHeight)

        fill(0, 0, 80)
        textAlign(LEFT, TOP)
        text(query, this.x + SEARCH_PADDING, this.y + SEARCH_PADDING)

        // if an element is hovered over, make sure it is displayed last so
        // that it's on top of everything else
        let hoveredElement

        for (let e of this.elements) {
            // helps simplify this code
            let lQ = query.toLowerCase()
            let symbol = e.symbol.toLowerCase()
            let name = e.name.toLowerCase()
            if (symbol.includes(lQ) || name.includes(lQ)) {
                // simplification: the top of the periodic table
                let tableTop = this.y + 2*SEARCH_MARGIN + textBoxHeight

                // since the element calculates its positions in its own
                // render function, we have to do it here instead
                // I'm not sure
                if (
                    mouseY < this.x + ((e.g - 1) * e.h) + e.h - e.h/2 + e.h &&
                    mouseX < tableTop + ((e.p - 1) * e.w) + e.w - e.w/2 &&
                    mouseY > this.x + ((e.g - 1) * e.h) - e.h/2 + e.h &&
                    mouseX > tableTop + ((e.p - 1) * e.w) - e.w/2 &&
                    !ifDarkenScreen
                ) {
                    hoveredElement = e
                }
                e.render(this.x,
                    tableTop,
                    true
                )
            } else {
                e.render(this.x,
                    this.y + 2*SEARCH_MARGIN + textBoxHeight,
                    false
                )
            }
        }

        if (hoveredElement) {
            hoveredElement.hoverRender(
                this.x,
                this.y + 2*SEARCH_MARGIN + textBoxHeight
            )
        }
    }
}
