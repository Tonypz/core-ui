import CanvasView from 'demoPage/views/CanvasView';

export default function() {
    const model = new Backbone.Model({
        title: 'foo',
        idealDays: 12,
        dueDate: '2015-07-20T10:46:37Z',
        description: 'bar\nbaz',
        blocked: true
    });

    return new CanvasView({
        view: new Core.layout.TabLayout({
            tabs: [
                {
                    id: 'tab1',
                    name: 'Tab 1',
                    view: new Core.layout.Form({
                        model,
                        schema: [
                            {
                                type: 'v-container',
                                items: [
                                    {
                                        key: 'title',
                                        title: 'Title',
                                        type: 'Text-field'
                                    },
                                    {
                                        type: 'h-container',
                                        items: [
                                            {
                                                key: 'idealDays',
                                                title: 'Ideal Days',
                                                type: 'Number-field'
                                            },
                                            {
                                                key: 'dueDate',
                                                type: 'DateTime-field',
                                                title: 'Due Date'
                                            }
                                        ]
                                    },
                                    {
                                        key: 'description',
                                        title: 'Description',
                                        type: 'TextArea-field'
                                    },
                                    {
                                        key: 'blocked',
                                        type: 'Boolean-field',
                                        displayText: 'Blocked by another task'
                                    },
                                    {
                                        text: 'Commit',
                                        type: 'Button',
                                        handler() {
                                            view.form.commit();
                                            alert(JSON.stringify(model.toJSON(), null, 4));
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                },
                {
                    id: 'tab2',
                    name: 'Tab 2',
                    view: new Core.form.editors.MembersSplitEditor({
                        key: 'title', //wrong key, expect [''] structure in title,
                        model,
                        autocommit: true,
                        users: Core.services.UserService.listUsers(),
                        groups: Core.services.UserService.listGroups(),
                        showMode: 'button'
                    })
                },
                {
                    id: 'tab3',
                    name: 'Tab 3',
                    enabled: false,
                    view: new Core.form.editors.TextAreaEditor({
                        value: 'Content 3'
                    })
                },
                {
                    id: 'tab4',
                    name: 'Tab 4',
                    error: 'Validation Error',
                    view: new Core.layout.Form({
                        model,
                        schema: [{
                            type: 'v-container',
                            items: [{
                                type: 'MembersSplit-field',
                                key: 'title', //wrong key, expect [''] structure in title,
                                model,
                                autocommit: true,
                                users: Core.services.UserService.listUsers(),
                                groups: Core.services.UserService.listGroups(),
                                showMode: 'button'
                            }]
                        }]
                    })
                }
            ],
            showStepper: true,
            showMoveButtons: true
        }),
        canvas: {
            height: '400px',
            width: '400px'
        }
    });
}
