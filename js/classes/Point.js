class Point {
    constructor(word, x, y, size = 10) {
        this.world = word
        this.x = x
        this.y = y
        this.size = size

        this.body

        this.locked = false

        this.draw()
        // this.events()
    }

    draw() {
        this.body = Bodies.circle(this.x, this.y, this.size, {
            label: "created",
            isStatic: true,
            class: this,
            render: {
                fillStyle: "#FFF"
            }
        })
        Composite.add(this.world, this.body);
    }

    setLocked() {
        this.locked = true
        this.body.render.fillStyle = "#F00"
    }

}