/*
Editor Source:
https://github.com/jaredreich/pell

Convertor Source:
https://github.com/ekalai-org/whatsapp-editor
http://ekalai.net
*/

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (factory((global.pell = {})));
}(this, (function(exports) {
    'use strict';

    var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

    var defaultParagraphSeparatorString = 'defaultParagraphSeparator';
	
    var formatBlock = 'formatBlock';
	
    var addEventListener = function addEventListener(parent, type, listener) {
        return parent.addEventListener(type, listener);
    };
	
    var appendChild = function appendChild(parent, child) {
        return parent.appendChild(child);
    };
	
    var createElement = function createElement(tag) {
        return document.createElement(tag);
    };
	
    var queryCommandState = function queryCommandState(command) {
        return document.queryCommandState(command);
    };
	
    var queryCommandValue = function queryCommandValue(command) {
        return document.queryCommandValue(command);
    };

    var exec = function exec(command) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return document.execCommand(command, false, value);
    };

    var defaultActions = {
        bold: {
            icon: '<b>Bold</b>',
            title: 'Bold',
            state: function state() {
                return queryCommandState('bold');
            },
            result: function result() {
                return exec('bold');
            }
        },
        italic: {
            icon: '<i>Italic</i>',
            title: 'Italic',
            state: function state() {
                return queryCommandState('italic');
            },
            result: function result() {
                return exec('italic');
            }
        },
        strikethrough: {
            icon: '<strike>Strike</strike>',
            title: 'Strike-through',
            state: function state() {
                return queryCommandState('strikeThrough');
            },
            result: function result() {
                return exec('strikeThrough');
            }
        }
		/* , // Uncomment for enable other UI editor controls.
        underline: {
            icon: '<u>U</u>',
            title: 'Underline',
            state: function state() {
                return queryCommandState('underline');
            },
            result: function result() {
                return exec('underline');
            }
        },				
        heading1: {
            icon: '<b>H<sub>1</sub></b>',
            title: 'Heading 1',
            result: function result() {
                return exec(formatBlock, '<h1>');
            }
        },
        heading2: {
            icon: '<b>H<sub>2</sub></b>',
            title: 'Heading 2',
            result: function result() {
                return exec(formatBlock, '<h2>');
            }
        },
        paragraph: {
            icon: '&#182;',
            title: 'Paragraph',
            result: function result() {
                return exec(formatBlock, '<p>');
            }
        },
        quote: {
            icon: '&#8220; &#8221;',
            title: 'Quote',
            result: function result() {
                return exec(formatBlock, '<blockquote>');
            }
        },
        olist: {
            icon: '&#35;',
            title: 'Ordered List',
            result: function result() {
                return exec('insertOrderedList');
            }
        },
        ulist: {
            icon: '&#8226;',
            title: 'Unordered List',
            result: function result() {
                return exec('insertUnorderedList');
            }
        },
        code: {
            icon: '&lt;/&gt;',
            title: 'Code',
            result: function result() {
                return exec(formatBlock, '<pre>');
            }
        },
        line: {
            icon: '&#8213;',
            title: 'Horizontal Line',
            result: function result() {
                return exec('insertHorizontalRule');
            }
        },
        link: {
            icon: '&#128279;',
            title: 'Link',
            result: function result() {
                var url = window.prompt('Enter the link URL');
                if (url) exec('createLink', url);
            }
        },
        image: {
            icon: '&#128247;',
            title: 'Image',
            result: function result() {
                var url = window.prompt('Enter the image URL');
                if (url) exec('insertImage', url);
            }
        }
		*/
    };

    var defaultClasses = {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
    };

    var init = function init(settings) {
        var actions = settings.actions ? settings.actions.map(function(action) {
            if (typeof action === 'string') return defaultActions[action];
            else if (defaultActions[action.name]) return _extends({}, defaultActions[action.name], action);
            return action;
        }) : Object.keys(defaultActions).map(function(action) {
            return defaultActions[action];
        });

        var classes = _extends({}, defaultClasses, settings.classes);

        var defaultParagraphSeparator = settings[defaultParagraphSeparatorString] || 'div';

        var actionbar = createElement('div');
        actionbar.className = classes.actionbar;
        appendChild(settings.element, actionbar);

        var content = settings.element.content = createElement('div');
        content.contentEditable = true;
        content.className = classes.content;
        content.oninput = function(_ref) {
            var firstChild = _ref.target.firstChild;

            if (firstChild && firstChild.nodeType === 3) exec(formatBlock, '<' + defaultParagraphSeparator + '>');
            else if (content.innerHTML === '<br>') content.innerHTML = '';
            settings.onChange(content.innerHTML);
        };
        content.onkeydown = function(event) {
            if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
                setTimeout(function() {
                    return exec(formatBlock, '<' + defaultParagraphSeparator + '>');
                }, 0);
            }
        };
        appendChild(settings.element, content);

        actions.forEach(function(action) {
            var button = createElement('button');
            button.className = classes.button;
            button.innerHTML = action.icon;
            button.title = action.title;
            button.setAttribute('type', 'button');
            button.onclick = function() {
                return action.result() && content.focus();
            };

            if (action.state) {
                var handler = function handler() {
                    return button.classList[action.state() ? 'add' : 'remove'](classes.selected);
                };
                addEventListener(content, 'keyup', handler);
                addEventListener(content, 'mouseup', handler);
                addEventListener(button, 'click', handler);
            }

            appendChild(actionbar, button);
        });

        if (settings.styleWithCSS) exec('styleWithCSS');
        exec(defaultParagraphSeparatorString, defaultParagraphSeparator);

        return settings.element;
    };

    var pell = {
        exec: exec,
        init: init
    };

    exports.exec = exec;
    exports.init = init;
    exports['default'] = pell;

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

})));

function initEditor() {
    window.pell.init({
        'element': document.getElementById('editor'),
        'defaultParagraphSeparator': 'p',
        'onChange': function(htmlContent) {
            document.getElementById('html-output').textContent = htmlContent;
            changeToWhatsappFormat();
        }
    });
}

function changeToWhatsappFormat() {
    var htmlOutputContent = document.getElementById('html-output').textContent;
    htmlOutputContent = moveSpaceFromLastToFrontForAll(htmlOutputContent);
    htmlOutputContent = convertWhatsAppText(htmlOutputContent, 'b', '*');
    htmlOutputContent = convertWhatsAppText(htmlOutputContent, 'i', '_');
    htmlOutputContent = convertWhatsAppText(htmlOutputContent, 'strike', '~');
    document.getElementById('whatsapp-output').innerHTML = htmlOutputContent;
}

function moveSpaceFromLastToFrontForAll(htmlContent) {
    for (i = 0; i < 4; i++) {
        htmlContent = moveSpaceFromLastToFront(htmlContent, 'b'), htmlContent = moveSpaceFromLastToFront(htmlContent, 'i'), htmlContent = moveSpaceFromLastToFront(htmlContent, 'strike');
    }
    return htmlContent;
}

function moveSpaceFromLastToFront(htmlContent, htmlTagName) {
    return replaced = htmlContent, replaced = replaceAll(replaced, '<' + htmlTagName + '>&nbsp;', '&nbsp;<' + htmlTagName + '>'), replaced = replaceAll(replaced, '&nbsp;</' + htmlTagName + '>', '</' + htmlTagName + '>&nbsp;'), replaced = replaceAll(replaced, ' </' + htmlTagName + '>', '</' + htmlTagName + '> '), replaced;
}

function replaceAll(str, from, to) {
    return str['replace'](new RegExp(escapeRegExp(from), 'g'), to);
}

function escapeRegExp(str) {
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\$&');
}

function convertWhatsAppText(htmlContent, htmlTagName, whatsAppFormatChar) {
    return replaced = htmlContent, replaced = replaceAll(replaced, '<' + htmlTagName + '>&nbsp;', '&nbsp;' + whatsAppFormatChar), replaced = replaceAll(replaced, '&nbsp;<' + htmlTagName + '>', '&nbsp;' + whatsAppFormatChar), replaced = replaceAll(replaced, '<' + htmlTagName + '>', whatsAppFormatChar), replaced = replaceAll(replaced, '&nbsp;</' + htmlTagName + '>', whatsAppFormatChar + '&nbsp;'), replaced = replaceAll(replaced, '</' + htmlTagName + '>', whatsAppFormatChar), replaced;
}

function copyFormatedText(outputElement) {
    var range = document.createRange();
    range.selectNode(outputElement), window.getSelection().removeAllRanges(), window.getSelection().addRange(range), document.execCommand('copy'), window.getSelection().removeAllRanges(), alert('Formatted text copied. You can paste in web WhatsApp');
}

function copyForWhatsapp() {
    copyFormatedText(divWhatsapp);
}