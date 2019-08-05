class Connection {
    constructor() { }

    createServer(port) {
        var mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.ico': 'image/ico',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        };

        http.createServer((req, res) => {
            // start http server
            q = url.parse(req.url);
            var filename = '.' + q.pathname;
            var tmp = filename.lastIndexOf('.');
            var ext = filename.slice(tmp).toLowerCase();

            var contentType = mimeTypes[ext] || 'application/octet-stream';
            if (req.method == 'POST') {
                // on post request
                this.getCookies(req);
                this.createNODESSID(res);
                req.res = res;
                req.on('data', this.onPosting).on('end', this.onPosted);
            }
            else if (filename == './') {
                // if page is index
                this.getCookies(req);
                this.createNODESSID(res);
                sessions[sessionID].store(req, res);
            }
            else {
                fs.exists(filename, (exists)=>{
                    if(exists){
                        res.writeHead(200, { 'Content-Type': contentType });
                        fs.createReadStream(filename).pipe(res);
                    }
                    else{
                        res.writeHead(404, { 'Content-Type': contentType });
                        res.end('Not Found');
                    }
                })
            }
        }).listen(port, () => {
            console.log("Server Running on Port : " + port);
        });
    }

    onPosting(data) {
        // get the post request data
        if (this.data) {
            this.data.fill(data, this.dataIndex);
            this.dataIndex += data.length;
        } else {
            var contentLength = +this.headers["content-length"];
            if (data.length === contentLength) {
                this.data = data;
            } else {
                this.data = Buffer.alloc(contentLength);
                this.data.fill(data)
                this.dataIndex = data.length;
            }
        }
    }

    onPosted() {
        // post the request
        var boundary = bFunc.extract(this.headers['content-type'], ' boundary=');
        var form = bFunc.parseForm(boundary, this.data);
        postHandler.act(form, this, this.res);
    }

    createNODESSID(res) {
        // sessionid generator
        if (!bFunc.isset(cookies) || !bFunc.isset(cookies.NODESSID)) {
            sessionID = bFunc.generateRandom(32);
            this.setCookie(res, { NODESSID: sessionID, httpOnly: true, path: '/' });
        }
        else {
            sessionID = cookies.NODESSID;
        }
        if (!bFunc.isset(sessions[sessionID])) sessions[sessionID] = new Sessions(sessionID);
    }

    getCookies(req) {
        // cookie fetcher
        var allCookies = req.headers.cookie;
        if (!bFunc.isset(allCookies)) {
            cookies = {};
            return;
        }
        allCookies = allCookies.split('; ');
        allCookies.forEach(cookie => {
            cookie = cookie.split('=');
            cookies[cookie[0]] = cookie[1];
        });
    }

    setCookie(res, cookieData) {
        // cookie setter
        var arrangedCookie = '';
        var cookieLength = bFunc.objectLength(cookieData);
        Object.keys(cookieData).map(key => {
            cookieLength--;
            arrangedCookie += key + '=' + cookieData[key];
            if (cookieLength > 0) arrangedCookie += '; ';
        });
        res.setHeader('Set-Cookie', [arrangedCookie]);
    }

    startSessions() {
        // start all sessions before server starts
        return new Promise((resolve, reject) => {
            db.find({ collection: 'sessions', query: {}, many: {} }).then(result => {
                for (var session of result) {
                    sessions[session._id] = new Sessions(session._id);
                    Object.keys(session).map(key => {
                        sessions[session._id][key] = session[key];
                    });
                }
                resolve('Done');
            }).catch(err => {
                reject("Error fetching existing sessions before starting=> " + err);
            });
        });
    }

    clearOldSessions() {
        // destroy all old sessions every 10mins
        var time = new Date().getTime();
        var interval = 1000 * 60 * 60;
        setInterval(() => {
            db.delete({ collection: 'sessions', query: { time: { $lt: (time - interval) } }, many: {} }).then(result => {
                console.log('Old sessions cleared');
            }).catch(err => {
                console.log('Error clearing old sessions=> ' + err);
            });
        }, interval);
    }
}

module.exports = Connection;