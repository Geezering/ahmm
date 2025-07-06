document.addEventListener('DOMContentLoaded', function() {
  // Setup dropdowns
  document.querySelectorAll('.md-select').forEach(select => {
    select.addEventListener('change', function() {
      if (this.value) {
        loadHtmlFragment(this.value);
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

function loadHtmlFragment(htmlFile) {
  fetch(htmlFile)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      document.getElementById('content').innerHTML = html;
      makeAccordion('#content');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => {
      document.getElementById('content').innerHTML = 
        `<p style="color:red;">Error loading file: ${err.message}</p>`;
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

    // Move content under heading into wrapper, but stop at H1
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

    // Set initial state to collapsed
    contentWrapper.style.display = 'none';

    // Make heading clickable
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function(e) {
      e.stopPropagation();
      // Toggle active state
      heading.classList.toggle('active');
      contentWrapper.classList.toggle('active');
      // Toggle visibility
      contentWrapper.style.display = contentWrapper.style.display === 'none' ? 'block' : 'none';
    });
  });
}
