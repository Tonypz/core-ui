/**
 * Developer: Stepan Burguchev
 * Date: 8/4/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer */

//noinspection ThisExpressionReferencesGlobalObjectJS
(function (global) {
    'use strict';

    define([ 'module/lib', 'ajaxMap' ], function (lib) {
        var ajaxMap = global.ajaxMap;

        debugger;
        global.Ajax = {
            /*get: function (locId) {
                if (!locId) {
                    throw new Error('Bad localization id: (locId = ' + locId + ')');
                }
                var text = ajaxMap[locId];
                if (text === undefined) {
                    throw new Error('Failed to find localization constant ' + locId);
                }
                return text;
            },

            resolveLocalizedText: function (localizedText) {
                if (!localizedText) {
                    return '';
                }

                return localizedText[langCode] || localizedText[defaultLangCode] || '';
            }*/
        };
        return global.Ajax;
    });
}(this));
