// Theme color persistence across pages
(function() {
  try {
    var savedColor = localStorage.getItem('activeColor');
    if (savedColor) {
      var links = document.querySelectorAll('.alternate-style');
      links.forEach(function(l){
        if (l.getAttribute('title') === savedColor) {
          l.removeAttribute('disabled');
          try { l.disabled = false; } catch(e) {}
        } else {
          l.setAttribute('disabled', 'true');
          try { l.disabled = true; } catch(e) {}
        }
      });
    }
  } catch (e) {}
})();

// Override setActiveStyle to also persist selection
window.setActiveStyle = function(color) {
  var links = document.querySelectorAll('.alternate-style');
  links.forEach(function(style) {
    if (color === style.getAttribute('title')) {
      style.removeAttribute('disabled');
      try { style.disabled = false; } catch(e) {}
    } else {
      style.setAttribute('disabled', 'true');
      try { style.disabled = true; } catch(e) {}
    }
  });
  try { localStorage.setItem('activeColor', color); } catch (e) {}
  try {
    var evt = new CustomEvent('themeColorChanged', { detail: { color: color } });
    document.dispatchEvent(evt);
  } catch (e) {
    // fallback
    document.dispatchEvent(new Event('themeColorChanged'));
  }
};

// Persist dark/light mode across pages
(function(){
  try {
    var savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'dark') {
      document.body.classList.add('dark');
    } else if (savedMode === 'light') {
      document.body.classList.remove('dark');
    }
  } catch (e) {}
})();

// Hook day-night toggle after partials load
function initThemeToggle(){
  var dayNight = document.querySelector('.day-night');
  if (!dayNight) return;
  var icon = dayNight.querySelector('i');
  icon.classList.remove('fa-sun','fa-moon');
  if (document.body.classList.contains('dark')) {
    icon.classList.add('fa-sun');
  } else {
    icon.classList.add('fa-moon');
  }
  dayNight.addEventListener('click', function(){
    var isDark = document.body.classList.toggle('dark');
    try { localStorage.setItem('themeMode', isDark ? 'dark' : 'light'); } catch (e) {}
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
  });
}

document.addEventListener('partialsLoaded', initThemeToggle);
document.addEventListener('DOMContentLoaded', initThemeToggle);


