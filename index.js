const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const http = require('http');

//const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use('/users', users);



const apiUrl = 'http://www.omdbapi.com/?i=tt3896198&apikey=89baa03e';


app.get('/', (req, res) => {
    res.send('Working');
});

app.post('/movie', (req, res) => {


     if(req.body.result.parameters.movieName && req.body.result.parameters.plot) {
         console.log('here');
        const plot = req.body.result.parameters.plot;
        const name = req.body.result.parameters.movieName;
        console.log(apiUrl + '&t=' + name +'&plot=' + plot);
        fetch(apiUrl + '&t=' + name +'&plot=' + plot)
            .then(response => {
                response.json().then(json => {
                    return res.json({
                        speech: "Here you go",
                        displayText: json.Plot,
                        source: "first-dialogflow",
                    });
                });
            })
            .catch(error => {
                console.log(error);
            });
    }



    else if(req.body.result.parameters.movieName) {
        const name = req.body.result.parameters.movieName;
        const resp = {};
        fetch(apiUrl + '&t=' + name)
            .then(response => {
                response.json().then(json => {

                    /*console.log(json);
                    console.log('Here');
                    resp.title = json.Title;
                    resp.year = json.Year;
                    resp.director = json.Director;
                    resp.actors = json.Actors;
                    resp.plot = json.Plot;
                    resp.imdbRating = json.imdbRating;

                    console.log('Resp: ' + resp);*/

                    return res.json({
                        speech: "Here is something about " + name,
                        displayText: "The movie " + name + 'was directed by ' + json.Director + 'in the year '+ json.Year,
                        source: "first-dialogflow"
                    });
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
});

const server = http.createServer(app);

server.listen(process.env.PORT || 8008, () => {
    console.log('Server is up and running');
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
