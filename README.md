# Una Simulación de Procesos de Fabricación #

El simulador se ejecuta en una plataforma de Gamificación, se basa en una planta de ensamblaje automotriz que utiliza dispositivos Meccanos con lecciones de Realidad Virtual y Aumentada.

## ¿Para qué es este repositorio? ##

* Simulaciones
* Version 1.0.0

# Instalación  #
Debe tener instalado y configurado MongoDB o si en caso de usar MongoDB en la nube, tener a la mano la ruta de conexión, ya que se indicara en los siguientes pasos donde podrá usar esta ruta. 

Clonar el proyecto desde el repositorio con el comando proporcionado por el sistema de gestor de versiones o si ya tiene el proyecto omitir este paso:

~~~~~
    git clone https//..
~~~~~

Es requerido instalar Node en una versión superior a la 12, así como el gestor de paquetes npm y se recomienda usar PM2 para el despliegue de la aplicación.

Para instalar las dependencias puede ejecutar el comando de npm en la raíz del proyecto:

~~~~
    npm install
~~~~

Instale el gestor de procesos [PM2](http://example.com/) en el servidor o la máquina donde levantara el proyecto, ingresando al cmd en Windows o la consola en Linux.

Ejecute el comando:

~~~
    npm install pm2 -g
~~~

# Ejecución del proyecto   #
En el proyecto encontrar dos archivos de configuración **"dev-novus-tec.json"** y **"prod-novustec.json"**, los cuales contienen las configuraciones de los dos habientes de ejecución, **DESARROLLO** y **PRODUCCIÓN**.

Antes de ejecutar, debe revisar que esté configurada correctamente la ruta de la base de datos, esto en los archivos mencionados anterior mente.

Encontrará la ruta de esta manera:
~~~
"DATABASE_URI": "mongodb://localhost:27017/NovusTecDEV",
~~~

Si por alguna razón debe cambiar el puerto donde estará trabajando el proyecto, solo edite estas líneas en los archivos, cambiado el número del puerto:
~~~
"PORT": 7878,
~~~
~~~
"SERVER_URL": "http://localhost:7878/parse",
~~~
~~~
"PUBLIC_SERVER_URL": "http://localhost:7878/parse",
~~~

Para ejecutar el proyecto, debe abrir cmd en Windows o la consola en Linux, y dirigirse a la raíz del proyecto y ejecuté:
~~~
    pm2 start dev-novus-tec.json
~~~

o

~~~
    pm2 start prod-novustec.json
~~~
Según el archivo que elija correr, y listo el proyecto ya está trabajando.

# Información General #

## Ver Logs ##
Si desea ver si el proyecto se levantó correctamente ingresa en el cmd o consola y ejecute:
~~~
pm2 logs
~~~
y podrá ver que se muestra dos mensajes 
~~~
1|NovusTecDEV | Iniciando Server
1|NovusTecDEV | parse-server-example running on port 7878.
~~~
Esto indicaría que el proyecto corre sin problemas, y si surge algún error aquí aparecerá.

## Parar el proyecto #
 Si lo que desea es parar el proyecto primero ingrese el comando:
 ~~~
 pm2 list
 ~~~
 y se mostrará una tabla donde se indica el **id** del proyecto que se está ejecutando, el cual utilizaremos para detener el proyecto usando este **id**:
 ~~~
 pm2 stop id
 ~~~
 o
 ~~~
 pm2 delete id
 ~~~

## Reiniciar el Proyecto #
Para reiniciar el proyecto, cuando ya se encuentra en ejecución, solo ejecute el comando: 
~~~
pm2 restart id
~~~

## Revivir el proyecto
El proyecto cuenta la ejecución del comando **pm2 save**, este comando permite guardar en memoria el proyecto o los proyectos que pm2 están corriendo, para evitar volver a correr **pm2 stop**, **pm2 delete** y **pm2 start**, se recomienda **desde el servidor solamente** ejecutar el siguiente comando
~~~
pm2 resurrect
~~~


## Servidor
Para acceder al servidor estos son los accesos:

```
Usuario: ti_novus
Dirección IP: 10.97.85.98
Protocolo ssh puerto 22
Password: fsYZYw3j6aspRypK
Al ingresar a la terminal hacer:  sudo su
```

**Nota: Para acceder se debe realizar a través de la red del TEC, no se puede acceder de manera remota**

Una vez aplicado el comando de **sudo su** se pueden revisar la carpeta actual con **ls** para ver el repositorio del proyecto. Desde aquí se pueden ejecutar los comandos de **pm2**, o en su defecto acceder a nginx o a mongodb para revisar la información.

## MongoDB Servidor
Para acceder a mongodb desde el servidor no existe ninguna autenticación o restricción, con ejecutar los comandos abiertos de mongo se puede ver la Base de Datos la cual lleva por nombre **NovusTecDEV**.

## Nginx
El proyecto corre sobre el puerto 7878 pero para acceder sobre la ip directa se tiene configurado NGINX, su configuración se puede encontrar en la ruta /etc/nginx.

## Configuración final
Al traspaso de este repositorio se necesita para seguir cualquier desarrollo el cambiar el usuario al que apunta el mismo ya que de momento se hace con uno propio y para hacer la descarga se eliminarán las claves de ssh del servidor por seguridad.