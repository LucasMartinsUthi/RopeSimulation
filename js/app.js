let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse

let bodyType = null
let firstClick = false

let engine = null,
    render = null,
    runner = null


let start = () => {
    engine = Engine.create()

    render = Render.create({
        element: $("#matter")[0],
        engine: engine,
        options: {
            wireframes: false
        }
    })

    runner = Runner.create()
    Render.run(render)

    let mouse = Mouse.create(render.canvas)
    let mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            render: {
                visible: false
            }
        }
    });

    Composite.add(engine.world, mouseConstraint)

    render.mouse = mouse

    //mouse events
    Events.on(mouseConstraint, "enddrag", ({body}) => {
        if(bodyType == "Stick") {
            if(!firstClick)
                firstClick = body              
            else {
                if(firstClick.id != body.id) {
                    Composite.add(engine.world, 
                        Constraint.create({
                            bodyA: firstClick,
                            bodyB: body,
                            stiffness: 0.5,
                            render: {
                                type: 'line',
                                strokeStyle: '#fff'
                            }
                        })
                    )
                    firstClick = false
                }
            } 
        } else if(bodyType == "Mouse") {
            body.class.setLocked()
        } else if(bodyType == "Remove") {
            Composite.remove(engine.world, body)
        }
    })

    Runner.run(runner, engine)
}

let run = () => {
    let createdBodies = engine.world.bodies.filter(b => b.label == "created")
    console.log({createdBodies})
    createdBodies.forEach(b => {
        if(!b.class.locked)
            Body.setStatic(b, false)
    });

}

$(() => {
    start()

    let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
    Composite.add(engine.world, ground)

    $("#run").click(() => run())

    $("#matter canvas").click(({currentTarget, pageX, pageY}) => {
        
        let x = pageX - $(currentTarget).offset().left
        let y = pageY - $(currentTarget).offset().top

        if(bodyType == "Point") {
            new Point(engine.world, x, y)
            firstClick = false
        }        
    })

    $(".bodyType").click(({currentTarget}) => {
        bodyType = $(currentTarget).val()
        firstClick = false
        $(".bodyType")
            .removeClass('btn-primary')
            .addClass('btn-secondary')
        $(currentTarget)
            .removeClass('btn-secondary')
            .addClass('btn-primary')
    })
})