(function () {
  var track = document.getElementById('testiTrack');
  var slides = track.querySelectorAll('.testi-slide');
  var dotsEl = document.getElementById('testiDots');
  var total = slides.length;
  var current = 0;
  var autoTimer;


  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); resetAuto(); });
    dotsEl.appendChild(d);
  });

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsEl.querySelectorAll('.testi-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  document.getElementById('testiPrev').addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  document.getElementById('testiNext').addEventListener('click', function () { goTo(current + 1); resetAuto(); });

  function startAuto() { autoTimer = setInterval(function () { goTo(current + 1); }, 5000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  startAuto();


  var outer = document.querySelector('.testi-carousel-outer');
  outer.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
  outer.addEventListener('mouseleave', function () { startAuto(); });
})();