let tick = 2000
// ms
let Vmax = 255
let mismoSentido = false
let reposoInhibido = true
class comandosClase {
    cola: any[]
    text_claro: boolean
    comienza: number
    comandos_validos: string[]
    constructor(texto_claro: boolean) {
        this.cola = []
        // self.borrar_cola()
        this.text_claro = texto_claro
        if (texto_claro) {
            this.comienza = 0
        } else {
            this.comienza = 4
            this.comandos_validos = ["izquierda", "derecha", "adelante", "atrás", "izIII", "deDDD", "adAAA", "atRRR", "reposo"]
        }
        
    }
    
    // los primeros 4 son para mover_motores(), en "texto claro"
    // los segunos 4 son el código SECRETO correspondiente a los primeros 4
    // el último elemento de comandos_validos siemrpe es para reposo
    public borrar_cola() {
        this.cola = []
    }
    
    public procesar() {
        let desentriptado: boolean;
        let comando: string;
        if (this.cola.length > 0) {
            desentriptado = false
            comando = "" + _py.py_array_pop(this.cola, 0)
            if (comando == this.comandos_validos[-1]) {
                // el último elemento de comandos_validos siemrpe es para reposo
                console.log(",OKre")
                reposo()
            } else if (this.comandos_validos.slice(this.comienza).indexOf(comando) >= 0) {
                if (this.comandos_validos.slice(0, this.comienza).indexOf(comando) >= 0) {
                    desentriptado = true
                } else {
                    // vino en texto claro, nada que hacer
                    // desencripto
                    for (let indice = this.comienza; indice < this.comandos_validos.length; indice++) {
                        if (this.comandos_validos[indice] == comando) {
                            comando = this.comandos_validos[indice - this.comienza]
                            desentriptado = true
                        }
                        
                    }
                }
                
                console.log(",OK" + comando.slice(0, 2))
                mover_motores(comando)
            } else {
                console.log(",ER" + comando.slice(0, 2))
            }
            
        } else {
            console.log(",_")
        }
        
    }
    
}

function on_received_string(receivedString: any) {
    
}

function reposo() {
    // basic.show_icon(IconNames.DIAMOND)
    // robotbit.motor_run(robotbit.Motors.M1A, 0)
    // robotbit.motor_run(robotbit.Motors.M2B, 0)
    robotbit.MotorStopAll()
    mostrarModo()
}

function mover_motores(comando: string) {
    if (comando == "izquierda") {
        basic.showArrow(ArrowNames.NorthWest)
        robotbit.MotorRunDual(robotbit.Motors.M1A, -Vmax, robotbit.Motors.M2B, Vmax)
    } else {
        console.log(",desconocido(" + comando + ")")
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

let comandos = new comandosClase(true)
// adminte comandos en texto claro
loops.everyInterval(tick, function onEvery_interval() {
    
    if (comandos.cola.length == 0 || comandos.cola[-1] == "reposo") {
        comandos.borrar_cola()
        reposo()
    } else {
        comandos.procesar()
    }
    
})
// radio.on_received_string(on_received_string)
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    // if input.button_is_pressed(Button.A):
    
})
input.onLogoEvent(TouchButtonEvent.Pressed, cambiarModo)
cambiarModo()
