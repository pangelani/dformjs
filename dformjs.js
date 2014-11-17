window.dform = (function () {
    var __extends = function(child, parent) {
        for (var key in parent) {
            if (Object.prototype.hasOwnProperty.call(parent, key)) {
                child[key] = parent[key];
            }
        }
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMElement
    // --------------------------------------------------------------------- //
    function DFormDOMElement() {
        this.tag = undefined;
        this.attributes = {};
        this.childs = [];
    }
    DFormDOMElement.prototype.create = function(listener) {
        var domElement = undefined;
        if (this.tag) {
            domElement = document.createElement(this.tag);
            for (var attr in this.attributes) {
                if (!this.attributes[attr] || typeof this.attributes[attr] === 'string' || typeof this.attributes[attr] === 'number') {
                    var value = this.attributes[attr] !== undefined ? this.attributes[attr] : '';
                    domElement.setAttribute(attr, value);
                }
            }
        }
        if (listener) {
            domElement.addEventListener("input", listener);
            domElement.addEventListener("keyup", listener);
        }
        return domElement;
    };
    DFormDOMElement.prototype.init = function(tag, attrs, defaultAttributes) {
        this.tag = tag;
        for (var attr in defaultAttributes) {
            this.attributes[attr] = (attrs.hasOwnProperty(attr)) ? attrs[attr] : defaultAttributes[attr];
        };
        for (var attr in attrs) {
            this.attributes[attr] = attrs[attr];
        };
    }
    // --------------------------------------------------------------------- //
    // DFormDOMFieldElement
    // --------------------------------------------------------------------- //
    function DFormDOMFieldElement(attrs) {
        DFormDOMFieldElement.__super__.constructor.apply(this, attrs);
        this.inputFirst = attrs && (attrs.type == 'radio' || attrs.type == 'checkbox');
    }
    __extends(DFormDOMFieldElement, DFormDOMElement);
    DFormDOMFieldElement.prototype.create = function(onChangeListener) {
        var domFieldElement = DFormDOMFieldElement.__super__.create.apply(this, [onChangeListener]);
        var requiredDOM = undefined;
        var p = document.createElement('p');
        var domBuilder = new DFormDOMElement();
        if (this.attributes.hasOwnProperty('required')) {
            requiredDOM = document.createElement('strong');
            requiredDOM.innerHTML = '<abbr title="required">&#42;</abbr>';
        }
        if (this.attributes.label) {
            this.attributes.label['for'] = domFieldElement.id;
            domBuilder.init('label', this.attributes.label);
            var labelDOM = domBuilder.create();
            var labelSpan = document.createElement('span');
            if(document.all){
                labelSpan.innerText = this.attributes.label.value;
            } else {
                labelSpan.textContent = this.attributes.label.value;
            }
            if (this.inputFirst) {
                labelDOM.appendChild(labelSpan);
                labelDOM.appendChild(domFieldElement);
            } else {
                labelDOM.appendChild(domFieldElement);
                labelDOM.appendChild(labelSpan);
            }
            if (requiredDOM) {
                labelDOM.appendChild(requiredDOM);
            }
            p.appendChild(labelDOM);
        } else {
            p.appendChild(domFieldElement);
            if (requiredDOM) {
                p.appendChild(requiredDOM);
            }
        }
        return p;
    }
    // --------------------------------------------------------------------- //
    // DFormDOMBuilderInput
    // --------------------------------------------------------------------- //
    function DFormDOMBuilderInput(attrs) {
        DFormDOMBuilderInput.__super__.constructor.apply(this, attrs);
        var id = Date.now();
        this.init('input', attrs, {
            id : 'id_input_' + id,
            name : 'name_input_' + id,
            type : 'text'
        });
    }
    __extends(DFormDOMBuilderInput, DFormDOMFieldElement);
    // --------------------------------------------------------------------- //
    // DFormDOMBuilderTextarea
    // --------------------------------------------------------------------- //
    function DFormDOMBuilderTextarea(attrs) {
        DFormDOMBuilderTextarea.__super__.constructor.apply(this, attrs);
        var id = Date.now();
        this.init('textarea', attrs, {
            id : 'id_textarea_' + id,
            name : 'name_textarea_' + id,
        });
        this.id = attrs.id ? attrs.id : 'id_textarea_' + id;
    }
    __extends(DFormDOMBuilderTextarea, DFormDOMFieldElement);
    DFormDOMBuilderTextarea.prototype.create = function(onChangeListener) {
        var domElement = DFormDOMBuilderTextarea.__super__.create.apply(this, [onChangeListener]);
        var domTextarea = domElement.getElementsByTagName('textarea');
        if(document.all){
            domTextarea.innerText = domElement.getAttribute('value');
        } else{
            domTextarea.textContent = domElement.getAttribute('value');
        }
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMBuilderLegend
    // --------------------------------------------------------------------- //
    function DFormDOMBuilderLegend(attrs) {
        DFormDOMBuilderLegend.__super__.constructor.apply(this, attrs);
        var id = Date.now();
        this.init('legend', attrs, {});
    }
    __extends(DFormDOMBuilderLegend, DFormDOMElement);
    DFormDOMBuilderLegend.prototype.create = function(onChangeListener) {
        var domElement = DFormDOMBuilderLegend.__super__.create.apply(this, [onChangeListener]);
        if(document.all){
            domElement.innerText = domElement.getAttribute('value');
        } else{
            domElement.textContent = domElement.getAttribute('value');
        }
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMBuilderSelect
    // --------------------------------------------------------------------- //
    function DFormDOMBuilderSelect(attrs, options) {
        DFormDOMBuilderSelect.__super__.constructor.apply(this, attrs);
        var id = Date.now();
        this.options = options ? options : attrs.options;
        this.init('select', attrs, {
            id : 'id_select_' + id,
            name : 'name_select_' + id,
        });
    }
    __extends(DFormDOMBuilderSelect, DFormDOMFieldElement);
    DFormDOMBuilderSelect.prototype.create = function(onChangeListener) {
        var domElement = DFormDOMBuilderSelect.__super__.create.apply(this, [onChangeListener]);
        // --------------------------------------------------------------------- //
        // DFormDOMSelectOption
        // --------------------------------------------------------------------- //
        function DFormDOMSelectOption(attrs, index) {
            DFormDOMSelectOption.__super__.constructor.apply(this, attrs);
            var id = index ? index : Date.now();
            this.text = id;
            if (attrs.text !== undefined) {
                this.text = attrs.text;
                delete attrs.text;
            }
            this.init('option', attrs, {
                value : 'option_' + id
            });
        }
        __extends(DFormDOMSelectOption, DFormDOMElement);
        DFormDOMSelectOption.prototype.create = function(onChangeListener) {
            var domElement = DFormDOMSelectOption.__super__.create.apply(this, [onChangeListener]);
            domElement.text = this.text;
            return domElement;
        };
        var domSelect = domElement.getElementsByTagName('select');
        for (var i = 0; i < this.options.length; i++) {
            var opt = new DFormDOMSelectOption(this.options[i]);
            domSelect[0].appendChild(opt.create());
        };
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMBuilderRadio
    // --------------------------------------------------------------------- //
    function DFormDOMBuilderRadio(attrs, options) {
        DFormDOMBuilderRadio.__super__.constructor.apply(this, attrs);
        var id = Date.now();
        this.options = options ? options : attrs.options;
        this.attributes = attrs ? attrs : {};
        this.attributes.name = this.attributes.name ? this.attributes.name : 'radio_' + id;
        this.attributes.id = this.attributes.id ? this.attributes.id : 'id_radio_' + id;
        this.init('ul', {}, {});
    }
    __extends(DFormDOMBuilderRadio, DFormDOMFieldElement);
    DFormDOMBuilderRadio.prototype.create = function(onChangeListener) {
        var domElement = DFormDOMBuilderRadio.__super__.create.apply(this, [onChangeListener]);
        var domRadios = domElement.getElementsByTagName('ul');
        for (var i = this.options.length - 1; i >= 0; i--) {
            var attrs = this.options[i];
            attrs.type = 'radio';
            attrs.name = this.attributes.name;
            attrs.id = this.attributes.id + '_' + i;
            var radio = new DFormDOMBuilderInput(attrs);
            var li = document.createElement('li');
            li.appendChild(radio.create(onChangeListener))
            domRadios[0].appendChild(li);
        };
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMBuilderFieldset
    // --------------------------------------------------------------------- //
    function DFormDOMBuilderFieldset(attrs, fields) {
        DFormDOMBuilderFieldset.__super__.constructor.apply(this, attrs);
        var id = Date.now();
        this.fields = fields ? fields : [];
        this.init('fieldset', attrs, {});
        if (attrs.legend) {
            this.legend = attrs.legend;
            delete attrs.legend;
        }
    }
    __extends(DFormDOMBuilderFieldset, DFormDOMElement);
    DFormDOMBuilderFieldset.prototype.create = function(onChangeListener) {
        var domElement = DFormDOMBuilderFieldset.__super__.create.apply(this, [onChangeListener]);
        var ul = document.createElement('ul');
        if (this.legend) {
            var domBuilder = new DFormDOMBuilderLegend({value: this.legend});
            domElement.appendChild(domBuilder.create());
        }
        for (var i = this.fields.length - 1; i >= 0; i--) {
            var li = document.createElement('li');
            li.appendChild(this.fields[i].getDOM())
            ul.appendChild(li);
        };
        domElement.appendChild(ul);
        return domElement;
    };
    DFormDOMBuilderFieldset.prototype.addField = function (field) {
        this.fields.push(field);
    };
    // --------------------------------------------------------------------- //
    // DFormField
    // --------------------------------------------------------------------- //
    function DFormField (dFormDOMBuilder) {
        this._DOMBuilder = dFormDOMBuilder;
        this._listeners = [];
        this._DOM = undefined;
    }
    DFormField.prototype.getValue = function() {
        return this._DOM ? this._DOM.value : undefined;
    }
    DFormField.prototype.addOnChangeListener = function(listener) {
        this._listeners.push(listener);
    }
    DFormField.prototype.handleEvent = function(event) {
        for (var i = this._listeners.length - 1; i >= 0; i--) {
            this._listeners[i].update(this);
        };
    }
    DFormField.prototype.getDOM = function() {
        this._DOM = this._DOMBuilder.create(this);
        var me = this;
        return this._DOM;
    }
    DFormField.prototype.reset = function() {
        this._DOM.value = undefined;
    }
    DFormField.prototype.clone = function() {
        clone = new DFormField(this.dFormDOMBuilder);
        return clone;
    }
    DFormField.prototype.addField = function(field) {
        if (this._DOMBuilder && this._DOMBuilder.addField) {
            this._DOMBuilder.addField(field);
        }
    }
    DFormField.prototype.update = function(field) {
        // Redefine if neccessary;
    }
    // --------------------------------------------------------------------- //
    // DForm
    // --------------------------------------------------------------------- //
    function DForm (attrs) {
        // --------------------------------------------------------------------- //
        // DFormDOMForm
        // --------------------------------------------------------------------- //
        function DFormDOMForm(attrs) {
            DFormDOMForm.__super__.constructor.apply(this, attrs);
            var id = Date.now();
            this.init('FORM', attrs, {
                id : 'form_' + id,
                name : 'form_' + id
            });
        }
        __extends(DFormDOMForm, DFormDOMElement);
        this.dFormDOM = new DFormDOMForm(attrs ? attrs : {});
        this.fields = [];
    }
    DForm.prototype.addField = function (field) {
        this.fields.push(field);
    };
    DForm.prototype.getDOM = function () {
        var domElement = this.dFormDOM.create();
        for (var i = 0; i < this.fields.length; i++) {
            domElement.appendChild(this.fields[i].getDOM());
        };
        return domElement;
    };
    DForm.prototype.appendTo = function (selector) {
        var domElement = document.querySelector(selector);
        if (domElement) {
            domElement.appendChild(this.getDOM());
        }
        return this.domElement;
    };
    DForm.prototype.newInput = function (attrs) {
        var DOMBuilder = new DFormDOMBuilderInput(attrs);
        return new DFormField(DOMBuilder);
    };
    DForm.prototype.newTextarea = function (attrs) {
        var DOMBuilder = new DFormDOMBuilderTextarea(attrs);
        return new DFormField(DOMBuilder);
    };
    DForm.prototype.newSelect = function (attrs, opts) {
        var DOMBuilder = new DFormDOMBuilderSelect(attrs, opts);
        return new DFormField(DOMBuilder);
    };
    DForm.prototype.newRadio = function (attrs, opts) {
        var DOMBuilder = new DFormDOMBuilderRadio(attrs, opts);
        return new DFormField(DOMBuilder);
    };
    DForm.prototype.newLegend = function (attrs, fields) {
        var DOMBuilder = new DFormDOMBuilderLegend(attrs, fields);
        return new DFormField(DOMBuilder);
    };
    DForm.prototype.newFieldset = function (attrs, fields) {
        var DOMBuilder = new DFormDOMBuilderFieldset(attrs, fields);
        return new DFormField(DOMBuilder);
    };
    DForm.prototype.newField = function (builder) {
        return new DFormField(builder);
    };
    var dform = function(options) {
        return new DForm(options);
    };
    return dform;
}());


