// @flow
const classes: { HIDDEN: string } = {
    HIDDEN: 'layout__hidden'
};

export default Marionette.Behavior.extend({
    initialize(options: {}, view): void {
        view.__updateState = this.__updateState.bind(this);

        this.__state = {};
    },

    __updateState(): void {
        const nextState = this.__computeViewState();

        if (this.__state.visible !== nextState.visible) {
            this.el.classList.toggle(classes.HIDDEN, !nextState.visible);
            this.view.trigger('change:visible', this.view, nextState.visible);
        }
        this.__state = nextState;
    },

    __computeViewState(): { visible: boolean } {
        let visible = this.view.options.visible;

        visible = _.isFunction(visible) ? visible.call(this.view) : visible;
        if (_.isUndefined(visible)) {
            visible = true;
        }
        return {
            visible
        };
    }
});
