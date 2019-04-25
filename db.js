var pg = require("pg");
pg.defaults.ssl = true;

//"postgres://ghnswrbvqsipfn:3303edab84a21b73e9c1d885a78d12d464a7e67b83f89b7474fe2a1a11368992@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/dfhu902s798jjf"

var DbHelper = function (connectionURL) {
  var client = new pg.Client(connectionURL);
  client.connect();

  // burası async çünkü client.query asenkron çalışırken await kullanmamız gerekiyor
  this.userAuth = async function (mail, password) {
    var result = await client.query("SELECT * FROM db_runners WHERE mail = $1 AND password = $2", [mail, password])
    if (result.rows.length > 0) {
      return true;
    }
    return false;
  }

  this.listRunners = async function () {
    var result = await client.query("SELECT name,runCount FROM db_runners")
    if (result.rows.length > 0) {
      return result.rows;
    } else
      return false;
  }

  this.insertRunner = async function (name, surname, password, mail, image) {
    await client.query('INSERT INTO db_runners (name,surname,password,mail,image) VALUES ($1,$2,$3,$4,pg_read_file($5)::bytea)', [name, surname, password, mail, image], function (err, result) {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log('row inserted');
        return true;
      }
    });
  }

  this.updateRunner = async function (name, surname, password, age, phoneNumber, id) {
    await client.query("UPDATE db_runners SET name=$1,surname=$2,password=$3,age=$4,phoneNumber=$5 WHERE id=$6", [name, surname, password, age, phoneNumber, id], function (err, result) {
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
