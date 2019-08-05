class PostHandler {
    constructor() {
    }

    act(query, req, res) {
        this.query = query;
        this.action = escape(query.action.value.toString());
        if (this.action != 'checkLogin') {
            sessions[sessionID].write();
        }

        if (!bFunc.isset(sessions[sessionID].userID) && this.action != 'checkLogin' && this.action != 'loginUser') {
            res.end('logout');
            return;
        }

        if (typeof this.action == 'undefined') {
            return 'no_action';
        }
        else if (this.action === "registerUser") {
            this.registerUser(res);
        }
        else if (this.action === "getScripts") {
            this.getScripts(res);
        }
        else if (this.action === "loginUser") {
            this.loginUser(res);
        }
        else if (this.action == 'isExisting') {
            this.isExisting(res)
        }
        else if (this.action == 'checkLogin') {
            this.checkLogin(res);
        }
        else if (this.action == 'logoutUser') {
            this.logoutUser(res);
        }
        else if (this.action == 'insert') {
            this.insert(res);
        }
        else if (this.action == 'update') {
            this.update(res);
        }
        else if (this.action == 'save') {
            this.save(res);
        }
        else if (this.action == 'find') {
            this.find(res);
        }
        else if (this.action == 'delete') {
            this.delete(res);
        }
        else if (this.action == 'getLocation') {
            this.getLocations(res);
        }
    }

    getLocations(res) {
        var params = JSON.parse(this.query.params.value.toString());
        if (params.name == 'country') {
            res.end(JSON.stringify(bFunc.isset(params.id) ? csc.default.getCountryById(params.id) : csc.default.getAllCountries()));
        }
        else if (params.name == 'state') {
            res.end(JSON.stringify(bFunc.isset(params.id) ? csc.default.getStateById(params.id) : csc.default.getStatesOfCountry(params.parent)));
        }
        else if (params.name == 'city') {
            res.end(JSON.stringify(bFunc.isset(params.id) ? csc.default.getCityById(params.id) : csc.default.getCitiesOfState(params.parent)));
        }
    }

    logoutUser(res) {
        persistence.logout(res, sessions[sessionID].userID)
            .then(result => {
                res.end(result);
                sessions[sessionID].unset(['userID', 'userType']);
            }).catch(err => {
                console.log(err);
            });
    }

    checkLogin(res) {
        bFunc.runParallel({
            isExpired: sessions[sessionID].isExpired()
        }, result => {
            if (bFunc.isset(sessions[sessionID].userID)) {
                db.find({ collection: 'users', query: { _id: sessions[sessionID].userID }, projection: { _id: 1, userType: 1 } }).then(user => {
                    res.end(JSON.stringify(user));
                });
            } else if (!bFunc.isset(cookies.notNew)) {
                con.setCookie(res, { notNew: 'Yes' });
                res.end('new')
            } else {
                res.end('false');
            }
        });
    }

    getScripts() {
        var scripts = ['./includes/classes/Query.js', './includes/classes/UMan.js'];

        var allPromises = scripts.map((item, i) => {
            return new Promise(function (resolve, reject) {
                fs.readFile(item, function (err, data) {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            });
        });

        return Promise.all(allPromises);
    }

    loginUser(res) {
        var userName = this.query.userName.value.toString();
        var password = this.query.password.value.toString();
        var rememberMe = this.query.rememberMe;
        db.find({ collection: 'users', query: { userName: userName }, projection: { _id: 1, password: 1, userType: 1 } }).then(result => {
            if (bFunc.isnull(result)) {
                res.end('false');
            }
            else {
                bcrypt.compare(password, result.password).then(correct => {
                    if (correct == true) {
                        sessions[sessionID].set([{ name: 'userID', value: result._id }]);
                        if (bFunc.isset(rememberMe)) {
                            persistence.make(res, sessions[sessionID]).then(persist => {
                                res.end(JSON.stringify(result));
                            }).catch(err => console.log('making_persistence_error=> ' + err));
                        } else {
                            res.end(JSON.stringify(result));
                        }
                    } else {
                        res.end('false');
                    }
                });
            }
        }).catch(err => {
            console.log('Login error=> ' + err);
            res.write('error');
            res.end();
        });
    }

    registerUser(res) {
        var email = escape(this.query.email.value.toString()),
            userName = escape(this.query.userName.value.toString()),
            userType = escape(this.query.userType.value.toString()),
            userID = bFunc.generateRandom(8);

        bcrypt.hash('verified', 10).then(hash => {
            db.insert({ collection: 'users', query: { _id: userID, email: email, userName: userName, password: hash, userType: userType } }).then((result) => {
                console.log('inserted');
                res.end('true');
            }).catch((err) => {
                console.log(err);
                res.end('false');
            });
        })
    }

    isExisting(res) {
        delete this.query.action;
        var query = {};
        var collection = codedCollections[this.query.collection.value.toString()];

        var queries = this.query.query.value.toString().split(':');
        for (var v of queries) {
            v = v.split('=');
            query[v[0]] = v[1];
        }
        db.exists({ collection: collection, query: query }).then(result => {
            res.end(result.toString());
        }).catch(err => {
            console.log('Error checking ajax existence=> ' + err);
            res.end('error');
        });
    }

    insert(res) {
        var params = JSON.parse(this.query.params.value.toString());

        db.update({ collection: params.collection, query: params.query }).then(result => {
            res.end('true');
        }).catch(err => {
            res.end('false');
        });
    }

    update(res) {
        var params = JSON.parse(this.query.params.value.toString());

        db.update({ collection: params.collection, query: params.query, new: params.new }).then(result => {
            res.end('true');
        }).catch(err => {
            res.end('false');
        });
    }

    save(res) {
        var params = JSON.parse(this.query.params.value.toString());

        db.update({ collection: params.collection, query: params.query }).then(result => {
            res.end('true');
        }).catch(err => {
            res.end('false');
        });
    }

    find(res) {
        var params = JSON.parse(this.query.params.value.toString());

        db.find(params).then(result => {
            res.end(JSON.stringify(result));
        }).catch(err => {
            res.end('false');
        });
    }

    delete(res) {
        var params = JSON.parse(this.query.params.value.toString());

        db.update({ collection: params.collection, query: params.query }).then(result => {
            res.end('true');
        }).catch(err => {
            res.end('false');
        });
    }
}

module.exports = PostHandler;