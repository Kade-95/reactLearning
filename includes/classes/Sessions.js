class Sessions {
    constructor(id) {
        this._id = id;
    }

    async read() {
        return await db.find({ collection: 'sessions', query: { _id: this._id }, projection: { _id: 0 } });
    }

    async write() {
        this.time = new Date().getTime();
        return await db.save({ collection: 'sessions', query: this });
    }

    store(req, res) {
        loginURL = 'http://' + req.headers['host'] + '/' + '#?login';

        var time = new Date().getTime(),
            duration = time - 600000;
        this.read().then(result => {
            if (!bFunc.isnull(result)) {
                // is session in database
                Object.keys(result).map(key => {
                    this[key] = result[key];
                });
            } else {
                delete this.userID;
            }

            if (bFunc.isset(this.userID) && !bFunc.isnull(result) && !bFunc.isnull(result.time) && result.time < duration) {
                // has user session expired
                delete this.userID;
                this.write().then(result => {
                    view.createView(req, res, this);
                }).catch(error => {
                    console.log('expired-session_write_error=> ' + error);
                });
            }
            else if (!bFunc.isset(this.userID) && bFunc.isnull(result)) {
                persistence.checkCredentials(res).then(result => {
                    // is user persistent
                    this.userID = result.userID;
                    if (typeof result != "object") delete this.userID;
                    this.write().then(result => {
                        view.createView(req, res, this);
                    }).catch(error => {
                        console.log('persistence-session_write_error=> ' + error);
                    });
                    return;
                });
            }
            else {
                this.write().then(result => {
                    view.createView(req, res, this);
                }).catch(error => {
                    console.log('else-session_write_error=> ' + error);
                });
            }
        });
    }

    set(item) {
        for (var i of item) if (bFunc.isset(i.name)) this[i.name] = i.value
        this.write();
    }

    unset(item) {
        for (var i of item) delete this[i];
        this.write();
    }

    async destroy() {
        return await db.delete({ collection: 'sessions', query: { _id: this._id } });
    }

    isExpired() {
        var time = new Date().getTime();
        var duration = 600000;
        return new Promise((resolve, reject)=>{
            db.find({ collection: 'sessions', query: { _id: this._id }, projection: { _id: 0, time: 1 } }).then(result=>{
                if (bFunc.isnull(result) || bFunc.isnull(result.time)) {
                    if (bFunc.isset(this.userID)) delete this.userID;
                    resolve(true);
                }
                else if ((result.time < (time - duration))) {
                    this.destroy().then(res => {
                        resolve(true)
                    }).catch(err => {
                        reject('expired_session unable to destroy=> ' + err)
                    });
                }
                else {
                    resolve(false);
                }
            }).catch(err=>{
                reject('could not determine if session expired=> ' + err);
            });
        });
    }
}

module.exports = Sessions;