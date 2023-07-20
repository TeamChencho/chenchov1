var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js");

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'));

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));
var rawdataTesting = fs.readFileSync(path.resolve(__dirname, '../../prod-novustec.json'))
var TESTING_ENVIRONMENT = JSON.parse(rawdataTesting)

//log(TESTING_ENVIRONMENT.apps[0].env)

var Parse = require('parse/node');

const APP_ID = process.env.APP_ID || TESTING_ENVIRONMENT.apps[0].env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY || TESTING_ENVIRONMENT.apps[0].env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL || TESTING_ENVIRONMENT.apps[0].env.PUBLIC_SERVER_URL

var DM = 'DM'

/*
Orden de creación de las tablas Data Master en la base de datos:
1 => DMMateriaPrimaCategoria
2 => DMMateriaPrima
3 => DMMateriaPrimaInventario
4 => DMProductoFamilia
5 => DMOrderHistory
6 => DMRegiones
7 => DMPaises
8 => DMProveedores
9 => DMTransporte
10 => DMProveedoresMP
11 => DMClientes
12 => DMEmpleados
13 => DMGastos
14 => DMActivosFijos
15 => DMActivosFijosInventario
16 => DMSalaryTabulator
17 => DMProductionLinePhase
18 => DMProductionLineTemplates
*/


/*CATEGORÍA DE LA MATERIA PRIMA*/
var materiaPrimaCategoria = []

var ptrPlasticos
var ptrMetal
var ptrTornilleria
var ptrLlanta

var DMMateriaPrimaCategoria = Parse.Object.extend(DM + "MateriaPrimaCategoria");
var categoria = new DMMateriaPrimaCategoria();
categoria.set('nombre', 'Plásticos')
categoria.set('abreviatura', 'P')
categoria.set('exists', true)
categoria.set('active', true)
materiaPrimaCategoria.push(categoria)
ptrPlasticos = categoria

var DMMateriaPrimaCategoria = Parse.Object.extend(DM + "MateriaPrimaCategoria");
var categoria = new DMMateriaPrimaCategoria();
categoria.set('nombre', 'Metal')
categoria.set('abreviatura', 'M')
categoria.set('exists', true)
categoria.set('active', true)
materiaPrimaCategoria.push(categoria)
ptrMetal = categoria

var DMMateriaPrimaCategoria = Parse.Object.extend(DM + "MateriaPrimaCategoria");
var categoria = new DMMateriaPrimaCategoria();
categoria.set('nombre', 'Tornillería')
categoria.set('abreviatura', 'T')
categoria.set('exists', true)
categoria.set('active', true)
materiaPrimaCategoria.push(categoria)
ptrTornilleria = categoria

var DMMateriaPrimaCategoria = Parse.Object.extend(DM + "MateriaPrimaCategoria");
var categoria = new DMMateriaPrimaCategoria();
categoria.set('nombre', 'Llanta')
categoria.set('abreviatura', 'L')
categoria.set('exists', true)
categoria.set('active', true)
materiaPrimaCategoria.push(categoria)
ptrLlanta = categoria

Parse.Object.saveAll(materiaPrimaCategoria).then((listaCategoria) => {
    log("Se agregó correctamente las categorías")
}, (error) => {
    log(error.message)
})

/*MATERIA PRIMA*/
var arregloMateriaPrima = []

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Llantas')
materiaPrima.set('noparte', 'A142')
materiaPrima.set('codigo', 'L01')
materiaPrima.set('imagen', '/simulacion/images/tire.png')
materiaPrima.set('categoriaPtr', ptrLlanta)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Rines')
materiaPrima.set('noparte', 'A187')
materiaPrima.set('codigo', 'L02')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Tuerca ciega')
materiaPrima.set('noparte', 'A737')
materiaPrima.set('codigo', 'T-Ca')
materiaPrima.set('categoriaPtr', ptrTornilleria)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Placa S, 3 orificios')
materiaPrima.set('noparte', 'A825')
materiaPrima.set('codigo', 'M03S')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Soporte del eje')
materiaPrima.set('noparte', 'A212')
materiaPrima.set('codigo', 'MM1')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Plástico codo en L')
materiaPrima.set('noparte', 'A423')
materiaPrima.set('codigo', 'P03')
materiaPrima.set('categoriaPtr', ptrPlasticos)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Eje chico')
materiaPrima.set('noparte', 'A016')
materiaPrima.set('codigo', 'L00EC')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Eje grande')
materiaPrima.set('noparte', 'A315')
materiaPrima.set('codigo', 'L00EG')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Cubierta plástica de tornillo rojo')
materiaPrima.set('noparte', 'A238')
materiaPrima.set('codigo', 'P01-R')
materiaPrima.set('categoriaPtr', ptrPlasticos)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Engrane pequeño')
materiaPrima.set('noparte', 'A025')
materiaPrima.set('codigo', 'PEC')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Engrane plástico, grande')
materiaPrima.set('noparte', 'A326')
materiaPrima.set('codigo', 'PEG')
materiaPrima.set('categoriaPtr', ptrPlasticos)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Buje transparente')
materiaPrima.set('noparte', 'A259')
materiaPrima.set('codigo', 'PG01')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Placa U, 3 orificios')
materiaPrima.set('noparte', 'A548')
materiaPrima.set('codigo', 'M05U')
materiaPrima.set('categoriaPtr', ptrMetal)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Rondanas')
materiaPrima.set('noparte', 'A138')
materiaPrima.set('codigo', 'T-Ron')
materiaPrima.set('categoriaPtr', ptrTornilleria)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Tuerca cuadrada')
materiaPrima.set('noparte', 'A337')
materiaPrima.set('codigo', 'T-Cu')
materiaPrima.set('categoriaPtr', ptrTornilleria)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Tornillo de 40mm')
materiaPrima.set('noparte', 'B696')
materiaPrima.set('codigo', 'T40')
materiaPrima.set('categoriaPtr', ptrTornilleria)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Tornillo de 21 mm')
materiaPrima.set('noparte', 'A447')
materiaPrima.set('codigo', 'T21')
materiaPrima.set('categoriaPtr', ptrTornilleria)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)

var DMMateriaPrima = Parse.Object.extend(DM + "MateriaPrima");
var materiaPrima = new DMMateriaPrima();
materiaPrima.set('nombre', 'Tornillo de 25mm')
materiaPrima.set('noparte', 'A347')
materiaPrima.set('codigo', 'T25')
materiaPrima.set('categoriaPtr', ptrTornilleria)
materiaPrima.set('exists', true)
materiaPrima.set('active', true)
arregloMateriaPrima.push(materiaPrima)


var arregloProductoFamilia = []

Parse.Object.saveAll(arregloMateriaPrima).then((listaMateriaPrima) => {
    log("Se agregó correctamente las materias primas")

    /*FAMILIA DE PRODUCTOS*/
    var stringObjectos = '{'
    listaMateriaPrima.forEach(element => {
        stringObjectos += '"' + element.id + '":"1",'
    });
    stringObjectos = stringObjectos.substr(0, stringObjectos.length - 1)
    stringObjectos += '}'

    var DMProductoFamilia = Parse.Object.extend(DM + "ProductoFamilia");
    var productoFamilia = new DMProductoFamilia();
    productoFamilia.set('nombre', 'F1')
    productoFamilia.set('imagen', 'public/assets/families/1633117692145_195029.jpg')
    productoFamilia.set('codigo', '195029')
    productoFamilia.set('component', JSON.parse(stringObjectos))
    productoFamilia.set('exists', true)
    productoFamilia.set('active', true)
    arregloProductoFamilia.push(productoFamilia)

    var DMProductoFamilia = Parse.Object.extend(DM + "ProductoFamilia");
    var productoFamilia = new DMProductoFamilia();
    productoFamilia.set('nombre', 'Buggy')
    productoFamilia.set('imagen', 'public/assets/families/1633117634139_18205.jpg')
    productoFamilia.set('codigo', '18205')
    productoFamilia.set('component', JSON.parse(stringObjectos))
    productoFamilia.set('exists', true)
    productoFamilia.set('active', true)
    arregloProductoFamilia.push(productoFamilia)

    Parse.Object.saveAll(arregloProductoFamilia).then((listaFamiliasDeProductos) => {
        log("Se agregó correctamente las familias de productos")

        var productoPtr = _.find(arregloProductoFamilia, function (obj) { return obj.get('nombre') == 'F1' })
        var DMOrderHistory = Parse.Object.extend(DM + "OrderHistory")
        var ordenHistory = new DMOrderHistory()

        ordenHistory.set("productoPtr",productoPtr)
        ordenHistory.set("quantity",1)
        ordenHistory.set("exists",true)
        ordenHistory.set("active",true)

        ordenHistory.save().then((resultOrdenHistory)=>{
            creaActivosFijos (arregloProductoFamilia)
            log("Se agregó correctamente el historial de orden")
        }, (error)=>{
            log(error.message)
        })

    }, (error) => {
        log(error.message)
    })

}, (error) => {
    log(error.message)
})

/*INVENTARIO DE LA MATERIA PRIMA*/
var arregloMateriaPrimaInventario = []

arregloMateriaPrima.forEach(element => {

    var DMMateriaPrimaInventario = Parse.Object.extend(DM + "MateriaPrimaInventario");
    var materiaPrimaInventario = new DMMateriaPrimaInventario();
    materiaPrimaInventario.set('materaPrimaPtr', element)
    materiaPrimaInventario.set('cantidad', '1')
    materiaPrimaInventario.set('exists', true)
    materiaPrimaInventario.set('active', true)
    arregloMateriaPrimaInventario.push(materiaPrimaInventario)

});

Parse.Object.saveAll(arregloMateriaPrimaInventario).then((listaInventarioMateriasPrimas) => {
    log("Se agregó correctamente el inventario de materias primas")
}, (error) => {
    log(error.message)
})

/*REGIONES*/
var arregloRegiones = []

var DMRegiones = Parse.Object.extend(DM + "Regiones");
var region = new DMRegiones();
region.set('nombre', 'Europa')
region.set('abreviatura', '1')
region.set('exists', true)
region.set('active', true)
arregloRegiones.push(region)

var DMRegiones = Parse.Object.extend(DM + "Regiones");
var region = new DMRegiones();
region.set('nombre', 'Asia')
region.set('abreviatura', '2')
region.set('exists', true)
region.set('active', true)
arregloRegiones.push(region)

var DMRegiones = Parse.Object.extend(DM + "Regiones");
var region = new DMRegiones();
region.set('nombre', 'África')
region.set('abreviatura', '3')
region.set('exists', true)
region.set('active', true)
arregloRegiones.push(region)

var DMRegiones = Parse.Object.extend(DM + "Regiones");
var region = new DMRegiones();
region.set('nombre', 'Oceanía')
region.set('abreviatura', '4')
region.set('exists', true)
region.set('active', true)
arregloRegiones.push(region)

var DMRegiones = Parse.Object.extend(DM + "Regiones");
var region = new DMRegiones();
region.set('nombre', 'Norteamérica')
region.set('abreviatura', '5')
region.set('exists', true)
region.set('active', true)
arregloRegiones.push(region)

var DMRegiones = Parse.Object.extend(DM + "Regiones");
var region = new DMRegiones();
region.set('nombre', 'Sudamérica')
region.set('abreviatura', '6')
region.set('exists', true)
region.set('active', true)
arregloRegiones.push(region)

var DMRegiones = Parse.Object.extend(DM + "Regiones");
var region = new DMRegiones();
region.set('nombre', 'Centroamérica')
region.set('abreviatura', '7')
region.set('exists', true)
region.set('active', true)
arregloRegiones.push(region)

Parse.Object.saveAll(arregloRegiones).then((listaRegiones) => {
    log("Se agregó correctamente las regiones")
}, (error) => {
    log(error.message)
})

/*PAÍSES*/
var arregloPaises = []

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'China')
pais.set('abreviatura', 'CHN')
pais.set('paisEnvio', true)
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Estados Unidos de América')
pais.set('abreviatura', 'USA')
pais.set('paisEnvio', true)
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Hungría')
pais.set('abreviatura', 'HUN')
pais.set('paisEnvio', true)
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Malasia')
pais.set('abreviatura', 'MYS')
pais.set('paisEnvio', true)
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'México')
pais.set('abreviatura', 'MEX')
pais.set('paisEnvio', true)
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Ucrania')
pais.set('abreviatura', 'UKR')
pais.set('paisEnvio', true)
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Afganistán')
pais.set('abreviatura', 'AFG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Albania')
pais.set('abreviatura', 'ALB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Alemania')
pais.set('abreviatura', 'DEU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Andorra')
pais.set('abreviatura', 'AND')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Angola')
pais.set('abreviatura', 'AGO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Anguila')
pais.set('abreviatura', 'AIA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Antártida')
pais.set('abreviatura', 'ATA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Antigua Barbuda')
pais.set('abreviatura', 'ATG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Antillas Neerlandesas')
pais.set('abreviatura', 'ANT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Arabia Saudita')
pais.set('abreviatura', 'SAU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Argel')
pais.set('abreviatura', 'DZA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Argentina')
pais.set('abreviatura', 'ARG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Armenia')
pais.set('abreviatura', 'ARM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Aruba')
pais.set('abreviatura', 'ABW')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Australia')
pais.set('abreviatura', 'AUS')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Austria')
pais.set('abreviatura', 'AUT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Azerbaiyán')
pais.set('abreviatura', 'AZE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bahamas')
pais.set('abreviatura', 'BHS')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bahréin')
pais.set('abreviatura', 'BHR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bangladesh')
pais.set('abreviatura', 'BGD')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Barbados')
pais.set('abreviatura', 'BRB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Belarús')
pais.set('abreviatura', 'BLR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bélgica')
pais.set('abreviatura', 'BEL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Belice')
pais.set('abreviatura', 'BLZ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Benin')
pais.set('abreviatura', 'BEN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bermudas')
pais.set('abreviatura', 'BMU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bhután')
pais.set('abreviatura', 'BTN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bolivia')
pais.set('abreviatura', 'BOL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bosnia y Herzegovina')
pais.set('abreviatura', 'BIH')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Botsuana')
pais.set('abreviatura', 'BWA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Brasil')
pais.set('abreviatura', 'BRA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Brunéi')
pais.set('abreviatura', 'BRN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Bulgaria')
pais.set('abreviatura', 'BGR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Burkina Faso')
pais.set('abreviatura', 'BFA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Burundi')
pais.set('abreviatura', 'BDI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Cabo Verde')
pais.set('abreviatura', 'CPV')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Camboya')
pais.set('abreviatura', 'KHM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Camerún')
pais.set('abreviatura', 'CMR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Canadá')
pais.set('abreviatura', 'CAN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Chad')
pais.set('abreviatura', 'TCD')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Chile')
pais.set('abreviatura', 'CHL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Chipre')
pais.set('abreviatura', 'CYP')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Ciudad del Vaticano')
pais.set('abreviatura', 'VAT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Colombia')
pais.set('abreviatura', 'COL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Comoros')
pais.set('abreviatura', 'COM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Congo')
pais.set('abreviatura', 'COG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Corea del Norte')
pais.set('abreviatura', 'PRK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Corea del Sur')
pais.set('abreviatura', 'KOR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Costa de Marfil')
pais.set('abreviatura', 'CIV')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Costa Rica')
pais.set('abreviatura', 'CRI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Croacia')
pais.set('abreviatura', 'HRV')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Cuba')
pais.set('abreviatura', 'CUB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Dinamarca')
pais.set('abreviatura', 'DNK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Domínica')
pais.set('abreviatura', 'DMA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Ecuador')
pais.set('abreviatura', 'ECU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Egipto')
pais.set('abreviatura', 'EGY')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'El Salvador')
pais.set('abreviatura', 'SLV')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Emiratos Árabes Unidos')
pais.set('abreviatura', 'ARE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Eritrea')
pais.set('abreviatura', 'ERI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Eslovaquia')
pais.set('abreviatura', 'SVK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Eslovenia')
pais.set('abreviatura', 'SVN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'España')
pais.set('abreviatura', 'ESP')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Estonia')
pais.set('abreviatura', 'ETS')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Etiopía')
pais.set('abreviatura', 'ETH')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Fiji')
pais.set('abreviatura', 'FJI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Filipinas')
pais.set('abreviatura', 'PHL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Finlandia')
pais.set('abreviatura', 'FIN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Francia')
pais.set('abreviatura', 'FRA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Gabón')
pais.set('abreviatura', 'GAB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Gambia')
pais.set('abreviatura', 'GMB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Georgia')
pais.set('abreviatura', 'GEO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Georgia del Sur e Islas Sandwich del Sur')
pais.set('abreviatura', 'SGS')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Ghana')
pais.set('abreviatura', 'GHA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Gibraltar')
pais.set('abreviatura', 'GIB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Granada')
pais.set('abreviatura', 'GRD')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Grecia')
pais.set('abreviatura', 'GRC')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Groenlandia')
pais.set('abreviatura', 'GRL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guadalupe')
pais.set('abreviatura', 'GLP')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guam')
pais.set('abreviatura', 'GUM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guatemala')
pais.set('abreviatura', 'GTM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guayana')
pais.set('abreviatura', 'GUY')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guayana Francesa')
pais.set('abreviatura', 'GUF')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guernsey')
pais.set('abreviatura', 'GGY')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guinea')
pais.set('abreviatura', 'GIN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guinea Ecuatorial')
pais.set('abreviatura', 'GNQ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Guinea-Bissau')
pais.set('abreviatura', 'GNB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Haití')
pais.set('abreviatura', 'HTI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Honduras')
pais.set('abreviatura', 'HND')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Hong Kong')
pais.set('abreviatura', 'HKG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'India')
pais.set('abreviatura', 'IND')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Indonesia')
pais.set('abreviatura', 'IDN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Irak')
pais.set('abreviatura', 'IRQ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Irán')
pais.set('abreviatura', 'IRN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Irlanda')
pais.set('abreviatura', 'IRL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Isla Bouvet')
pais.set('abreviatura', 'BVT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Isla de Man')
pais.set('abreviatura', 'IMN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islandia')
pais.set('abreviatura', 'ISL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Áland')
pais.set('abreviatura', 'ALA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Caimán')
pais.set('abreviatura', 'CYM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Christmas')
pais.set('abreviatura', 'CXR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Cocos')
pais.set('abreviatura', 'CCK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Cook')
pais.set('abreviatura', 'COK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Faroe')
pais.set('abreviatura', 'FRO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Heard y McDonald')
pais.set('abreviatura', 'HMD')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Malvinas')
pais.set('abreviatura', 'KLK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Marshall')
pais.set('abreviatura', 'MHL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Norkfolk')
pais.set('abreviatura', 'NFK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Palaos')
pais.set('abreviatura', 'PLW')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Pitcairn')
pais.set('abreviatura', 'PCN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Solomón')
pais.set('abreviatura', 'SLB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Svalbard y Jan Mayen')
pais.set('abreviatura', 'SJM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Turcas y Caicos')
pais.set('abreviatura', 'TCA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Vírgenes Británicas')
pais.set('abreviatura', 'VGB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Islas Vírgenes de los Estados Unidos de América')
pais.set('abreviatura', 'VIR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Israle')
pais.set('abreviatura', 'ISR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Italia')
pais.set('abreviatura', 'ITA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Jamaica')
pais.set('abreviatura', 'JAM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Japón')
pais.set('abreviatura', 'JPN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Jersey')
pais.set('abreviatura', 'JEY')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Jordania')
pais.set('abreviatura', 'JOR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Kazajstán')
pais.set('abreviatura', 'KAZ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Kenia')
pais.set('abreviatura', 'KEN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Kirguistán')
pais.set('abreviatura', 'KGZ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Kiribati')
pais.set('abreviatura', 'KIR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Kuwait')
pais.set('abreviatura', 'KWT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Laos')
pais.set('abreviatura', 'LAO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Lesotho')
pais.set('abreviatura', 'LSO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Letonia')
pais.set('abreviatura', 'LVA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Líbano')
pais.set('abreviatura', 'LBN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Liberia')
pais.set('abreviatura', 'LBR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Libia')
pais.set('abreviatura', 'LBY')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Liechtenstein')
pais.set('abreviatura', 'LIE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Lituania')
pais.set('abreviatura', 'LTU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Luxemburgo')
pais.set('abreviatura', 'LUX')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Macao')
pais.set('abreviatura', 'MAC')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Macedonia')
pais.set('abreviatura', 'MKD')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Madagascar')
pais.set('abreviatura', 'MDG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Malawi')
pais.set('abreviatura', 'MWI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Maldivas')
pais.set('abreviatura', 'MDV')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Mali')
pais.set('abreviatura', 'MLI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Malta')
pais.set('abreviatura', 'MLT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Marruecos')
pais.set('abreviatura', 'MAR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Martinica')
pais.set('abreviatura', 'MTQ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Mauricio')
pais.set('abreviatura', 'MUS')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Mauritania')
pais.set('abreviatura', 'MRT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Mayotte')
pais.set('abreviatura', 'MYT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Micronesia')
pais.set('abreviatura', 'FSM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Moldova')
pais.set('abreviatura', 'MDA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Mónaco')
pais.set('abreviatura', 'MCO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Mongolia')
pais.set('abreviatura', 'MNG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Montenegro')
pais.set('abreviatura', 'MNE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Montserrat')
pais.set('abreviatura', 'MSR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Mozambique')
pais.set('abreviatura', 'MOZ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Myanmar')
pais.set('abreviatura', 'MMR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Namibia')
pais.set('abreviatura', 'NAM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Nauru')
pais.set('abreviatura', 'NRU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Nepal')
pais.set('abreviatura', 'NPL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Nicaragua')
pais.set('abreviatura', 'NIC')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Níger')
pais.set('abreviatura', 'NER')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Nigeria')
pais.set('abreviatura', 'NGA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Niue')
pais.set('abreviatura', 'NIU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Noruega')
pais.set('abreviatura', 'NOR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Nueva Caledonia')
pais.set('abreviatura', 'NCL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Nueva Zelanda')
pais.set('abreviatura', 'NZL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Omán')
pais.set('abreviatura', 'OMN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Países Bajos')
pais.set('abreviatura', 'NLD')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Pakistán')
pais.set('abreviatura', 'PAK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Palestina')
pais.set('abreviatura', 'PSE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Panamá')
pais.set('abreviatura', 'PAN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Papúa Nueva Guinea')
pais.set('abreviatura', 'PNG')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Paraguay')
pais.set('abreviatura', 'PRY')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Perú')
pais.set('abreviatura', 'PER')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Polinesia Francesa')
pais.set('abreviatura', 'PYF')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Polonia')
pais.set('abreviatura', 'POL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Portugal')
pais.set('abreviatura', 'PRT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Puerto Rico')
pais.set('abreviatura', 'PRI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Qatar')
pais.set('abreviatura', 'QAT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Reino Unido')
pais.set('abreviatura', 'GBR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'República Centro-Africana')
pais.set('abreviatura', 'CAF')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Republica checa')
pais.set('abreviatura', 'CZE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'República Dominicana')
pais.set('abreviatura', 'DOM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Reunión')
pais.set('abreviatura', 'REU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Ruanda')
pais.set('abreviatura', 'RWA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Rumanía')
pais.set('abreviatura', 'ROU')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Rusia')
pais.set('abreviatura', 'RUS')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Sahara Occidental')
pais.set('abreviatura', 'ESH')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Samoa')
pais.set('abreviatura', 'WSM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Samoa Americana')
pais.set('abreviatura', 'ASM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'San Bartolomé')
pais.set('abreviatura', 'BLM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'San Cristóbal y Nieves')
pais.set('abreviatura', 'KNA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'San Marino')
pais.set('abreviatura', 'SRM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'San Pedro y Miquelón')
pais.set('abreviatura', 'SPM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'San Vicente y las Granadinas')
pais.set('abreviatura', 'VCT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Santa Elena')
pais.set('abreviatura', 'SHN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Santa Lucía')
pais.set('abreviatura', 'LCA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Santo Tomé y Príncipe')
pais.set('abreviatura', 'STP')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Senegal')
pais.set('abreviatura', 'SEN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Serbia y Montenegro')
pais.set('abreviatura', 'SRB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Seychelles')
pais.set('abreviatura', 'SYC')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Sierra Leona')
pais.set('abreviatura', 'SLE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Singapur')
pais.set('abreviatura', 'SGP')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Siria')
pais.set('abreviatura', 'SYR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Somalia')
pais.set('abreviatura', 'SOM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Sri Lanka')
pais.set('abreviatura', 'LKA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Suazilandia')
pais.set('abreviatura', 'SWZ')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Sudáfrica')
pais.set('abreviatura', 'ZAF')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Sudán')
pais.set('abreviatura', 'SDN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Suecia')
pais.set('abreviatura', 'SWE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Suiza')
pais.set('abreviatura', 'CHE')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Surinam')
pais.set('abreviatura', 'SUR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Tailandia')
pais.set('abreviatura', 'THA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Tajwán')
pais.set('abreviatura', 'TWN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Tanzania')
pais.set('abreviatura', 'TZA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Tayikistan')
pais.set('abreviatura', 'TJK')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Territorio Británico del Océano Índico')
pais.set('abreviatura', 'IOT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Territorios Australes Franceses')
pais.set('abreviatura', 'ATF')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Timor-Leste')
pais.set('abreviatura', 'TLS')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Togo')
pais.set('abreviatura', 'TGO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Tokelau')
pais.set('abreviatura', 'TKL')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Tonga')
pais.set('abreviatura', 'TON')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Trinidad y Tobago')
pais.set('abreviatura', 'TTO')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Túnez')
pais.set('abreviatura', 'TUN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Turkmenistán')
pais.set('abreviatura', 'TKM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Turquía')
pais.set('abreviatura', 'TUR')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Tuvalu')
pais.set('abreviatura', 'TUV')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Uganda')
pais.set('abreviatura', 'UGA')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Uruguay')
pais.set('abreviatura', 'URY')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Uzbekistán')
pais.set('abreviatura', 'UZB')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Vanuatu')
pais.set('abreviatura', 'VUT')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Venezuela')
pais.set('abreviatura', 'VEN')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Vietnam')
pais.set('abreviatura', 'VNM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Wallis y Futuna')
pais.set('abreviatura', 'WLF')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Yemen')
pais.set('abreviatura', 'YEM')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

var DMPaises = Parse.Object.extend(DM + "Paises");
var pais = new DMPaises();
pais.set('nombre', 'Yibuti')
pais.set('abreviatura', 'DJI')
pais.set('exists', true)
pais.set('active', true)
arregloPaises.push(pais)

Parse.Object.saveAll(arregloPaises).then((listaPaises) => {
    log("Se agregó correctamente las países")
}, (error) => {
    log(error.message)
})

/*PROVEEDORES*/
var arregloProveedor = []

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '1458234')
proveedor.set("folio", '12345')
proveedor.set("nombre", 'Ansorge Min')
proveedor.set("rfc", '1234-ERT')
proveedor.set("rsSocial", 'Minería')
proveedor.set("telefono", '954211432100000000')
proveedor.set("correoElectronico", 'Ansorge@gmail.com')
proveedor.set("paginaWeb", 'http://tecniflex.biz/')
proveedor.set("cuentaBancaria", '1234566')
proveedor.set("diasCredito", '35')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '1458')
proveedor.set("folio", '123456')
proveedor.set("nombre", 'Ansorge MT')
proveedor.set("rfc", '1234-ERTS')
proveedor.set("rsSocial", 'Metalurgia')
proveedor.set("telefono", '9542114321')
proveedor.set("correoElectronico", 'Ansorge@gmail.com')
proveedor.set("paginaWeb", 'http://tecniflex.biz/')
proveedor.set("cuentaBancaria", '1234566')
proveedor.set("diasCredito", '35')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '1')
proveedor.set("folio", '43234599')
proveedor.set("nombre", 'Robert Bosch GmbH.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '2')
proveedor.set("folio", '43234598')
proveedor.set("nombre", 'ZF Friedrichshafen AG.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '3')
proveedor.set("folio", '43234597')
proveedor.set("nombre", 'Magna International Inc.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '4')
proveedor.set("folio", '43234596')
proveedor.set("nombre", 'Denso Corporation.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '5')
proveedor.set("folio", '43234595')
proveedor.set("nombre", 'Continental AG.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '6')
proveedor.set("folio", '43234594')
proveedor.set("nombre", 'Aisin Seiki Co.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '7')
proveedor.set("folio", '43234593')
proveedor.set("nombre", 'Hyundai Mobis.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '8')
proveedor.set("folio", '43234592')
proveedor.set("nombre", 'Faurecia S.A.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '9')
proveedor.set("folio", '43234591')
proveedor.set("nombre", 'Lear Corporation.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '10')
proveedor.set("folio", '43234590')
proveedor.set("nombre", 'Valeo S.A.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '11')
proveedor.set("folio", '43234589')
proveedor.set("nombre", 'ZF Holding')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '12')
proveedor.set("folio", '43234588')
proveedor.set("nombre", 'ABB México')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '13')
proveedor.set("folio", '43234587')
proveedor.set("nombre", 'Ansorge')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '14')
proveedor.set("folio", '43234586')
proveedor.set("nombre", 'Autoseat')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '15')
proveedor.set("folio", '43234585')
proveedor.set("nombre", 'Sabic')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '16')
proveedor.set("folio", '43234584')
proveedor.set("nombre", 'Basf')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '17')
proveedor.set("folio", '43234583')
proveedor.set("nombre", 'Clevite')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '18')
proveedor.set("folio", '43234582')
proveedor.set("nombre", 'Cristales Inastillables de México')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '19')
proveedor.set("folio", '43234581')
proveedor.set("nombre", 'Dana Holding Corporation')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '20')
proveedor.set("folio", '43234580')
proveedor.set("nombre", 'EAN SA')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '21')
proveedor.set("folio", '43234579')
proveedor.set("nombre", 'Reisser Schraubentechnik')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '22')
proveedor.set("folio", '43234578')
proveedor.set("nombre", 'Echlin')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '23')
proveedor.set("folio", '43234577')
proveedor.set("nombre", 'Federal Mogul')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '24')
proveedor.set("folio", '43234576')
proveedor.set("nombre", 'FPA')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '25')
proveedor.set("folio", '43234575')
proveedor.set("nombre", 'Gabriel de México')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '26')
proveedor.set("folio", '43234574')
proveedor.set("nombre", 'Gates Rubber')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '27')
proveedor.set("folio", '43234573')
proveedor.set("nombre", 'Goodyear Tire & Rubber')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '28')
proveedor.set("folio", '43234572')
proveedor.set("nombre", 'Maxion Wheels')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '29')
proveedor.set("folio", '43234571')
proveedor.set("nombre", 'Hayes Wheels Acero')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '30')
proveedor.set("folio", '43234570')
proveedor.set("nombre", 'Hella KG Hueck & Co.')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '31')
proveedor.set("folio", '43234569')
proveedor.set("nombre", 'Henkel Kgaa')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '32')
proveedor.set("folio", '43234568')
proveedor.set("nombre", 'Hitachi Automotive Systems')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '33')
proveedor.set("folio", '43234567')
proveedor.set("nombre", 'Industrias Tamer')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '34')
proveedor.set("folio", '43234566')
proveedor.set("nombre", 'Kiriu Mexicana')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '35')
proveedor.set("folio", '43234565')
proveedor.set("nombre", 'Krupp Hoesch')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '36')
proveedor.set("folio", '43234564')
proveedor.set("nombre", 'Lyondellbasell')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '37')
proveedor.set("folio", '43234563')
proveedor.set("nombre", 'Magna International')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '38')
proveedor.set("folio", '43234562')
proveedor.set("nombre", 'Parker Hannifin')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '39')
proveedor.set("folio", '43234561')
proveedor.set("nombre", 'Perkings Industries')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '40')
proveedor.set("folio", '4323456')
proveedor.set("nombre", 'Sarnamotive Blue Water')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '41')
proveedor.set("folio", '12345676')
proveedor.set("nombre", 'Sealed Power Mexicana')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '42')
proveedor.set("folio", '123434')
proveedor.set("nombre", 'SKD de México')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '43')
proveedor.set("folio", '4543221')
proveedor.set("nombre", 'TI Automotive')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '44')
proveedor.set("folio", '12323344')
proveedor.set("nombre", 'Trelleborg YSH')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '45')
proveedor.set("folio", '12324434')
proveedor.set("nombre", 'Valeo Sylvania')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '46')
proveedor.set("folio", '12343')
proveedor.set("nombre", 'Celo')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

var DMProveedores = Parse.Object.extend(DM + "Proveedores");
var proveedor = new DMProveedores();
proveedor.set("abreviatura", '47')
proveedor.set("folio", '123434')
proveedor.set("nombre", 'Reisser Schraubentechnik')
proveedor.set('exists', true)
proveedor.set('active', true)
arregloProveedor.push(proveedor)

Parse.Object.saveAll(arregloProveedor).then((listaProveedores) => {
    log("Se agregó correctamente los proveedores")
}, (error) => {
    log(error.message)
})

/*TRANSPORTE*/
var arregloTransporte = []

var DMTransporte = Parse.Object.extend(DM + "Transporte");
var transporte = new DMTransporte();
transporte.set('tipoEnvio', 'Barco')
transporte.set('lugarDestino', 'México')
transporte.set('lugarSalida', 'Hungria')
transporte.set('cantidadMin', '456')
var paisPtr = _.find(arregloPaises, function (obj) { return obj.get('abreviatura') == 'HUN' })
transporte.set('paisPtr', paisPtr)
var proveedorPtr = _.find(arregloProveedor, function (obj) { return obj.get('abreviatura') == '1' })
transporte.set('proveedorPtr', proveedorPtr)
var productoPtr = _.find(arregloMateriaPrima, function (obj) { return obj.get('codigo') == 'PEG' })
transporte.set('productoPtr', productoPtr)
transporte.set('porcentajePrecio', '23')
transporte.set('precio', '123')
transporte.set('urgente', true)
transporte.set('cantidadMax', '21')
transporte.set('diasEntrega', '23')
transporte.set('exists', true)
transporte.set('active', true)
arregloTransporte.push(transporte)

var DMTransporte = Parse.Object.extend(DM + "Transporte");
var transporte = new DMTransporte();
transporte.set('tipoEnvio', 'Avión')
transporte.set('lugarDestino', 'Veracruz')
transporte.set('lugarSalida', 'Denver')
transporte.set('cantidadMin', '6')
var paisPtr = _.find(arregloPaises, function (obj) { return obj.get('abreviatura') == 'USA' })
transporte.set('paisPtr', paisPtr)
var proveedorPtr = _.find(arregloProveedor, function (obj) { return obj.get('abreviatura') == '1' })
transporte.set('proveedorPtr', proveedorPtr)
var productoPtr = _.find(arregloMateriaPrima, function (obj) { return obj.get('codigo') == 'L01' })
transporte.set('productoPtr', productoPtr)
transporte.set('porcentajePrecio', '12')
transporte.set('precio', '32')
transporte.set('urgente', true)
transporte.set('cantidadMax', '4')
transporte.set('diasEntrega', '23')
transporte.set('exists', true)
transporte.set('active', true)
arregloTransporte.push(transporte)

var DMTransporte = Parse.Object.extend(DM + "Transporte");
var transporte = new DMTransporte();
transporte.set('tipoEnvio', 'Tren')
transporte.set('lugarDestino', 'Queretaro')
transporte.set('lugarSalida', 'Oaxaca')
transporte.set('cantidadMin', '12')
var paisPtr = _.find(arregloPaises, function (obj) { return obj.get('abreviatura') == 'MEX' })
transporte.set('paisPtr', paisPtr)
var proveedorPtr = _.find(arregloProveedor, function (obj) { return obj.get('abreviatura') == '1' })
transporte.set('proveedorPtr', proveedorPtr)
var productoPtr = _.find(arregloMateriaPrima, function (obj) { return obj.get('codigo') == 'T40' })
transporte.set('productoPtr', productoPtr)
transporte.set('porcentajePrecio', '20')
transporte.set('precio', '21')
transporte.set('urgente', true)
transporte.set('cantidadMax', '12')
transporte.set('diasEntrega', '1')
transporte.set('exists', true)
transporte.set('active', true)
arregloTransporte.push(transporte)

Parse.Object.saveAll(arregloTransporte).then((listaTransportes) => {
    log("Se agregó correctamente los transportes")
}, (error) => {
    log(error.message)
})

/*PROVEEDORES MATERIA PRIMA*/
var arregloProveedorMP = []

var DMProveedoresMP = Parse.Object.extend(DM + "ProveedoresMP");
var ProveedoresMP = new DMProveedoresMP();
var proveedorPtr = _.find(arregloProveedor, function (obj) { return obj.get('abreviatura') == '7' })
ProveedoresMP.set('proveedorPtr', proveedorPtr)
var productoPtr = _.find(arregloMateriaPrima, function (obj) { return obj.get('codigo') == 'T-Ron' })
ProveedoresMP.set('materiaPrimaPtr', productoPtr)
ProveedoresMP.set('costo', '34')
ProveedoresMP.set('cantidadMinima', '23')
ProveedoresMP.set('exists', true)
ProveedoresMP.set('active', true)
arregloProveedorMP.push(ProveedoresMP)

var DMProveedoresMP = Parse.Object.extend(DM + "ProveedoresMP");
var ProveedoresMP = new DMProveedoresMP();
var proveedorPtr = _.find(arregloProveedor, function (obj) { return obj.get('abreviatura') == '7' })
ProveedoresMP.set('proveedorPtr', proveedorPtr)
var productoPtr = _.find(arregloMateriaPrima, function (obj) { return obj.get('codigo') == 'T-Cu' })
ProveedoresMP.set('materiaPrimaPtr', productoPtr)
ProveedoresMP.set('costo', '12000')
ProveedoresMP.set('cantidadMinima', '45')
ProveedoresMP.set('exists', true)
ProveedoresMP.set('active', true)
arregloProveedorMP.push(ProveedoresMP)

var DMProveedoresMP = Parse.Object.extend(DM + "ProveedoresMP");
var ProveedoresMP = new DMProveedoresMP();
var proveedorPtr = _.find(arregloProveedor, function (obj) { return obj.get('abreviatura') == '37' })
ProveedoresMP.set('proveedorPtr', proveedorPtr)
var productoPtr = _.find(arregloMateriaPrima, function (obj) { return obj.get('codigo') == 'T25' })
ProveedoresMP.set('materiaPrimaPtr', productoPtr)
ProveedoresMP.set('costo', '23')
ProveedoresMP.set('cantidadMinima', '40')
ProveedoresMP.set('exists', true)
ProveedoresMP.set('active', true)
arregloProveedorMP.push(ProveedoresMP)

var DMProveedoresMP = Parse.Object.extend(DM + "ProveedoresMP");
var ProveedoresMP = new DMProveedoresMP();
var proveedorPtr = _.find(arregloProveedor, function (obj) { return obj.get('abreviatura') == '1' })
ProveedoresMP.set('proveedorPtr', proveedorPtr)
var productoPtr = _.find(arregloMateriaPrima, function (obj) { return obj.get('codigo') == 'T25' })
ProveedoresMP.set('materiaPrimaPtr', productoPtr)
ProveedoresMP.set('costo', '56')
ProveedoresMP.set('cantidadMinima', '67')
ProveedoresMP.set('exists', true)
ProveedoresMP.set('active', true)
arregloProveedorMP.push(ProveedoresMP)

Parse.Object.saveAll(arregloProveedorMP).then((listaProveedorMP) => {
    log("Se agregó correctamente los proveedores con su materia prima")
}, (error) => {
    log(error.message)
})

/*CLIENTES*/
var arregloClientes = []

var DMClientes = Parse.Object.extend(DM + "Clientes");
var clientes = new DMClientes();
clientes.set("nombre", 'Alberto')
clientes.set("apellidoPaterno", 'Castro')
clientes.set("apellidoMaterno", 'Figuero')
clientes.set("calle", 'Benito Juárez ')
clientes.set("numero", '4')
clientes.set("suburbio", 'colonia francesa')
clientes.set("codigoPostal", '69500')
clientes.set("ciudad", 'Mexico')
clientes.set("estado", 'Oaxaca')
clientes.set("telefono", '9541234578')
clientes.set("email", 'AlbertoFA@gmail.com')
clientes.set("creditoMonetario", '123')
clientes.set("tipoCliente", 'potencial')
clientes.set('exists', true)
clientes.set('active', true)
arregloClientes.push(clientes)


var DMClientes = Parse.Object.extend(DM + "Clientes");
var clientes = new DMClientes();
clientes.set("nombre", 'Julio')
clientes.set("apellidoPaterno", 'López')
clientes.set("apellidoMaterno", 'López')
clientes.set("calle", 'Benito Juárez ')
clientes.set("numero", '8')
clientes.set("suburbio", 'colonia francesa')
clientes.set("codigoPostal", '69780')
clientes.set("ciudad", 'Mexico')
clientes.set("estado", 'Oaxaca')
clientes.set("telefono", '9973763558')
clientes.set("email", 'Albert@gmailc.com')
clientes.set("creditoMonetario", '56')
clientes.set("tipoCliente", 'potencial')
clientes.set('exists', true)
clientes.set('active', true)
arregloClientes.push(clientes)

Parse.Object.saveAll(arregloClientes).then((listaclientes) => {
    log("Se agregó correctamente los clientes")
}, (error) => {
    log(error.message)
})

/*EMPLEADOS*/
var arregloEmpleados = []

var DMEmpleados = Parse.Object.extend(DM + "Empleados");
var empledao = new DMEmpleados();
empledao.set("idEmpleado", '123123')
empledao.set("nombre", 'Alberto')
empledao.set("apellidoPaterno", 'Catrso')
empledao.set("apellidoMaterno", 'Cruz')
empledao.set("diaInicio", '20/09/2021')
empledao.set("imss", '123123-rtur')
empledao.set("rfc", 'Rfc-u45')
empledao.set("curp", 'CAFTWDDAS5631A')
empledao.set("estadoCivil", 'soltero')
empledao.set("sexo", 'hombre')
empledao.set("calle", 'Hidalgo')
empledao.set("numero", '34')
empledao.set("suburbio", 'La venta')
empledao.set("estado", 'oaxaca')
empledao.set("ciudad", 'oaxaca')
empledao.set("salarioHora", '$120.00')
empledao.set("giro", 'obrero')
empledao.set("email", 'Alberto@gmail.com')
empledao.set("telefono", '12312323')
empledao.set("trabajo", 'obrero')
empledao.set("fechaNacimiento", '22/04/98')
empledao.set('exists', true)
empledao.set('active', true)
arregloEmpleados.push(empledao)

var DMEmpleados = Parse.Object.extend(DM + "Empleados");
var empledao = new DMEmpleados();
empledao.set("idEmpleado", '123134')
empledao.set("nombre", 'Rafael')
empledao.set("apellidoPaterno", 'Robles')
empledao.set("apellidoMaterno", 'Alberola')
empledao.set("diaInicio", '26/4/2021')
empledao.set("imss", '123123-rt')
empledao.set("rfc", 'Rfc-u45')
empledao.set("curp", 'CAFAADDAS5631A')
empledao.set("estadoCivil", 'soltero')
empledao.set("sexo", 'hombre')
empledao.set("calle", 'Morelos')
empledao.set("numero", '34')
empledao.set("suburbio", 'La venta')
empledao.set("estado", 'oaxaca')
empledao.set("ciudad", 'oaxaca')
empledao.set("salarioHora", '$120.00')
empledao.set("giro", 'obrero')
empledao.set("email", 'rafa@gmail.com')
empledao.set("telefono", '12312323')
empledao.set("trabajo", 'obrero')
empledao.set("fechaNacimiento", '23/06/78')
empledao.set('exists', true)
empledao.set('active', true)
arregloEmpleados.push(empledao)

Parse.Object.saveAll(arregloEmpleados).then((listaEmpleados) => {
    log("Se agregó correctamente los Empleados")
}, (error) => {
    log(error.message)
})

/*GASTOS*/
var arregloGastos = []

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Agua')
gastos.set("importar", '2500')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'fijo')
gastos.set("porcentaje", '0')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Gastos de Viaje')
gastos.set("importar", '150000')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'variable')
gastos.set("porcentaje", '10')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Gastos de Venta')
gastos.set("importar", '80000')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'variable')
gastos.set("porcentaje", '15')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Limpieza')
gastos.set("importar", '5000')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'fijo')
gastos.set("porcentaje", '0')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Servicios informáticos')
gastos.set("importar", '25000')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'fijo')
gastos.set("porcentaje", '0')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Servicios legales')
gastos.set("importar", '30000')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'variable')
gastos.set("porcentaje", '7')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Energía Eléctrica')
gastos.set("importar", '15000')
gastos.set("periodo", 'bimestral')
gastos.set("tipo", 'fijo')
gastos.set("porcentaje", '0')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Papelería y Utilería')
gastos.set("importar", '5000')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'fijo')
gastos.set("porcentaje", '0')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

var DMGastos = Parse.Object.extend(DM + "Gastos");
var gastos = new DMGastos();
gastos.set("cuenta", 'Combustibles y Lubricantes')
gastos.set("importar", '20000')
gastos.set("periodo", 'mensual')
gastos.set("tipo", 'variable')
gastos.set("porcentaje", '5')
gastos.set('exists', true)
gastos.set('active', true)
arregloGastos.push(gastos)

Parse.Object.saveAll(arregloGastos).then((listaGastos) => {
    log("Se agregó correctamente los gastos")
}, (error) => {
    log(error.message)
})

function creaActivosFijos ( familiaProductos ) {
    /*ACTIVOS FIJOS*/
    var arregloActivosFijos = []

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Computardora')
    activosFijos.set("descripcion", 'Computaddora desktop para ejecutivo')
    activosFijos.set("modelo", 'HP371')
    activosFijos.set("precioCosto", '50000')
    activosFijos.set("precioVenta", '40000')
    activosFijos.set("numeroSerie", 'AKDICVHDI8292')
    activosFijos.set("marca", 'HP')
    activosFijos.set("departamento", 'VENTAS')
    activosFijos.set("fechaAdquisicion", '20/09/2021')
    activosFijos.set("tiempoVida", '24')
    activosFijos.set("tarifaDepreciacion", '30')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Pistolas de Soldadura')
    activosFijos.set("descripcion", 'Pistola de soldadura de plástico de engrapado por calor')
    activosFijos.set("modelo", 'HPEVA')
    activosFijos.set("precioCosto", '1453')
    activosFijos.set("precioVenta", '1000')
    activosFijos.set("numeroSerie", 'PS219')
    activosFijos.set("marca", 'Hot Stapler Machine')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '11/12/21')
    activosFijos.set("tiempoVida", '665')
    activosFijos.set("tarifaDepreciacion", '12')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Banco de rodillos RR 220d')
    activosFijos.set("descripcion", '"Es un doble rodillo que permite someter a esfuerzos y trazar curvas características de potencia, torque, perdida y aceleración en una amplia gama de vehículos livianos estándar y de competición hasta 400 HP. "')
    activosFijos.set("modelo", 'RR 220d')
    activosFijos.set("precioCosto", '4000')
    activosFijos.set("precioVenta", '2000')
    activosFijos.set("numeroSerie", 'BR220')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '878')
    activosFijos.set("tarifaDepreciacion", '12')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Módulos de abocardado de tuberías')
    activosFijos.set("descripcion", '"Para el montaje de la estructura inferior de los asientos"')
    activosFijos.set("modelo", 'Agme PH-50')
    activosFijos.set("precioCosto", '20000')
    activosFijos.set("precioVenta", '5000')
    activosFijos.set("numeroSerie", 'MAT221')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '879')
    activosFijos.set("tarifaDepreciacion", '12')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Máquina para montaje automático de bisagras')
    activosFijos.set("descripcion", '"Carga automática o semiautomática de componentes, conformado y calibrado de casquillos, Remachado CNC de piezas, etc …"')
    activosFijos.set("modelo", 'AGME RR-16')
    activosFijos.set("precioCosto", '45320')
    activosFijos.set("precioVenta", '5000')
    activosFijos.set("numeroSerie", 'MMA222')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '880')
    activosFijos.set("tarifaDepreciacion", '13')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Máquina para el montaje y engrasado de rótulas')
    activosFijos.set("descripcion", '"Manipulación, montaje, engrasado y control de componentes"')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '50000')
    activosFijos.set("precioVenta", '6001')
    activosFijos.set("numeroSerie", 'MME223')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '881')
    activosFijos.set("tarifaDepreciacion", '14')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Máquina para inserción casquillos')
    activosFijos.set("descripcion", 'Integración de dos procesos una misma máquina: inserción de casquillos y remachado')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '45500')
    activosFijos.set("precioVenta", '6000')
    activosFijos.set("numeroSerie", 'MIC224')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '782')
    activosFijos.set("tarifaDepreciacion", '15')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Máquina especiales de control y marcaje de componentes')
    activosFijos.set("descripcion", '"Brochado y alineación de componentes. Así mismo, el marcaje láser de los piezas."')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '50000')
    activosFijos.set("precioVenta", '6001')
    activosFijos.set("numeroSerie", 'MEC225')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '883')
    activosFijos.set("tarifaDepreciacion", '16')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Maquinaria especial para la inserción de muelles')
    activosFijos.set("descripcion", 'Inserción de muelles en subconjuntos previamente montados de componentes de asientos')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '20000')
    activosFijos.set("precioVenta", '3000')
    activosFijos.set("numeroSerie", 'MEI226')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '884')
    activosFijos.set("tarifaDepreciacion", '17')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Maquinaria especial para inserción de tornillos')
    activosFijos.set("descripcion", 'Se consigue automatizar el proceso de enmangado')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '20000')
    activosFijos.set("precioVenta", '3001')
    activosFijos.set("numeroSerie", 'MEIT227')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '585')
    activosFijos.set("tarifaDepreciacion", '18')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Máquinas de control de estanqueidad')
    activosFijos.set("descripcion", 'Para controlar la estanqueidad de válvulas')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '15000')
    activosFijos.set("precioVenta", '5000')
    activosFijos.set("numeroSerie", 'MCE228')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '886')
    activosFijos.set("tarifaDepreciacion", '19')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Maquinaria especial para montaje de guías de asientos para coches')
    activosFijos.set("descripcion", 'Puesto de doblado de jaulas con bolas; puesto de engrasado de la guía inferior; puesto de ensamblado de jaulas con bolas sobre la guía superior y ambos sobre la guía inferior.')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '18000')
    activosFijos.set("precioVenta", '5001')
    activosFijos.set("numeroSerie", 'MEM229')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '887')
    activosFijos.set("tarifaDepreciacion", '20')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Maquinaria especial para deformación de tubos')
    activosFijos.set("descripcion", '" Realizar operaciones de deformación de tubos de forma rápida, eficaz y segura en un tiempo de ciclo de 7 s."')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '15000')
    activosFijos.set("precioVenta", '5002')
    activosFijos.set("numeroSerie", 'MED230')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '888')
    activosFijos.set("tarifaDepreciacion", '21')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Maquinaria ensamblaje automático de componentes de automoción')
    activosFijos.set("descripcion", 'Robots integrados para su automatización')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '40000')
    activosFijos.set("precioVenta", '5003')
    activosFijos.set("numeroSerie", 'MEM231')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '5000')
    activosFijos.set("tarifaDepreciacion", '22')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Maquinaria de ensamblaje de bisagras para coches')
    activosFijos.set("descripcion", '"Alimentación de componentes, rebordeado de casquillos, remachado de bisagras, control de presencia y posición de los componentes, control de par de giro, presión y recorrido, marcaje y selección de piezas buenas y malas."')
    activosFijos.set("modelo", 'AGME')
    activosFijos.set("precioCosto", '75000')
    activosFijos.set("precioVenta", '5004')
    activosFijos.set("numeroSerie", 'MEM232')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '890')
    activosFijos.set("tarifaDepreciacion", '23')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Sistema de robot para pintura')
    activosFijos.set("descripcion", '"Integrando el cambiador de color y las válvulas de control de fluido, se reduce las pérdidas de pintura y el tiempo de cambio de color, mejorándose el tiempo de ciclo. "')
    activosFijos.set("modelo", 'P-200E')
    activosFijos.set("precioCosto", '60500')
    activosFijos.set("precioVenta", '2000')
    activosFijos.set("numeroSerie", 'PSP233')
    activosFijos.set("marca", 'AGME')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '1200')
    activosFijos.set("tarifaDepreciacion", '24')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Transportador para la industria del automóvil')
    activosFijos.set("descripcion", 'Se realiza en el plano aéreo y está diseñado en principio para el transporte de mercancía en perchas.')
    activosFijos.set("modelo", 'KNAPP')
    activosFijos.set("precioCosto", '80000')
    activosFijos.set("precioVenta", '2000')
    activosFijos.set("numeroSerie", 'TIA234')
    activosFijos.set("marca", 'KNAPP')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '892')
    activosFijos.set("tarifaDepreciacion", '25')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Transportador con cadena')
    activosFijos.set("descripcion", 'ransporta automóviles que se encuentran en distintas etapas de la producción dentro de una fábrica. Puede usar monorriel aéreo o sobre el suelo.')
    activosFijos.set("modelo", 'Ramrun')
    activosFijos.set("precioCosto", '90000')
    activosFijos.set("precioVenta", '20000')
    activosFijos.set("numeroSerie", 'TCA235')
    activosFijos.set("marca", 'Ramrun')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '793')
    activosFijos.set("tarifaDepreciacion", '26')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'Transportador de banda')
    activosFijos.set("descripcion", '"transportadores de rodillos, transportadores de cadena, transportadores de banda, transportadores de suelo, transportadores inclinados"')
    activosFijos.set("modelo", 'THIMON')
    activosFijos.set("precioCosto", '70000')
    activosFijos.set("precioVenta", '39000')
    activosFijos.set("numeroSerie", 'TBT236')
    activosFijos.set("marca", 'THIMON')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '894')
    activosFijos.set("tarifaDepreciacion", '27')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    var DMActivosFijos = Parse.Object.extend(DM + "ActivosFijos");
    var activosFijos = new DMActivosFijos();
    activosFijos.set("nombre", 'cuba de pintura')
    activosFijos.set("descripcion", 'Construida en acero revestida interiormente con un aislante eléctrico')
    activosFijos.set("modelo", 'O01')
    activosFijos.set("precioCosto", '20000')
    activosFijos.set("precioVenta", '3000')
    activosFijos.set("numeroSerie", 'CUB237')
    activosFijos.set("marca", 'O01')
    activosFijos.set("departamento", 'Producción')
    activosFijos.set("fechaAdquisicion", '15/12/21')
    activosFijos.set("tiempoVida", '9000')
    activosFijos.set("tarifaDepreciacion", '10')
    activosFijos.set('exists', true)
    activosFijos.set('active', true)
    arregloActivosFijos.push(activosFijos)

    Parse.Object.saveAll(arregloActivosFijos).then((listaActivosFijos) => {
        log("Se agregó correctamente los activos fijos")
        crearTabulador(arregloActivosFijos, familiaProductos)
    }, (error) => {
        log(error.message)
    })

    /*INVENTARIO DE ACTIVOS FIJOS*/
    var arregloInventarioActivosFijos = []

    var DMActivosFijosInventario = Parse.Object.extend(DM + "ActivosFijosInventario");
    var inventarioActivosFijos = new DMActivosFijosInventario();
    var activoFijoPtr = _.find(arregloActivosFijos, function (obj) { return obj.get('numeroSerie') == 'AKDICVHDI8292' })
    inventarioActivosFijos.set("activoFijoPtr", activoFijoPtr)
    inventarioActivosFijos.set("cantidad", '1')
    inventarioActivosFijos.set('exists', true)
    inventarioActivosFijos.set('active', true)
    arregloInventarioActivosFijos.push(inventarioActivosFijos)

    Parse.Object.saveAll(arregloInventarioActivosFijos).then((listaInventarioActivosFijos) => {
        log("Se agregó correctamente el inventario de activos fijos")
    }, (error) => {
        log(error.message)
    })
}

function crearTabulador(arregloAF, arregloPF){

    //TABULADOR DE SALARIO
    var arregloSalaryTabulator = []

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Oper")
    salaryTabulator.set("department","Explosion of materials")
    salaryTabulator.set("salary","9000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Oper")
    salaryTabulator.set("department","Production line")
    salaryTabulator.set("salary","9000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Admin")
    salaryTabulator.set("department","Suppliers")
    salaryTabulator.set("salary","9000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Admin")
    salaryTabulator.set("department","Orders")
    salaryTabulator.set("salary","7000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Admin")
    salaryTabulator.set("department","Employees")
    salaryTabulator.set("salary","6000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Admin")
    salaryTabulator.set("department","Finance")
    salaryTabulator.set("salary","13000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Admin")
    salaryTabulator.set("department","Sales")
    salaryTabulator.set("salary","12000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    var DMSalaryTabulator = Parse.Object.extend(DM + "SalaryTabulator");
    var salaryTabulator   = new DMSalaryTabulator()
    salaryTabulator.set("area","Admin")
    salaryTabulator.set("department","Purchasing")
    salaryTabulator.set("salary","10000")
    salaryTabulator.set("exists",true)
    salaryTabulator.set("active",true)
    arregloSalaryTabulator.push(salaryTabulator)

    Parse.Object.saveAll(arregloSalaryTabulator).then((resultSalaryTabulator)=>{
        //agregarPlatillaLineaProducto ( arregloActivosFijos, arregloSalaryTabulator)
        log("Se agregó correctamente el tabulador de salario")
        crearPhaseYTemaplate(arregloAF, arregloPF, arregloSalaryTabulator)
    }, (error)=>{
        log(error.message)
    })
}

function crearPhaseYTemaplate(arrayAF, arryPF, arrayTB){
    /*LINEA DE PRODUCCIÓN*/

    var   arrayProductionLinePhase = []
    var arrayFixedAssets = (data, serialNumber, numero) => {
        let json   = {}
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < serialNumber.length; j++) {
                    if ( data[i].get("numeroSerie") == serialNumber[j] ) {
                        json[data[i].id]=Number(numero)
                        break
                    }
                }
            }
        return json
        }

    var arrayEmployees = (arregloSalaryTabulator,department, numero) => {
            let json   = {}
            for (let i = 0; i < arregloSalaryTabulator.length; i++) {
                if(arregloSalaryTabulator[i].get("department") == department){
                    json[arregloSalaryTabulator[i].id] = Number(numero)
                }
            }
            return json
        }
    var fixedAssets = arrayFixedAssets (arrayAF,["MEC225"],2)
    var employee = arrayEmployees(arrayTB,"Production line",3)
    var DMProductionLinePhase = Parse.Object.extend(DM + "ProductionLinePhases")
    var productionLinePhase  = new DMProductionLinePhase ()
        productionLinePhase.set("name","Cutting of metal parts")
        productionLinePhase.set("fixedAssetDMPtr",fixedAssets)
        productionLinePhase.set("quantityEmployees",employee)
        productionLinePhase.set("hoursFinishPhase",5)
        productionLinePhase.set("exists",true)
        productionLinePhase.set("active",true)
        arrayProductionLinePhase.push(productionLinePhase)

        fixedAssets = arrayFixedAssets (arrayAF,["MEI226","PS219","MEIT227","TBT236"],5)
    var employee = arrayEmployees(arrayTB,"Production line",5)
    var DMProductionLinePhase = Parse.Object.extend(DM + "ProductionLinePhases")
    var productionLinePhase  = new DMProductionLinePhase ()
        productionLinePhase.set("name","Chassis and body assembly")
        productionLinePhase.set("fixedAssetDMPtr",fixedAssets)
        productionLinePhase.set("quantityEmployees",employee)
        productionLinePhase.set("hoursFinishPhase",12)
        productionLinePhase.set("exists",true)
        productionLinePhase.set("active",true)
        arrayProductionLinePhase.push(productionLinePhase)

        fixedAssets = arrayFixedAssets (arrayAF,["CUB237","PSP233","TIA234"],4)
    var employee = arrayEmployees(arrayTB,"Production line",6)
    var DMProductionLinePhase = Parse.Object.extend(DM + "ProductionLinePhases")
    var productionLinePhase  = new DMProductionLinePhase ()
        productionLinePhase.set("name","Paint")
        productionLinePhase.set("fixedAssetDMPtr",fixedAssets)
        productionLinePhase.set("quantityEmployees",employee)
        productionLinePhase.set("hoursFinishPhase",4)
        productionLinePhase.set("exists",true)
        productionLinePhase.set("active",true)
        arrayProductionLinePhase.push(productionLinePhase)

        fixedAssets = arrayFixedAssets (arrayAF,["MAT221","MME223","MCE228","MED230","MEM231"],7)
    var employee = arrayEmployees(arrayTB,"Production line",8)
    var DMProductionLinePhase = Parse.Object.extend(DM + "ProductionLinePhases")
    var productionLinePhase  = new DMProductionLinePhase ()
        productionLinePhase.set("name","Assembly of mechanical parts")
        productionLinePhase.set("fixedAssetDMPtr",fixedAssets)
        productionLinePhase.set("quantityEmployees",employee)
        productionLinePhase.set("hoursFinishPhase",5)
        productionLinePhase.set("exists",true)
        productionLinePhase.set("active",true)
        arrayProductionLinePhase.push(productionLinePhase)

        fixedAssets = arrayFixedAssets (arrayAF,["BR220","MMA222","MIC224","MEM232","TCA235"],5)
    var employee = arrayEmployees(arrayTB,"Production line",7)
    var DMProductionLinePhase = Parse.Object.extend(DM + "ProductionLinePhases")
    var productionLinePhase  = new DMProductionLinePhase ()
        productionLinePhase.set("name","Exterior termination")
        productionLinePhase.set("fixedAssetDMPtr",fixedAssets)
        productionLinePhase.set("quantityEmployees",employee)
        productionLinePhase.set("hoursFinishPhase",3)
        productionLinePhase.set("exists",true)
        productionLinePhase.set("active",true)
        arrayProductionLinePhase.push(productionLinePhase)

        fixedAssets = arrayFixedAssets (arrayAF,["MEM229"],4)
    var employee = arrayEmployees(arrayTB,"Production line",3)
    var DMProductionLinePhase = Parse.Object.extend(DM + "ProductionLinePhases")
    var productionLinePhase  = new DMProductionLinePhase ()
        productionLinePhase.set("name","Interior finishes")
        productionLinePhase.set("fixedAssetDMPtr",fixedAssets)
        productionLinePhase.set("quantityEmployees",employee)
        productionLinePhase.set("hoursFinishPhase",5)
        productionLinePhase.set("exists",true)
        productionLinePhase.set("active",true)
        arrayProductionLinePhase.push(productionLinePhase)

    Parse.Object.saveAll(arrayProductionLinePhase).then((rersulPhases)=>{
        log("Se agregaron correctamente las las fases de líneas de producción")

        //Creación de la plantilla de linea de produccion
        var arrayPhasesPtr  = []
        var arayhoursPhases = []
        var arrayQuantityFixedAsset = []
        var hoursFinalProduct = 0
        for (let i = 0; i < arrayProductionLinePhase.length; i++) {
            arrayPhasesPtr.push(arrayProductionLinePhase[i].id)
            arayhoursPhases.push(arrayProductionLinePhase[i].get("hoursFinishPhase"))
            hoursFinalProduct += parseInt(arrayProductionLinePhase[i].get("hoursFinishPhase"))
            arrayQuantityFixedAsset.push(arrayProductionLinePhase[i].get("fixedAssetDMPtr"))
        }
        var arregloProductionLineTempletates = []
        var DMProductionLineTemplates = Parse.Object.extend(DM + "ProductionLineTemplates")
        var productionLineTempletate  = new DMProductionLineTemplates ()
            productionLineTempletate.set("name","Production Line F1")
            productionLineTempletate.set("productFamilyDMPtr",arryPF[0])
            productionLineTempletate.set("phases",arrayPhasesPtr)
            productionLineTempletate.set("hoursPhases",arayhoursPhases)
            productionLineTempletate.set("hoursFinalProduct",Number(hoursFinalProduct))
            productionLineTempletate.set("quantityFixedAssets",arrayQuantityFixedAsset)
            productionLineTempletate.set("exists",true)
            productionLineTempletate.set("active",true) 

            arregloProductionLineTempletates.push(productionLineTempletate)

        var DMProductionLineTemplates = Parse.Object.extend(DM + "ProductionLineTemplates")
        var productionLineTempletate  = new DMProductionLineTemplates ()
            productionLineTempletate.set("name","Production Line Buggy")
            productionLineTempletate.set("productFamilyDMPtr",arryPF[0])
            productionLineTempletate.set("phases",arrayPhasesPtr)
            productionLineTempletate.set("hoursPhases",arayhoursPhases)
            productionLineTempletate.set("hoursFinalProduct",Number(hoursFinalProduct))
            productionLineTempletate.set("quantityFixedAssets",arrayQuantityFixedAsset)
            productionLineTempletate.set("exists",true)
            productionLineTempletate.set("active",true) 

            arregloProductionLineTempletates.push(productionLineTempletate)
            
            Parse.Object.saveAll( arregloProductionLineTempletates ).then( ( resultTempleate ) => {
                log("Se agregaron correctamente las plantillas de líneas de producción")
            }, ( error ) => {
                log(error.message)
            })
        
    }, ( error ) => {
        log(error.message)
    })
     
}