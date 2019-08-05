class Router {
    constructor() {
        this.body = document.querySelector('body');
        this.user = 'false';
        this.header = '';
        this.main = '';
        this.footer = '';
    }

    async checkLogin() {
        // check if user is logged in with session expiration check
        var formData = new FormData();
        formData.append('action', 'checkLogin');
        return await queryHandler.mainWorker({ action: 'ajax', data: queryHandler.copyFormData(formData) })
    }

    clearBody(except) {
        // clear document body for new render
        Array.from(this.body.children).forEach(node => {
            if (fFunc.isset(except)) {
                if (!((fFunc.isset(except.name) && except.name == node.nodeName) || fFunc.isset(except.class) && node.classList.contains(except.class) || (fFunc.isset(except.id) && except.id == node.id))) {
                    node.remove();
                }
            } else {
                node.remove();
            }
        });
    }

    setBody() {
        this.header = jsElements.createElement({ name: 'header' });
        this.main = jsElements.createElement({ name: 'main' });
        this.main.style.minHeight = appHeight - 200 + 'px';
        this.footer = jsElements.createElement({ name: 'footer' });
        this.body.prepend(this.header, this.main, this.footer);
    }

    render(url) {
        // render new page 
        // change url #
        urlVars = fFunc.getUrlVars(fullUrl);
        newQuery = '?' + fFunc.stringReplace(fFunc.urlSplitter(url).queries, ' ', '-');

        this.clearBody({ name: 'SCRIPT' });
        this.setBody();
        if (onReload) {
            onReload = false;
            fFunc.runParallel({
                checkLogin: this.checkLogin()
            }, result => {
                this.user = (typeof result.checkLogin == 'object')?JSON.parse(result.checkLogin):result.checkLogin;
                if(this.user == 'new'){
                    page.sayWelcome();
                }
                else if (this.user == 'false' && fFunc.isset(urlVars) && !fFunc.isset(urlVars.home) && !fFunc.isset(urlVars.login) && fFunc.objectLength(urlVars) > 0) {
                    alert("Your session has expired");
                    reload('?home');
                    this.user = 'false';
                } else {
                    if (newQuery != oldQuery) {
                        oldQuery = newQuery;
                        if (newQuery == '?null') newQuery = '?home';
                        page.get(urlVars);
                        this.getAction();
                    }
                }
            });
            this.isExpired()
        }
        else {
            if (this.user == 'false' && fFunc.isset(urlVars) && !fFunc.isset(urlVars.home) && !fFunc.isset(urlVars.login) && fFunc.objectLength(urlVars) > 0) {
                alert("Your session has expired");
                reload('?home');
                this.user = 'false';
            } else {
                if (newQuery != oldQuery) {
                    oldQuery = newQuery;
                    if (newQuery == '?null') newQuery = '?home';
                    page.get(urlVars);
                    this.getAction();
                }
            }
        }
    }

    getAction() {
        // take action based on urlvars
        if (fFunc.isset(urlVars.login)) {
            return queryHandler.loginUser();
        }
        else if (fFunc.isset(urlVars.register)) {
            return queryHandler.registerUser();
        }
    }

    isExpired() {
        // check if user is still using the system every 5mins
        var min = 1000 * 60;
        setInterval(() => {
            if (fFunc.isset(this.user._id)) {
                this.checkLogin().then(result => {
                    this.user = result;
                }).catch(err => {
                    console.log(err)
                });
            }
        }, min * 5);
    }
}