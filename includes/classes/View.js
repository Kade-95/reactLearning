class View {
    // set the document on entry
    constructor() {
        this.docType = "<!DOCTYPE html>";
    }

    createView(req, res) {
        this.query = bFunc.getUrlVars('?' + url.parse(req.url).query);

        if ((bFunc.isset(this.query.loginUser) || bFunc.isset(this.query.registerUser)) && bFunc.isset(sessions.userID)) {
            res.writeHead(302, { 'Content-Type': 'text/html', 'Location': loggedInURL });
            res.end();
            console.log(loggedInURL)
            return;
        }

        this.request = req;
        this.response = res;
        this.setHead();
        if (this.setBody() == 're-directed') return;
        var page = new HtmlElement({ name: 'html', content: (this.head.view + this.body.view) });
        res.setHeader('Content-Type', 'text/html');
        res.write(this.docType + page.view);
        res.end();
    }

    setHead() {
        this.head = new HtmlElement({ name: 'head', content: this.getLink() + this.getMeta().view });
    }

    getLink() {
        var links = '';
        var linkList = [
            './css/main.css',
            './css/header.css',
            './css/form.css',
            './css/footer.css',
            './css/special.css',
            './images/favicon.ico',
            './css/sidebar.css',
            './css/containers.css',
            './css/table.css'
        ];
        linkList.map((link, i) => {
            links += '<link rel="stylesheet" type="text/css" media="screen" href="' + link + '"></link>';
        });
        return links;
    }

    getMeta() {
        return new HtmlElement({ name: 'meta', param: { content: 'width=device-width, initial-scale=1.0', name: 'viewport' } });
    }

    setBody() {
        var scripts = this.getScripts();
        this.body = new HtmlElement({ name: 'body', content: (scripts) });
    }

    getScripts() {
        var scriptList = ['./includes/func.js', './includes/classes/QueryHandler.js', './includes/classes/FrontFunc.js', './includes/classes/Router.js', './includes/classes/JSElements.js', './includes/classes/Page.js'];
        var scripts = '';
        scriptList.map((script, i) => {
            scripts += new HtmlElement({ name: 'script', param: { src: script, type: "text/javascript" } }).view;
        });
        return scripts;
    }
}

module.exports = View;