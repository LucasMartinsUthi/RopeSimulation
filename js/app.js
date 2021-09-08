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
    engine = Engine.create({
        velocityIterations: 5
    })

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
                    new Stick(engine.world, firstClick, body, 1)
                    firstClick = false
                }
            } 
        } else if(bodyType == "Lock") {
            body.class.setLocked()
        } else if(bodyType == "Sleep") {
            body.class.setSleeping()
        } else if(bodyType == "Remove") {
            Composite.remove(engine.world, body)
        }
    })

    Runner.run(runner, engine)
}

let run = () => {
    let createdBodies = engine.world.bodies.filter(b => b.label == "created")
    createdBodies.forEach(b => {
        if(!b.class.locked)
            Body.setStatic(b, false)
    })
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

    $(".generateCloth").click(() => {
        const sizeX = 21
        const sizeY = 15
        const distance = 20
        let x = 100
        let y = 50

        let listPoints = []

        for (let i = 0; i < sizeY; i++) {
            listPoints.push([])
            for (let j = 0; j < sizeX; j++) {
                let point = new Point(engine.world, x, y, 5)
                if(j % 5 == 0 && i == 0)
                    point.setLocked()

                listPoints[i].push(point.body)

                //create Stick Y axis
                if(!!listPoints[i-1])
                    new Stick(engine.world, point.body, listPoints[i-1][j], 0.2)

                //create Stick X axis
                if(!!listPoints[i][j-1])
                    new Stick(engine.world, point.body, listPoints[i][j-1], 0.2)

                x += distance
            }
            y += distance
            x = 100
        }
    })

    $(".generatePendulum").click(() => {
        const lockedPoint = new Point(engine.world, 300, 250, 8)
        lockedPoint.setLocked(true)

        const pointA = new Point(engine.world, 300, 150, 5)
        const pointB = new Point(engine.world, 301, 50, 5)

        new Stick(engine.world, lockedPoint.body, pointA.body)
        new Stick(engine.world, pointA.body, pointB.body)
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