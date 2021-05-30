const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    console.log('t');
  }
}
const courseCreator = (function () {
  const map = $('#map');

  const nodes = course.nodes.slice();

  /*function toNodeList(nodes) {
    let nextNodes = nodes.reduce((next, node) => next.concat(node.next), []);
    if (nextNodes.length) {
      nextNodes = toNodeList(nextNodes);
    }

    return nodes.concat(nextNodes);
  }*/

  function createNode(x, y, article) {
    const node = { x, y, article, next: [] };
    nodes.push(node);

    return node;
  }

  function createHTMLNode(node, key) {
    const htmlNode = $(`<div class='node' value='${key}' style='left:${node.x}px; top:${node.y}px;'>${node.article.title}</div>`);

    htmlNode.mousedown(function (e) {
      e.stopPropagation();

      selectedNodes.push(htmlNode);

      if (selectedNodes.length === 2) {
        // TODO: prevent duplicates
        getNodeFromHTML(selectedNodes[0]).next.push(getNodeFromHTML(selectedNodes[1]));
        selectedNodes.splice(0);

        renderCanvas();
      }
    });

    map.append(htmlNode);

    return htmlNode;
  }

  function createHTMLNodes(nodes) {
    nodes.forEach((node, key) => createHTMLNode(node, key));
  }
  function getNodeFromHTML(html) {
    return nodes.find((node, key) => {
      return key == html.attr('value');
    });
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

  // disable default pop-up on right click
  map.on('contextmenu', e => false);

  const articleSelect = $('#article');

  let x, y = 0;
  map.mousedown(e => {
    if (e.button === 2) {
      x = e.pageX - e.currentTarget.offsetLeft;
      y = e.pageY - e.currentTarget.offsetTop;

      // display article select menu and move it to the click position
      articleSelect.css('display', 'inline-block').css('left', x).css('top', y);
    }
  });

  const selectedNodes = [];

  articleSelect.change(e => {
    // article selected; hide article select menu and create node

    articleSelect.css('display', 'none');
    const option = e.target.options[e.target.selectedIndex];
    createHTMLNode(createNode(x, y, { _id: option.value, title: option.innerHTML }), nodes.length - 1);
  });

  $('#submit-button').click(e => {
    nodes.forEach(node => node.next = node.next.map(nextNode => nodes.indexOf(nextNode)));

    $.post(location.path,
      { ...course, articles: JSON.stringify(course.articles), nodes: JSON.stringify(nodes) },
      function (data, status) {
        console.log('Data:', data, 'Status:', status);
      });
  });
})();