var express = require('express')
var db = require('./db')
var app = express()
var bodyParser = require('body-parser')
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

app.post('/create', function (req, res) {  
  console.log("CREATE: " + req.query.username + " " + req.query.password + " " + req.query.mail);
  //name, surname, password,age,phoneNumber,runcount,mail,title
  // if(dbHelper.insertRunner(req.query.username,req.query.name,req.query.password,req.query.age,req.query.phonenumber,req.query.runcount,req.query.mail,req.query.title)){
  //   res.setHeader('Content-Type', 'application/json');
  //   res.end(JSON.stringify({ auth : true }, null, 3));
  // }
  //username, name, password, age, phonenumber, mail, runcount, title,imageData,state
  dbHelper.insertRunnerImageTest(req.query.username, req.query.name, req.query.password, req.query.age, req.query.phonenumber, req.query.mail, req.query.runcount, req.query.title, req.query.imageData, req.query.state).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
    console.log(result);
    
    
  })
})

app.get('/update', function (req, res) {
  console.log(req.query);
  if (dbHelper.updateRunner(req.query.username, req.query.name, req.query.password, req.query.age, req.query.phoneNumber, req.query.id)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ auth: true }, null, 3));
  }
})

app.listen(8000)