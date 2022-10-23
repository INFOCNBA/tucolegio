let tick = 100
// ms
let Vmax = 255
let mismoSentido = false
radio.onReceivedString(function on_received_string(receivedString: string) {
    if (receivedString == "izquierda") {
        mover_motores(Button.A, false)
        pause(100)
        reposo()
    }
    
})
function reposo() {
    // basic.show_icon(IconNames.DIAMOND)
    // robotbit.motor_run(robotbit.Motors.M1A, 0)
    // robotbit.motor_run(robotbit.Motors.M2B, 0)
    robotbit.MotorStopAll()
    mostrarModo()
}

function mover_motores(boton: number, mismoSentido: boolean) {
    if (boton == Button.A) {
        if (mismoSentido) {
            basic.showArrow(ArrowNames.South)
            robotbit.MotorRunDual(robotbit.Motors.M1A, -Vmax, robotbit.Motors.M2B, -Vmax)
        } else {
            basic.showArrow(ArrowNames.NorthWest)
            robotbit.MotorRunDual(robotbit.Motors.M1A, -Vmax, robotbit.Motors.M2B, Vmax)
        }
        
    } else if (boton == Button.B) {
        if (mismoSentido) {
            basic.showArrow(ArrowNames.North)
            // robotbit.motor_run(robotbit.Motors.M1A, Vmax)
            // robotbit.motor_run(robotbit.Motors.M2B, Vmax)
            robotbit.MotorRunDual(robotbit.Motors.M1A, Vmax, robotbit.Motors.M2B, Vmax)
        } else {
            basic.showArrow(ArrowNames.NorthEast)
            robotbit.MotorRunDual(robotbit.Motors.M1A, Vmax, robotbit.Motors.M2B, -Vmax)
        }
        
    } else {
        console.log("botonAB no implementado")
        basic.showIcon(IconNames.Angry)
    }
    
    while (input.buttonIsPressed(boton)) {
        basic.pause(tick)
    }
}

function mostrarModo() {
    if (mismoSentido) {
        basic.showLeds(`
            . . . # .
            . . # # #
            . . . . .
            # # # . .
            . # . . .
            `)
    } else {
        basic.showLeds(`
            . . . . .
            . # . # .
            # # . # #
            . # . # .
            . . . . .
            `)
    }
    
}

function cambiarModo() {
    
    mismoSentido = !mismoSentido
    mostrarModo()
}

function motor1_atras() {
    basic.showIcon(IconNames.No)
    robotbit.MotorRun(robotbit.Motors.M1A, -Vmax)
    while (input.buttonIsPressed(Button.B)) {
        basic.pause(tick)
    }
}

function on_button_pressed_a() {
    
}

function on_button_pressed_b() {
    
}

// input.on_button_pressed(Button.A, on_button_pressed_a)
// input.on_button_pressed(Button.B, on_button_pressed_b)
cambiarModo()
radio.setGroup(23)
basic.forever(function on_forever() {
    if (input.buttonIsPressed(Button.A)) {
        mover_motores(Button.A, mismoSentido)
        reposo()
    } else if (input.buttonIsPressed(Button.B)) {
        mover_motores(Button.B, mismoSentido)
        reposo()
    } else if (input.logoIsPressed()) {
        cambiarModo()
    }
    
})
