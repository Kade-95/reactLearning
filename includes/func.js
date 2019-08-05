var importedScripts = [],
    fullUrl = window.document.location,
    loading = document.createElement('span'),
    progress = '',
    error = document.createElement('h1'),
    pageLoading = document.createElement('div'),
    body = document.querySelector('body'),
    cover = document.createElement('div')

document.addEventListener("DOMContentLoaded", (e) => {
    queryHandler = new QueryHandler();
    fFunc = new FrontFunc();
    jsElements = new JSElements();
    router = new Router();
    page = new Page();
    appHeight = fFunc.isMobile()?window.outerHeight+200:window.outerHeight;
    urlVars = fFunc.getUrlVars(fullUrl);
    error.className = 'error';
    loading.className = 'loading';
    pageLoading.id = 'page-loading';
    pageLoading.style.height = appHeight + 'px';
    cover.className = 'cover';
    cover.style.height = appHeight + 'px';
    cover.id = 'main-cover';
    sidebarToggle = '';
    sideBar = '';
    mainView = '';
    mainURL = fullUrl.origin;
    oldQuery = '';
    newQuery = '';
    homeURL = mainURL + '?home';

    window.onhashchange = function () {
        router.render(fullUrl);
    }

    window.onresize = function () {
        page.adjustSideBar();
    }

    // document.addEventListener('keydown', e => {
    //     disableF5(e)
    // });

    onReload = true;
    clickHandler();
    router.render(fullUrl);
});

// function disableF5(e) {
//     if ((e.which || e.keyCode) || ((e.ctrlKey || e.metaKey) && (e.which || e.keyCode) == 82) == 116 || (window.event.ctrlKey && e.keyCode == 82)) {
//         var body = document.querySelector('body');
//         body.childNodes.forEach(e => {
//             if (e.nodeName != 'SCRIPT') e.remove();
//         });
//         body.querySelector('header').remove();
//         body.querySelector('footer').remove();
//         clickHandler();
//         router.setUp();
//         router.render(fullUrl, action => {
//             action();
//         });
//         e.preventDefault()
//     }
// }

function clickHandler() {
    document.addEventListener('click', event => {
        var element = event.target;
        var id = element.id;
        var nodeName = element.nodeName;
        var classList = element.classList;

        if (id == 'toggle-side-bar') {
            sidebarToggle = element;
            sidebarToggle.toggleClass('close-side-bar').toggleClass('open-side-bar');
            sideBar = document.querySelector('#side-bar');
            mainView = document.querySelector('#main-view');
            mainView.toggleChild(cover);
            sideBar.toggleClass('narrow-side-bar').toggleClass('wide-side-bar')
            mainView.toggleClass('narrow-main-view').toggleClass('wide-main-view');
            page.adjustSideBar();
        }
        else if (id == 'main-cover') {
            sideBar.toggleClass('narrow-side-bar').toggleClass('wide-side-bar')
            mainView.toggleClass('narrow-main-view').toggleClass('wide-main-view');
            sidebarToggle.toggleClass('close-side-bar').toggleClass('open-side-bar');
            mainView.toggleChild(cover);
            page.adjustSideBar();
        }

        if (nodeName == 'BUTTON') {
            if (id == 'sign-out-button') {
                queryHandler.logoutUser();
            }
            else if (id == 'search-button') {
                var query = element.previousElementSibling.value;
                if (query != '') {
                    reload('?page=search&query=' + query);
                }
            }
            else if (id == 'change-password') {
                alert('helo')
            }
        }
        else if (nodeName == 'A') {
            event.preventDefault();
            if (element.hasAttribute('href')) {
                reload(element.getAttribute('href'));
            }
        }
    });
}

function reload(url){
    window.location.hash = url;
}

function importScripts(script) {
    var flag = false;
    for (var i in importedScripts) {
        if (script == importedScripts[i]) {
            flag = true;
            break;
        }
    }

    if (!flag) {
        var scriptTag = document.createElement('script');
        var body = document.querySelector('body');
        scriptTag.setAttribute('src', script);
        body.appendChild(scriptTag);
        importedScripts.push(script);
    }
}
