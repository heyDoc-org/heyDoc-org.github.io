/**
 * HeyDoc Navbar Controller
 * Handles mobile toggle menu and navigation state
 */
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking nav links or action button
    const navLinks = mainNav.querySelectorAll('.nav-link, .btn-navbar-demo');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link detection based on current URL
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const pageFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const navItems = document.querySelectorAll('.main-nav .nav-link');

  if (navItems.length > 0) {
    navItems.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      const cleanHref = href.replace(/^\.\//, '').replace(/\/$/, "");
      if (cleanHref === pageFile || ((pageFile === 'index.html' || pageFile === '') && (cleanHref === 'index.html' || cleanHref === ''))) {
        navItems.forEach(item => {
          item.classList.remove('active');
          item.removeAttribute('aria-current');
        });
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }
});
