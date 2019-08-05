function boolFromProb(p) {
  if (random(0, 1) <= p)
    return true;
  else
    return false;
}


function compareNumbers(a, b) {
  return a.distance - b.distance;
}


function addBugToTable(bug, mutated, scene) {
  let newRow;
  if (!mutated)
    newRow = scene.bugTable.addRow();
  else
    newRow = scene.bugTable.getRow(bug.id - 1);
  newRow.setNum('id', bug.id);
  newRow.setNum('sightDiameter', bug.SightDiameter);
  newRow.setNum('smellDiameter', bug.SmellDiameter);
  newRow.setNum('maxAngleChange', bug.maxAngleChange);
  newRow.setNum('diameter', bug.diameter);
  newRow.setNum('speed', bug.speed);
  newRow.setNum('giveFoodToKidOnBirthProb', bug.giveFoodToKidOnBirthProb);
  newRow.setNum('mutationFactor', bug.mutationFactor);
  newRow.setNum('parentId', bug.parentId);
  newRow.setNum('birthFrame', bug.birthFrame);
  newRow.setNum('deathFrame', scene.frameCount);
  newRow.setString('deathFrame', 'living');
  newRow.setNum('foodEaten', bug.foodParticlesEaten);
  newRow.setNum('childrenCount', bug.childrenCount);
  if (bug.id == bug.parentId)
    console.log("problem");
}

GLayer.prototype.drawParentLines = function(){
  strokeWeight(1);
  stroke(200,200,200);
  for (let i = 0; i < this.plotPoints.length; i++){
    if (parseInt(this.points[i].label) != 0){
      line(this.plotPoints[i].x, this.plotPoints[i].y, this.plotPoints[parseInt(this.points[i].label)-1].x, this.plotPoints[parseInt(this.points[i].label)-1].y);
      if (this.plotPoints[i].x == this.plotPoints[parseInt(this.points[i].label)-1].x)
        console.log("major problem");
    }
  }
}