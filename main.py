tick=100 #ms
Vmax=255
mismoSentido=False

def on_forever():
    if input.button_is_pressed(Button.A):
        mover_motores(Button.A,mismoSentido)
        reposo()
    elif input.button_is_pressed(Button.B):
        mover_motores(Button.B,mismoSentido)
        reposo()
    elif input.logo_is_pressed():
        cambiarModo()        


def on_received_string(receivedString):
    if receivedString == "izquierda":
        mover_motores(Button.A,False)
        pause(100)
        reposo()


radio.on_received_string(on_received_string)


def reposo():
    #basic.show_icon(IconNames.DIAMOND)
    #robotbit.motor_run(robotbit.Motors.M1A, 0)
    #robotbit.motor_run(robotbit.Motors.M2B, 0)
    robotbit.motor_stop_all()
    mostrarModo()
    

def mover_motores(boton,mismoSentido):
    if boton==Button.A:
        if mismoSentido:
            basic.show_arrow(ArrowNames.SOUTH)
            robotbit.motor_run_dual(robotbit.Motors.M1A, -Vmax,
                                    robotbit.Motors.M2B, -Vmax)

        else:
            basic.show_arrow(ArrowNames.NORTH_WEST)
            robotbit.motor_run_dual(robotbit.Motors.M1A, -Vmax,
                                    robotbit.Motors.M2B, Vmax)

    elif boton==Button.B:
        if mismoSentido:
            basic.show_arrow(ArrowNames.NORTH)
            #robotbit.motor_run(robotbit.Motors.M1A, Vmax)
            #robotbit.motor_run(robotbit.Motors.M2B, Vmax)
            robotbit.motor_run_dual(robotbit.Motors.M1A, Vmax,
                                    robotbit.Motors.M2B, Vmax)

        else:
            basic.show_arrow(ArrowNames.NORTH_EAST)
            robotbit.motor_run_dual(robotbit.Motors.M1A, Vmax,
                                    robotbit.Motors.M2B, -Vmax)


    else:
        print("botonAB no implementado")
        basic.show_icon(IconNames.ANGRY)

    while input.button_is_pressed(boton):
        basic.pause(tick)

def mostrarModo():
    if mismoSentido:
            basic.show_leds("""
            . . . # .
            . . # # #
            . . . . .
            # # # . .
            . # . . .
            """)
    else:
            basic.show_leds("""
            . . . . .
            . # . # .
            # # . # #
            . # . # .
            . . . . .
            """)



def cambiarModo():
    global mismoSentido
    mismoSentido=not(mismoSentido)
    mostrarModo()


def motor1_atras():
    basic.show_icon(IconNames.NO)    
    robotbit.motor_run(robotbit.Motors.M1A, -Vmax)
    while input.button_is_pressed(Button.B):
        basic.pause(tick)

def on_button_pressed_a():
    pass

def on_button_pressed_b():
    pass

#input.on_button_pressed(Button.A, on_button_pressed_a)
#input.on_button_pressed(Button.B, on_button_pressed_b)
cambiarModo()
radio.set_group(23)
basic.forever(on_forever)
