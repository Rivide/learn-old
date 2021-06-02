const CourseUIController = (function () {
  const map = $('#map');

  const nodes = course.nodes.slice();
  
  function createHTMLNode(node, key) {
    const htmlNode = $(`<a href='${node.article.url}'><div class='node' value='${key}' style='left:${node.x}px; top:${node.y}px;'>${node.article.title}</div></a>`);

    return htmlNode;
  }

  function createHTMLNodes(nodes) {
    nodes.forEach((node, key) => createHTMLNode(node, key));
  }

  const renderCanvas = (function () {
    const canvas = document.getElementById('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext('2d');

    return function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(parent => parent.next.forEach(child => {
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(child.x, child.y);
        ctx.stroke();
      }));
    }
  })();

  // return {
  //   canvas: null,
  //   nodes: null,
  //   createHTMLNodes: createHTMLNodes.bind(null, nodes),
  //   renderCanvas
  // }
  // return function(nodes, canvasTag, containerTag) {
  //   this.nodes = nodes;
  //   this.canvas = document.getElementById(canvasTag);
  //   this.ctx = canvas.getContext("2d");
  //   this.container = $(`#${containerTag}`);

  //   this.createHTMLNode = function() {

  //   }
  // }
  return class {
    constructor(nodes, canvasTag, containerTag) {
      this.nodes = nodes;
      this.canvas = document.getElementById(canvasTag);
      this.ctx = canvas.getContext("2d");
      this.container = $(`#${containerTag}`);
    }
    createHTMLNodes() {
      this.nodes.forEach((node, key) => this.container.append(createHTMLNode(node, key)));
    }
    renderCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.nodes.forEach(parent => parent.next.forEach(child => {
        this.ctx.moveTo(parent.x, parent.y);
        this.ctx.lineTo(child.x, child.y);
        this.ctx.stroke();
      }));
    }
  }
})();