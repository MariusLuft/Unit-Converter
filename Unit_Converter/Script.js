//arrays for calculation
var physics = new Array();
var unit = new Array();
var factor = new Array();

physics[0] = "Flaeche"
unit[0] = new Array("Quadratmeter", "Quadratkilometer", "Hektar","Quadratdezimeter", "Quadratzentimeter");
factor[0] = new Array(1, 1E6, 1E4, 0.01, 0.0001);

physics[1] = "Energie"
unit[1] = new Array("Joule", "Kilojoule", "Kalorie","Kilokalorie", "Kilowattstunde");
factor[1] = new Array(1, 1000, 4.1868, 4.1868E3, 36E4);

physics[2] = "Zeit"
unit[2] = new Array("Sekunden", "Minuten", "Stunden","Tage", "Jahre");
factor[2] = new Array(1, 60, 3600, 8.640E4, 31536E3);

physics[3] = "Geschwindigkeit"
unit[3] = new Array("Meter/Sekunde", "Kilometer/Stunde", "Meilen/Stunde","Kilometer/Sekunde", "Lichtgeschwindigkeit");
factor[3] = new Array(1, .2777778, .44707, 3600, 299792458);

//update the unit selects
function updateMenu (select, unitSelect) {
    var i = select.selectedIndex;
    document.getElementById('zahleingabe').value = "Zahl eingeben";
    document.getElementById('ergebnis').value = "Ergebnis";
    updateSelect(unitSelect, unit[i]);
}

function updateSelect(unitMenu, Array) {
    var i;
    unitMenu.options.length = Array.length;
    for (i = 0; i < Array.length; i++) {
        unitMenu.options[i].text = Array[i];
    }
  }

//calculate the result
function calc (select1, select2, input, output, prop) {
    
    if (input.value != 0) {
        
        var property = prop.selectedIndex;
        var source = select1.selectedIndex;
        var dest = select2.selectedIndex;
        var sourceFacor = factor[property][source];
        var destFactor = factor[property][dest];
        var result = input.value;

        result *= sourceFacor; //convert to base unit
        result /= destFactor;  //convert to target unit

        output.value = result; //update result
    }
}


let newWorker;
//shows the upadate box
function showUpdateBar() {
  let update1 = document.getElementById('update1');
  update1.className = 'show';
}

//actionlistener for update button
window.onload = function ()  {
  let refreshbutton = document.getElementById('reload');
  refreshbutton.addEventListener('click', function(){
    newWorker.postMessage({ action: 'skipWaiting' });
  });
}

//register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      // check if new version was installed properly
      newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        // Has network.state changed?
        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // new update available
                 showUpdateBar();
            }
            // No update available
            break;
        }
      });
    });
  });

  //reloads window
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}


