var express = require('express'), 
expressLess = require('express-less');

var app = express();
app.use('/less-css', expressLess(__dirname + '/app/css/', { compress: true }));

app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(express.static(__dirname+'/app'));

app.listen(3000);
console.log('Listening on port 3000...');