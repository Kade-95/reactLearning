class PersistentSessions {

    constructor() {
        this.collection = 'persistence';
        this.expires = new Date(new Date().getTime() + (1000 * 3600 * 24 * 30)).toUTCString();
    }

    make(res, session) {
        return new Promise((resolve, reject) => {
            var token = bFunc.generateRandom(32);
            this.setCookie(res, token, session.userID);
            this.storeCookie(token, session.userID).then(result => {
                this.updateUserAutoLogin(session.userID).then(result=>{
                    resolve('done');
                }).catch(err=>{
                    reject('update_autologin_error=> ' + err);
                });
            }).catch(err => reject('store_cookie_error=> ' + err));
        });
    }

    setCookie(res, token, userID) {
        var storedToken = [];
        for (var key in token) {
            storedToken.push(token[key]);
            if (key % 4 == 0) {
                storedToken.push(userID[key / 4]);
            }
        }
        token = userID + '|' + bFunc.implode('', storedToken);
        con.setCookie(res, { PSID: token, expires: this.expires, httpOnly: true, path: '/' });
    }

    async storeCookie(token, userID) {
        return await db.insert({ collection: this.collection, query: { token: token, userID: userID, used: 0, expires: this.expires, created: bFunc.today() } });
    }

    async updateUserAutoLogin(userID) {
        return db.update({ collection: 'users', query: { userID: userID }, new: { autologin: 1 } });
    }

    checkCredentials(res) {
        var cookie = cookies.PSID;
        return new Promise((resolve, reject)=>{
            if (bFunc.isset(cookie)) {
                cookie = this.parseCookie(cookie);
                if(cookie){
                    this.clearOld().then(cleared=>{
                        this.cookieExists(cookie).then(cookieData=>{
                            if(!bFunc.isnull(cookieData)){
                                if(cookieData.used != 1){
                                    this.useToken(cookie).then(usedToken=>{
                                        var newToken = bFunc.generateRandom(32);
                                        this.setCookie(res, newToken, cookie[0]);
                                        this.storeCookie(newToken, cookie[0]).then(cookieStored=>{
                                            resolve({userID:cookie[0]});
                                        }).catch(err=>{
                                            console.log('storing_cookie_error=> '+err);
                                            reject('storing_cookie_error=> '+err);
                                        });
                                    }).catch(err=>{
                                        console.log('using_cookie_error=> '+err);
                                        reject('using_cookie_error=> '+err);
                                    });
                                }
                                else{
                                    this.logout(res).then(loggedOut=>{
                                        console.log('PSID_with_used_cookie');
                                        resolve('PSID_with_used_cookie');
                                    }).catch(err=>{
                                        console.log('PSID_used_logout_error=> '+err);
                                        reject('PSID_used_logout_error');
                                    });
                                }
                            }
                            else{
                                this.logout(res).then(loggedOut=>{
                                    resolve('PSID_with_unexisting_cookie')
                                    console.log('PSID_with_unexisting_cookie')
                                }).catch(err=>{
                                    reject('PSID_unexisting_logout_error')
                                    console.log('PSID_unexisting_logout_error=> '+err);
                                });
                            }
                        }).catch(err=>{
                            reject('cookie_exists_error');
                            console.log('cookie_exists_error=> '+err);
                        });
                    }).catch(err=>{
                        reject('old_token_clearing_error');
                        console.log('old_token_clearing_error=> '+err);
                    });
                }
                else{
                    resolve('expired');
                }
            }
            else{
                resolve('none');
            }
        });
    }

    parseCookie(cookie) {
        var userID = cookie.split('|')[0];
        cookie = cookie.split('|')[1].split('');
        var storedKey = '';
        var i = 1;
        for (var key in cookie) {
            if (key % 4 == 0) {//positions of the userID
                if (storedKey.length < 8) {//length of userID
                    storedKey += cookie[(key/1)+i];
                    cookie[(key/1)+i] = '';
                    i++;
                }
            }
        }
        cookie = bFunc.implode('', cookie);

        if (storedKey == userID) {
            return [userID, cookie];
        }
        return false;
    }

    async clearOld() {
        var time = new Date().getTime();
        return await db.delete({ collection: this.collection, query: { expires: { lt: time } }, many: 1 });
    }

    async cookieExists(cookie) {
        var userId = '',
            token = '';
        [userId, token] = cookie;

        return await db.find({ collection: this.collection, query: { userID: userId, token: token }, projection:{_id:0, used:1}});
    }

    async useToken(cookie) {
        var userID = cookie[0],
            token = cookie[1];

        return await db.update({ collection: this.collection, query: { userID: userID, token: token }, new: { used: '1' } });
    }

    async deleteAll(userID) {
        var userId = this.parseCookie(cookie)[0];
        return await db.delete({ collection: this.collection, query: { userId: userId } });
    }

    logout(res, userID){
        var cookie = cookies.PSID;
        return new Promise((resolve, reject)=>{
            if(!bFunc.isset(userID)){
                db.delete({collection:this.collection, query:{}, many:{}}).then(result=>{
                    sessions[sessionID].destroy().then(result=>{
                        resolve('1');
                    }).catch(err=>{
                        reject('session_destroy_error=> '+err);
                    });
                }).catch(err=>{
                    reject('general_logout_err=> '+err);
                });
            }
            else{
                if(bFunc.isset(cookie)){
                    con.setCookie(res, {PSID:cookie, expires:new Date().toUTCString(), httpOnly: true, path: '/'});
                    var token = this.parseCookie(cookie)[1];
                    db.update({collection:this.collection, query:{token:token}, new:{used:1}}).then(result=>{
                        db.update({collection:'users', query:{_id:userID}, new:{autologin:0}}).then(result=>{
                            sessions[sessionID].destroy().then(result=>{
                                resolve('1');
                            }).catch(err=>{
                                reject('session_destroy_error=> '+err);
                            });
                        }).catch(err=>{
                            reject('autologin_reset_error=> '+err);
                        })
                    }).catch(err=>{
                        reject('token_used_err=> '+err);
                    });
                }
                else{
                    sessions[sessionID].destroy().then(result=>{
                        resolve('1');
                    }).catch(err=>{
                        reject('session_destroy_error=> '+err);
                    });
                }
            }
        });
    }
}

module.exports = PersistentSessions;