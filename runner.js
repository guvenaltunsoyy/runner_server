class Runner {
    createUser(username, name, password, age, phonenumber, mail, runcount, title, imageData, state) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.age = age;
        this.phonenumber = phonenumber;
        this.mail = mail;
        this.runcount = runcount;
        this.title = title;
        this.imageData = imageData;
        this.state = state;
        return this;
    }
    sayHell(){
        console.log('HELLO RUNNER !!');
        
    }
}
module.exports = Runner