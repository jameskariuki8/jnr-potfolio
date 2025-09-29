/* Initialize style switcher after DOM and partials are ready */
(function(){
  function init(){
    var styleSwitcherToggle = document.querySelector('.style-switcher-toggler');
    if (styleSwitcherToggle) {
      styleSwitcherToggle.addEventListener('click', function(){
        var panel = document.querySelector('.style-switcher');
        if (panel) panel.classList.toggle('open');
      });
    }

    window.addEventListener('scroll', function(){
      var panel = document.querySelector('.style-switcher');
      if (panel && panel.classList.contains('open')) panel.classList.remove('open');
    });

    // define setActiveStyle only if not already defined (avoid redeclare errors)
    if (typeof window.setActiveStyle !== 'function') {
      var alternateStyles = document.querySelectorAll('.alternate-style');
      window.setActiveStyle = function(color){
        alternateStyles.forEach(function(style){
          if (color === style.getAttribute('title')) {
            style.removeAttribute('disabled');
            try { style.disabled = false; } catch(e) {}
          } else {
            style.setAttribute('disabled', 'true');
            try { style.disabled = true; } catch(e) {}
          }
        });
      };
    }

    // day-night button is managed in common.js for persistence
  }

  document.addEventListener('partialsLoaded', init);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
