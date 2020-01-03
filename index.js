var express = require('express')
var db = require('./db')
const https = require('https');
var app = express()
var bodyParser = require('body-parser');
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.use(allowCrossDomain);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 10000 }));
var dbHelper = new db.DbHelper("postgres://lgkxkmshddxzvj:ab3d66ebe3160b43edb312f0387660056e121f4840e5bfd8ee9c6b8289ceca29@ec2-54-75-245-196.eu-west-1.compute.amazonaws.com:5432/dc7r3mthu333un");
//postgres://ghnswrbvqsipfn:3303edab84a21b73e9c1d885a78d12d464a7e67b83f89b7474fe2a1a11368992@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/dfhu902s798jjf

app.get('/login', function (req, res) {
  console.log(req.query);

  // userAuth async function olduğundan async await yapısı var
  // fonksiyonun dönüş değerini almak için then kullanıyoruz ve 
  // dönen parametreyi alan fonksiyon atıyoruz içine
  dbHelper.userAuth(req.query.username, req.query.password).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ auth: result }, null, 3));
  })
})

app.get('/list', function (req, res) {
  console.log(req.query);
  dbHelper.listRunners().then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
  })
})
app.get('/image', function (req, res) {
  console.log(req.query);
  dbHelper.getImage(req.query.username).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
  })
})

app.get('/email', function (req, res) {
  console.log(req.query);
  dbHelper.getMail().then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
  })
})

app.post('/runCount', function (req, res) {
  console.log(req.query);
  dbHelper.getRunCount(req.query.username).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
  })
})

app.post('/create', async function (req, res) {
  console.log(req.body.runner);
  if (req.body.runner === undefined || req.body.runner === null) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "result": "Runner undefined" }, null, 3));
  } else {
    const result = await dbHelper.insertRunnerImageTest(req.body.runner);
    //console.log("result => ", result);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
  }
})

app.post('/createEvent', async function (req, res) {
  console.log(JSON.stringify(req.body.event));
  const result = await dbHelper.createEvent(req.body.event);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ auth : result }, null, 3));
})

app.post('/addEvent', async function (req, res) {
  const result = await dbHelper.addEvent(req.body.event);
  console.log(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ auth : result }, null, 3));
})
app.get('/eventList', function (req, res) {
  dbHelper.eventList().then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
  })
})
app.get('/update', function (req, res) {
  console.log(req.query);
  if (dbHelper.updateRunner(req.query.username, req.query.name, req.query.password, req.query.age, req.query.phoneNumber, req.query.id)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ auth: true }, null, 3));
  }
})
app.post('/getUser', async function (req, res) {
  const result = await dbHelper.getUser(req.body).then(RunnerModel => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ RunnerModel }, null, 3));
  });
})

app.get('/runnerCounter', function (req, res) {
  console.log(req.query);
  if (dbHelper.runnerCounter(req.query.id)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ auth: true }, null, 3));
  }
})
//iot project endpoint started
app.get("/filled", async function (req, res) {
  https.get('https://2bw3s8zet7.execute-api.eu-west-1.amazonaws.com/dev/?fillId=5e07c1008173e316bff90356', (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.stringify(data));
      res.end(JSON.stringify(data));
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
})

app.get("/discharge", async function (req, res) {
  https.get('https://2bw3s8zet7.execute-api.eu-west-1.amazonaws.com/dev/?dischargeId=5e07c1008173e316bff90356', (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.stringify(data));
      res.end(JSON.stringify(data));
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
})
//iot project endpoint finished


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
