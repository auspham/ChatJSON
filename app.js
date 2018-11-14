var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlenCoded = bodyParser.urlencoded({extended: false});
var fs = require('fs');

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

app.get('/', (req,res) => {
    console.log('running on localhost:3000');
    var file = fs.readFileSync('chat-history.json');
    (file.lastIndexOf("}") >= 0) ? res.render('index', {'data': fs.readFileSync('chat-history.json')}) : res.render('index');
})

app.post('/', urlenCoded, (req,res) => {
    var data = {
        user: req.body.user,
        message: req.body.message
    }
    var content = fs.readFileSync('chat-history.json');
    var index  = content.lastIndexOf("}");
    if(index >= 0) {
        var result = content.slice(0, index+1) + ',\n\t' + JSON.stringify(data) + '\n]'; 
    } else {
        var result = `[\n\t${JSON.stringify(data)}\n]`;
    }
    fs.writeFileSync('chat-history.json', result)
    res.render('index', {'data' : fs.readFileSync('chat-history.json')});
})


app.listen(3000);