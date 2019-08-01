
function boolFromProb(p){
    if (random(0,1) <= p)
      return true;
    else
      return false;
  }
  

function compareNumbers(a, b) {
    return a.distance - b.distance;
  }

  
function addBugToTable(bug,mutated, scene){
    let newRow;
    if (!mutated)
      newRow = scene.bugTable.addRow();
    else
      newRow = scene.bugTable.getRow(bug.id-1);
    newRow.setNum('id',bug.id);
    newRow.setNum('sightDiameter',bug.SightDiameter);
    newRow.setNum('smellDiameter',bug.SmellDiameter);
    newRow.setNum('maxAngleChange',bug.maxAngleChange);
    newRow.setNum('diameter',bug.diameter);
    newRow.setNum('speed',bug.speed);
    newRow.setNum('giveFoodToKidOnBirthProb',bug.giveFoodToKidOnBirthProb);
    newRow.setNum('mutationFactor',bug.mutationFactor);
    newRow.setNum('parentId',bug.parentId);
    newRow.setNum('birthFrame',scene.frameCount);
    newRow.setString('deathFrame','living');
    newRow.setNum('foodEaten', bug.foodParticlesEaten);
    newRow.setNum('childrenCount',bug.childrenCount);
  }

