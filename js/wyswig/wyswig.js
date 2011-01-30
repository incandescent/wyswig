(function(){

  // WysWig namespace
  var WysWig;
  if (typeof exports !== 'undefined') {
    WysWig = exports;
  } else {
    WysWig = this.WysWig = {};
  }

  // options
  WysWig.options = {};

  var graphView = null;
  
  // init
  WysWig.init = function(options) {
    // extends options
    _.extend(WysWig.options, options);
    graphView = new RoutesView();
    return this;
  }

  // TODO move this to init
  WysWig.renderGraph = function(xml) {
    var parser = new RoutePathsParser(xml),
    graph = parser.buildGraph();
    graphView.render(graph);
  }

  // parser constructor
  // parses given xml/json and builds tree structure
  function RoutePathsParser(xml) {
    try {
      this.docTypeJson = $.xml2json(xml);
      this.routePaths = this.docTypeJson.documentType.routePaths.routePath;
    }
    catch(e) {
      console.log('xml is not valid');
      console.log(e);
    }
  }

  RoutePathsParser.prototype = {
    // restore constructor
    constructor: RoutePathsParser,
    // builds tree structure based on document nodes
    buildGraph: function() {
      return this._buildGraph(this.routePaths, new Graph(), 0);
    },
   
    _buildGraph: function(path, graph, weight, fromVertex) {
      for (var element in path) {
        switch (element) {
          case "start":
            fromVertex = this._addVertices(graph, path[element], weight);
            weight += 1;
            break;
          case "split":
            var to = graph.findOrAddVertex(path[element].name);
            this._buildGraph(path[element], graph, weight + 1, to);
            break;
          case "branch":
            // process branches
            var branches = path[element];
            if (_.isArray(branches)) {
              for (var i = 0, l = branches.length; i < l; i++) {
                var to = graph.findOrAddVertex(branches[i].name);
                graph.addEdge(fromVertex.index, to.index, weight);
                this._buildGraph(branches[i], graph, weight + 1, to);
              }
            }
            break;
          case "requests":
            // process requests
            var requests = path[element];
            
            if (_.isArray(requests)) {
              for (var i = 0, l = requests.length; i < l; i++) {
                // first element doesn't contain nextNode attribute 
                // so couple parent vertex with the current vertex
                if (i == 0) {
                  var to = graph.findOrAddVertex(requests[i].name);
                  graph.addEdge(fromVertex.index, to.index, weight);
                }
                weight += 1;
                this._addVertices(graph, requests[i], weight);
              }
            }
            else {
              var to = graph.findOrAddVertex(requests.name);
              graph.addEdge(fromVertex.index, to.index, weight);
              this._addVertices(graph, requests, weight);
            }
            break;
        }
      }
      return graph;
    },

    // convenient helper which couples 2 vertices together
    // used when name and nextNode attributes are  present on the element
    // returns 'from' vertex
    _addVertices: function(graph, node, weight) {
      var from = graph.findOrAddVertex(node.name);
      if (node.nextNode) {
        var to = graph.addVertex(node.nextNode);
        graph.addEdge(from.index, to.index, weight);
      }
      return from;
    }
  }
})(this);
