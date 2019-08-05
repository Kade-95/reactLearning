class JSElements {
    constructor() {
        this.prepareFrameWork();
    }

    prepareFrameWork() {
        Element.prototype.toggleChild = function (child) {
            var name, _classes, id, found = false;
            Array.from(this.children).forEach(node => {
                name = node.nodeName;
                _classes = node.classList;
                id = node.id;
                if (name == child.nodeName && id == child.id && _classes.toString() == child.classList.toString()){
                node.remove();
                found = true;
            }
        });
        if (!found) this.append(child);
    }

    Element.prototype.removeClass = function (_class) {
        this.classList.remove(_class);
        return this;
    }

    Element.prototype.hasClassList = function (classList) {
        var classes = this.classList.toString().split(',');
        classList = classList.toString('')
    }

    Element.prototype.addClass = function (_class) {
        this.classList.add(_class);
        return this;
    }

    Element.prototype.toggleClass = function (_class) {
        (this.classList.contains(_class)) ? this.classList.remove(_class) : this.classList.add(_class);
        return this;
    }

    Element.prototype.position = function () {
        var dx = 0,
            dy = 0,
            width = this.offsetWidth | 0,
            height = this.offsetHeight | 0;

        dx += this.offsetLeft;
        dy += this.offsetTop;
        return { top: dy, left: dx, width: width, height: height, bottom: dy + height, right: dx + width };
    }

    Element.prototype.hasClass = function (_class) {
        var classes = this.classList.toString().split(',');
        return (classes.indexOf(_class) != -1);
    }

    Element.prototype.getParents = function (name) {
        var attribute = name.slice(0, 1);
        var parent = this.parentNode;
        if (attribute == '.') {
            while (parent) {
                if(parent.classList.contains(name.slice(1))){
                    break;
                }
                parent = parent.parentNode;
            }
        }
        else if (attribute == '#') {
            while (parent) {
                if (parent.id != name.slice(1)) {
                    break;
                }
                parent = parent.parentNode;
            }
        } else {
            while (parent) {
                if (parent.nodeName != name.slice(1)) {
                    break;
                }
                parent = parent.parentNode;
            }
        }
        return parent;
    }
}

createElement(param) {
    var element = document.createElement(param.name);
    if (fFunc.isset(param.attributes)) {
        for (var attr in param.attributes) {
            element.setAttribute(attr, param.attributes[attr]);
        }
    }
    if (fFunc.isset(param.children)) {
        for (var child in param.children) {
            element.append(param.children[child]);
        }
    }
    if (fFunc.isset(param.text)) element.textContent = param.text;
    if (fFunc.isset(param.value)) element.value = param.value;
    return element;
}

validateFormTextarea(element) {
    if (element.value == '') {
        return false;
    }
    return true;
}

validateFormInput(element) {
    var type = element.getAttribute('type');
    var value = element.value;
    if (type == 'file' && value == '') {
        return false;
    }
    else if (type == 'text') {
        return !fFunc.isSpaceString(value);
    }
    else if (type == 'date') {
        if (fFunc.hasString(element.className, 'future')) {
            return fFunc.isDate(value);
        } else {
            return fFunc.isDateValid(value);
        }
    }
    else if (type == 'email') {
        return fFunc.isEmail(value);
    }
    else if (type == 'number') {
        return fFunc.isNumber(value);
    }
    else if (type == 'password') {
        return fFunc.isPasswordValid(value);
    }
}

validateFormSelect(element) {
    if (element.value == 0 || element.value == 'null') {
        return false;
    }
    return true;
}

validateForm(form, nodeNames) {
    if (!fFunc.isset(nodeNames)) nodeNames = 'INPUT, SELECT, TEXTAREA';
    var final = true,
        nodeName = '',
        elementValue = true,
        prototype = null;
    form.querySelectorAll(nodeNames).forEach(element => {
        nodeName = element.nodeName;
        prototype = this.getParents(element, '#content_prototype').id;
        if (prototype == 'content_prototype') {
            elementValue = true;
        }
        else if (nodeName == 'INPUT') {
            elementValue = this.validateFormInput(element);
        }
        else if (nodeName == 'SELECT') {
            elementValue = this.validateFormSelect(element);
        }
        else if (nodeName == 'TEXTAREA') {
            elementValue = this.validateFormTextarea(element);
        }

        if (final) final = elementValue;
    });
    return final;
}

ValidateFormImages(form) {
    return (type == 'file' && !self.isImageValid(value));
}

getParents(element, name) {
    var attribute = name.slice(0, 1);
    var parent = element.parentNode;
    if (attribute == '.') {
        while (parent) {
            if (parent.className == name.slice(1) || fFunc.hasString(parent.className, name.slice(1))) {
                break;
            }
            parent = parent.parentNode;
        }
    }
    else if (attribute == '#') {
        while (parent) {
            if (parent.id != name.slice(1)) {
                break;
            }
            parent = parent.parentNode;
        }
    } else {
        while (parent) {
            if (parent.nodeName != name.slice(1)) {
                break;
            }
            parent = parent.parentNode;
        }
    }
    return parent;
}

replaceElements(newElement, oldElement) {
    oldElement.before(newElement);
    oldElement.style.visibility = 'hidden';
    newElement.style.visibility = 'visible';
}

isImageValid(input) {
    var ext = input.substring(input.lastIndexOf('.') + 1).toLowerCase();
    if (ext == "png" || ext == "gif" || ext == "jpeg" || ext == "jpg") {
        return true;
    } else {
        return false;
    }
}

preview_image(img, upload, no_preview = 'images/no_preview.png') {
    if (user == 'admin') {
        no_preview = '../' + no_preview;
    }

    img.addEventListener('change', listenger => {
        var input = image.innerHTML;
    });
    $(img).change(function () {
        var input = $(fFunc).val();
        var ext = input.substring(input.lastIndexOf('.') + 1).toLowerCase();
        if ((ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "gif") && fFunc.files && fFunc.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $(upload).attr("src", e.target.result);
                $(upload).show();
            }

            reader.readAsDataURL(fFunc.files[0]);
        } else {
            $(upload).attr("src", no_preview);
            $(upload).show();
        }
    });
}
}
