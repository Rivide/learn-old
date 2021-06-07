const CourseUpdateUIController = (function() {
  return class extends CourseUIController {
    constructor(course, canvasID, containerID, articleSelectID, submitButtonID) {
      super(course.nodes.slice(), canvasID, containerID);

      this.nodes.forEach(node => {
        node.key = node._id;
        node.next.forEach(nextNode => nextNode.key = nextNode._id);
      });

      this.pendingNodeKey = 0;
      
      this.articleSelect = $(`#${articleSelectID}`)
      this.selectedNodes = [];

      this.container.on('contextmenu', e => false);

      let x, y = 0;
      this.container.mousedown(e => {
        if (e.button === 2) {
          x = e.pageX - e.currentTarget.offsetLeft;
          y = e.pageY - e.currentTarget.offsetTop;

          // display article select menu and move it to the click position
          this.articleSelect.css('display', 'inline-block').css('left', x).css('top', y);
        }
      });

      this.articleSelect.change(e => {
        // article selected; hide article select menu and create node

        this.articleSelect.css('display', 'none');
        
        const option = e.target.options[e.target.selectedIndex];
        
        const node = this.createNode(x, y, { _id: option.value, title: option.innerHTML }, this.getPendingNodeKey());
        this.nodes.push(node);

        this.appendHTMLNode(node);
      });

      $(`#${submitButtonID}`).click(e => {
        this.nodes.forEach(node => node.next = node.next.map(nextNode => nextNode.key));
        
        $.post(location.path,
          { ...course, articles: JSON.stringify(course.articles), nodes: JSON.stringify(this.nodes) },
          function (data, status) {
            console.log('Data:', data, 'Status:', status);
          });
      });
    }

    getPendingNodeKey() {
      return this.pendingNodeKey++;
    }

    appendHTMLNodes() {
      this.nodes.forEach(node => this.appendHTMLNode(node, node.key));
    }

    appendHTMLNode(node) {
      this.container.append(this.createHTMLNode(node));
    }

    createHTMLNode(node) {
      const htmlNode = $(`<div class='node' value='${node.key}' style='left:${node.x}px; top:${node.y}px;'>${node.article.title}</div>`);

      htmlNode.mousedown(e => {
        e.stopPropagation();

        this.selectedNodes.push(htmlNode);
        console.log(htmlNode.attr('value'));
        console.log(this.nodes);

        if (this.selectedNodes.length === 2) {
          // TODO: prevent duplicates
          this.getNodeFromHTML(this.selectedNodes[0]).next.push(this.getNodeFromHTML(this.selectedNodes[1]));
          this.selectedNodes.splice(0);

          this.renderCanvas();
        }
      });

      return htmlNode;
    }

    createNode(x, y, article, key) {
      return { x, y, article, next: [], key };
    }

    getNodeFromHTML(htmlNode) {
      return this.nodes.find(node => node.key == htmlNode.attr('value'));
    }
  }
})();

const courseUpdateUIController = new CourseUpdateUIController(course, 'canvas', 'map', 'article', 'submit-button');

courseUpdateUIController.appendHTMLNodes();
courseUpdateUIController.renderCanvas();