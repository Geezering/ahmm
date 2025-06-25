document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.md-select').forEach(select => {
    select.addEventListener('change', function () {
      if (this.value) {
        loadMarkdown(this.value);
        document.querySelectorAll('.md-select').forEach(other => {
          if (other !== this) other.selectedIndex = 0;
        });
      }
    });
  });
});

function loadMarkdown(mdFile) {
  fetch(mdFile)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(text => {
      document.getElementById('content').innerHTML = marked.parse(text);
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

  // List the heading levels you want to include in the accordion
  const headingTags = ['H2', 'H3', 'H4']; // Add H5, H6 if desired

  // Helper: get heading level as a number (e.g., H2 -> 2)
  function getLevel(tagName) {
    return parseInt(tagName.replace('H', ''), 10);
  }

  // Find all headings of interest
  const allHeadings = Array.from(container.querySelectorAll(headingTags.join(',')));

  allHeadings.forEach((heading, idx) => {
    // Find all elements between this heading and the next heading of same or higher level
    const thisLevel = getLevel(heading.tagName);
    let next = heading.nextElementSibling;
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('accordion-content');
    while (
      next &&
      (
        !headingTags.includes(next.tagName) ||
        getLevel(next.tagName) > thisLevel
      )
    ) {
      const toMove = next;
      next = next.nextElementSibling;
      contentWrapper.appendChild(toMove);
    }
    contentWrapper.style.display = 'none';
    heading.after(contentWrapper);

    // Make heading clickable
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function (e) {
      e.stopPropagation();
      // Toggle only this section
      const isVisible = contentWrapper.style.display === 'block';
      contentWrapper.style.display = isVisible ? 'none' : 'block';

      // Optionally, close all nested accordions when closing
      if (isVisible) {
        contentWrapper.querySelectorAll('.accordion-content').forEach(div => div.style.display = 'none');
      }
    });
  });
}

