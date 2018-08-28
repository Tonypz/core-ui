import template from '../templates/membersToolbar.html';

export default Marionette.View.extend({
    initialize(options) {
        this.reqres = options.reqres;
    },

    template: Handlebars.compile(template),

    className: 'tabs tabs_columns-select',

    regions: {
        listRegion: '.js-list-region'
    },

    ui: {
        allButton: '.js-all-button',
        usersButton: '.js-users-button',
        groupsButton: '.js-groups-button',
        resourcesButton: '.js-resource-button',

        filterButtons: '.js-filter-button',

        allLink: '.js-all-link',
        usersLink: '.js-users-link',
        groupsLink: '.js-groups-link',
        resourcesLink: '.js-resource-link',

        filterLink: '.js-filter-link'
    },

    events: {
        'click @ui.allButton': '__filterAll',
        'click @ui.usersButton': '__filterUsers',
        'click @ui.groupsButton': '__filterGroups',
        'click @ui.resourcesButton': '__filterResources'
    },

    classes: {
        active: 'tabs__i_current',
        activeLink: 'tabs__link_current'
    },

    onRender() {
        if (!this.model.get('showAll')) {
            if (this.model.get('showUsers')) {
                this.__filterUsers();
            } else if (this.model.get('showGroups')) {
                this.__filterGroups();
            }
        }
    },

    __filterAll() {
        if (this.ui.allButton.hasClass(this.classes.active)) return;
        this.ui.filterButtons.classList.remove(this.classes.active);
        this.ui.allButton.classList.add(this.classes.active);
        this.ui.filterLink.classList.remove(this.classes.activeLink);
        this.ui.allLink.classList.add(this.classes.activeLink);
        this.trigger('select', '');
    },

    __filterUsers() {
        if (this.ui.usersButton.hasClass(this.classes.active)) return;
        this.ui.filterButtons.classList.remove(this.classes.active);
        this.ui.usersButton.classList.add(this.classes.active);
        this.ui.filterLink.classList.remove(this.classes.activeLink);
        this.ui.usersLink.classList.add(this.classes.activeLink);
        this.trigger('select', 'users');
    },

    __filterGroups() {
        if (this.ui.groupsButton.hasClass(this.classes.active)) return;
        this.ui.filterButtons.classList.remove(this.classes.active);
        this.ui.groupsButton.classList.add(this.classes.active);
        this.ui.filterLink.classList.remove(this.classes.activeLink);
        this.ui.groupsLink.classList.add(this.classes.activeLink);
        this.trigger('select', 'groups');
    },

    __filterResources() {
        if (this.ui.resourcesButton.hasClass(this.classes.active)) return;
        this.ui.filterButtons.classList.remove(this.classes.active);
        this.ui.resourcesButton.classList.add(this.classes.active);
        this.ui.filterLink.classList.remove(this.classes.activeLink);
        this.ui.resourcesLink.classList.add(this.classes.activeLink);
        this.trigger('select', 'resources');
    }
});
