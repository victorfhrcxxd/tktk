// UTMify placeholder - corrigindo erro de XML
(function() {
  console.log('UTMify: Modo offline - tracking desabilitado');
  
  // Previne erros no código principal
  window.utmify = {
    track: function() {},
    page: function() {},
    identify: function() {}
  };
})();
