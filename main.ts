basic.forever(function on_forever() {
    robotbit.MotorRun(robotbit.Motors.M1B, 255)
    basic.showIcon(IconNames.No)
    basic.pause(1000)
    robotbit.MotorRun(robotbit.Motors.M1B, -255)
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
})
