function makeAccordion(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const headingTags = ['H2', 'H3', 'H4'];

  function getLevel(tagName) {
    return parseInt(tagName.replace('H', ''), 10);
  }

  // Remove any previous accordion-content divs (if reloading)
  container.querySelectorAll('.accordion-content').forEach(el => el.remove());
  container.querySelectorAll('.active').forEach(el => el.classList.remove('active'));

  const allHeadings = Array.from(container.querySelectorAll(headingTags.join(',')));

  allHeadings.forEach((heading, idx) => {
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
    heading.after(contentWrapper);

    // Make heading clickable
    heading.addEventListener('click', function (e) {
      e.stopPropagation();
      heading.classList.toggle('active');
      contentWrapper.classList.toggle('active');
    });
  });
}
