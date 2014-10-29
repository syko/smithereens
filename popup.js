var smithereen = {
  url: 'https://cdn.rawgit.com/syko/smithereens/master/smithereens.json',

  refresh: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.url, true);
    req.onload = this.onRefresh.bind(this);
    req.send(null);
  },

  onRefresh: function (e) {
    var smithereens = JSON.parse(e.target.responseText);
    chrome.storage.sync.set(smithereens, function() {
       var button = document.getElementById('id_refresh');
       button.textContent = 'Success!';
       button.disabled = 'disabled';
     });
  },

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('id_refresh').onclick = function() {
    smithereen.refresh();
  }
});
