// Load Markdown content when a movement is clicked
document.querySelectorAll('[data-md-file]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const mdFile = this.getAttribute('data-md-file');
    fetch(mdFile)
      .then(response => {
        if (!response.ok) {
          throw new Error('File not found');
        }
        return response.text();
      })
      .then(markdown => {
        const html = marked.parse(markdown);
        document.getElementById('content').innerHTML = html;
        setupAccordion();
      })
      .catch(error => {
        document.getElementById('content').innerHTML = `<p>Error loading: ${mdFile}</p>`;
      });
  });
});

// Setup accordion for headings and bullet points
function setupAccordion() {
  const content = document.querySelector('.markdown-content');
  if (!content) return;

  // Helper: find next siblings until next heading of same or higher level
  function getNextSiblings(node, level) {
    let siblings = [];
    while (node.nextElementSibling && (
      !node.nextElementSibling.tagName.match(/^H[1-6]$/i) ||
      parseInt(node.nextElementSibling.tagName.substring(1)) > level
    )) {
      node = node.nextElementSibling;
      siblings.push(node);
    }
    return siblings;
  }

  // Add click handlers for h1, h2, h3
  ['h1', 'h2', 'h3'].forEach(tag => {
    content.querySelectorAll(tag).forEach(heading => {
      heading.addEventListener('click', function() {
        const level = parseInt(this.tagName.substring(1));
        const siblings = getNextSiblings(this, level);
        this.classList.toggle('active');
        // Toggle visibility of all siblings until next heading of same or higher level
        siblings.forEach(sib => {
          if (this.classList.contains('active')) {
            sib.style.display = 'block';
          } else {
            // Only hide if not revealed by a higher-level active heading
            if (!(sib.tagName && sib.tagName.match(/^H[1-3]$/i) && sib.classList.contains('active'))) {
              sib.style.display = 'none';
            }
          }
        });
      });
    });
  });
}
