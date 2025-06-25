// js/main.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Add event listeners to all dropdowns with the .md-select class
  document.querySelectorAll('.md-select').forEach(select => {
    select.addEventListener('change', function () {
      if (this.value) {
        loadMarkdown(this.value);
        // Reset other dropdowns to their default option
        document.querySelectorAll('.md-select').forEach(other => {
          if (other !== this) other.selectedIndex = 0;
        });
      }
    });
  });
});

// Function to fetch and display the selected markdown file
function loadMarkdown(mdFile) {
  fetch(mdFile)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(text => {
      document.getElementById('content').innerHTML = marked.parse(text);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => {
      document.getElementById('content').innerHTML =
        `<p style="color:red;">Error loading file: ${err.message}</p>`;
    });
}
