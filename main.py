def on_forever():
    robotbit.motor_run(robotbit.Motors.M1B, 255)
    basic.show_icon(IconNames.NO)
    basic.pause(1000)
    robotbit.motor_run(robotbit.Motors.M1B, -255)
    basic.show_icon(IconNames.YES)
    basic.pause(1000)
basic.forever(on_forever)
