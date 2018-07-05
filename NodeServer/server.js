var express = require ('express');
var bodyParser = require ('body-parser');
var app = express();
var jwt = require('Jsonwebtoken');

const https = require('https');

var FB_ACCESS_TOKEN = "386946751736534|6LUqCTQHMtSVLkgr7ZD1O0L7UjU";
var FB_BASE_URL = "https://graph.facebook.com/"

var messages = [{text: 'some text', owner: 'Tim'}, {text: 'more text', owner: 'Jane'}];

var users = [];

app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

var api = express.Router();
var auth = express.Router();
var fb = express.Router();

fb.get('/getAccessToken', (req, res)=>{
    var self = this;
    https.get('https://graph.facebook.com/oauth/access_token?client_id=386946751736534&client_secret=7e722955b003a84ab137ac0043009c8d&grant_type=client_credentials', 
    (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // console.log(JSON.parse(data).explanation);
            
            var json = JSON.parse(data);
            self.FB_ACCESS_TOKEN = json["access_token"];
            res.send(self.FB_ACCESS_TOKEN);

            // res.json(JSON.parse(data));
        });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
})

fb.get('/searchPages/:pageName', (req, res)=> {
    var url = FB_BASE_URL +'/search?q=' + req.params.pageName +'&type=page&access_token=' + FB_ACCESS_TOKEN;

    https.get(url,
    (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var json = JSON.parse(data);
            res.json(JSON.parse(data));
        });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

fb.get('/pageFans/:pageId', (req, res)=> {
    var url = FB_BASE_URL +'/' + req.params.pageId +'?fields=fan_count&access_token=' + FB_ACCESS_TOKEN;

    https.get(url,
    (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var json = JSON.parse(data);
            res.json(JSON.parse(data));
        });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

fb.get('/pageposts/:pageid', (req, res)=> {
    var url = FB_BASE_URL +'/' + req.params.pageid +'?fields=posts.order(reverse_chronological).limit(3)&access_token=' + FB_ACCESS_TOKEN;

    https.get(url,
    (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var json = JSON.parse(data);
            res.json(JSON.parse(data));
        });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
});


fb.get('/analyzepage/:pageid', (req, res)=> {
    var url = FB_BASE_URL + req.params.pageid +'?fields=posts.order(reverse_chronological).limit(10)&access_token=' + FB_ACCESS_TOKEN;

    https.get(url,
        (resp) => {
            let data = '';
    
            resp.on('data', (chunk) => {
                data += chunk;
            });
    
            resp.on('end', () => {
                var json = JSON.parse(data);
                var ids = (json["posts"]["data"].map(it => it.id).join(','));

                var reactionsUrl = FB_BASE_URL 
                                    +'?ids=' + ids
                                    +'&fields=reactions.type(LIKE).limit(0).summary(true).as(like),reactions.type(LOVE).limit(0).summary(true).as(love),reactions.type(WOW).limit(0).summary(true).as(wow),reactions.type(HAHA).limit(0).summary(true).as(haha),reactions.type(SAD).limit(0).summary(true).as(sad),reactions.type(ANGRY).limit(0).summary(true).as(angry),reactions.type(THANKFUL).limit(0).summary(true).as(thankful)' 
                                    + '&access_token=' + FB_ACCESS_TOKEN;
                
                https.get(reactionsUrl,
                    (resp) => {
                        let data = '';
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });
                
                        resp.on('end', () => {
                            var json = JSON.parse(data);
                            res.json(json);
                        });
                
                    }).on("error", (err) => {
                      console.log("Error: " + err.message);
                    });
            });
    
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });

})

api.get('/messages', (req, res) => {
    res.json(messages);
})

api.get('/messages/:user', (req, res) => {
    var user = req.params.user;
    var result = messages.filter(message=>message.owner==user);
    res.json(result);
})

api.post('/messages', (req, res) => {
    messages.push(req.body);
    res.json(req.body);
})

api.get('/users/me', checkAuthenticated, (req, res) => {
    res.json(users[req.user]);
})

api.post('/users/me', checkAuthenticated, (req, res) => {
    var user = users[req.user];
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    res.json(user);
})

auth.post('/login', (req, res) => {
    var user = users.find(user=> user.email == req.body.email);
    console.log(users);

    if (!user) {
        sendAuthError(res);
        return;
    }

    if(user.password == req.body.password) {
        sendToken(user, res);
    }else{
        sendAuthError(res);
        return;
    }
});

auth.post('/register', (req, res) => {
    var index = users.push(req.body) -1;
    console.log('reg:', users);
    var user = users[index];
    user.id = index;
    sendToken(user, res);
})

function sendToken(user, res){
    var token = jwt.sign(user.id, '123');
    res.json({firstName: user.firstName, "token": token});
}

function sendAuthError(res){
    return res.json({success: false, message: 'email or password incorrect'});
}

function checkAuthenticated(req, res, next) {
    if(!req.header('authorization')){
        return res.status(401).send({message: 'Unauthorized requested. Missing authentication header'});
    }
    var token = req.header('authorization').split(' ')[1];

    var payload = jwt.decode(token, '123');

    if(!payload) {
        return res.status(401).send({message: 'Unauthorized requested. Authentication header is invalid.'});
    }

    req.user = payload;

    next();
}

app.use('/api', api);
app.use('/auth', auth);
app.use('/fb', fb)

app.listen(4321);