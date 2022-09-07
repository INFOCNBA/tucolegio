basic.forever(function () {
    robotbit.MotorRun(robotbit.Motors.M1A, 255)
    basic.showIcon(IconNames.No)
    basic.pause(1000)
    robotbit.MotorRun(robotbit.Motors.M1A, -255)
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
})
