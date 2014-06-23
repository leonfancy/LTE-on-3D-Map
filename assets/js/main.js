// the Google Earth handler
var ge;

// users' information
var ues = [];

/*
 * timer and a counter
 * - timer: used to setInterval and clearInterval
 * - timecounter: used to count the simulation time
 */
var timer;
var timecounter = 1;

// Total similation time (seconds)
var totalTime = 0;

google.load("earth", "1", {"other_params":"sensor=false"});

function init() {
  google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
  ge = instance;
  ge.getWindow().setVisibility(true);
  ge.getNavigationControl().setVisibility(ge.VISIBILITY_HIDE);

  // get data of users and base stations 
  $.getJSON("_getdata.ajax.php",function (data) {
    // start simulation 
    simulation(data);
  });

  ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS_LOW_RESOLUTION, true);
  ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
  ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
  ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);

  // Move the camera.
  var la = ge.createLookAt('');
  la.set(50.0021 , 80.0012, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, -8.541, 66.213, 20000);
  ge.getView().setAbstractView(la);

}

function failureCB(errorCode) {
}

// simulate the users and base stations
function simulation( data ) {
  // the number of users 
  var un = data.users.length;

  /* 
   * assume the time interval of latitute data array  
   * is 1 second, thus the total simulation time is the
   * length of this array.
   *
   * *FIXME*: The totalTime should be considered more 
   *          carefully. Its should be adopt to different 
   *          time interval.
   */
  totalTime = data.users[0].lat.length;

  for(var i=0; i<un; i++) {
    ues[i] = {};
    ues[i].data = data.users[i];
    ues[i].placemark = ge.createPlacemark('');
    var point = ge.createPoint('');
    point.setLatitude(parseFloat(ues[i].data.lat[0]));
    point.setLongitude(parseFloat(ues[i].data.long[0]));
    ues[i].placemark.setGeometry(point);
    //google.earth.addEventListener(ues[i].placemark, 'click', doSomething);
    ge.getFeatures().appendChild(ues[i].placemark);
  }

  // update the user's position every second
  timer = setInterval(updatePos, 1000);
}

// update the position of every user per second
function updatePos() {
  var un = ues.length;
  // if exceed the simulation total time, then exit
  if( timecounter >= totalTime ) {
    clearInterval(timer);
  }

  for(var i=0; i<un; i++) {
    var point = ues[i].placemark.getGeometry();
    point.setLatitude(parseFloat(ues[i].data.lat[timecounter]));
    point.setLongitude(parseFloat(ues[i].data.long[timecounter]));
  }
  timecounter++;
}

google.setOnLoadCallback(init);
