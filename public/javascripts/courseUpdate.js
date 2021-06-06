// const xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function () {
//   if (this.readyState == 4 && this.status == 200) {
//     console.log('t');
//   }
// }
// const courseCreator = (function () {
//   const map = $('#map');

//   const nodes = course.nodes.slice();

//   function createNode(x, y, article) {
//     const node = { x, y, article, next: [] };
//     nodes.push(node);

//     return node;
//   }

//   function createHTMLNode(node, key) {
//     const htmlNode = $(`<div class='node' value='${key}' style='left:${node.x}px; top:${node.y}px;'>${node.article.title}</div>`);

//     htmlNode.mousedown(function (e) {
//       e.stopPropagation();

//       selectedNodes.push(htmlNode);

//       if (selectedNodes.length === 2) {
//         // TODO: prevent duplicates
//         getNodeFromHTML(selectedNodes[0]).next.push(getNodeFromHTML(selectedNodes[1]));
//         selectedNodes.splice(0);

//         renderCanvas();
//       }
//     });

//     map.append(htmlNode);

//     return htmlNode;
//   }

//   function createHTMLNodes(nodes) {
//     nodes.forEach((node, key) => createHTMLNode(node, key));
//   }
//   function getNodeFromHTML(html) {
//     return nodes.find((node, key) => {
//       return key == html.attr('value');
//     });
//   }

//   const renderCanvas = (function () {
//     const canvas = document.getElementById('canvas');
//     canvas.width = canvas.clientWidth;
//     canvas.height = canvas.clientHeight;

//     const ctx = canvas.getContext('2d');

//     return function () {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       nodes.forEach(parent => parent.next.forEach(child => {
//         ctx.moveTo(parent.x, parent.y);
//         ctx.lineTo(child.x, child.y);
//         ctx.stroke();
//       }));
//     }
//   })();

//   createHTMLNodes(nodes);
//   renderCanvas();

//   // disable default pop-up on right click
//   map.on('contextmenu', e => false);

//   const articleSelect = $('#article');

//   let x, y = 0;
//   map.mousedown(e => {
//     if (e.button === 2) {
//       x = e.pageX - e.currentTarget.offsetLeft;
//       y = e.pageY - e.currentTarget.offsetTop;

//       // display article select menu and move it to the click position
//       articleSelect.css('display', 'inline-block').css('left', x).css('top', y);
//     }
//   });

//   const selectedNodes = [];

//   articleSelect.change(e => {
//     // article selected; hide article select menu and create node

//     articleSelect.css('display', 'none');
//     const option = e.target.options[e.target.selectedIndex];
//     createHTMLNode(createNode(x, y, { _id: option.value, title: option.innerHTML }), nodes.length - 1);
//   });

//   $('#submit-button').click(e => {
//     nodes.forEach(node => node.next = node.next.map(nextNode => nodes.indexOf(nextNode)));

//     $.post(location.path,
//       { ...course, articles: JSON.stringify(course.articles), nodes: JSON.stringify(nodes) },
//       function (data, status) {
//         console.log('Data:', data, 'Status:', status);
//       });
//   });
// })();
const CourseUpdateUIController = (function() {
  return class extends CourseUIController {
    constructor(course, canvasID, containerID, articleSelectID, submitButtonID) {
      super(course.nodes.slice(), canvasID, containerID);
      
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
        
        const node = CourseUpdateUIController.createNode(x, y, { _id: option.value, title: option.innerHTML });
        this.nodes.push(node);

        this.appendHTMLNode(node, this.nodes.length - 1);
      });

      $(`#${submitButtonID}`).click(e => {
        this.nodes.forEach(node => node.next = node.next.map(nextNode => this.nodes.indexOf(nextNode)));
        
        $.post(location.path,
          { ...course, articles: JSON.stringify(course.articles), nodes: JSON.stringify(this.nodes) },
          function (data, status) {
            console.log('Data:', data, 'Status:', status);
          });
      });
    }

    createHTMLNode(node, key) {
      const htmlNode = $(`<div class='node' value='${key}' style='left:${node.x}px; top:${node.y}px;'>${node.article.title}</div>`);

      htmlNode.mousedown(e => {
        e.stopPropagation();

        this.selectedNodes.push(htmlNode);

        if (this.selectedNodes.length === 2) {
          // TODO: prevent duplicates
          this.getNodeFromHTML(this.selectedNodes[0]).next.push(this.getNodeFromHTML(this.selectedNodes[1]));
          this.selectedNodes.splice(0);

          this.renderCanvas();
        }
      });

      return htmlNode;
    }

    static createNode(x, y, article) {
      return { x, y, article, next: [] };
    }

    getNodeFromHTML(htmlNode) {
      return this.nodes.find((node, key) => key == htmlNode.attr('value'));
    }
  }
})();

const courseUpdateUIController = new CourseUpdateUIController(course, 'canvas', 'map', 'article', 'submit-button');

courseUpdateUIController.appendHTMLNodes();
courseUpdateUIController.renderCanvas();