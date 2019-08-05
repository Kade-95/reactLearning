class Page {
    constructor() {
    }

    get(urlVars) {
        //get the url varibles and take action
        var notificationBlock = jsElements.createElement({
            name: 'div', attributes: { id: 'notification-block' }
        });
        notificationBlock.style.maxHeight = appHeight / 5 + 'px';
        body.append(notificationBlock);
        if (!fFunc.isset(urlVars) || fFunc.isset(urlVars.home) || fFunc.objectLength(urlVars) == 0) {
            this.land();
        }
        else if (fFunc.isset(urlVars.login)) {
            this.login();
        }
        else if (fFunc.isset(urlVars.register)) {
            this.register();
        }
        else {
            this.land();
        }
    }

    login() {
        //login page
        if (fFunc.isset(router.user._id) && fFunc.isset(fFunc.getUrlVars(newQuery).login)) {
            alert("You are currently logged in");
            reload('?home');
            return;
        }
        var title = jsElements.createElement({name:'h1', attributes:{class:'title'}, text:'Enter your credentials to login'})
        var userName = jsElements.createElement({ name: 'input', attributes: { id: 'user-name', type: 'text', name: 'userName' } });
        var userNameLabel = jsElements.createElement({ name: 'label', text: 'Enter Username.' });
        var userNameDiv = jsElements.createElement({ name: 'div', children: { userNameLabel, userName } });
        var password = jsElements.createElement({ name: 'input', attributes: { id: 'password', type: 'password', name: 'password' } });
        var passwordLabel = jsElements.createElement({ name: 'label', text: 'Enter Password.' });
        var passwordDiv = jsElements.createElement({ name: 'div', children: { passwordLabel, password } });
        var register = jsElements.createElement({ name: 'button', attributes: { id: 'register-button' }, text: "I've never used it before" });
        var submit = jsElements.createElement({ name: 'button', attributes: { id: 'submit' }, text: 'Submit' });
        var submitDiv = jsElements.createElement({ name: 'div', children: [register, submit]});
        var form = jsElements.createElement({ name: 'form', attributes: { class: 'form', id: 'login-form' }, children: {title, userNameDiv, passwordDiv, submitDiv } });
        var main = document.querySelector('main');
        main.append(form)
    }

    register() {
        // registration page
        var userName = jsElements.createElement({ name: 'input', attributes: { id: 'user-name', class: 'border-less', type: 'text', name: 'userName' } });
        var userNameLabel = jsElements.createElement({ name: 'label', children: 'User Name:' });
        var userNameDiv = jsElements.createElement({ name: 'div', children: { userNameLabel, userName } });
        var email = jsElements.createElement({ name: 'input', attributes: { id: 'email', class: 'border-less', type: 'email', name: 'email' } });
        var emailLabel = jsElements.createElement({ name: 'label', children: 'Email:' });
        var emailDiv = jsElements.createElement({ name: 'div', children: { emailLabel, email } });
        var userType = jsElements.createElement({ name: 'select', attributes: { id: 'user-type', class: 'border-less', name: 'userType' } });
        var types = fFunc.userTypes();
        for (var i in types) {
            var option = document.createElement('option');
            option.value = i;
            if (i == 0) {
                option = jsElements.createElement({ name: 'option', attributes: { selected: '', disabled: '' } });
                option.value = i;
            }
            option.text = types[i];
            userType.append(option);
        }
        var userTypeLabel = jsElements.createElement({ name: 'label', children: 'User Type:' });
        var userTypeDiv = jsElements.createElement({ name: 'div', children: { userTypeLabel, userType } });
        var submit = jsElements.createElement({ name: 'button', attributes: { id: 'submit' }, children: 'Submit' });
        var submitDiv = jsElements.createElement({ name: 'div', children: { submit } });
        var form = jsElements.createElement({ name: 'form', attributes: { class: 'form', id: 'register-form' }, children: { userNameDiv, emailDiv, userTypeDiv, submitDiv } });
        var main = document.querySelector('main');
        main.append(form)
    }

    sayWelcome() {
        var home = jsElements.createElement({ name: 'div', attributes: { id: 'home' } });

        var notes = jsElements.createElement({ name: 'div', attributes: { id: 'notes' } });

        home.style.height = appHeight + 'px';
        var welcomeNotes = ["Hello Bismark", "Nice?", "This is a moodboard for all the people in your life"];
        var i = 0;
        home.append(notes)
        body.prepend(home);
        window.addEventListener('resize', () => {
            home.style.height = appHeight + 'px';
        });

        var allNotesTime = setInterval(() => {
            var j = 0;
            var text = welcomeNotes[i];
            notes.innerHTML = '';
            if(i == 0){
                var time = setInterval(() => {
                    notes.innerHTML += text[j];
                    if(j == text.length - 1) clearInterval(time);
                    j++;
                }, 100);
            }else{
                notes.innerHTML = text;
            }
            if(i == welcomeNotes.length - 1){
                clearInterval(allNotesTime);
                setTimeout(() => {
                    this.land();
                }, 3000);
            }
            i++;
        }, 3000);
    }

    land() {
        //check if loggedin and land
        if (!fFunc.isset(router.user._id)) {
            reload('?login');            
        }
        else {
            this.landed(body);
        }
    }

    landed(body) {
        // user is loggedin and landed, display sidebar and header and footer
        var bodyContent = jsElements.createElement({ name: 'div', attributes: { class: 'full-width', id: 'body-content' } });

        var mainView = jsElements.createElement({ name: 'div', attributes: { id: 'main-view', class: 'wide-main-view' } });
        Array.from(body.children).forEach(child => {
            if (child.nodeName != 'SCRIPT') {
                mainView.append(child);
            }
        });
        bodyContent.append(mainView);
        body.prepend(bodyContent);

        this.setHeader();
        this.setMain();
        this.setFooter();
    }

    setHeader() {
        var homeButton = jsElements.createElement({ name: 'a', attributes: { class: 'btn curved transparent', href: '?home' }, text: 'Home' });
        var aboutButton = jsElements.createElement({ name: 'a', attributes: { class: 'btn curved transparent', href: '?page=about' }, text: 'About' });
        var headerNavigator = jsElements.createElement({ name: 'div', attributes: { id: 'hearder-navigator' } });
        headerNavigator.append(homeButton, aboutButton);

        var searchQuery = jsElements.createElement({ name: 'input', attributes: { placeholder: 'search', id: 'search-query', class: 'border-less transparent' } });
        var searchButton = jsElements.createElement({ name: 'button', attributes: { id: 'search-button', class: 'small-btn curved translucent' }, text: 'Search' });
        var search = jsElements.createElement({ name: 'div', attributes: { id: 'search' } });
        search.append(searchQuery, searchButton);

        router.menu = jsElements.createElement({ name: 'menu', attributes: { id: 'main-menu' } });

        var mainHeader = jsElements.createElement({ name: 'div', attributes: { class: 'main-header' }, children: [headerNavigator, search] });

        router.header.append(mainHeader, router.menu);
    }

    setMain() {
        if (!fFunc.isset(urlVars) || fFunc.isset(urlVars.home) || fFunc.objectLength(urlVars) == 0) {
            this.home();
        }
        else if (fFunc.isset(urlVars.page)) {
            this[urlVars.page]();
        }
    }

    setMenu(params) {
        for (var i of params.menu) {
            router.menu.append(this.menuButton(params.parent, i));
        }
    }

    setFooter() {
        router.footer.append('hello footer here')
    }

    home() {
        // home page based on user type
        router.main.append("home page");
    }

    about() {

    }

    search() {
        var query = router.urlVars.query;
    }

    menuButton(parent, name) {
        var button = jsElements.createElement({ name: 'li', attributes: { class: 'main-menu-button' }, text: name.toUpperCase() });
        button.addEventListener('click', event => {
            window.location.hash = '?page=' + parent + '&action=' + name.toLowerCase();
        });
        return button;
    }

    message(params) {
        var me = jsElements.createElement({
            name: 'span', attributes: { class: 'alert' }, children: [
                fFunc.isset(params.link) ?
                    jsElements.createElement({ name: 'a', text: params.text, attributes: { class: 'text', href: params.link } })
                    :
                    jsElements.createElement({ name: 'a', text: params.text, attributes: { class: 'text' } }),
                ,
                jsElements.createElement({ name: 'span', attributes: { class: 'close' } })
            ]
        });

        if (fFunc.isset(params.temp)) {
            var time = setTimeout(() => {
                me.remove();
                clearTimeout(time);
            }, (params.temp != '') ? params.time * 1000 : 5000);
        }

        me.querySelector('.close').addEventListener('click', event => {
            me.remove();
        });

        body.querySelector('#notification-block').append(me);
    }
}