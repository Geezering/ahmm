document.addEventListener('DOMContentLoaded', function() {
  // --- Fragment Loading (Dropdowns & Inject Links) ---

  // Unified fragment loader for both dropdowns and inject-links
  function loadFragment(fragmentFile) {
    // If the file path doesn't start with /md-html_docs/, add it
    const filePath = fragmentFile.startsWith('/md-html_docs/')
      ? fragmentFile
      : `/md-html_docs/${fragmentFile}`;

    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('Fragment not found');
        return response.text();
      })
      .then(html => {
        document.getElementById('content').innerHTML = html;
        makeAccordion('#content');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        document.getElementById('content').innerHTML =
          `<p style="color:red;">Error loading content: ${err.message}</p>`;
      });
  }

  // Dropdowns with class .md-select
  document.querySelectorAll('.md-select').forEach(select => {
    select.addEventListener('change', function() {
      if (this.value) {
        loadFragment(this.value);
        // Reset other dropdowns
        document.querySelectorAll('.md-select').forEach(other => {
          if (other !== this) other.selectedIndex = 0;
        });
      }
    });
  });

  // Inject-link fragment loading
  document.querySelectorAll('.inject-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const fragmentFile = link.getAttribute('data-fragment');
      if (fragmentFile) loadFragment(fragmentFile);
    });
  });

  // Load a default fragment on page load (optional, change as needed)
  // Comment out if you don't want a default
  loadFragment('impressionism.html');

  // --- Accordion Initialisation (for static content) ---
  // If there is already content in #content, make it an accordion
  if (document.getElementById('content').innerHTML.trim()) {
    makeAccordion('#content');
  }
});

// --- Accordion Functionality ---
function makeAccordion(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const headingTags = ['H2', 'H3', 'H4'];

  // Remove previous accordion content and active classes
  container.querySelectorAll('.accordion-content').forEach(el => el.remove());
  container.querySelectorAll('.active').forEach(el => el.classList.remove('active'));

  // Find all headings for accordion
  const allHeadings = Array.from(container.querySelectorAll(headingTags.join(',')));

  allHeadings.forEach(heading => {
    const thisLevel = parseInt(heading.tagName.replace('H', ''), 10);
    let next = heading.nextElementSibling;
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('accordion-content');
    contentWrapper.style.display = 'none';

    // Move all elements under this heading into the wrapper, until a higher or same-level heading or H1
    while (
      next &&
      (next.tagName !== 'H1') &&
      (!headingTags.includes(next.tagName) ||
        parseInt(next.tagName.replace('H', ''), 10) > thisLevel)
    ) {
      const toMove = next;
      next = next.nextElementSibling;
      contentWrapper.appendChild(toMove);
    }

    heading.after(contentWrapper);

    // Make heading clickable for accordion
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function(e) {
      e.stopPropagation();
      heading.classList.toggle('active');
      contentWrapper.classList.toggle('active');
      contentWrapper.style.display =
        contentWrapper.style.display === 'none' ? 'block' : 'none';
    });
  });
}
