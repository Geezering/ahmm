// js/main.js

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

// Accordion functionality for markdown headings
function makeAccordion(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Find all h2 headings (adjust to h3/h4 if needed)
  const headings = container.querySelectorAll('h2');
  headings.forEach((heading, idx) => {
    // Find all elements between this heading and the next heading
    let next = heading.nextElementSibling;
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('accordion-content');
    // Move siblings into the content wrapper until the next heading or end
    while (next && next.tagName !== 'H2') {
      const toMove = next;
      next = next.nextElementSibling;
      contentWrapper.appendChild(toMove);
    }
    // Hide content by default
    contentWrapper.style.display = 'none';
    heading.after(contentWrapper);

    // Make heading clickable
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function () {
      const isVisible = contentWrapper.style.display === 'block';
      // Optionally close all others:
      container.querySelectorAll('.accordion-content').forEach(div => div.style.display = 'none');
