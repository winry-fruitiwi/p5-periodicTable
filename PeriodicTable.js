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
        this.constructTestElements()
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

    // renders all elements at their respective locations, starting from the
    // x and y coordinates of this class. also filters
    render() {
        for (let element of this.elements) {
            element.render(this.x, this.y)
        }
    }
}
