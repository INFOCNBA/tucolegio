
tick=2000 #ms
Vmax=255
mismoSentido=False
reposoInhibido=True

class comandosClase():
    def __init__(self,texto_claro):
        self.cola=[] #self.borrar_cola()
        self.text_claro=texto_claro
        if texto_claro:
            self.comienza=0
        else:
            self.comienza=4
            self.comandos_validos=["izquierda","derecha","adelante","atrás", #los primeros 4 son para mover_motores(), en "texto claro"
                                "izIII", "deDDD", "adAAA", "atRRR",             #los segunos 4 son el código SECRETO correspondiente a los primeros 4
                                "reposo"] #el último elemento de comandos_validos siemrpe es para reposo



    def borrar_cola(self):
        self.cola=[]

    def procesar(self):
        if len(self.cola) > 0:
            desentriptado=False
            comando=str(self.cola.pop(0))
            if comando == self.comandos_validos[-1]: #el último elemento de comandos_validos siemrpe es para reposo
                print(",OKre")
                reposo()
            elif comando in self.comandos_validos[self.comienza:]:
                if comando in  self.comandos_validos[:self.comienza]:
                    desentriptado=True #vino en texto claro, nada que hacer
                else:
                    #desencripto
                    for indice in range(self.comienza,len(self.comandos_validos)):
                        if self.comandos_validos[indice]==comando:
                            comando=self.comandos_validos[indice-self.comienza]
                            desentriptado=True
                print(",OK"+comando[:2])
                mover_motores(comando)
            else:
                print(",ER"+comando[:2])
        else:
            print(",_")
            


def on_received_string(receivedString):
    pass

def reposo():
    #basic.show_icon(IconNames.DIAMOND)
    #robotbit.motor_run(robotbit.Motors.M1A, 0)
    #robotbit.motor_run(robotbit.Motors.M2B, 0)
    robotbit.motor_stop_all()
    mostrarModo()
    

def mover_motores(comando:str):
    if comando=="izquierda":
        basic.show_arrow(ArrowNames.NORTH_WEST)
        robotbit.motor_run_dual(robotbit.Motors.M1A, -Vmax,
                                robotbit.Motors.M2B, Vmax)
    else:
        print(",desconocido("+comando+")")

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

def on_button_pressed_a():
    #if input.button_is_pressed(Button.A):
    pass

def onEvery_interval():
    global comandos
    if len(comandos.cola)==0 or comandos.cola[-1] == "reposo":
        comandos.borrar_cola()
        reposo()
    else:
        comandos.procesar()



comandos=comandosClase(True) #adminte comandos en texto claro
loops.every_interval(tick, onEvery_interval)
#radio.on_received_string(on_received_string)
input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_logo_event(TouchButtonEvent.PRESSED, cambiarModo)
cambiarModo()
#radio.set_group(23)
