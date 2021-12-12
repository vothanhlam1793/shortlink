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
app.use(express.static('public'));
//app.use('/static', express.static('public'));
app.use(express.static('some_other_folder'));

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
    short: String,
    webhooks: Array
})).methods(['get', 'post']);
Short.register(app, '/shorts');

var Log = app.log = restful.model('log', mongoose.Schema({
    query: Object,
    date: Date,
    short: String,
    ip: String
})).methods(['get', 'post', 'put', 'delete']);
Log.register(app, '/logs');


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/:short", function(req, res){
    var forwarded = req.headers['x-real-ip']
    var ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    console.log("IP", ip);
    Short.find({short: req.params.short}, function(e, r){
        if(e){
            res.send("Server have error - We will fix it ajust!");
            return;
        }
        console.log(r);
        if(r.length == 1){
            if(r[0].long == ""){
                res.send("Have wrong query - long EMPTY");                
            } else {
                res.render("short",{long:r[0].long});
                var l = new Log({
                    query: req.query,
                    date: new Date(),
                    short: req.params.short,
                    ip: ip
                });
                l.save();
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
    if(req.body.short.length < 6){
        res.send({
            data: "ERROR",
            why: "Không thể tạo đường dẫn ngắn hơn 6 kí tự"
        })
    }
    Short.find({short: req.body.short}, function(e,r){
        if(e){
            res.send({
                data: "ERROR",
                why: "Hệ thống lưu trữ bị lỗi"
            });
            return;
        }
        if(r.length == 0){
            var s = new Short(req.body);
            s.save();
            res.send({
                data: "OK"
            })
        } else {
            res.send({
                data: "ERROR",
                why: "Không thể tạo link với code này vì có thể đã tồn tại: " + req.body.short
            });
        }
    })
})

app.get("/mon/:code", function(req, res){
    if(req.params.code != "yoursolution"){
        res.send("Hello World!. - :)");
        return;
    }
    res.render("logs");
});

app.get("/chitiet/log", function(req, res){
    res.render("elogs");
})

app.get("/logs/search/:short", function(req, res){
    Log.find({short: req.params.short}, function(e,r){
        if(e){
            res.send({
                data: "ERROR",
                why: "Database - I don't now"
            })
            return;
        }
        res.send(r);
    })
})
app.listen(7000);