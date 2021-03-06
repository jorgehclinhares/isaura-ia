const express     = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    Filer         = require('./src/libs/filer'),
    mongoose      = require('mongoose'),
    Config        = require('./config/config');

(function initApi() {

  const config = Config.env();

  if(!config || config == ""){
    console.log("# Ambiente não setado");
    return;
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // TODO
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  let files = Filer.load(["controllers"]);

  for (let i = 0; i < files.length; i++) {
    for (let y = 0; y < files[i].length; y++) {
      app.use(require(files[i][y]));
    }
  }

  connectDB();

  app.listen(config.port, startService);


})();

function connectDB() {
  mongoose.connect('mongodb://localhost/isaura', function(err){
    if(err) {
      console.log("Não foi possível conectaro ao Banco de Dados");
    } else{
      console.log('Banco de Dados Online');
    }
  });
}

function startService() {
  console.log('Serviço Online');
}
