// Set your GitHub Pages project base path here:
const BASE_PATH = '/ahmm/';

document.addEventListener('DOMContentLoaded', function () {
  // --- Accordion Reveal Helper ---
  function openAccordionsToReveal(element) {
    // Recursively open all hidden parent accordions containing this element
    let cur = element;
    while (cur) {
      if (
        cur.classList &&
        cur.classList.contains('accordion-content') &&
        cur.style.display === 'none'
      ) {
        cur.style.display = 'block';
        // Also activate the previous sibling heading
        let heading = cur.previousElementSibling;
        if (heading && /^H[2-4]$/.test(heading.tagName)) {
          heading.classList.add('active');
          cur.classList.add('active');
        }
      }
      cur = cur.parentElement;
    }
  }

  // --- Unified fragment loader for dropdowns and inject-links ---
  function loadFragment(fragmentFile, optionalHash) {
    const filePath = `${BASE_PATH}md-html_docs/${fragmentFile}`;
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('Fragment not found');
        return response.text();
      })
      .then(html => {
        document.getElementById('content').innerHTML = html;
        fixLocalImagePaths('#content');
        makeAccordion('#content');
        enableContentLinks(); // Enable link handling after fragment load

        // SCROLL TO ANCHOR IF HASH PRESENT
        const hash = optionalHash || window.location.hash;
        if (hash && hash.length > 1) {
          const target = document.getElementById(hash.replace(/^#/, ''));
          if (target) {
            openAccordionsToReveal(target);
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
      .catch(err => {
        document.getElementById('content').innerHTML =
          `<p style="color:red;">Error loading content: ${err.message}</p>`;
      });
  }

  // --- Converts all local image src values to be relative to BASE_PATH ---
  function fixLocalImagePaths(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      // Only change if src is present, not an absolute URL, not a URI
      if (
        src &&
        !/^(https?:)?\/\//i.test(src) &&
        !src.startsWith('') // Not a data: URI (shouldn't be blank)
      ) {
        img.src = BASE_PATH + src.replace(/^\/+/, '');
      }
    });
  }

  // --- Enable AJAX-style link handling and anchor jumps inside loaded content ---
  function enableContentLinks() {
    const content = document.getElementById('content');
    if (!content) return;

    content.onclick = null;

    content.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link || !content.contains(link)) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Handle in-page anchor link
      if (href.startsWith('#')) {
        const id = href.slice(1);
        const anchor = document.getElementById(id);
        if (anchor) {
          openAccordionsToReveal(anchor);
          window.location.hash = href;
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
          e.preventDefault();
        }
        return;
      }

      // Ignore external links
      if (href.startsWith('http')) return;

      // AJAX-style fragment loading for internal links
      e.preventDefault();

      // Allow hash in URLs in the href, e.g. MyFragment.html#anchor
      const split = href.split('#');
      const fragmentFile = split[0].replace(/^\//, '');
      const hash = split.length > 1 ? '#' + split[1] : '';

      // If URL includes #hash, after loading scroll to it
      loadFragment(fragmentFile, hash);
    });
  }

  // --- Dropdowns with class .md-select ---
  document.querySelectorAll('.md-select').forEach(select => {
    select.addEventListener('change', function () {
      if (this.value) {
        loadFragment(this.value);
        // Reset other dropdowns
        document.querySelectorAll('.md-select').forEach(other => {
          if (other !== this) other.selectedIndex = 0;
        });
      }
    });
  });

  // --- Inject-link fragment loading ---
  document.querySelectorAll('.inject-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const fragmentFile = link.getAttribute('data-fragment');
      if (fragmentFile) loadFragment(fragmentFile);
    });
  });

  // --- Load a default fragment on page load (optional) ---
  // Uncomment and set your preferred default fragment:
  // loadFragment('Impressionism.html');

  // --- Accordion Initialisation (for static content) ---
  if (document.getElementById('content').innerHTML.trim()) {
    makeAccordion('#content');
    enableContentLinks();
    fixLocalImagePaths('#content');
  }
});

// --- Accordion Functionality ---
function makeAccordion(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const headingTags = ['H2', 'H3', 'H4'];

  // Remove previous accordion .accordion-content and .active classes
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
    heading.addEventListener('click', function (e) {
      e.stopPropagation();
      heading.classList.toggle('active');
      contentWrapper.classList.toggle('active');
      contentWrapper.style.display =
        contentWrapper.style.display === 'none' ? 'block' : 'none';
    });
  });
}
