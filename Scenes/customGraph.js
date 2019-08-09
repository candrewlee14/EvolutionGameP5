function CustomGraph() {
  let me = this;
  let resumeButton;
  this.enter = function () {
    background(100, 100, 100);
    // Create the canvas
    // Prepare the points for the plot
    let oAnimX = this.sceneManager.findScene(CustomGraphSetupX);
    let oAnimY = this.sceneManager.findScene(CustomGraphSetupY);
    let columnNameX = oAnimX.oScene.dataColumnChosen;
    let columnNameY = oAnimY.oScene.dataColumnChosen;

    let oAnimGraph = this.sceneManager.findScene(DefaultGraph);
    let startPauseFrame = oAnimGraph.oScene.startPauseFrame;

    let oAnim1 = this.sceneManager.findScene(Sim);
    let bugCSV = oAnim1.oScene.bugTable;

    var points = [];
    let livingCount = 0;
    var rowArray = bugCSV.getRows();
    for (var i = 0; i < rowArray.length; i++) {
      //label is their parent
      if (columnNameX == "deathFrame" || columnNameY == "deathFrame") {
        try {
          if (columnNameX == "lifespan") {
            try {
              points.push(new GPoint(rowArray[i].getNum("deathFrame") - rowArray[i].getNum("birthFrame"), rowArray[i].getNum(columnNameY), rowArray[i].getNum("parentId")));
            } catch (e) {
              console.log("ignored a living bug");
              console.log(e);
              livingCount++;
            }
          } else if (columnNameY == "lifespan") {
            try {
              points.push(new GPoint(rowArray[i].getNum(columnNameX), rowArray[i].getNum("deathFrame") - rowArray[i].getNum("birthFrame"), rowArray[i].getNum("parentId")));
            } catch (e) {
              console.log("ignored a living bug");
              console.log(e);
              livingCount++;
            }
          } else {
            points.push(new GPoint(rowArray[i].getNum(columnNameX), rowArray[i].getNum(columnNameY), rowArray[i].getNum("parentId")));
          }
        } catch (e) {
          console.log("ignored a living bug");
          console.log(e);
          livingCount++;
        }
      }
      else if (columnNameX == "lifespan") {
        try {
          points.push(new GPoint(rowArray[i].getNum("deathFrame") - rowArray[i].getNum("birthFrame"), rowArray[i].getNum(columnNameY), rowArray[i].getNum("parentId")));
        } catch (e) {
          console.log("ignored a living bug");
          console.log(e);
          livingCount++;
        }
      } else if (columnNameY == "lifespan") {
        try {
          points.push(new GPoint(rowArray[i].getNum(columnNameX), rowArray[i].getNum("deathFrame") - rowArray[i].getNum("birthFrame"), rowArray[i].getNum("parentId")));
        } catch (e) {
          console.log("ignored a living bug");
          console.log(e);
          livingCount++;
        }
      } else {
        points.push(new GPoint(rowArray[i].getNum(columnNameX), rowArray[i].getNum(columnNameY), rowArray[i].getNum("parentId")));
      }
    }
    

    // Create a new plot and set its position on the screen
    var plot = new GPlot(me.sceneManager.p);
    plot.setPos(25, 25);
    plot.setDim(simWidth / 1.1 - 50, simHeight / 1.1 - 50);
    plot.setPointColor(color(255, 0, 0));

    // Set the plot title and the axis labels
    plot.setPoints(points);



    plot.getXAxis().setAxisLabelText(columnNameX);
    plot.getYAxis().setAxisLabelText(columnNameY);
    plot.setTitleText(columnNameY + " over " + columnNameX);

    // Draw it!  
    plot.beginDraw();
    plot.drawBox();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawTitle();
    plot.drawGridLines(GPlot.VERTICAL);
    //plot.drawFilledContours(GPlot.HORIZONTAL, 0);
    plot.getMainLayer().drawParentLines();
    plot.drawPoints();

    plot.endDraw();

    textSize(10);
    if (livingCount > 0){
      fill(0,0,0);
      text(livingCount + " living ungraphed",200,80);
    }
    resumeButton = new Button("RESUME", 100, 10, 80, 20, color(0, 0, 0), color(20, 20, 20), color(240, 240, 240), () => {me.sceneManager.showScene(Sim); frameCount -= (frameCount - startPauseFrame)});
    //noLoop();
  };
  this.draw = function () {
    resumeButton.handleAndDraw();
  }


}