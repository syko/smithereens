var smithereenOptions = {
  url: 'https://cdn.rawgit.com/syko/smithereens/master/smithereens.json',

  reloadConfig: function(fileName, configName) {
    var reader = new FileReader();
    reader.onerror = (function() {
      alert("Some error");
    }).bind(this);
    reader.onload = (function(e) {
      try {
        var config = HanSON.parse(e.target.result);
      } catch(e) {
        alert(e);
      }
      this.storeConfig(config, configName);
    }).bind(this);
    reader.readAsText(fileName);
  },

  storeConfig: function(config, configName) {
    var data = {};
    data[configName] = config;
    chrome.storage.sync.set(data, (function() {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
      } else {
        this.refreshCurrentConfigPre();
        this.refreshCurrentSmithereensPre();
      }
    }).bind(this));
  },

  getCurrentConfig: function(cb) {
    chrome.storage.sync.get('config', (function(data) {
      if(!data.config) data = {config: SMITHEREEN_DEFAULT_CONFIG}
      if(cb) cb(data);
    }).bind(this));
  },
  getCurrentSmithereens: function(cb) {
    chrome.storage.sync.get('smithereens', (function(data) {
      if(cb) cb(data);
    }).bind(this));
  },

  refreshCurrentConfigPre: function() {
    this.getCurrentConfig((function (data) {
      this.getCurrentConfigPre().textContent = JSON.stringify(data, undefined, 2);
    }).bind(this));
  },
  refreshCurrentSmithereensPre: function() {
    this.getCurrentSmithereens((function (data) {
      this.getCurrentSmithereensPre().textContent = JSON.stringify(data, undefined, 2);
    }).bind(this));
  },

  getConfigInput: function () {
    return document.getElementById('id_config');
  },
  getCurrentConfigPre: function () {
    return document.getElementById('id_currentConfig');
  },
  getSmithereensInput: function () {
    return document.getElementById('id_smithereens');
  },
  getCurrentSmithereensPre: function () {
    return document.getElementById('id_currentSmithereens');
  },

  init: function() {
    this.refreshCurrentConfigPre();
    this.refreshCurrentSmithereensPre();
    this.getConfigInput().addEventListener('change', (function(e) {
      var fileName = e.target.files[0];
      this.reloadConfig(fileName, 'config');
    }).bind(this));
    this.getSmithereensInput().addEventListener('change', (function(e) {
      var fileName = e.target.files[0];
      this.reloadConfig(fileName, 'smithereens');
    }).bind(this));
  },

};

document.addEventListener('DOMContentLoaded', function () {
  smithereenOptions.init();
});
