//@flow
import dropdown from 'dropdown';
import template from '../templates/documentBubbleItem.html';
import DocumentRevisionButtonView from './DocumentRevisionButtonView';
import DocumentRevisionPanelView from './DocumentRevisionPanelView';
import DocumentItemController from '../controllers/DocumentItemController';
import iconWrapRemoveBubble from '../../../iconsWraps/iconWrapRemoveBubble.html';
import ExtensionIconService from '../services/ExtensionIconService';

const savedDocumentPrefix = 'document';

export default Marionette.View.extend({
    initialize(options) {
        this.revisionCollection = new Backbone.Collection();
        const controller = new DocumentItemController({ view: this });
        this.reqres = controller.reqres;

        this.attachmentsController = options.attachmentsController;
    },

    regions: {
        reviseRegion: '.js-revise-button-region'
    },

    tagName: 'li',

    template: Handlebars.compile(template),

    templateContext() {
        const { text, name, isLoading, extension } = this.model.toJSON();
        return {
            text: text || name,
            icon: ExtensionIconService.getIconForDocument({ isLoading, extension, name })
        };
    },

    className: 'task-links__i',

    ui: {
        remove: '.js-bubble-delete',
        revise: '.js-revise-button-region',
        link: '.js-link'
    },

    triggers: {
        'click @ui.remove': 'remove'
    },

    events: {
        'click @ui.revise': '__getDocumentRevision',
        'click @ui.link': '__showPreview',
        mouseenter: '__onMouseenter',
        mouseleave: '__onMouseleave'
    },

    modelEvents: {
        'change:isLoading': 'render'
    },

    __getDocumentRevision() {
        this.isRevisionButtonClicked = true;
        this.reqres.request('document:revise', this.model.id).then(revisionList => {
            this.revisionCollection.reset(revisionList.sort((a, b) => a.version - b.version));
            this.documentRevisionPopout.open();
        });
    },

    __showPreview() {
        return this.attachmentsController.showGallery(this.model);
    },

    __onMouseenter() {
        if (this.options.allowDelete) {
            this.el.insertAdjacentHTML('beforeend', iconWrapRemoveBubble);
        }
        if (this.model.id?.indexOf(savedDocumentPrefix) > -1 && this.options.showRevision) {
            if (!this.isRevisonButtonShown) {
                this.documentRevisionPopout = new dropdown.factory.createDropdown({
                    buttonView: DocumentRevisionButtonView,
                    panelView: DocumentRevisionPanelView,
                    panelViewOptions: { collection: this.revisionCollection },
                    popoutFlow: 'right',
                    autoOpen: false,
                    panelMinWidth: 'none'
                });
                this.documentRevisionPopout.on('close', () => (this.isRevisionButtonClicked = false));
                this.showChildView('reviseRegion', this.documentRevisionPopout);
                this.isRevisonButtonShown = true;
            } else {
                this.ui.revise.show();
            }
        }
    },

    __onMouseleave() {
        if (this.options.allowDelete) {
            this.el.removeChild(this.el.lastElementChild);
        }
        if (!this.isRevisionButtonClicked) {
            this.ui.revise.hide();
        }
    }
});
