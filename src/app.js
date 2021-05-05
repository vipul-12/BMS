const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
      mysql = require('mysql'),
      myConnection = require('express-myconnection');
      

const app = express();

// importing routes
const Routes = require('./routes/routes');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: '1234',
  // port: 3306,
  database: 'bank',
  // chit fund
  multipleStatements: true
}));
app.use(express.urlencoded({extended: false}));

// routes
app.use('/', Routes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));
