(function(){
  function resolveUrl(path){
    try { return new URL(path, window.location.href).toString(); }
    catch(e){ return path; }
  }

  function loadIncludes(){
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    if (nodes.length === 0) {
      document.dispatchEvent(new Event('partialsLoaded'));
      return;
    }
    var tasks = nodes.map(function(node){
      var src = node.getAttribute('data-include');
      if (!src) return Promise.resolve();
      var url = resolveUrl(src);
      return fetch(url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(function(res){
          if (!res.ok) throw new Error('Failed to fetch '+url+' status='+res.status);
          return res.text();
        })
        .then(function(html){
          node.innerHTML = html;
          // execute inline scripts inside the included fragment
          var scripts = node.querySelectorAll('script');
          scripts.forEach(function(old){
            var s = document.createElement('script');
            Array.prototype.slice.call(old.attributes).forEach(function(attr){ s.setAttribute(attr.name, attr.value); });
            if (old.textContent) s.textContent = old.textContent;
            old.parentNode.replaceChild(s, old);
          });
        })
        .catch(function(err){ try { console.error('[include]', err); } catch(e) {} });
    });
    Promise.all(tasks).then(function(){ document.dispatchEvent(new Event('partialsLoaded')); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();


