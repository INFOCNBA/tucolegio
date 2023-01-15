let grupo_radio = 15
let tick = 125
// ms
let pausa_derecho = tick * 4
let pausa_giro = tick * 2
let pausa_actual = 0
let Vmax = 255
let mismoSentido = false
let reposoInhibido = true
let recibir_texto_claro = true
class comandosClase {
    cola: string[]
    ultimo_comando: string
    texto_claro: boolean
    comandos_validos: string[]
    comienza: number
    constructor(texto_claro: boolean) {
        this.cola = []
        // self.borrar_cola()
        this.ultimo_comando = ""
        this.texto_claro = texto_claro
        this.comandos_validos = ["izquierda", "derecha", "adelante", "atrás"]
        // los primeros 4 son para mover_motores(), en "texto claro"
        this.comienza = this.comandos_validos.length
        // comentar
        this.comandos_validos = this.comandos_validos.concat(["zqr", "drc", "dln", "trs"])
        // los segunos 4 son el código SECRETO correspondiente a los primeros 4
        this.ultimo_comando = "reposo"
        // ojo, esto es ultimo_comando "recibido"
        this.comandos_validos.push("" + this.ultimo_comando)
    }
    
    // el último elemento de comandos_validos siemrpe es para reposo
    public desencriptar(comando: string): string {
        let desencriptado = false
        //  for indice in range(self.comienza,len(self.comandos_validos)):
        //                          if self.comandos_validos[indice]==comando:
        //                              comando=self.comandos_validos[indice-self.comienza]
        //                              desencriptado=True
        for (let indice = this.comienza; indice < this.comandos_validos.length; indice++) {
            // el ultimo es reposo y NO va encriptado
            // if indice >= self.comienza and self.comandos_validos[indice]==comando:
            if (this.comandos_validos[indice] == comando) {
                comando = this.comandos_validos[indice - this.comienza]
                desencriptado = true
            }
            
        }
        return comando
    }
    
    // no puedo dvolver tupla... microsoft del orto!!
    public encriptar(comando: string): string {
        let letra: string;
        // resultado=comando
        let resultado = ""
        let indice = 0
        while (resultado.length < 3 && indice < comando.length) {
            letra = comando[indice]
            if (["a", "e", "i", "o", "u", "á"].indexOf(letra) < 0) {
                resultado += letra
            }
            
            indice += 1
        }
        return resultado
    }
    
    public borrar_cola() {
        this.cola = []
    }
    
    public procesar() {
        let desencriptado: boolean;
        let modo_ráfaga: boolean;
        let comando: string;
        let comando_en_claro: any;
        if (this.cola.length > 0) {
            desencriptado = false
            modo_ráfaga = false
            // inhibir botones - no hace falta
            comando = this.cola[0]
            if (this.cola.length > 1 && comando == this.cola[1]) {
                modo_ráfaga = true
            } else {
                modo_ráfaga = false
            }
            
            this.cola = this.cola.slice(1)
            // activar botones - no hace falta
            comando_en_claro = this.comandos_validos.slice(0, this.comienza).indexOf(comando) >= 0
            if (comando_en_claro && this.texto_claro) {
                desencriptado = true
            } else if (this.comandos_validos.slice(this.comienza, -1).indexOf(comando) >= 0) {
                // desencripto
                comando = this.desencriptar(comando)
                if (this.comandos_validos.slice(0, this.comienza).indexOf(comando) >= 0) {
                    desencriptado = true
                } else {
                    desencriptado = false
                }
                
            } else {
                console.log(",comandos.procesar()->ErrorNoExisteComando:" + comando)
            }
            
            if (desencriptado) {
                if (modo_ráfaga) {
                    
                } else {
                    // if comando not in ["izquierda","derecha"]: #los giros deben repetirse
                    //     print(",comandos.procesar()->CmdRepetido:"+comando)
                    // self.ultimo_comando == comando #mismo error que en Máquina de Voto Electrónico
                    this.ultimo_comando = comando
                    console.log(",comandos.procesar()->CmdNuevo:" + comando)
                }
                
                mover_motores(comando, modo_ráfaga)
            } else {
                console.log(",comandos.procesar()->ErrorDesencriptar:" + comando)
            }
            
        } else {
            console.log(",comandos.procesar()->ErrorColaVacia")
        }
        
    }
    
}

function enviar_por_radio(comando: string) {
    radio.sendString(comando)
}

function reposo() {
    
    // basic.show_icon(IconNames.DIAMOND)
    // robotbit.motor_run(robotbit.Motors.M1A, 0)
    // robotbit.motor_run(robotbit.Motors.M2B, 0)
    robotbit.MotorStopAll()
    comandos.borrar_cola()
    let comando = "reposo"
    console.log("," + comando)
    comandos.ultimo_comando = comando
    pausa_actual = 0
    mostrarModo()
}

function mover_motores(comando: string, modo_ráfaga: boolean) {
    
    let comando_válido = true
    let pausa = 0
    if (comando == "izquierda") {
        basic.showArrow(ArrowNames.NorthWest)
        robotbit.MotorRunDual(robotbit.Motors.M1A, Vmax, robotbit.Motors.M2B, Vmax)
        pausa = pausa_giro
    } else if (comando == "derecha") {
        basic.showArrow(ArrowNames.NorthEast)
        robotbit.MotorRunDual(robotbit.Motors.M1A, -Vmax, robotbit.Motors.M2B, -Vmax)
        pausa = pausa_giro
    } else if (comando == "adelante") {
        basic.showArrow(ArrowNames.North)
        robotbit.MotorRunDual(robotbit.Motors.M1A, Vmax, robotbit.Motors.M2B, -Vmax)
        pausa = pausa_derecho
    } else if (comando == "atrás") {
        basic.showArrow(ArrowNames.South)
        robotbit.MotorRunDual(robotbit.Motors.M1A, -Vmax, robotbit.Motors.M2B, Vmax)
        pausa = pausa_derecho
    } else {
        console.log(",mover_motores():ErrorNoExisteComando:" + comando)
        comando_válido = false
    }
    
    pausa_actual = +pausa
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

function on_button_pressed_b_pruebas() {
    let comando = comandos.comandos_validos[0]
    // es "izquierda" en claro
    console.log(",botonB()->" + comando)
    comandos.cola.push(comando)
    
}

function interfaz_de_usuario_texto_claro() {
    
    
    recibir_texto_claro = !recibir_texto_claro
    comandos.texto_claro = recibir_texto_claro
    if (recibir_texto_claro) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
    
}

// elif comandos.ultimo_comando != "reposo":
//     reposo()
let comandos = new comandosClase(recibir_texto_claro)
loops.everyInterval(tick, function onEvery_interval() {
    
    if (pins.digitalReadPin(DigitalPin.P0)) {
        interfaz_de_usuario_texto_claro()
    }
    
    // aceptar texto_claro o no (encriptado siempre acepta)
    pausa_actual = Math.max(pausa_actual - tick, 0)
    if (pausa_actual < tick && comandos.ultimo_comando != "reposo") {
        reposo()
    }
    
    if (comandos.cola.length > 0) {
        if (comandos.cola.indexOf("reposo") >= 0) {
            reposo()
        } else {
            comandos.procesar()
        }
        
    }
    
})
radio.onReceivedString(function on_received_string(comando: string) {
    console.log("on_received_string()->" + comando)
    comandos.cola.push(comando)
})
input.onButtonPressed(Button.A, function interfaz_de_usuario_a() {
    let indice: number;
    // atrás o izquierda
    if (mismoSentido) {
        // atrás
        indice = 3
    } else {
        // izquierda 
        indice = 0
    }
    
    let comando = comandos.comandos_validos[indice]
    if (!comandos.texto_claro) {
        // TODO: pasar a enviar_por_radio()
        // indice+=comandos.comienza #version encriptada
        // comando=comandos.comandos_validos[indice]
        comando = comandos.encriptar(comando)
    }
    
    console.log(",botonA()->" + comando)
    comandos.cola.push(comando)
    enviar_por_radio(comando)
    
})
input.onButtonPressed(Button.B, function interfaz_de_usuario_b() {
    let indice: number;
    // adelant o derecha
    if (mismoSentido) {
        // adelante
        indice = 2
    } else {
        // derecha
        indice = 1
    }
    
    let comando = comandos.comandos_validos[indice]
    if (!comandos.texto_claro) {
        // TODO: pasar a enviar_por_radio()
        // indice+=comandos.comienza #version encriptada
        // comando=comandos.comandos_validos[indice]
        comando = comandos.encriptar(comando)
    }
    
    console.log(",botonB()->" + comando)
    comandos.cola.push(comando)
    enviar_por_radio(comando)
    
})
input.onButtonPressed(Button.AB, function interfaz_de_usuario_reposo() {
    // comandos.cola.push("reposo")
    // onEvery_interval()
    reposo()
    enviar_por_radio("reposo")
})
input.onLogoEvent(TouchButtonEvent.Pressed, cambiarModo)
// reposo
cambiarModo()
radio.setGroup(grupo_radio)
