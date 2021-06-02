const courseUIController = new CourseUIController(course.nodes, 'canvas', 'map');

courseUIController.createHTMLNodes();
courseUIController.renderCanvas()