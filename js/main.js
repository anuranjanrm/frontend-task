/* PACELINE — site interactivity */
(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Product filter pills */
  var pills = document.querySelectorAll('.pill');
  var products = document.querySelectorAll('#productGrid .product');
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('is-active'); });
      pill.classList.add('is-active');
      var f = pill.getAttribute('data-filter');
      products.forEach(function (card) {
        var tags = card.getAttribute('data-tags') || '';
        var show = f === 'all' || tags.split(' ').indexOf(f) !== -1;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* Wishlist hearts */
  document.querySelectorAll('.wishlist').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var liked = btn.classList.toggle('is-liked');
      btn.textContent = liked ? '♥' : '♡';
      btn.setAttribute('aria-label', liked ? 'Remove from wishlist' : 'Add to wishlist');
    });
  });

  /* Bag counter */
  var bagCount = document.getElementById('bagCount');
  var count = 0;
  document.querySelectorAll('.add-bag').forEach(function (btn) {
    btn.addEventListener('click', function () {
      count += 1;
      if (bagCount) bagCount.textContent = String(count);
      btn.textContent = 'Added ✓';
      setTimeout(function () { btn.textContent = 'Add to bag'; }, 1600);
    });
  });

  /* Newsletter form */
  document.querySelectorAll('#newsletterForm').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input || !input.value || input.validity.typeMismatch) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      form.innerHTML = '<p style="color:#d9f651;font-weight:700;">Welcome to the club — check your inbox for 10% off.</p>';
    });
  });
})();
