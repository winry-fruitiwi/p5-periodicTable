// a single element in the periodic table of elements. handles its own hover
// checks and can display itself.
class Element {
    // the JSON includes far more properties than this, but this is a basic
    // periodic table and I can always add them throughout development
    constructor(symbol, name, number, category, atomicMass, period, group, w, h) {
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
    // maybe name. changes color based on category.
    render() {}
}
