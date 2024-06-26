// container for Elements in Element.js. handles tasks concerning larger
// sections of the periodic table app, like filtering elements based on group.
class PeriodicTable {
    constructor(elements, x, y) {
        // contains a list of all elements in the periodic table. requires
        // access to elements.json
        this.elements = elements

        // the position where elements are first displayed
        this.x = x
        this.y = y

        // which element categories are not supposed to be displayed
        this.filters = []
    }

    // renders all elements at their respective locations, starting from the
    // x and y coordinates of this class. also filters
    render() {}
}
