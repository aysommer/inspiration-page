(function () {
   var design = 'apple';
   try {
      var saved = localStorage.getItem('design');
      if (saved === 'google' || saved === 'microsoft') design = saved;
   } catch (e) {}
   var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   var root = document.documentElement;
   root.dataset.design = design;
   root.dataset.theme = design + '-' + (dark ? 'dark' : 'light');
})();
