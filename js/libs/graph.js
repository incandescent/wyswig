//     graph.js 0.1
//     (c) 2011 Michal Kuklis, Incandescent Software Inc.
//     Directed Graph

// graph constructor
function Graph() {
  // vertices list
  this.vertices = [];
  // adjancency matrix
  this.adjMatrix = [];
  // size of vertices list
  this.verSize = 0;
}

Graph.prototype = {
  //restore constructor
  constructor: Graph,

  // adds and returns new vertex
  addVertex: function(data) {
    // object which represents vertex
    var vertex = {
      data: data,
      index: this.verSize,
      visited: false
    }
    this.vertices.push(vertex);
    this.verSize++;
    return vertex;
  },

  // adds edge between vertices
  addEdge: function(from, to, weight) {
    this.adjMatrix[from] = this.adjMatrix[from] || [];
    if (typeof weight != "undefined") {
      this.adjMatrix[from][to] = weight;
    }
    else {
      this.adjMatrix[from][to] = 1;
    }
  },

  // finds and returns vertex based on the given data
  // comparator can be used to override default compare implementation
  findVertex: function(data, comparator) {
    for (var i = 0; i < this.verSize; i++) {
      if (comparator) {
        var vertex = comparator(data, this.vertices[i]);
        if (vertex != null) {
          return vertex;
        } 
      }
      else {
        if (this.vertices[i].data === data) {
          return this.vertices[i];
        }
      }
    }
    return null;
  },

  // searches for vertex for given data
  // returns vertex if found or adds and returns new one
  findOrAddVertex: function(data, comparator) {
    var vertex = this.findVertex(data, comparator);
    if (vertex == null) {
      vertex = this.addVertex(data);
    }
    return vertex;
  },
  
  // iterates over connected vertices
  // callback can be used to access current from/to vertices 
  // and an edge between them
  each: function(callback) {
    for (var i = 0; i < this.verSize; i++) {
      for (var j = 0; j < this.verSize; j++) {
        if (typeof this.adjMatrix[i] != "undefined"
          && typeof this.adjMatrix[i][j] != "undefined") { 
          if (callback) {
            callback.call(this, this.vertices[i], this.vertices[j], this.adjMatrix[i][j]);
          }
        }
      }
    } 
  }
}
