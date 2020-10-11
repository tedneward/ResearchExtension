console.log("Inside popup script")

function onBookmarkClicked() {
  console.log("Click")
  console.log("Name:", editName.value)
  console.log("category:", listCategories.options[listCategories.selectedIndex].text)
  console.log("Title:", editTitle.value)
  console.log("Tags:", editTags.value)
  console.log("Summary:", editSummary.value)
  console.log("Content:", editContent.value)
}

// Grab controls
var editName = document.getElementById("editName")
var listCategories = document.getElementById("listCategories")
var editTitle = document.getElementById("editTitle")
var editTags = document.getElementById("editTags")
var editSummary = document.getElementById("editSummary")
var editContent = document.getElementById("editContent")
var btnBookmark = document.getElementById("btnBookmark")

// Register event handlers
btnBookmark.onclick = onBookmarkClicked;

// /repos/{owner}/{repo}/contents/{path}
fetch('https://api.github.com/repos/tedneward/research/contents/content')
  .then(response => response.json())
  .then( data => {
    for (var i = 1; i<data.length; i++) {
      var option = document.createElement( 'option' );
      option.value = option.text = data[i].name;
      listCategories.add(option);
    }
  })
  .catch( error => console.error(error));

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  console.log("activeTab: ", tabs[0].id, tabs[0].title, tabs[0].url)
  editTitle.value = tabs[0].title
  editContent.value += "[Website](" + tabs[0].url + ")"
});
