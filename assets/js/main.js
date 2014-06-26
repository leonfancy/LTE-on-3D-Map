var path_prefix = window.location.href.replace('map.php','');
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

// current selected user ID
var curUserID = 0;

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
  var lookAt = ge.createLookAt('');
  lookAt.setLatitude(37.80769684195154);
  lookAt.setLongitude(-122.41233782046058);
  lookAt.setRange(200.0); //default is 0.0
  lookAt.setTilt(45.0);

  ge.getView().setAbstractView(lookAt);

}

function failureCB(errorCode) {
}

// simulate the users and base stations
function simulation( data ) {
  // the number of base stations
  var bn = data.stations.length; 

  for( var i=0; i<bn; i++) {
    var placemark = ge.createPlacemark("station-" + i.toString());
    placemark.setName("station " + i.toString());

    // Add a custom icon
    var icon = ge.createIcon('');
    icon.setHref(path_prefix + 'assets/images/station-yellow.png');
    var style = ge.createStyle(''); 
    style.getIconStyle().setIcon(icon); 
    style.getIconStyle().setScale(2.0);
    placemark.setStyleSelector(style); 
    
    var point = ge.createPoint('');
    point.setLatitude(parseFloat(data.stations[i].lat));
    point.setLongitude(parseFloat(data.stations[i].long));
    placemark.setGeometry(point);

    ge.getFeatures().appendChild(placemark);
  }

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
  $('#totaltime').html(totalTime);


  for(var i=0; i<un; i++) {
    ues[i] = {};
    ues[i].data = data.users[i];

    /*
     * Create placemark, set the placemark ID. 
     * ID is an string.
     * The ID is important, it must correspond to the 
     * user's ID.
     */
    ues[i].placemark = ge.createPlacemark(i.toString());
    ues[i].placemark.setName("user " + i.toString());

    // Add a custom icon
    var icon = ge.createIcon('');
    icon.setHref(path_prefix + 'assets/images/phone-red.png');
    var style = ge.createStyle(''); 
    style.getIconStyle().setIcon(icon); 
    ues[i].placemark.setStyleSelector(style); 

    var point = ge.createPoint('');
    point.setLatitude(parseFloat(ues[i].data.lat[0]));
    point.setLongitude(parseFloat(ues[i].data.long[0]));
    ues[i].placemark.setGeometry(point);
    
    google.earth.addEventListener( ues[i].placemark, 'click', userClickHandler );

    ge.getFeatures().appendChild(ues[i].placemark);
  }

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
    if( curUserID == i ) {
      $('#sinr').html(ues[i].data.sinr[timecounter]);
      $('#throughput').html(ues[i].data.throughput[timecounter]);
    }
  }
  $('#curtime').html(timecounter);
  timecounter++;
}

function userClickHandler(event) {
  var placemark = event.getTarget();
  var prevUserID = curUserID;
  curUserID = parseInt( placemark.getId() );
  $('#userid').html(curUserID);

  // change the user's icon when click it
  var icon = ge.createIcon('');
  var style = ge.createStyle(''); 
  icon.setHref(path_prefix + 'assets/images/phone-green.png');
  style.getIconStyle().setIcon(icon); 
  style.getIconStyle().setScale(1.5);
  ues[curUserID].placemark.setStyleSelector(style); 

  // change the previous selected user's icon to the default icon 
  if( curUserID != prevUserID ) {
    var icon = ge.createIcon('');
    var style = ge.createStyle(''); 
    icon.setHref(path_prefix + 'assets/images/phone-red.png');
    style.getIconStyle().setIcon(icon); 
    ues[prevUserID].placemark.setStyleSelector(style); 
  }
}

google.setOnLoadCallback(init);

$('#switcher').click(function() {
  var switcher = $('#switcher .glyphicon');
  if( switcher.hasClass('glyphicon-play') ) {
    // update the user's position every second
    timer = setInterval(updatePos, 1000);
    $('#switcher').html(
      '<span class="glyphicon glyphicon-pause"></span> 暂停'
      );
  } else if ( switcher.hasClass('glyphicon-pause') ) {
    clearInterval(timer);
    $('#switcher').html(
      '<span class="glyphicon glyphicon-play"></span> 开始'
      );
  }
});

$('#restart').click(function () {
  clearInterval(timer);
  timecounter = 1;
  $('#switcher').html(
    '<span class="glyphicon glyphicon-pause"></span> 暂停'
    );
  timer = setInterval(updatePos, 1000);
});
