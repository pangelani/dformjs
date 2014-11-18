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
    // DFormDOMBuilder
    // --------------------------------------------------------------------- //
    function DFormDOMBuilder() {
        this.tag = undefined;
        this.attributes = {};
        this.childs = [];
    }
    DFormDOMBuilder.prototype.create = function(listener, css) {
        console.error('must implement builder.create() method.');
    };
    DFormDOMBuilder.prototype.addField = function(listener) {
        console.error('this builder does not support addField() method.');
    };
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilder
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilder() {
        this.tag = undefined;
        this.attributes = {};
        this.childs = [];
    }
    __extends(DFormDOMElementBuilder, DFormDOMBuilder);
    DFormDOMElementBuilder.prototype.create = function(listener, css) {
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
        if (listener && domElement) {
            domElement.addEventListener("input", listener);
            domElement.addEventListener("keyup", listener);
        }
        if (css && css[this.tag] && domElement) {
            var cssValue = domElement.getAttribute('class') ? domElement.getAttribute('class') : '';
            var defaultCss = '';
            if (typeof css[this.tag] === 'string') {
                defaultCss = css[this.tag];
            } else {
                defaultCss = css[this.tag][this.attributes.type];
            }
            domElement.setAttribute('class', defaultCss + ' ' + cssValue)
        }
        return domElement;
    };
    DFormDOMElementBuilder.prototype.init = function(tag, attrs, defaultAttributes) {
        this.tag = tag;
        for (var attr in defaultAttributes) {
            this.attributes[attr] = (attrs.hasOwnProperty(attr)) ? attrs[attr] : defaultAttributes[attr];
        };
        for (var attr in attrs) {
            this.attributes[attr] = attrs[attr];
        };
    }
    // --------------------------------------------------------------------- //
    // DFormDOMFieldBuilder
    // --------------------------------------------------------------------- //
    function DFormDOMFieldBuilder(attrs) {
        DFormDOMFieldBuilder.__super__.constructor.apply(this, [attrs]);
        this.inputFirst = attrs && (attrs.type == 'radio' || attrs.type == 'checkbox');
    }
    __extends(DFormDOMFieldBuilder, DFormDOMElementBuilder);
    DFormDOMFieldBuilder.prototype.create = function(onChangeListener, css) {
        var domFieldElement = DFormDOMFieldBuilder.__super__.create.apply(this, [onChangeListener, css]);
        var domFieldWrapper = document.createElement('div');
        var domRequired = undefined;
        var domDescription = undefined;
        var domLabel = undefined;
        var domLabelText = undefined;
        var domErrorSpan = undefined;
        var p = document.createElement('p');
        if (css.p) {
            p.setAttribute('class', css.p);
        }
        var domBuilder = new DFormDOMElementBuilder();
        if (css.div) {
            domFieldWrapper.setAttribute('class', css.div);
        }
        domRequired = document.createElement('abbr');
        if (this.attributes.hasOwnProperty('required')) {
            domRequiredText = document.createTextNode('*');
            domRequired.appendChild(domRequiredText);
        }
        domErrorSpan = document.createElement('span');
        domErrorSpan.appendChild(document.createTextNode(this.attributes.error ? this.attributes.error : ''));
        if (this.attributes.label && domFieldElement) {
            this.attributes.label['for'] = domFieldElement.id;
        }
        domBuilder.init('label', this.attributes.label, {});
        domLabel = domBuilder.create(undefined, css);
        domLabelText = document.createTextNode(this.attributes.label ? this.attributes.label.value : '');
        domLabel.appendChild(domLabelText);
        p.appendChild(domLabel);
        domDescription = document.createTextNode(this.attributes.description ? this.attributes.description : '');
        if (this.inputFirst) {
            var domSubFieldWrapper = document.createElement('div');
            if (css.div) {
                domSubFieldWrapper.setAttribute('class', css.div);
            }
            var domSubSubFieldWrapper = document.createElement('label');
            domSubFieldWrapper.appendChild(domSubSubFieldWrapper);
            if (domFieldElement) {
                domSubSubFieldWrapper.appendChild(domFieldElement);
            }
            domSubSubFieldWrapper.appendChild(domDescription);
            if (domRequired) {
                domSubSubFieldWrapper.appendChild(domRequired);
            }
            if (domErrorSpan) {
                domSubSubFieldWrapper.appendChild(domErrorSpan);
            }
            p.appendChild(domSubFieldWrapper);
        } else {
            if (domFieldElement) {
                domFieldWrapper.appendChild(domFieldElement);
            }
            if (domRequired) {
                domFieldWrapper.appendChild(domRequired);
            }
            domFieldWrapper.appendChild(domDescription);
            if (domErrorSpan) {
                domFieldWrapper.appendChild(domErrorSpan);
            }
            p.appendChild(domFieldWrapper);
        }
        return p;
    }
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilderInput
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilderInput(attrs) {
        DFormDOMElementBuilderInput.__super__.constructor.apply(this, [attrs]);
        var id = Date.now();
        this.init('input', attrs, {
            id : 'id_input_' + id,
            name : 'name_input_' + id,
            type : 'text'
        });
    }
    __extends(DFormDOMElementBuilderInput, DFormDOMFieldBuilder);
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilderButton
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilderButton(attrs) {
        DFormDOMElementBuilderButton.__super__.constructor.apply(this, [attrs]);
        var id = Date.now();
        this.init('button', attrs, {
            id : 'id_button_' + id,
            name : 'name_button_' + id,
            type : 'submit'
        });
    }
    __extends(DFormDOMElementBuilderButton, DFormDOMElementBuilder);
    DFormDOMElementBuilderButton.prototype.create = function(onChangeListener, css) {
        var domElement = DFormDOMElementBuilderButton.__super__.create.apply(this, [onChangeListener, css]);
        if(document.all){
            domElement.innerText = domElement.getAttribute('value');
        } else{
            domElement.textContent = domElement.getAttribute('value');
        }
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilderTextarea
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilderTextarea(attrs) {
        DFormDOMElementBuilderTextarea.__super__.constructor.apply(this, [attrs]);
        var id = Date.now();
        this.init('textarea', attrs, {
            id : 'id_textarea_' + id,
            name : 'name_textarea_' + id,
        });
        this.id = attrs.id ? attrs.id : 'id_textarea_' + id;
    }
    __extends(DFormDOMElementBuilderTextarea, DFormDOMFieldBuilder);
    DFormDOMElementBuilderTextarea.prototype.create = function(onChangeListener, css) {
        var domElement = DFormDOMElementBuilderTextarea.__super__.create.apply(this, [onChangeListener, css]);
        var domTextarea = domElement.getElementsByTagName('textarea');
        if(document.all){
            domTextarea.innerText = domElement.getAttribute('value');
        } else{
            domTextarea.textContent = domElement.getAttribute('value');
        }
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilderLegend
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilderLegend(attrs) {
        DFormDOMElementBuilderLegend.__super__.constructor.apply(this, [attrs]);
        var id = Date.now();
        this.init('legend', attrs, {});
    }
    __extends(DFormDOMElementBuilderLegend, DFormDOMElementBuilder);
    DFormDOMElementBuilderLegend.prototype.create = function(onChangeListener, css) {
        var domElement = DFormDOMElementBuilderLegend.__super__.create.apply(this, [onChangeListener, css]);
        domElement.appendChild(document.createTextNode(domElement.getAttribute('value')));
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilderSelect
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilderSelect(attrs, options) {
        DFormDOMElementBuilderSelect.__super__.constructor.apply(this, [attrs]);
        var id = Date.now();
        this.options = options ? options : attrs.options;
        this.init('select', attrs, {
            id : 'id_select_' + id,
            name : 'name_select_' + id,
        });
    }
    __extends(DFormDOMElementBuilderSelect, DFormDOMFieldBuilder);
    DFormDOMElementBuilderSelect.prototype.create = function(onChangeListener, css) {
        var domElement = DFormDOMElementBuilderSelect.__super__.create.apply(this, [onChangeListener, css]);
        // --------------------------------------------------------------------- //
        // DFormDOMSelectOption
        // --------------------------------------------------------------------- //
        function DFormDOMSelectOption(attrs, index) {
            DFormDOMSelectOption.__super__.constructor.apply(this, [attrs]);
            var id = index !== undefined ? index : Date.now();
            this.text = id;
            if (attrs.description !== undefined) {
                this.text = attrs.description;
                delete attrs.description;
            }
            this.init('option', attrs, {
                value : 'option_' + id
            });
        }
        __extends(DFormDOMSelectOption, DFormDOMElementBuilder);
        DFormDOMSelectOption.prototype.create = function(onChangeListener, css) {
            var domElement = DFormDOMSelectOption.__super__.create.apply(this, [onChangeListener, css]);
            domElement.appendChild(document.createTextNode(this.text));
            return domElement;
        };
        var domSelect = domElement.getElementsByTagName('select');
        for (var i = 0; i < this.options.length; i++) {
            var opt = new DFormDOMSelectOption(this.options[i], i);
            domSelect[0].appendChild(opt.create(undefined, css));
        };
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilderRadio
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilderRadio(attrs, options) {
        DFormDOMElementBuilderRadio.__super__.constructor.apply(this, [attrs]);
        var id = Date.now();
        this.options = options ? options : attrs.options;
        this.attributes = attrs ? attrs : {};
        this.attributes.name = this.attributes.name ? this.attributes.name : 'radio_' + id;
        this.attributes.id = this.attributes.id ? this.attributes.id : 'id_radio_' + id;
        this.init(undefined, attrs, {});
    }
    __extends(DFormDOMElementBuilderRadio, DFormDOMFieldBuilder);
    DFormDOMElementBuilderRadio.prototype.create = function(onChangeListener, css) {
        var domElement = DFormDOMElementBuilderRadio.__super__.create.apply(this, [onChangeListener, css]);
        var domRadios = domElement.getElementsByTagName('div')[0];
        for (var i = this.options.length - 1; i >= 0; i--) {
            var attrs = this.options[i];
            attrs.type = 'radio';
            attrs.name = this.attributes.name;
            attrs.id = this.attributes.id + '_' + i;
            var radio = new DFormDOMElementBuilderInput(attrs);
            var domRadio = radio.create(onChangeListener, css);
            var domInputRadio = domRadio.getElementsByTagName('div')[0];
            domRadios.appendChild(domInputRadio);
        };
        return domElement;
    };
    // --------------------------------------------------------------------- //
    // DFormDOMElementBuilderFieldset
    // --------------------------------------------------------------------- //
    function DFormDOMElementBuilderFieldset(attrs, fields) {
        DFormDOMElementBuilderFieldset.__super__.constructor.apply(this, [attrs]);
        var id = Date.now();
        this.fields = fields ? fields : [];
        this.init('fieldset', attrs, {});
        if (attrs.legend) {
            this.legend = attrs.legend;
            delete attrs.legend;
        }
    }
    __extends(DFormDOMElementBuilderFieldset, DFormDOMElementBuilder);
    DFormDOMElementBuilderFieldset.prototype.create = function(onChangeListener, css) {
        var domElement = DFormDOMElementBuilderFieldset.__super__.create.apply(this, [onChangeListener, css]);
        if (this.legend) {
            var domBuilder = new DFormDOMElementBuilderLegend({value: this.legend});
            domElement.appendChild(domBuilder.create(undefined, css));
        }
        for (var i = 0; i < this.fields.length; i++) {
            domElement.appendChild(this.fields[i].getDOM());
        };
        return domElement;
    };
    DFormDOMElementBuilderFieldset.prototype.addField = function (field) {
        this.fields.push(field);
    };
    // --------------------------------------------------------------------- //
    // DFormDOMFormBuilder
    // --------------------------------------------------------------------- //
    function DFormDOMFormBuilder(attrs) {
        DFormDOMFormBuilder.__super__.constructor.apply(this, [attrs]);
        this.fields = [];
        var id = Date.now();
        this.init('form', attrs, {
            id : 'form_' + id,
            name : 'form_' + id
        });
    }
    __extends(DFormDOMFormBuilder, DFormDOMElementBuilder);
    DFormDOMFormBuilder.prototype.create = function(onChangeListener, css) {
        var domElement = DFormDOMFormBuilder.__super__.create.apply(this, [onChangeListener, css]);
        for (var i = 0; i < this.fields.length; i++) {
            domElement.appendChild(this.fields[i].getDOM());
        };
        return domElement;
    };
    DFormDOMFormBuilder.prototype.addField = function (field) {
        this.fields.push(field);
    };
    // --------------------------------------------------------------------- //
    // DFormField
    // --------------------------------------------------------------------- //
    function DFormField (dFormDOMElementBuilder) {
        this._DOMBuilder = dFormDOMElementBuilder;
        this._listeners = [];
        this._css = {};
        this.fields = [];
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
        this._DOM = this._DOMBuilder.create(this, this._css);
        var me = this;
        return this._DOM;
    }
    DFormField.prototype.reset = function() {
        this._DOM.value = undefined;
    }
    DFormField.prototype.clone = function() {
        clone = new DFormField(this.dFormDOMElementBuilder);
        return clone;
    }
    DFormField.prototype.addField = function (field) {
        field.css(this._css);
        this.fields.push(field);
        this._DOMBuilder.addField(field);
    };
    DFormField.prototype.update = function(field) {
        // Redefine if neccessary;
    }
    DFormField.prototype.css = function (map) {
        this._css = map;
        if (this.fields) {
            for (var i = this.fields.length - 1; i >= 0; i--) {
                this.fields[i].css(map);
            };
        }
    };
    // --------------------------------------------------------------------- //
    // DForm
    // --------------------------------------------------------------------- //
    function DForm (attrs) {
        DForm.__super__.constructor.apply(this, [new DFormDOMFormBuilder(attrs ? attrs : {})]);
    }
    __extends(DForm, DFormField);
    DForm.prototype.appendTo = function (selector) {
        var domElement = document.querySelector(selector);
        if (domElement) {
            domElement.appendChild(this.getDOM());
        }
        return this.domElement;
    };
    var dform = {
        form : function (attrs) {
            return new DForm(attrs ? attrs : {});
        },
        input : function (attrs) {
            var DOMBuilder = new DFormDOMElementBuilderInput(attrs ? attrs : {});
            return new DFormField(DOMBuilder);
        },
        button : function (attrs) {
            var DOMBuilder = new DFormDOMElementBuilderButton(attrs ? attrs : {});
            return new DFormField(DOMBuilder);
        },
        textarea : function (attrs) {
            var DOMBuilder = new DFormDOMElementBuilderTextarea(attrs ? attrs : {});
            return new DFormField(DOMBuilder);
        },
        select : function (attrs, opts) {
            var DOMBuilder = new DFormDOMElementBuilderSelect(attrs ? attrs : {}, opts);
            return new DFormField(DOMBuilder);
        },
        radio : function (attrs, opts) {
            var DOMBuilder = new DFormDOMElementBuilderRadio(attrs ? attrs : {}, opts);
            return new DFormField(DOMBuilder);
        },
        legend : function (attrs, fields) {
            var DOMBuilder = new DFormDOMElementBuilderLegend(attrs ? attrs : {}, fields);
            return new DFormField(DOMBuilder);
        },
        fieldset : function (attrs, fields) {
            var DOMBuilder = new DFormDOMElementBuilderFieldset(attrs ? attrs : {}, fields);
            return new DFormField(DOMBuilder);
        },
        field : function (builder) {
            return new DFormField(builder);
        },
        customBuilder : function () {
            return new DFormDOMBuilder();
        }
    }
    return dform;
}());


