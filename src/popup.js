console.log("Inside popup script")

var repoRoot = 'https://api.github.com/repos/tedneward/research/'

// Grab controls
var editName = document.getElementById("editName")
var listCategories = document.getElementById("listCategories")
var editTitle = document.getElementById("editTitle")
var editTags = document.getElementById("editTags")
var editSummary = document.getElementById("editSummary")
var editContent = document.getElementById("editContent")
var btnBookmark = document.getElementById("btnBookmark")

function onBookmarkClicked() {
  var ghAccessToken = '';
  chrome.storage.sync.get({
    accessToken: ''
  }, function(items) {
    // Set values
    ghAccessToken = items.accessToken;
    console.log("ghAccessToken:", ghAccessToken);
  });

  console.log("Click");
  console.log("Name:", editName.value, "category:", listCategories.options[listCategories.selectedIndex].text,"Title:", editTitle.value,"Tags:", editTags.value,"Summary:", editSummary.value,"Content:", editContent.value);

  var file = editName.value + ".md";
  var category = listCategories.options[listCategories.selectedIndex].text;
  fetch(repoRoot + 'contents/content/' + category + "/" + file, {
    headers: {
      // must send media type "application/vnd.github.VERSION.raw"
      // to get contents in non-Base64-encoded format; while I could
      // convert it, why bother if GH can give it to me raw?
      // EXCEPT IT DOESN'T SEEM TO WORK THAT WAY! ARGH! WHY?!?
      "Accept": "application/vnd.github.v3.raw+json"
    }
  }).then(response => response.json())
    .then(data => {
      var putContents = ""
      if (data["message"] !== undefined) {
        if (data.message === "Not Found") {
          // We have no file at that location -- do a straight PUT
          console.log("We have no file at that location")
          putContents = "title=" + editTitle.value + "\n";
          putContents += "tags=" + editTags.value + "\n";
          putContents += "summary=" + editSummary.value + "\n";
          putContents += "~~~~~~\n";
          putContents += editContent.value + "\n";
        }
      }
      else if (data["name"] === file) {
        // We have a file by that name already!
        if (data["encoding"] === 'base64') {
          // Fine, de-encrypt the damn thing
          putContents = window.atob(data.content);
          console.log("Decoded:", putContents);
        }
        else {
          console.log("Wait, it worked?!?", data.content)
          window.alert("We got back non-base64-encoded data?!?");
          putContents = data.content + "\n" + editContent.value;
        }
      }

      /*
Syntax of a working command to create a file in a repository using the GitHub API:

curl -i -X PUT -H 'Authorization: token <token_string>' -d '{"path": "<filename.extension>", "message": "<Commit Message>", "committer": {"name": "<Name>", "email": "<E-Mail>"}, "content": "<Base64 Encoded>", "branch": "master"}' https://api.github.com/repos/<owner>/<repository>/contents/<filename.extension>

My example:

curl -i -X PUT -H 'Authorization: token f94ce61613d5613a23770b324521b63d202d5645' -d '{"path": "test4.txt", "message": "Initial Commit", "committer": {"name": "Neil", "email": "neil@abc.com"}, "content": "bXkgbmV3IGZpbGUgY29udGVudHM=", "branch": "master"}' https://api.github.com/repos/InViN-test/test_repo1/contents/test4.txt
       */
      var putBody = {
        'path': file,
        'message': 'Bookmark from Chrome Extension (' + new Date(Date.now() + ')'),
        'committer': { 'name': 'Ted Neward', 'email': 'ted@tedneward.com' },
        'content': window.btoa(putContents)
      }

      console.log("Preparing to PUT", putContents, "to", file);
      fetch(repoRoot + 'contents/content/' + category + "/" + file, {
        method: 'PUT',
        body: putBody,
        headers: {
          'Authorization': 'token ' + ghAccessToken
        }
      }).then( response => response.json() )
      .then(data => {
        console.log("PUT response data:", data);
      })
      .catch( error => console.error("Error in PUT", error) )
    })
    .catch(error => console.error("Error in fetching " + file, error) );
}

function fetchContentsFrom(path, callback) {
  console.log("Fetching content from", path);
  // /repos/{owner}/{repo}/contents/{path}
  fetch(repoRoot + 'contents/' + path)
    .then(response => response.json())
    .then( data => callback(data))
    .catch( error => console.error("Error in fetchContentsFrom", error) );
}

// Register event handlers
btnBookmark.onclick = onBookmarkClicked;

// Populate listCategories
fetchContentsFrom('content', (data) => {
  for (var i = 1; i<data.length; i++) {
    var option = document.createElement( 'option' );
    option.value = option.text = data[i].name;
    listCategories.add(option);
  }
})

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  console.log("activeTab: ", tabs[0].id, tabs[0].title, tabs[0].url);
  editTitle.value = tabs[0].title;
  editContent.value += '["' + tabs[0].title + '"](' + tabs[0].url + ')';
});
