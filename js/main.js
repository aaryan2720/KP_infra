(function () {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { observer.observe(el); });
})();

(function () {
  var links = document.querySelectorAll('.nav-link');
  var path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href === path) link.classList.add('active-link');
  });
})();

function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-count'), 10);
  var duration = 1600;
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + (el.getAttribute('data-suffix') || '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { obs.observe(c); });
})();

(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    var payload = {
      fname: (document.getElementById('fname') || {}).value || '',
      lname: (document.getElementById('lname') || {}).value || '',
      email: (document.getElementById('email') || {}).value || '',
      phone: (document.getElementById('phone') || {}).value || '',
      service: (document.getElementById('service') || {}).value || '',
      budget: (document.getElementById('budget') || {}).value || '',
      timeline: (document.getElementById('timeline') || {}).value || '',
      message: (document.getElementById('message') || {}).value || ''
    };

    try {
      var res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      var data = await res.json().catch(function () { return {}; });

      if (res.ok && data.success) {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#2E7D32';
        btn.style.borderColor = '#2E7D32';
        btn.style.color = '#fff';
        form.reset();
        setTimeout(function () {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3500);
      } else {
        throw new Error(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      btn.textContent = 'Failed to send — Please try again';
      btn.style.background = '#C62828';
      btn.style.borderColor = '#C62828';
      btn.style.color = '#fff';
      setTimeout(function () {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3500);
    }
  });

  const track = document.querySelector('.clients-track');
  if (track) {
    const clone = track.innerHTML;
    track.innerHTML += clone;
  }

})();

(function () {
  'use strict';

  var SKIP = new Set([
    'and','for','the','in','on','at','to','a','an','of',
    'but','or','nor','so','yet','with','by','from','into',
    'onto','upon','as','via','per','vs','vs.','etc','etc.'
  ]);

  function toTitleCase(str) {
    return str
      .split(/(\s+)/)
      .map(function (token, index) {
        var lower = token.toLowerCase();
        if (index === 0 || !SKIP.has(lower)) {
          return token.charAt(0).toUpperCase() + token.slice(1);
        }
        return lower;
      })
      .join('');
  }

  function processTextNodes(el) {
    var child = el.firstChild;
    while (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        var trimmed = child.nodeValue.trim();
        if (trimmed.length > 0) {
          child.nodeValue = child.nodeValue.replace(
            /\S+/g,
            function (word, offset) {
              var lower = word.toLowerCase();
              var isFirst = (child.nodeValue.slice(0, offset).trim() === '');
              if (isFirst || !SKIP.has(lower)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
              }
              return lower;
            }
          );
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        processTextNodes(child);
      }
      child = child.nextSibling;
    }
  }

  function run() {
    var targets = document.querySelectorAll('.tc-format');
    targets.forEach(function (el) {
      processTextNodes(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();

(function () {
  document.body.classList.add('bc-loading');
  var _start = Date.now();
  var _minMs = 1900;
  function _hide() {
    var loader = document.getElementById('bc-loader');
    if (!loader) return;
    var wait = Math.max(0, _minMs - (Date.now() - _start));
    setTimeout(function () {
      loader.classList.add('bc-loader--hidden');
      document.body.classList.remove('bc-loading');
      setTimeout(function () {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }, 700);
    }, wait);
  }
  if (document.readyState === 'complete') { _hide(); }
  else { window.addEventListener('load', _hide, { once: true }); }
})();

(function () {
  var btn = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 320) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ==========================================================================
   Brand Launch Pop-Up Controller
   ========================================================================== */
(function () {
  var modal = document.getElementById('brandLaunchModal');
  if (!modal) return;

  var closeBtn = modal.querySelector('.launch-close-btn');
  var backdrop = modal.querySelector('.launch-backdrop');
  var ctaBtn = modal.querySelector('#launchDiscoverBtn');

  function showModal() {
    setTimeout(function () {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }, 450);
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Show as soon as loader finishes or document is ready
  var loader = document.getElementById('bc-loader');
  if (loader) {
    var checkInterval = setInterval(function () {
      if (loader.classList.contains('bc-loader--hidden') || !document.body.contains(loader)) {
        clearInterval(checkInterval);
        showModal();
      }
    }, 100);
    // Fallback safety timeout
    setTimeout(function () {
      clearInterval(checkInterval);
      if (!modal.classList.contains('show')) showModal();
    }, 3000);
  } else {
    if (document.readyState === 'complete') {
      showModal();
    } else {
      window.addEventListener('load', showModal, { once: true });
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  if (ctaBtn) {
    ctaBtn.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
      var foundationTarget = document.getElementById('foundation');
      if (foundationTarget) {
        setTimeout(function () {
          foundationTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
      }
    });
  }
})();