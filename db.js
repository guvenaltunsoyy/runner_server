var Runner = require('./runner.js')

var pg = require("pg");
pg.defaults.ssl = true;

//"postgres://ghnswrbvqsipfn:3303edab84a21b73e9c1d885a78d12d464a7e67b83f89b7474fe2a1a11368992@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/dfhu902s798jjf"
result = {
  'runner': {
    'username': null,
    'name': null,
    'password': null,
    'age': null,
    'phonenumber': null,
    'mail': null,
    'runcount': null,
    'title': null,
    'imageData': null,
    'state': null,
  },
  'errorCode': ''
}
var DbHelper = function (connectionURL) {
  var client = new pg.Client(connectionURL);
  client.connect();

  // burası async çünkü client.query asenkron çalışırken await kullanmamız gerekiyor
  this.userAuth = async function (username, password) {
    var result = await client.query("SELECT * FROM db_runners WHERE username = $1 AND password = $2", [username, password])
    if (result.rows.length > 0) {
      return true;
    }
    return false;
  }
  this.getMail = async function () {
    var result = await client.query("SELECT * FROM email")
    if (result.rows.length > 0) {
      return result.rows;
    }
  }
  this.getImage = async function (username) {
    var result = await client.query("SELECT image FROM db_runners WHERE username=$1", [username])
    if (result.rows.length > 0) {
      for (var i = 0; i < result.rows.length; i++) {
        result.rows[i].image = result.rows[i].image.toString();
      }
      return result.rows;
    } else {
      return false;
    }
  }
  this.getRunCount = async function (user) {
    var result = await client.query("SELECT username,runcount,image FROM db_runners WHERE username = $1", [user])
    if (result.rows.length > 0) {
      for (var i = 0; i < result.rows.length; i++) {
        result.rows[i].image = result.rows[i].image.toString();
      }
      return result.rows;
    } else {
      return false;
    }
  }

  this.listRunners = async function () {
    var result = await client.query("SELECT username,runCount,title,image FROM db_runners WHERE id!=1 ORDER BY runcount DESC LIMIT 10")
    if (result.rows.length > 0) {
      for (var i = 0; i < result.rows.length; i++) {
        result.rows[i].image = result.rows[i].image.toString();
      }
      return result.rows;
    } else
      return false;
  }


  this.insertRunner = async function (username, name, password, age, phonenumber, runcount, mail, title) {
    runcount = Math.floor(Math.random() * Math.floor(100));
    await client.query('INSERT INTO db_runners (username,name, password,age,phonenumber,runcount,mail,title,state,id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [username, name, password, age, phonenumber, runcount, mail, title, false, runcount], function (err) {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log('row inserted');
        return true;
      }
    });
  }
  this.insertRunnerImageTest = async function (username, name, password, age, phonenumber, mail, runcount, title, imageData, state) {
    runcount = Math.floor(Math.random() * Math.floor(100));
    const queryResult = await client.query('INSERT INTO db_runners (username,name, password,age,phonenumber,mail,runcount,title,image,state) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [username, name, password, age, phonenumber, mail, runcount, title, imageData, state], function (err) {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log('row inserted');
        var runners = new Runner();
        runners.createUser(username, name, password, age, phonenumber, mail, runcount, title, imageData, state);
        //result.runner = runners;
        result.runner.username = runners.username;
        result.runner.name = runners.name;
        result.runner.password = runners.password;
        result.runner.age = runners.age;
        result.runner.phonenumber = runners.phonenumber;
        result.runner.mail = runners.mail;
        result.runner.runcount = runners.runcount;
        result.runner.title = runners.title; 
        result.runner.imageData = runners.imageData;
        result.runner.state = runners.state;

        result.errorCode = '200';
        console.log('insert result : ' + JSON.stringify(result));

        return result;
      }
    });

    return result;
  }

  this.updateRunner = async function (username, name, password, age, phonenumber, id) {
    await client.query("UPDATE db_runners SET username=$1,name=$2,password=$3,age=$4,phonenumber=$5 WHERE id=$6", [username, name, password, age, phonenumber, id], function (err, result) {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log("updated.");
        return true;
      }
    })
  }
}

module.exports = { DbHelper };
