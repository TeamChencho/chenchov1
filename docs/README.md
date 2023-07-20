# Planta Virtual

[![Tecnológico de Monterrey](https://i.pinimg.com/originals/52/9d/ba/529dba25b1b6b5dfc697b90a08c3cf9a.png)](https://tec.mx/es/queretaro)

# Introducción 
El objetivo de este texto es dar a conocer las convenciones de código utilizadas en este proyecto, éstas se utilizan a través de todas las plataformas y está dirigido a los líderes, desarrolladores, testers y de soporte técnico involucrados en el proyecto.

# Requisitos 


# Instalación 


# Metodología de Desarrollo
La metodología de desarrollo es scrum, utilizando técnicas de BDD (Behavior Driven Development)

# Arquitectura 
La arquitectura de cada una de las plataformas se debe adecuar para el uso de las técnicas antes mencionadas en conjunto con las herramientas a utilizar durante el proyecto. 

Además debe considerarse que la arquitectura debe ser lo suficientemente flexible y robusta para realizar cambios lo más eficiente y sencillo posible.

**Tomar en cuenta que puede existir más de un ambiente de desarrollo, por lo que, deberá ser sencillo agregar más y ejecutar un ambiente en específico**

# Herramientas 
Las siguientes son las herramientas que se deberán tener instaladas o con acceso durante el desarrollo, si en alguna de ellas es desconocido o falta de experiencia es importante reforzar los conocimientos para utilizarla.

| Tecnología | Uso | Liga |
| ------ | ------ | ------ |
| Discord | Comunicación | https://discord.gg/3AyZvu
| Figma | Diseño de prototipos | 

## Visual Studio Code (VSCode) 
| Plugin | Uso | Liga |
| ------ | ------ | ------ |
| AsciiDoc | Documentación de manuales |  http://shorturl.at/jpqS5
| CodeStream | Comentarios de código entre los desarrolladres | http://shorturl.at/dnstZ
| Coffe Break | Minutas | http://shorturl.at/xCV39
| LiveShare | Trabajar en el mismo documento | http://shorturl.at/ilJQV
| LiveShare Chat | Comunicación por visual studio | http://shorturl.at/imuT4
| LiveShareExtension Pack | Extensiones para live share | http://shorturl.at/cpyIZ
| LiveShareSpaces | Espacios de trabajo en vscode | http://shorturl.at/bemL3
| LiveShareWhiteboard | Trabajar en dibujos | http://shorturl.at/zCKS3
| Todo Tree | Visualizar los todos que tienes asignados | http://shorturl.at/uDMR7
| Vscode-faker | Crear información falsa para pruebas | http://shorturl.at/gwBUZ
| Wakatime | Time tracking | http://shorturl.at/bfjv9
| PlantUML | Diagramas | http://shorturl.at/svJT4
| Gantt Project | Gantt | https://www.ganttproject.biz/
 
## Visualizar los diagramas de Asciidoc en los settings de asciidoc preview:
### Edit json settings

> "asciidoc.preview.attributes": {
   >"plantuml-server-url": "http://plantuml.com/plantuml"
>}
    
- Te saldrá un error en el preview de que se ha bloqueado contenido. Dale clic y te aparece el command palette selecciona el de allow insecure content.
- Recarga el preview a veces es necesario.

Guía de ayuda http://shorturl.at/hFL06

# Servidor 
Los servidores de producción serán a través de Amazon Web Services (AWS).

# Base de Datos
### Tablas
- El nombre de las tablas es estilo Camel Case (caja camello) iniciando con mayúscula.
- No se utilizan guiones bajo

### Campos
- El nombre de los campos es estilo Camel Case (caja camello) iniciando con minúscula. 
- No se utilizan guiones bajos

# Código
### Variables
- El nombre de los campos es estilo Camel Case (caja camello) iniciando con minúscula. 
- No se utilizan guiones bajos

### Métodos
- El nombre de los campos es estilo Camel Case (caja camello) iniciando con minúscula. 
- Suficientemente explicitos
- No se utilizan guiones bajos

### Comentarios

## Web
### Identación
- Web la identación se hace con tabs de ***2*** espacios

### Documentos estáticos
El layout.ejs es el archivo base de cada archivo html tenemos tag para body, head y scripts.

En cada uno de los archivos de ejs que crees tendrás que agregar el tag de body, además tendrás que tener un archivo scripts.js donde tengas todas las librerías scripts que necesitas y un archivo css.js que tenga todas la librerías de css. 

***Siempre se debe utilizar CDN***

Para los código in-site puedes hacerlo después de cada una de las etiquetas contentFor(scripts) en el caso de js/jquery; para los css debe ser antes del body, el head. 

Si tu css/script es muy largo considera crear un nuevo archivo corresondiente en la carpeta pública sigue la misma estructura de los susbsistemas. 

# Autores
| Nombre | Correo | Roles |
|------|------|------
| Alejandro Fernández Vilchis | alfervil@meeplab.com | Scrum Master |
| Denisse Maldonado Flores | denmf@meeplab.com | Product Owner |