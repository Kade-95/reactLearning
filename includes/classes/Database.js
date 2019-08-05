class Database {
    constructor() {
        this.database = dbServer + dbName;
    }

    open() {
        // open database for operations
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.database, { useNewUrlParser: true }, (err, db) => {
                if (err) reject(err);
                else resolve(db);
            });
        });
    }

    close(db) {
        // close database 
        if (db) {
            db.close();
        }
    }

    insert(param) {
        // insert into database
        var database = null;
        var value;
        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }
            this.open()
                .then((db) => {
                    database = db;
                    return db.db(dbName).collection(param.collection);
                })
                .then((collection) => {
                    if (Array.isArray(param.query)) value = collection.insertMany(param.query);
                    else value = collection.insertOne(param.query);
                    return value;
                })
                .then((result) => {
                    resolve(result.result.ok);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    update(param) {
        // update database
        var database = null;
        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }
            if (!bFunc.isset(param.new)) {
                reject('no_new');
            }
            this.open()
                .then((db) => {
                    database = db;
                    return db.db(dbName).collection(param.collection);
                })
                .then((collection) => {
                    if (bFunc.isset(param.many)) return collection.updateMany(param.query, { $set: param.new });
                    else return collection.updateOne(param.query, { $set: param.new });
                })
                .then((result) => {
                    resolve(result.result.ok);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    save(param) {
        // save or replace the content of a document
        var database = null;
        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }
            this.open()
                .then((db) => {
                    database = db;
                    return db.db(dbName).collection(param.collection);
                })
                .then((collection) => {
                    return collection.save(param.query);
                })
                .then((result) => {
                    resolve(result.result.ok);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    replace(param) {
        // insert or update the content of document
        var database = null;
        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }
            if (!bFunc.isset(param.new)) {
                reject('no_new');
            }
            this.open().then((db) => {
                database = db;
                return db.db(dbName).collection(param.collection);
            }).then((collection) => {
                return collection.replaceOne(param.query, param.new);
            }).then((result) => {
                resolve(result.result.ok);
                database.close();
            }).catch((err) => {
                database.close();
                reject(err);
            });
        });
    }

    aggregate(param) {
        // perform an aggregation on database
        var database = null;
        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }
            this.open().then((db) => {
                database = db;
                return db.db(dbName).collection(param.collection);
            }).then((collection) => {
                return collection.aggregate(param.query);
            }).then((result) => {
                resolve(result.result.ok);
                database.close();
            }).catch((err) => {
                database.close();
                reject(err);
            });
        });
    }

    join(param) {
        // join documents 
        var database = null;
        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }
            if (!bFunc.isset(param.query.from)) {
                reject('no_from');
            }
            if (!bFunc.isset(param.query.localField)) {
                reject('no_localField');
            }
            if (!bFunc.isset(param.query.foreignField)) {
                reject('no_foreignField');
            }
            if (!bFunc.isset(param.query.as)) {
                reject('no_as');
            }
            this.open()
                .then((db) => {
                    database = db;
                    return db.db(dbName).collection(param.collection);
                })
                .then((collection) => {
                    return collection.aggregate([{ $lookup: param.query }]).toArray();
                })
                .then((result) => {
                    resolve(result);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    exists(param) {
        // check if document exists
        return new Promise((resolve, reject)=>{
            this.find(param).then((res)=>{
                if(res) resolve(true)
                else resolve(false)
            }).catch(err=>{
                reject(err);
            });
        });
    }

    find(param) {
        // find in database
        var database = null;
        var value;
        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }

            this.open()
                .then((db) => {
                    database = db;
                    return db.db(dbName).collection(param.collection);
                })
                .then((collection) => {
                    if (bFunc.isset(param.many)) {
                        if (bFunc.isset(param.projection)) {
                            value = collection.find(param.query, { projection: param.projection });
                        } else {
                            value = collection.find(param.query);
                        }

                        if (bFunc.isset(param.many.limit)) value = value.limit(param.many.limit);

                        if (bFunc.isset(param.many.sort)) value = value.sort(param.many.sort);

                        value = value.toArray();
                    } else {
                        if (bFunc.isset(param.projection)) {
                            value = collection.findOne(param.query, { projection: param.projection });
                        } else {
                            value = collection.findOne(param.query);
                        }
                    }
                    return value;
                })
                .then((result) => {
                    resolve(result);
                    database.close();
                })
                .catch((err) => {
                    database.close();
                    reject(err);
                });
        });
    }

    delete(param) {
        // delete from database
        var database = null;

        return new Promise((resolve, reject) => {
            if (!bFunc.isset(param)) {
                reject('no_parameter');
            }
            if (!bFunc.isset(param.collection)) {
                reject('no_collection');
            }
            if (!bFunc.isset(param.query)) {
                reject('no_query');
            }

            this.open()
                .then((db) => {
                    database = db;
                    return db.db(dbName).collection(param.collection);
                })
                .then((collection) => {
                    if (bFunc.isset(param.many)) return collection.deleteMany(param.query);
                    else return collection.deleteOne(param.query);
                })
                .then((result) => {
                    resolve(result);
                    database.close();
                })
                .catch((e) => {
                    database.close();
                    reject(e);
                });
        });
    }

    dropCollection(collection) {
        // delete database
        var database = null;

        return new Promise((resolve, reject) => {
            if (!bFunc.isset(collection)) {
                reject('no_collection');
            }

            this.open()
                .then((db) => {
                    database = db;
                    return db.db(dbName).dropCollection(collection);
                })
                .then((result) => {
                    resolve(result);
                    database.close();
                })
                .catch((e) => {
                    database.close();
                    reject(e);
                });
        });
    }
}

module.exports = Database

