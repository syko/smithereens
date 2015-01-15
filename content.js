var utils = {
  getNodeValue: function(node) {
    switch(node.tagName.toLowerCase()) {
      case 'input':
      case 'textarea':
        return document.activeElement.value;
      default:
        return node.textContent;
    }
  },

  setNodeValue: function(node, value) {
    switch(node.tagName.toLowerCase()) {
      case 'input':
      case 'textarea':
        node.value = value;
      default:
        node.textContent = value;
    }
  },

  insertAtCaret: function(node, str) {
    if(node.selectionStart || node.selectionStart === 0) {
      var startPos = node.selectionStart;
      var endPos = node.selectionEnd;
      finalValue = node.value.substring(0, startPos) + str + node.value.substring(endPos, node.value.length);
    } else {
      finalValue = node.value + str;
      node.value += str;
    }
    node.value = finalValue
    return finalValue;
  },

  selectRange: function(node, start, end) {
    node.value = node.value;
    if (node.createTextRange) {
      var range = node.createTextRange();
      range.collapse(true)
      range.moveStart('character', start);
      range.moveEnd('character', end || start);
      range.select();
    } else {
      if (node.selectionStart || node.selectionStart === 0) {
        node.focus();
        node.setSelectionRange(start, end || start);
      } else  {
        node.focus();
      }
    }
  },

  findNode: function(selector) {
    return document.querySelector(selector);
  },

  findNodes: function(selector) {
    return document.querySelectorAll(selector);
  }

}

var smithereensApp = {

  defaultConfig: {},
  config: {},
  smithereens: {},

  init: function() {
    key.filter = function(event) {
      var tagName = (event.target || event.srcElement).tagName;
      key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
      return true;
    }
    chrome.storage.sync.get('config', (function(data) {
      if(!data.config) data = {config: SMITHEREEN_DEFAULT_CONFIG}
      this.config = data.config;
      chrome.storage.sync.get('smithereens', (function(data) {
        this.smithereens = data.smithereens;
        this.setupSmithereens();
      }).bind(this));
    }).bind(this));
  },

  setupSmithereens: function () {
    var smithereens = this.smithereens;
    for(var k in smithereens) {
      key(k, 'input', (function(k) { return function(e) { smithereensApp.applySmithereen(e, k, smithereens[k]); } })(k));
    }
  },

  applySmithereen: function (e, key, smithereen) {

    smithereen = this.bakeSmithereen(smithereen);
    var inputValue = utils.insertAtCaret(document.activeElement, smithereen);

    // Calculate selection start and end from final concatenated value

    var selectionStart = inputValue.search(/{\|}/)
    inputValue = inputValue.replace('{|}', '')

    var selectionEnd = inputValue.search(/{\|}/)
    inputValue = inputValue.replace('{|}', '')

    if(selectionStart == -1) {
      selectionStart = inputValue.length;
    }
    if(selectionEnd == -1) {
      selectionEnd = undefined;
    }

    utils.setNodeValue(document.activeElement, inputValue); // Lose the {|}
    utils.selectRange(document.activeElement, selectionStart, selectionEnd);

    document.activeElement.dispatchEvent(new Event('input')); // Force desk's autosize

  },

  bakeSmithereen: function (smithereen) {

    // Smithereen replacement functions

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function firstWord(str) {
      return (str || "").split(' ')[0];
    }
    function findRegex(nodes, regexStr, subpattern) {
      var regex = new RegExp(regexStr);
      for(var i in nodes) {
        var node = nodes[i];
        if(!node) continue;
        var matches = node.textContent.match(regex);
        if(!matches || !matches[subpattern]) continue;
        return matches[subpattern];
      }
    }
    function findNode(selector) {
      return utils.findNode(selector);
    }
    function findNodes(selector) {
      return utils.findNodes(selector);
    }
    function getNodeValue(node) {
      if(!node) return '';
      return (utils.getNodeValue(node) || "").replace(/^\s*/, '').replace(/\s*$/, '');
    }

    for(var k in this.config.replacements) {
      var replacements = this.config.replacements[k];
      for(var r in replacements) {
        var replacementCode = replacements[r];
        var replacement = eval(replacementCode);
        if(replacement) {
          smithereen = smithereen.replace(k, replacement);
          break;
        }
      }
    }
    return smithereen;
  }


};

smithereensApp.init();
