document.addEventListener('DOMContentLoaded', function() {
  // Setup dropdowns
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

  // Initialize accordion if content exists on page load
  if (document.getElementById('content').innerHTML) {
    makeAccordion('#content');
  }
});

function loadMarkdown(mdFile) {
  fetch(mdFile)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(text => {
      document.getElementById('content').innerHTML = marked.parse(text);
      fixImagePaths('#content', 'myrepo'); // <-- ADD THIS LINE
      makeAccordion('#content');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => {
      document.getElementById('content').innerHTML = 
        `<p style="color:red;">Error loading file: ${err.message}</p>`;
    });
}

// Add this function to fix image paths for GitHub Pages
function fixImagePaths(containerSelector, repoName = 'myrepo') {
  document.querySelectorAll(`${containerSelector} img`).forEach(img => {
    // Only fix if hosted on GitHub Pages
    if (window.location.hostname.endsWith('github.io')) {
      // If src starts with /images/, prepend repo name
      if (img.getAttribute('src') && img.getAttribute('src').startsWith('/images/')) {
        img.setAttribute('src', `/${repoName}${img.getAttribute('src')}`);
      }
      // If src starts with images/, prepend /repoName/
      else if (img.getAttribute('src') && img.getAttribute('src').startsWith('images/')) {
        img.setAttribute('src', `/${repoName}/${img.getAttribute('src')}`);
      }
      // If src starts with ../images/, replace ../ with /repoName/
      else if (img.getAttribute('src') && img.getAttribute('src').startsWith('../images/')) {
        img.setAttribute('src', `/${repoName}/images/${img.getAttribute('src').substring('../images/'.length)}`);
      }
    }
  });
}

function makeAccordion(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const headingTags = ['H2', 'H3', 'H4'];

  // Clear previous accordions
  container.querySelectorAll('.accordion-content').forEach(el => el.remove());
  container.querySelectorAll('.active').forEach(el => el.classList.remove('active'));

  const allHeadings = Array.from(container.querySelectorAll(headingTags.join(',')));

  allHeadings.forEach(heading => {
    const thisLevel = parseInt(heading.tagName.replace('H', ''), 10);
    let next = heading.nextElementSibling;
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('accordion-content');

    // Move content under heading into wrapper
    while (next &&
          (!headingTags.includes(next.tagName) ||
           parseInt(next.tagName.replace('H', ''), 10) > thisLevel)) {
      const toMove = next;
      next = next.nextElementSibling;
      contentWrapper.appendChild(toMove);
    }

    heading.after(contentWrapper);

    // Set initial state to collapsed
    contentWrapper.style.display = 'none';

    // Make heading clickable
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function(e) {
      e.stopPropagation();
      const wasActive = heading.classList.contains('active');

      // Toggle active state
      heading.classList.toggle('active');
      contentWrapper.classList.toggle('active');

      // Toggle visibility
      contentWrapper.style.display = contentWrapper.style.display === 'none' ? 'block' : 'none';
    });
  });
}
