class HtmlElement{
    // create elements (bDOM)
    constructor(element) {
        this.element = element;
        this.view = this.getView();
    }

    prepareElement() {
        this.parameter = '';
        this.content = '';
        this.name = this.element.name;

        if (bFunc.isset(this.element.param)) {
            this.element.param = bFunc.objectToArray(this.element.param);
            for (var x in this.element.param) {
                this.parameter += (x + '="' + this.element.param[x] + '" ');
            }
        }

        if (bFunc.isset(this.element.content)) {
            this.content = this.element.content;
        }

        if (!bFunc.isset(this.element.name)) {
            this.name = this.element;
        }
    }

    getView() {
        this.prepareElement();
        var view = '<' + this.name + ' ' + this.parameter + '>' + this.content + '</' + this.name + '>';
        return view;
    }

    appendChild(child) {
        if(bFunc.isset(this.element.content)) this.element.content += child;
        else this.element.content = child;
    }

    appendParam(child) {
        if(bFunc.isset(this.element.param)) this.element.param[child.name] = child.value;
        else this.element['param'] = child;
    }

    removeParam(child) {
        Object.keys(this.element.param).map((key)=>{
            if(child == key)  delete this.element.param[key]
        });
    }

    update() {

    }
}

module.exports = HtmlElement;