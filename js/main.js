document.querySelectorAll('.md-select').forEach(select => {
  select.addEventListener('change', function() {
    if (this.value) {
      loadMarkdown(this.value);
      // Reset other dropdowns
      document.querySelectorAll('.md-select').forEach(other => {
        if (other !== this) other.selectedIndex = 0;
      });
    }
  });
});

function loadMarkdown(mdFile) {
  fetch(mdFile)
    .then(response => response.text())
    .then(text => {
      document.getElementById('content').innerHTML = marked.parse(text);
      window.scrollTo({top: 0, behavior: 'smooth'});
    })
    .catch(err => {
      document.getElementById('content').innerHTML = '<p>Error loading file.</p>';
    });
}
