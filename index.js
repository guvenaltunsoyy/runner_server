var express = require('express')
var db=require('./db')
var app = express()

var dbHelper = new db.DbHelper("postgres://ghnswrbvqsipfn:3303edab84a21b73e9c1d885a78d12d464a7e67b83f89b7474fe2a1a11368992@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/dfhu902s798jjf");

 
app.get('/login', function (req, res) {
  console.log(req.query);
  
  // userAuth async function olduğundan async await yapısı var
  // fonksiyonun dönüş değerini almak için then kullanıyoruz ve 
  // dönen parametreyi alan fonksiyon atıyoruz içine
  dbHelper.userAuth(req.query.username, req.query.password).then(result => { 
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ auth : result }, null, 3));
  })
})

app.get('/list',function(req,res){
  console.log(req.query);
  dbHelper.listRunners().then(result=>{
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result }, null, 3));
  }

  )
})

app.get('/create',function(req,res){
console.log(req.query);
if(dbHelper.insertRunner(req.query.name,req.query.surname,req.query.password,req.query.mail,req.query.image)){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ auth : true }, null, 3));
}
})

app.get('/update',function(req,res){
  console.log(req.query);
  if (dbHelper.updateRunner(req.query.name,req.query.surname,req.query.password,req.query.age,req.query.phoneNumber,req.query.id)) {
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({auth : true},null,3));
  }
})

app.listen(3000)