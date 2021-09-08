class Point {
    constructor(word, x, y, size = 10, mass) {
        this.world = word
        this.x = x
        this.y = y
        this.size = size

        this.body

        this.locked = false
        this.sleeping = false

        this.draw()
    }

    draw() {
        this.body = Bodies.circle(this.x, this.y, this.size, {
            label: "created",
            isStatic: true,
            class: this,
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            mass: 20,
            render: {
                fillStyle: "#FFF"
            }
        })
        Composite.add(this.world, this.body);
    }

    setLocked(status = !this.locked) {
        this.locked = status
        this.body.render.fillStyle = this.locked ? "#F00" : "#FFF"
    }

    //Sleeping Points have no collision
    setSleeping(status = !this.sleeping) {
        this.sleeping = status
        this.body.render.fillStyle = this.sleeping ? "#CCC" : "#FFF"
        this.body.collisionFilter.mask = this.sleeping ? -1 : 0

        Matter.Sleeping.set(this.body, this.sleeping)
    }

}