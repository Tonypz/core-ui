import MappingService from '../services/MappingService';
import constants from '../Constants';
import getIconPrefixer from '../../../../../utils/handlebars/getIconPrefixer';

export default {
    getAutoCompleteContext() {
        let result;
        switch (this.autoCompleteContext) {
            case constants.autoCompleteContext.functions:
                result = constants.autoCompleteContext.functions;
                break;
            case constants.autoCompleteContext.attributes:
                result = constants.autoCompleteContext.attributes;
                break;
            case constants.autoCompleteContext.templates:
                result = constants.autoCompleteContext.templates;
                break;
            default:
                result = null;
        }

        return result;
    },

    findAutoCompleteContext(sourceCode, pos, autoCompleteModel) {
        const str = sourceCode.substr(pos - 3, 4);
        if (str === constants.activeSymbol.dbArrayRight) {
            this.autoCompleteContext = constants.autoCompleteContext.templates;
            return autoCompleteModel.get(constants.autoCompleteContext.templates);
        }
        this.autoCompleteContext = constants.autoCompleteContext.attributes;
        return autoCompleteModel.get(constants.autoCompleteContext.attributes);
    },

    async getDataRequest(options, type) {
        let result;
        if (type === constants.autoCompleteContext.attributes) {
            result = await options.intelliAssist.getAttributes(options.templateId);
        }
        if (type === constants.autoCompleteContext.templates) {
            result = await options.intelliAssist.getTemplates(options.completeHoverQuery);
        }
        const arr = MappingService.mapOntologyArrayToAutoCompleteArray(result, type);
        return arr;
    },

    async getAutoCompleteObject(options = {}) {
        let completion = [];
        let currentArray = [];
        let autoCompleteObject = {};
        if (options.token.type === constants.tokenTypes.identifier || options.types[options.token.type]) {
            if (options.completeHoverQuery.sourceCode[options.token.start - 1] === constants.activeSymbol.dollar) {
                currentArray = options.autoCompleteModel.get(constants.autoCompleteContext.attributes);
            } else if (options.completeHoverQuery.sourceCode[options.token.start - 1] === constants.activeSymbol.rightAngleBracket) {
                currentArray = this.findAutoCompleteContext(options.completeHoverQuery.sourceCode, options.token.start - 1, options.autoCompleteModel);
            } else {
                currentArray = options.autoCompleteModel.get(constants.autoCompleteContext.functions);
                this.autoCompleteContext = constants.autoCompleteContext.functions;
            }
            if (options.token.string === null) {
                return;
            }
            completion = currentArray.filter(item => item.text.toLowerCase().indexOf(options.token.string.toLowerCase()) > -1);
            autoCompleteObject = {
                from: {
                    line: options.cursor.line,
                    ch: options.token.start
                },
                to: {
                    line: options.cursor.line,
                    ch: options.token.end
                },
                list: completion
            };
        } else if (options.token.string === constants.activeSymbol.dollar) {
            let listToolbar;
            let attributes;
            if (options.attributes) {
                attributes = options.attributes;
            } else {
                attributes = await this.getDataRequest(options, constants.autoCompleteContext.attributes);
            }
            if (attributes.length) {
                attributes.forEach(atribute => { 
                    const type = atribute.type.toLowerCase();
                    atribute.icons = Core.meta.contextIconType[type];
                    if (atribute.alias) {
                        atribute.text = atribute.alias;
                    }
                });
                options.autoCompleteModel.set({ attributes });
                this.autoCompleteContext = constants.autoCompleteContext.attributes;
                listToolbar = this.__renderConfigListToolbar(attributes);
            } else {
                listToolbar = [{ text: LocalizationService.get('CORE.FORM.EDITORS.CODE.NOSUGGESTIONS') }];
            }
            autoCompleteObject = {
                from: options.cursor,
                to: options.cursor,
                list: listToolbar
            };
        } else if (options.token.string === constants.activeSymbol.arrayRight) {
            const result = await this.getDataRequest(options, constants.autoCompleteContext.templates);
            options.autoCompleteModel.set({ templates: result });
            this.autoCompleteContext = constants.autoCompleteContext.templates;
            autoCompleteObject = {
                from: options.cursor,
                to: options.cursor,
                list: this.__renderConfigListToolbar(result)
            };
        } else if (options.token.string === constants.activeSymbol.openParenthesis || options.codemirror.getValue().trim() === '') {
            autoCompleteObject = {
                from: options.cursor,
                to: options.cursor,
                list: this.__renderConfigListToolbar(options.autoCompleteModel.get(constants.autoCompleteContext.functions))
            };
        } else {
            autoCompleteObject = {
                from: options.cursor,
                to: options.cursor,
                list: this.__renderConfigListToolbar(completion)
            };
        }
        return autoCompleteObject;
    },

    __renderConfigListToolbar(list) {
        if (list.length) {
            list?.forEach(item => {
                item.render = function(el, cm, data) {
                    const icon = document.createElement('i');
                    const text = document.createElement('span');
                    text.innerText = data.text;
                    const type = data.type;
                    const getIcon = getIconPrefixer(type);
                    icon.className = getIcon(type);
                    el.appendChild(icon);
                    el.appendChild(text);
                };
            });
            return list;
        }
    }
};
