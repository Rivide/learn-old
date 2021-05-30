const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    console.log('t');
  }
}
const courseCreator = (function () {
  const map = $('#map');

  const nodes = course.nodes.slice();
  
  function createHTMLNode(node, key) {
    const htmlNode = $(`<a href='${node.article.url}'><div class='node' value='${key}' style='left:${node.x}px; top:${node.y}px;'>${node.article.title}</div></a>`);

    map.append(htmlNode);

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

  createHTMLNodes(nodes);
  renderCanvas();
})();