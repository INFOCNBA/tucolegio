grupo_radio=23
tick=1000 #ms
Vmax=255
mismoSentido=False
reposoInhibido=True
recibir_texto_claro=False

class comandosClase():
    def __init__(self,texto_claro):
        self.cola=[] #self.borrar_cola()
        self.ultimo_comando=""
        self.texto_claro=texto_claro
        self.comandos_validos=["izquierda","derecha","adelante","atrás"] #los primeros 4 son para mover_motores(), en "texto claro"
        self.comienza=len(self.comandos_validos) #comentar
        self.comandos_validos=self.comandos_validos+["zqr", "drc", "dln", "trs"] #los segunos 4 son el código SECRETO correspondiente a los primeros 4
        self.ultimo_comando="reposo" #ojo, esto es ultimo_comando "recibido"
        self.comandos_validos.append(str(self.ultimo_comando)) #el último elemento de comandos_validos siemrpe es para reposo


    def desencriptar(self,comando):
        desencriptado=False
        # for indice in range(self.comienza,len(self.comandos_validos)):
        #                         if self.comandos_validos[indice]==comando:
        #                             comando=self.comandos_validos[indice-self.comienza]
        #                             desencriptado=True
        for indice in range(self.comienza,len(self.comandos_validos)): #el ultimo es reposo y NO va encriptado
            #if indice >= self.comienza and self.comandos_validos[indice]==comando:
            if self.comandos_validos[indice]==comando:                
                comando=self.comandos_validos[indice-self.comienza]
                desencriptado=True
        return comando #no puedo dvolver tupla... microsoft del orto!!

    def borrar_cola(self):
        self.cola=[]

    def procesar(self):
        if len(self.cola) > 0:
            desencriptado=False
            #inhibir botones - no hace falta
            comando=self.cola[0]
            self.cola=self.cola[1:]
            #activar botones - no hace falta
            comando_en_claro=comando in self.comandos_validos[:self.comienza]
            if comando_en_claro and self.texto_claro:
                desencriptado=True
            elif comando in self.comandos_validos[self.comienza:-1]: 
                #desencripto
                comando=self.desencriptar(comando)
                if comando in self.comandos_validos[:self.comienza]:
                    desencriptado=True
                else:
                    desencriptado=False
            else:
                                            print(",comandos.procesar()->ErrorNoExisteComando:"+comando)
            if desencriptado:
                if self.ultimo_comando == comando:
                    print(",comandos.procesar()->CmdRepetido:"+comando)
                else:
                    #self.ultimo_comando == comando #mismo error que en Máquina de Voto Electrónico
                    self.ultimo_comando = comando
                    print(",comandos.procesar()->CmdNuevo:"+comando)
                    mover_motores(comando)
            else:
                print(",comandos.procesar()->ErrorDesencriptar:"+comando)    
        else:
            print(",comandos.procesar()->ErrorColaVacia")
            



def on_received_string(comando):
    print("on_received_string()->"+comando)
    comandos.cola.append(comando)

def enviar_por_radio(comando):
    radio.send_string(comando)


def reposo():
    #basic.show_icon(IconNames.DIAMOND)
    #robotbit.motor_run(robotbit.Motors.M1A, 0)
    #robotbit.motor_run(robotbit.Motors.M2B, 0)
    robotbit.motor_stop_all()
    comandos.borrar_cola()
    comando="reposo"
    print(","+comando)
    comandos.ultimo_comando=comando
    mostrarModo()
    

def mover_motores(comando:str):
    if comando=="izquierda":
        basic.show_arrow(ArrowNames.NORTH_WEST)
        robotbit.motor_run_dual(robotbit.Motors.M1A, -Vmax,
                                robotbit.Motors.M2B, Vmax)
    elif comando=="derecha":
            basic.show_arrow(ArrowNames.NORTH_EAST)
            robotbit.motor_run_dual(robotbit.Motors.M1A, Vmax,
                                    robotbit.Motors.M2B, -Vmax)
    elif comando=="adelante":
                basic.show_arrow(ArrowNames.NORTH)
                robotbit.motor_run_dual(robotbit.Motors.M1A, Vmax,
                                        robotbit.Motors.M2B, Vmax)
    elif comando=="atrás":
                basic.show_arrow(ArrowNames.SOUTH)
                robotbit.motor_run_dual(robotbit.Motors.M1A, Vmax,
                                        robotbit.Motors.M2B, -Vmax)
    else:
        print(",mover_motores():ErrorNoExisteComando:"+comando)

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

def on_button_pressed_a():  #atrás o izquierda
    if mismoSentido: #atrás
        indice=3 
    else: #izquierda 
        indice=0
    if not comandos.texto_claro:
        indice+=comandos.comienza #version encriptada        
    comando=comandos.comandos_validos[indice]
    print(",botonA()->"+comando)
    comandos.cola.append(comando)
    enviar_por_radio(comando) 
    pass


def on_button_pressed_b():  #adelant o derecha
    if mismoSentido: #adelante
        indice=2
    else: #derecha
        indice=1
    if not comandos.texto_claro:
        indice+=comandos.comienza #version encriptada
    comando=comandos.comandos_validos[indice]
    print(",botonB()->"+comando)
    comandos.cola.append(comando)
    enviar_por_radio(comando)
    pass



def on_button_pressed_b_pruebas():
    comando=comandos.comandos_validos[0] #es "izquierda" en claro
    print(",botonB()->"+comando)
    comandos.cola.append(comando)
    pass


def on_button_pressed_ab():
    global recibir_texto_claro
    global comandos
    recibir_texto_claro=not(recibir_texto_claro)
    comandos.texto_claro=recibir_texto_claro
    if recibir_texto_claro:
        basic.show_icon(IconNames.YES)
    else:
        basic.show_icon(IconNames.NO)


def onEvery_interval():
    global comandos
    if len(comandos.cola)>0:
        if "reposo" in comandos.cola:
            reposo()
        else:
            comandos.procesar()

def on_gesture_shake():
    #comandos.cola.push("reposo")
    #onEvery_interval()
    reposo()
    enviar_por_radio("reposo")

comandos=comandosClase(texto_claro=recibir_texto_claro)
loops.every_interval(tick, onEvery_interval)
radio.on_received_string(on_received_string)
input.on_button_pressed(Button.A, on_button_pressed_a) 
input.on_button_pressed(Button.B, on_button_pressed_b)
input.on_button_pressed(Button.AB, on_button_pressed_ab) #aceptar texto_claro o no
input.on_logo_event(TouchButtonEvent.PRESSED, cambiarModo) #reposo
input.on_gesture(Gesture.SHAKE, on_gesture_shake)
cambiarModo()
radio.set_group(grupo_radio)
