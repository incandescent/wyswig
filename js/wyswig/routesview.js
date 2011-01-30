// renders routes based on graph model 
var RoutesView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, "render", "createRows", "createVertex");
    
    // TODO move to jsPlumb helper and pass as a parameter
    jsPlumb.Defaults.Connector = new jsPlumb.Connectors.Bezier(50);
		jsPlumb.Defaults.DragOptions = { cursor: 'pointer', zIndex:2000 };
		jsPlumb.Defaults.PaintStyle = { strokeStyle:'gray', lineWidth:2 };
		jsPlumb.Defaults.EndpointStyle = { radius:9, fillStyle:'gray' };
		jsPlumb.Defaults.Anchors =  [ "BottomCenter", "TopCenter" ];
    this.el = $('#graph');
  },

  // renders view
  render: function(model) {
    var self = this;
    this.el.html('');
    jsPlumb.reset();
    model.each(function(fromVertex, toVertex, edgeWeight) {
      if (self.renderVertex(fromVertex, edgeWeight)) {
        self.renderVertex(toVertex, edgeWeight + 1);
      }
      else {
        self.renderVertex(toVertex, edgeWeight);
      }
      jsPlumb.connect({source: 'vertex' + fromVertex.data, target: 'vertex' + toVertex.data, overlays: [self.makeOverlay()]});
    });
  },

  renderVertex: function(vertex, weight) {
    if ($('#vertex' + vertex.data).size() == 0) {   
      this.createRows(weight);
      var rowId = "row" + weight;
      var row = $('#' + rowId);     
      var from = $('<div class="vertex" id="vertex' + vertex.data + '">' + vertex.data + '</div>');
      var width = parseInt(row.append(from).css('width').replace('px', ''));
      row.append(from).css({width: (width + 140) + 'px'});
      return true;
    }
    return false;
  },

  createRows: function(index) {
    for (var i = 0; i <= index; i++) {
      var rowId = "row" + i;
      if ($('#' +  rowId).size() == 0) {
        $('<div id="' + rowId + '" class="row"></div>').appendTo($('#graph'));
      }
    }
  },

  makeOverlay: function() { 
    return new jsPlumb.Overlays.Arrow({foldback: 0.7, fillStyle: 'gray', location: 0.5, width: 14}); 
  }
});
