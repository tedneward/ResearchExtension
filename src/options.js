// Options consist of:
// -- access_token


function save_options() {
  // Get values
  chrome.storage.sync.set({
    accessToken: token
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  // Use default value accessToken = ''
  chrome.storage.sync.get({
    accessToken: ''
  }, function(items) {
    // Set values
    document.getElementById('editAccessToken').value = items.accessToken;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
