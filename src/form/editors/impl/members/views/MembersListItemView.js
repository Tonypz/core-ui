import { htmlHelpers } from 'utils';
import list from 'list';
import template from '../templates/listItem.hbs';

export default Marionette.View.extend({
    template: Handlebars.compile(template),

    ui: {
        name: '.js-name'
    },

    className: 'dd-list__i',

    behaviors: [ list.views.behaviors.ListItemViewBehavior],

    events: {
        click: '__select'
    },

    __select() {
        this.trigger('member:select', this.model);
    },

    onHighlighted(fragment) {
        const text = htmlHelpers.highlightText(this.model.get('name'), fragment);
        this.ui.name.html(text);
    },

    onUnhighlighted() {
        this.ui.name.innerHtml = this.model.get('name');
    }
});
