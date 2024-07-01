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

            // handles lanthanides by putting them in their own row,
            // although this does leave a gap in the periodic table where
            // they are supposed to be (will be fixed soon)
            if (p === 6 && g === 3) {
                // creates a placeholder element to patch up the hole in the
                // periodic table and make it look cleaner
                if (lGroup === 3) {
                    this.elements.push(
                        new Element(
                            "",
                            "lanthanides",
                            "",
                            "",
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
                        element["symbol"],
                        element["name"],
                        element["number"],
                        "noble gas",
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
                            "",
                            "actinides",
                            "",
                            "",
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
                        element["symbol"],
                        element["name"],
                        element["number"],
                        "noble gas",
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
                        element["symbol"],
                        element["name"],
                        element["number"],
                        "noble gas",
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
    // x and y coordinates of this class. also filters
    render() {
        for (let element of this.elements) {
            element.render(this.x, this.y)
        }
    }
}
