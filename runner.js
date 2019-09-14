class Runner {
    createUser(username, name, age, phonenumber, mail, runcount, title, imageData, state) {
        this.username = username;
        this.name = name;
        this.age = age;
        this.phonenumber = phonenumber;
        this.mail = mail;
        this.runcount = runcount;
        this.title = title;
        this.imageData = imageData;
        this.state = state;
        return this;
    }
}
module.exports = Runner