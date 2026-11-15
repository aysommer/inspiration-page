(function () {
   var design = 'apple';
   try {
      if (localStorage.getItem('design') === 'google') design = 'google';
   } catch (e) {}
   var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   var root = document.documentElement;
   root.dataset.design = design;
   root.dataset.theme = design + '-' + (dark ? 'dark' : 'light');
})();
