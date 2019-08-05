this.onmessage = function (event) {
  imported = [];
  // this.mClasess = this.finishedImports();
  var result = null;
  if (event.data.action == 'registerUser') {
    result = this.registerUser(event.data.form);
  }
  else if(event.data.action == 'ajax'){
    result = this.ajax({method:'POST', data:event.data.data})
  }

  this.postMessage(result);
}

function isExisting(params) {
  params['action'] = 'isExisting';
  return ajax({method:'POST', data:params});
}

function registerUser(params) {
  if(isExisting({collection:'1', query:'email='+params.email}) == 'true') return 'found_email';
  else if(isExisting({collection:'1', query:'userName='+params.userName}) == 'true') return 'found_userName';
  return ajax({method:'POST', data:params});
}

function finishedImports() {
  importer('../classes/FrontFunc.js');
  importer('../classes/QueryHandler.js');
  fFunc = new FrontFunc();
  queryHandler = new QueryHandler();
  return { fFunc: fFunc, queryHandler: queryHandler };
}

function importer(script) {
  var found = false;
  for (var i in imported) {
    if (imported[i] == script) {
      found = true;
      break;
    }
  }

  if (!found) {
    this.importScripts(script);
    imported.push(script);
  }
}

function pasteFormData(form){
  var formData = new FormData();
  Object.keys(form).map(key=>{
    formData.append(key, form[key]);
  });
  return formData;
}

function ajax(params) {
  var result;
  var request = new XMLHttpRequest();
  request.onreadystatechange = function (e) {
    if (this.readyState == 4 && this.status == 200) {
      result = request.responseText;
    }
  }
  request.open(params.method, '/', false);
  request.send(pasteFormData(params.data));
  return result;
}