class QueryHandler {
  constructor() {
  }

  loginUser() {
    // login user if qualified
    var loginForm = document.querySelector('#login-form'),
      submit = loginForm.querySelector('#submit');

    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      error.className = 'error';
      error.textContent = 'Username or Password invalid';

      loginForm.querySelectorAll('.error').forEach(element => {
        element.parentNode.removeChild(element);
      });
      jsElements.replaceElements(loading, submit);

      var formData = new FormData(loginForm);
      formData.append('action', 'loginUser');
      jsElements.replaceElements(loading, submit);

      this.mainWorker({ action: 'ajax', data: this.copyFormData(formData) }).then(result => {
        jsElements.replaceElements(submit, loading);
        if (result == 'false') {
          loginForm.prepend(error);
        }
        else {
          alert("Login Successful");
          router.user = JSON.parse(result);
          reload('?home');
        }
      }).catch(err => {
        jsElements.replaceElements(submit, loading);
        var workerError = error.cloneNode();
        workerError.textContent = "An error occurred during login: Unsuccessful";
        loginForm.prepend(workerError);
      });
    });
  }

  registerUser() {
    // register new user if qualified
    var registerForm = document.querySelector('#register-form'),
      submit = registerForm.querySelector('#submit')

    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();

      error.className = 'error';

      registerForm.querySelectorAll('.error').forEach(element => {
        element.parentNode.removeChild(element);
      });
      jsElements.replaceElements(loading, submit);

      if (!jsElements.validateForm(registerForm)) {
        error.textContent = 'Form not filled correctly';
        registerForm.prepend(error);
        jsElements.replaceElements(submit, loading);
        return;
      }

      var formData = new FormData(registerForm);
      formData.append('action', 'registerUser');
      formData.append('userType', registerForm.querySelector('#user-type').value)
      this.mainWorker({ action: 'ajax', data: this.copyFormData(formData) }).then(result => {
        jsElements.replaceElements(submit, loading);
        if (result == 'true') {
          alert("Registration Successful");
          reload('?home');
        } else if (result == 'found_userName') {
          var userNameError = error.cloneNode();
          userNameError.textContent = "User Name is already in use";
          registerForm.prepend(userNameError);
        } else if (result == 'found_email') {
          var emailError = error.cloneNode();
          emailError.textContent = "Email is already in use";
          registerForm.prepend(emailError);
        }
      }).catch(err => {
        console.log(err)
        var workerError = error.cloneNode();
        workerError.textContent = "An error occurred during registration: Unsuccessful";
        registerForm.prepend(workerError);
        jsElements.replaceElements(submit, loading);
      });
    });
  }

  logoutUser() {
    // logout user 
    var formData = new FormData();
    formData.append('action', 'logoutUser');
    this.mainWorker({ action: 'ajax', data: this.copyFormData(formData) }).then(result => {
      alert("You are logged out");
      router.user = 'false';
      reload('?home');
    }).catch(err => {
      alert('Error logging out. Try again!');
    });
  }

  async db(action, params) {
    var formData = new FormData();
    formData.append('action', action);
    formData.append('params', JSON.stringify(params));
    return await this.mainWorker({ action: 'ajax', data: this.copyFormData(formData) });
  }

  async getLocations(params) {
    var formData = new FormData();
    formData.append('action', 'getLocation');
    formData.append('params', JSON.stringify(params));
    return await this.mainWorker({ action: 'ajax', data: this.copyFormData(formData) });
  }

  ajax(params) {
    // var i = 0;
    // var progress = jsElements.createElement({ name: 'span', attributes: { class: 'progress' } });
    // body.append(progress);
    // var progressInterval = setInterval(() => {
    //   if (i == 90) i--;
    //   progress.style.width = ++i + '%';
    // }, 50);
    return new Promise((resolve, reject) => {
      var result;
      var request = new XMLHttpRequest();
      request.onreadystatechange = function (e) {
        if (this.readyState == 4 && this.status == 200) {
          result = request.responseText;
        }
      }
      request.open(params.method, params.method, false);
      request.send(params.data);
      resolve(result);
    })
  }

  copyFormData(formData) {
    var myFormData = {};
    for (var data of formData.entries()) {
      myFormData[data[0]] = data[1];
    }
    return myFormData
  }

  mainWorker(param) {
    var progress = document.createElement('span');
    progress.classList.add('progress')
    body.append(progress);
    var i = 0;
    var progressInterval = setInterval(() => {
      if (i == 99)--i;
      if (i == 100) {
        clearInterval(progressInterval);
        progress.remove();
      }
      else progress.style.width = ++i + '%';
    }, 50);

    if (window.Worker) {
      return new Promise((resolve, reject) => {
        var working = new Worker('./includes/workers/MainWorker.js');
        working.onmessage = event => {
          resolve(event.data);
          clearInterval(progressInterval);
          progress.remove();
        }
        working.onerror = event => {
          reject(event);
        }
        working.postMessage(param);
      });
    }
  }
}

queryHandler = new QueryHandler();