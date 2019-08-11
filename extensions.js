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

GPoint.prototype.getParentId = function() {
	return this.parentId;
};

GPoint.prototype.getKillerId = function() {
	return this.killerId;
};

GPoint.prototype.set = function() {
	var x, y, label, parentId, killerId;

	if (arguments.length === 3) {
		x = arguments[0];
		y = arguments[1];
		label = arguments[2];
	} else if (arguments.length === 2 && arguments[0] instanceof p5.Vector) {
		x = arguments[0].x;
		y = arguments[0].y;
		label = arguments[1];
	} else if (arguments.length === 2) {
		x = arguments[0];
		y = arguments[1];
		label = "";
	} else if (arguments.length === 1 && arguments[0] instanceof GPoint) {
		x = arguments[0].getX();
		y = arguments[0].getY();
    label = arguments[0].getLabel();
    killerId = arguments[0].getKillerId();
    parentId = arguments[0].getParentId();
    
	} else if (arguments.length === 1 && arguments[0] instanceof p5.Vector) {
		x = arguments[0].x;
		y = arguments[0].y;
		label = "";
	} else {
		throw new Error("GPoint.set(): signature not supported");
	}

	this.x = x;
	this.y = y;
	this.label = label;
  this.valid = this.isValidNumber(this.x) && this.isValidNumber(this.y);
  this.killerId = killerId;
  this.parentId = parentId;
};


GLayer.prototype.drawParentLines = function () {
  strokeWeight(1);
  stroke(200, 200, 200);
  for (let i = 0; i < this.plotPoints.length; i++) {
    if (parseInt(this.points[i].parentId) != 0) {
      if (parseInt(this.points[i].parentId) != NaN && parseInt(this.points[i].parentId) >= 0) {
        line(this.plotPoints[i].x, this.plotPoints[i].y, this.plotPoints[parseInt(this.points[i].parentId) - 1].x, this.plotPoints[parseInt(this.points[i].parentId) - 1].y);
        if (this.plotPoints[i].x == this.plotPoints[parseInt(this.points[i].parentId) - 1].x)
          console.log("major problem");
      }
    }
  }
}

GLayer.prototype.drawKillerLines = function () {
  strokeWeight(1);
  stroke(220, 100, 100, 150);
  for (let i = 0; i < this.plotPoints.length; i++) {
    if (parseInt(this.points[i].killerId) != -1) {
      if (parseInt(this.points[i].killerId) != NaN && parseInt(this.points[i].killerId) >= 0) {
        line(this.plotPoints[i].x, this.plotPoints[i].y, this.plotPoints[parseInt(this.points[i].killerId) - 1].x, this.plotPoints[parseInt(this.points[i].killerId) - 1].y);
        noFill();
        ellipse(this.plotPoints[i].x, this.plotPoints[i].y,30,30);
        if (this.plotPoints[i].x == this.plotPoints[parseInt(this.points[i].killerId) - 1].x)
          console.log("major problem");
      }
    }
  }
}