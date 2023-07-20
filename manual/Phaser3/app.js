// Import the top-level function of express
const express           = require('express');
const path              = require('path')
const expressLayouts    = require('express-ejs-layouts')
const Request           = require('request')
const bodyParser        = require('body-parser')

// Creates an Express application using the top-level function
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', ['1_global_module/views']);
app.set('view engine', 'ejs');  
app.use(expressLayouts);
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

// Define port number as 3000
const port = 4000;

// Routes HTTP GET requests to the specified path "/" with the specified callback function

app.get('/test', function(req, res) {
    res.status(200).send({status:"success",message:"Welcome To Testing API"})
});

app.get('/', function(req,res) {
    res.render('NovusTec/Administrador/Magic/index', {
        title: "Principal", 
        description:"",
        content:"Magic",
    });
});




// Make the app listen on port 3000
app.listen(port, function() {
  console.log('Server listening on http://localhost:' + port);
});