function Graph() {
  let me = this;
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
      points[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("speed"));
      points2[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("smellDiameter"));
      points3[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("sightDiameter"));
      points4[i] = new GPoint(rowArray[i].getNum("birthFrame"), rowArray[i].getNum("diameter"));


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
    plot2.setPoints(points2);

    plot.getXAxis().setAxisLabelText("Birth Frame");
    plot.getYAxis().setAxisLabelText("Speed");
    plot.setTitleText("Speed over time");

    plot2.getRightAxis().setAxisLabelText("Diameter Measures")
    plot2.getRightAxis().setDrawTickLabels(true);
    plot2.addLayer("Sight Diameter", points3);
    plot2.addLayer("Diameter", points4);

    plot2.getMainLayer().setPointColor(color(0, 150, 0));
    plot2.getLayer("Sight Diameter").setPointColor(color(200, 100, 200));
    plot2.getLayer("Diameter").setPointColor(color(0, 100, 200));

    fill(0, 150, 0);
    text("Smell Diameter", 100,40);
    fill(200, 100, 200);
    text("Sight Diameter", 200, 40);
    fill(0, 100, 200);
    text("Diameter", 300, 40);
    fill(255, 0, 0);
    text("Speed", 400, 40);



    // Draw it!  
    plot.beginDraw();
    plot.drawBox();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawTitle();
    plot.drawGridLines(GPlot.VERTICAL);
    //plot.drawFilledContours(GPlot.HORIZONTAL, 0);
    plot.drawPoints();


    //plot.drawLines();
    plot.endDraw();
    plot2.beginDraw();
    plot2.drawRightAxis();
    plot2.getMainLayer().drawPoints();
    plot2.getLayer("Sight Diameter").drawPoints();
    plot2.getLayer("Diameter").drawPoints();
    plot2.endDraw();

    fill(0, 0, 0);
    rect(100, 10, 60, 20);
    fill(240, 240, 240);
    text("RESUME", 120, 15);

    fill(0, 0, 60);
    rect(200, 10, 60, 20);
    fill(240, 240, 240);
    text("EXPORT", 220, 15);

    //noLoop();
  };
  this.draw = function () {
    let touchButton = collidePointRect(mouseX, mouseY, 100, 10, 60, 20);
    let touchExport = collidePointRect(mouseX, mouseY, 200, 10, 60, 20);

    if (mouseIsPressed) {
      if (touchButton) {
        me.sceneManager.showScene(Sim);
      } else if (touchExport) {
        alert("Saving data as csv files. If not saving, allow downloads from this site.")
        save(this.globalsTable, 'globalsTable.csv');
        save(this.bugTable, 'bugTable.csv');
      }
    }


  }


}