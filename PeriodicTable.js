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
        this.constructElements(json)

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

    constructElements(json) {
        let elements = json["elements"]

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
            atomicMass = atomicMass.slice(0, len-3) + "." + atomicMass.slice(len-3)

            this.elements.push(
                new Element(
                    element["symbol"],
                    element["name"],
                    element["number"],
                    "noble gas",
                    atomicMass,
                    element["group"],
                    element["period"],
                    60,
                    80
                )
            )
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
