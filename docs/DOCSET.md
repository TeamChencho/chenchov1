# Planta Virtual | Convenciones de Documentación

[![Tecnológico de Monterrey](https://i.pinimg.com/originals/52/9d/ba/529dba25b1b6b5dfc697b90a08c3cf9a.png)](https://tec.mx/es/queretaro)

# Introducción 
El objetivo de este texto es dar a conocer las convenciones de documentación utilizadas en este proyecto.

# Inicidencias
Estás pueden ocurrir al momento de estar probando con los usuarios algún userstorie ya terminado. Se debe hacer lo siguiente:

1. Documentar en JIRA como inicidencia/memoria técnica.
2. Deliberar ya sea con el encargado del userstorie o con el equipo si este incidente es un BUG o una situación puede resolverse sin necesidad de utilizar el código.
3. En caso de ser un BUG se notificará y agregará a la carga de trabajo del responsable.
4. En caso de que no se agregará a la memora técnica del sistema, describiendo la incidencia, la forma de solucionarlo en un futuro y que roles pueden/tienen que intervenir en la solución.

# Documentación
En la siguiente tabla se muestra le gestión de la configuración establecida:

| Entregable | Documentos | Ubicación
| ------ | ------ | ------  
| Propuesta de Proyecto | Presentación |
| Plan de Trabajo | Diagrama de Gantt |
| Documento de Análisis | User Stories, Casos de Uso, Diagrama de Casos de Uso | AsciiDoc y PlantUML
| Documento de Diseño | Diagrama de Clases, Diagrama de Secuencia, Diagrama de Arquitectura | PlantUML
| Documento técnico de integraciones o interfaces desarrolladas en el proyecto | Propuesta de Diseño Web, iOS y Android | Figma
| Diagrama de base de datos | MER (Modelo Entidad- Relación) | 
| Manual de Usuario | AsciiDoc | Repo de Documentación |  
| Manual de Técnico | AsciiDoc | Repo de Documentación |  
| Documento de pruebas realizadas y firmadas | PDF | Impreso
| Relación de usuarios y contraseñas | Diagrama de roles |
| Inventario de Contenidos | Diagrama de Jerarquía |
| Script de Base de Datos | Node JS | Sistema Web

## Convertir AsciiDoc a PDF's
### 1. Instalar asciidoctor

    gem install asciidoctor   
    
Si no te funciona puedes consultar las siguientes url:

| Sistema Operativo | URL |
| ----------------- | ----------------- |
| Windows | http://shorturl.at/fhpqQ |
| Mac | http://shorturl.at/cEHM5 |    

### 2. Verificar instalación 
    
    asciidoctor-v

### 3. Install asciidocs-pdf

    gem install asciidoctor-pdf

Si no te funciona puedes consultar la siguientes url: http://shorturl.at/jouwC

***Mac opt***
    
    sudo gem install asciidoctor-pdf -n /usr/local/bin

### 4. Verificar instalación
    
    asciidoctor-pdf -v

### 5. Install graphviz
#### Windows:

    pip install graphviz

***Si no tienes pip instalalo o busca opciones***

#### Mac:

    brew install graphviz

### 6. Generar el pdf
    
    PlantUML
    
    asciidoctor-pdf -a icons=font -r asciidoctor-diagram CheatSheets/Adoc_Messages.adoc  


    asciidoctor-pdf -a icons=font -r CheatSheets/Adoc_Messages.adoc  

    asciidoctor-pdf -a icons=font -a pdf-theme=autocomparte-theme.yml 0_United.adoc