class Stick {
    constructor(world, bodyA, bodyB, stiffness = 0.5) {
        this.world = world
        this.bodyA = bodyA
        this.bodyB = bodyB
        this.stiffness = stiffness
        
        this.draw()
    }

    draw() {
        Matter.Composite.add(this.world, 
            Matter.Constraint.create({
                bodyA: this.bodyA,
                bodyB: this.bodyB,
                stiffness: this.stiffness,
                damping: 0,
                render: {
                    type: 'line',
                    strokeStyle: '#fff'
                }
            })
        )
    }
}