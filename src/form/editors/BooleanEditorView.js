// @flow
import keyCode from '../../utils/keyCode';
import template from './templates/booleanEditor.html';
import BaseItemEditorView from './base/BaseItemEditorView';
import formRepository from '../formRepository';

const defaultOptions = {
    displayText: '',
    thirdState: false
};

const classes = {
    CHECKED: 'editor_checked',
    CHECKED_SOME: 'editor_checked_some'
};

/**
 * @name BooleanEditorView
 * @memberof module:core.form.editors
 * @class A simple Checkbox editor. Supported data type: <code>Boolean</code>.
 * @extends module:core.form.editors.base.BaseEditorView
 * @param {Object} options Options object. All the properties of {@link module:core.form.editors.base.BaseEditorView BaseEditorView} class are also supported.
 * @param {String} [options.displayText] Text to the right of the checkbox. Click on text triggers the checkbox.
 * @param {String} [options.displayHtml] HTML content to the right of the checkbox. Click on it triggers the checkbox.
 * @param {String} [options.title] Title attribute for the editor.
 * @param {Boolean} [options.thirdState=false] Enables third state for checkbox.
 * */
export default (formRepository.editors.Boolean = BaseItemEditorView.extend(
    {
        initialize(options = {}) {
            _.defaults(this.options, _.pick(options.schema ? options.schema : options, Object.keys(defaultOptions)), defaultOptions);
        },

        ui: {
            displayText: '.js-display-text'
        },

        events: {
            click: '__toggle',
            'click @ui.displayText': '__toggle',
            keydown: '__onKeyDown'
        },

        className: 'editor editor_checkbox',

        attributes() {
            return {
                title: this.options.title || null
            };
        },

        template: Handlebars.compile(template),

        templateContext() {
            return {
                displayText: this.options.displayText,
                displayHtml: this.options.displayHtml
            };
        },

        __toggle() {
            if (!this.getEnabled() || this.getReadonly()) {
                return false;
            }
            this.setValue(!this.getValue());
            this.__triggerChange();
            return false;
        },

        onRender() {
            this.__updateState();
        },

        setValue(value) {
            if (this.value === value) {
                return;
            }
            this.value = value;
            this.__updateState();
        },

        isEmptyValue() {
            return !_.isBoolean(this.getValue());
        },

        __updateState() {
            if (this.value) {
                this.el.classList.add(classes.CHECKED);
                this.el.classList.remove(classes.CHECKED_SOME);
            } else if (this.value === false || !this.options.thirdState) {
                this.el.classList.remove(classes.CHECKED_SOME);
                this.el.classList.remove(classes.CHECKED);
            } else {
                this.el.classList.remove(classes.CHECKED);
                this.el.classList.add(classes.CHECKED_SOME);
            }
        },

        __setReadonly(readonly) {
            BaseItemEditorView.prototype.__setReadonly.call(this, readonly);
            if (this.getEnabled()) {
                this.el.setAttribute('tabindex', readonly ? -1 : 0);
            }
        },

        __onKeyDown(event) {
            if (event.ctrlKey) {
                return;
            }
            if (event.keyCode === keyCode.SPACE) {
                this.__toggle();
                event.preventDefault();
            }
        }
    },
    {
        classes
    }
));
