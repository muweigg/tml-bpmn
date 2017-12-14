'use strict';

const assign = require('lodash/assign'),
    is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function (onSettings) {
    
    function TMLContextPadProvider(contextPad, popupMenu, canvas) {
    
        this._contextPad = contextPad;
        this._popupMenu = popupMenu;
        this._canvas = canvas;
    
        contextPad.registerProvider(this);
    }
    
    TMLContextPadProvider.$inject = [
        'contextPad',
        'popupMenu',
        'canvas'
    ];
    
    TMLContextPadProvider.prototype.getContextPadEntries = function (element) {
    
        var self = this;
    
        var businessObject = element.businessObject;
    
        var actions = {};
    
        if (!is(businessObject, 'bpmn:SequenceFlow')) {
            assign(actions, {
                'settings-options': {
                    group: 'edit',
                    className: 'bpmn-icon-settings',
                    title: '节点配置',
                    action: {
                        click: function (event, element) {
                            self._popupMenu.close();
                            if (typeof onSettings === 'function')
                                onSettings(element.businessObject);
                        }
                    }
                }
            });
        }
    
        return actions;
    };

    return {
        __depends__: [
            require('diagram-js/lib/features/context-pad'),
            require('bpmn-js/lib/features/popup-menu'),
            require('bpmn-js/lib/features/modeling'),
        ],
        __init__: ['tmlContextPadProvider'],
        tmlContextPadProvider: ['type', TMLContextPadProvider]
    }
}
