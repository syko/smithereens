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
    // var caretPosition = smithereen.replace('\n', '').search(/{\|}/)
    // smithereen = smithereen.replace('{|}', '')
    utils.setNodeValue(document.activeElement, this.bakeSmithereen(smithereen));
    // if(caretPosition == -1) {
    //   caretPosition = utils.getNodeValue(document.activeElement).length;
    // }
    // document.activeElement.selectionStart = document.activeElement.selectionEnd = caretPosition;
    document.activeElement.dispatchEvent(new Event('input')); // Force desk's autosize
  },

  bakeSmithereen: function (smithereen) {

    // Smithereen replacement functions

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

// Run our kitten generation script as soon as the document's DOM is ready.
smithereensApp.init();
