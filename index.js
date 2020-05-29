var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    restful = require('node-restful'),
    mongoose = restful.mongoose;

var request = require("request");
var rp = require('request-promise');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride());
app.use('/static', express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

const uri = "mongodb+srv://black:asrkpvg7@cluster0-ogucd.mongodb.net/shortlink?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

var Short = app.short = restful.model('short', mongoose.Schema({
    long: String,
    short: String
})).methods(['get', 'post', 'put', 'delete']);
Short.register(app, '/shorts');

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/:short", function(req, res){
    Short.find({short: req.params.short}, function(e, r){
        if(e){
            res.send("Server have error - We will fix it ajust!");
            return;
        }
        if(r.length == 1){
            if(r[0].long == ""){
                res.send("Have wrong query - long EMPTY");                
            } else {
                res.render("short",{long:r[0].long});
            }
        } else {
            res.send("Have wrong query");
        }
    })
})

// Return random code
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function gen_short(cb){
    let str;
    if(cb){

    } else {
        return;
    }
    str = makeid(6);
    Short.find({short: str}, function(e, d){
        if(d.length > 0){
            gen_short(cb);
        } else {
            cb(str);
        }
    })
} 

app.post("/general", (req, res) => {
    gen_short(function(s){
        res.send({
            short: s 
        })
    });
})

app.post("/", function(req, res){
    console.log(req.body);
    if(req.body.long.indexOf("http") != 0){
        res.send({
            data: "ERROR",
            why: "Đây không phải là một đường dẫn hợp lệ!"
        })
        return;
    }
    var s = new Short(req.body);
    s.save();
    res.send({
        data: "OK"
    })
})

app.listen(80);