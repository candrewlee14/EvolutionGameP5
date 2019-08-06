function DefaultGraph() {
  let me = this;
  let resumeButton;
  let exportButton;
  let checkBoxArray = new Array();
  let customGraphButton;

  let checkBoxTest;
  let checkBoxTest2;
  let checkBoxTest3;
  let checkBoxTest4;
  let checkBoxTest5;
  let checkBoxTest6;

  this.graphSpeed = true;
  this.graphSmell = true;
  this.graphSight = true;
  this.graphDiameter = true;
  this.drawParentLines = true;

  this.setup = function () {
    
    checkBoxArray = new Array();

    checkBoxTest = new Checkbox("Smell Diameter", 100, 70, 10, me.graphSmell);
    checkBoxTest.textColor = color(0, 150, 0);
    checkBoxTest.clickFunction = () => {
      me.graphSmell = checkBoxTest.bool;
      me.enter();
    };
    checkBoxTest.checkedColor = color(0, 150, 0);
    checkBoxArray.push(checkBoxTest);

    checkBoxTest2 = new Checkbox("Sight Diameter", 200, 70, 10, me.graphSight);
    checkBoxTest2.textColor = color(200, 100, 200);
    checkBoxTest2.clickFunction = () => {
      me.graphSight = checkBoxTest2.bool;
      me.enter();
    };
    checkBoxTest2.checkedColor = color(200, 100, 200);
    checkBoxArray.push(checkBoxTest2);

    checkBoxTest3 = new Checkbox("Diameter", 300, 70, 10, me.graphDiameter);
    checkBoxTest3.textColor = color(0, 100, 200);
    checkBoxTest3.clickFunction = () => {
      me.graphDiameter = checkBoxTest3.bool;
      me.enter();
    };
    checkBoxTest3.checkedColor = color(0, 100, 200);
    checkBoxArray.push(checkBoxTest3);

    checkBoxTest4 = new Checkbox("Diameter", 300, 70, 10, me.graphDiameter);
    checkBoxTest4.textColor = color(0, 100, 200);
    checkBoxTest4.clickFunction = () => {
      me.graphDiameter = checkBoxTest4.bool;
      me.enter();
    };
    checkBoxTest4.checkedColor = color(0, 100, 200);
    checkBoxArray.push(checkBoxTest4);

    checkBoxTest5 = new Checkbox("Speed", 400, 70, 10, me.graphSpeed);
    checkBoxTest5.textColor = color(255, 0, 0);
    checkBoxTest5.clickFunction = () => {
      me.graphSpeed = checkBoxTest5.bool;
      me.enter();
    };
    checkBoxTest5.checkedColor = color(255, 0, 0);
    checkBoxArray.push(checkBoxTest5);

    checkBoxTest6 = new Checkbox("Parent Lines", 500, 70, 10, me.drawParentLines);
    checkBoxTest6.textColor = color(150, 150, 150);
    checkBoxTest6.clickFunction = () => {
      me.drawParentLines = checkBoxTest6.bool;
      me.enter();
    };
    checkBoxTest6.checkedColor = color(150, 150, 150);
    checkBoxArray.push(checkBoxTest6);

  }

  this.enter = function () {
    background(100, 100, 100);
    // Create the canvas
    // Prepare the points for the plot
    let oAnim1 = this.sceneManager.findScene(Sim);
    let bugCSV = oAnim1.oScene.bugTable;

    var points = [];
    var points2 = [];
    var points3 = [];
    var points4 = [];

    var rowArray = bugCSV.getRows();
    for (var i = 0; i < rowArray.length; i++) {
      //label is their parent
      points[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("speed"), rowArray[i].getNum("parentId"));
      points2[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("smellDiameter"), rowArray[i].getNum("parentId"));
      points3[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("sightDiameter"), rowArray[i].getNum("parentId"));
      points4[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("diameter"), rowArray[i].getNum("parentId"));


    }

    // Create a new plot and set its position on the screen
    var plot = new GPlot(me.sceneManager.p);
    plot.setPos(25, 25);
    plot.setDim(simWidth / 1.1 - 50, simHeight / 1.1 - 50);
    plot.setPointColor(color(255, 0, 0));

    var plot2 = new GPlot(me.sceneManager.p);
    plot2.setPos(plot.getPos());
    plot2.setDim(plot.getDim());
    // Set the plot title and the axis labels
    plot.setPoints(points);


    plot.getXAxis().setAxisLabelText("Birth Frame");
    plot.getYAxis().setAxisLabelText("Speed (pixels per frame)");
    plot.setTitleText("Speed over time");

    plot2.getRightAxis().setAxisLabelText("Diameter Measures (pixels)")
    plot2.getRightAxis().setDrawTickLabels(true);

    plot2.setPoints(points2);
    plot2.addLayer("Sight Diameter", points3);
    plot2.addLayer("Diameter", points4);

    plot2.getMainLayer().setPointColor(color(0, 150, 0));
    plot2.getLayer("Sight Diameter").setPointColor(color(200, 100, 200));
    plot2.getLayer("Diameter").setPointColor(color(0, 100, 200));





    // Draw it!  
    plot.beginDraw();
    plot.drawBox();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawTitle();
    plot.drawGridLines(GPlot.VERTICAL);
    if (this.graphSpeed) {


      //plot.drawFilledContours(GPlot.HORIZONTAL, 0);
      if (this.drawParentLines)
        plot.getMainLayer().drawParentLines();
      plot.drawPoints();
    }
    plot.endDraw();

    //plot.drawLines();

    plot2.beginDraw();
    plot2.drawRightAxis();



    if (this.graphSmell) {
      if (this.drawParentLines)
        plot2.getMainLayer().drawParentLines();
      plot2.getMainLayer().drawPoints();
    }
    if (this.graphSight) {
      if (this.drawParentLines)
        plot2.getLayer("Sight Diameter").drawParentLines();
      plot2.getLayer("Sight Diameter").drawPoints();
    }
    if (this.graphDiameter) {
      if (this.drawParentLines)
        plot2.getLayer("Diameter").drawParentLines();
      plot2.getLayer("Diameter").drawPoints();
    }

    plot2.endDraw();

    for (let i = 0; i < checkBoxArray.length; i++) {
      checkBoxArray[i].display();
    }


    resumeButton = new Button("RESUME", 100, 10, 80, 20, color(0, 0, 0), color(40, 40, 40), color(240, 240, 240), () => me.sceneManager.showScene(Sim));
    customGraphButton = new Button("GRAPH CUSTOM", 300, 10, 100, 20, color(60, 0, 0), color(100, 20, 20), color(240, 240, 240), () => me.sceneManager.showScene(CustomGraphSetupX));
    exportButton = new Button("EXPORT", 200, 10, 80, 20, color(0, 0, 60), color(20, 20, 100), color(240, 240, 240), () => {
      alert("Saving data as csv files. If not saving, allow downloads from this site.");
      save(this.globalsTable, 'globalsTable.csv');
      save(this.bugTable, 'bugTable.csv');
    });
    //noLoop();
  };
  this.draw = function () {
    resumeButton.handleAndDraw();
    exportButton.handleAndDraw();
    customGraphButton.handleAndDraw();
    for (let i = 0; i < checkBoxArray.length; i++) {
      checkBoxArray[i].handle();
    }

  }


}