$(function(){
  /*
  var mainLayout = $('body').layout({
    triggerEventsOnLoad: true,
    resizeWhileDragging: false,
    resizeWithWindowDelay: 0,
    
    // pane defaults
    closable: false,
    resizable: true,
    slidable: false,
    spacing_open: 13,
    west__size: "55%"

  });
  */

  var wyswig = WysWig.init();
  var editor = CodeMirror.fromTextArea('code', {
    height: "100%",
    parserfile: "parsexml.js",
    stylesheet: "js/libs/CodeMirror/css/xmlcolors.css",
    path: "js/libs/CodeMirror/js/",
    continuousScanning: 500,
    lineNumbers: true,
    onChange: function() {
      editor.save();
      wyswig.renderGraph($('#code').val());
    }
  });
  wyswig.renderGraph($('#code').val());  
  
});
