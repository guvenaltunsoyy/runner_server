class Event {
    createEvent(name, type, created_date, date, limit, address) {
        this.name = name;
        this.type = type;
        this.created_date = created_date;
        this.date = date;
        this.limit = limit;
        this.address = address;
        return this;
    }
}
module.exports = Event