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

var sinrChartUpdater;
var thrputChartUpdater;

google.load("earth", "1", {"other_params":"sensor=false"});

function init() {
  google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
  ge = instance;
  ge.getWindow().setVisibility(true);
  ge.getNavigationControl().setVisibility(ge.VISIBILITY_HIDE);

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

  // get data of users and base stations 
  $.getJSON("_getdata.ajax.php",function (data) {
    // start simulation 
    simulation(data);
  });
}

function failureCB(errorCode) {
  alert('请保证能够正常连接Google地图');
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

  sinrChartUpdater = drawChart( ues[curUserID].data.sinr, d3.select('#sinr-chart'), 'SINR' );
  thrputChartUpdater = drawChart( ues[curUserID].data.throughput, d3.select('#thrput-chart'), 'Throughput' );

}

// update the position of every user per second
function updatePos() {
  var un = ues.length;
  // if exceed the simulation total time, then exit
  if( timecounter >= totalTime ) {
    clearInterval(timer);
  }

  $('#curtime').html(timecounter);

  for(var i=0; i<un; i++) {
    var point = ues[i].placemark.getGeometry();
    point.setLatitude(parseFloat(ues[i].data.lat[timecounter]));
    point.setLongitude(parseFloat(ues[i].data.long[timecounter]));
  }

  $('#sinr').html(ues[curUserID].data.sinr[timecounter]);
  $('#throughput').html(ues[curUserID].data.throughput[timecounter]);

  sinrChartUpdater();
  thrputChartUpdater();

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

  sinrChartUpdater = drawChart( ues[curUserID].data.sinr, d3.select('#sinr-chart'), 'SINR' );
  thrputChartUpdater = drawChart( ues[curUserID].data.throughput, d3.select('#thrput-chart'), 'Throughput' );
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
  sinrChartUpdater = drawChart( ues[curUserID].data.sinr, d3.select('#sinr-chart'), 'SINR' );
  thrputChartUpdater = drawChart( ues[curUserID].data.throughput, d3.select('#thrput-chart'), 'Throughput' );
  timer = setInterval(updatePos, 1000);
});

function drawChart(data, chartDiv, chartType) {
  // delete the old chart for rendering the new one
  chartDiv.select("svg").remove();

  var margin = {top: 20, right: 30, bottom: 30, left: 50},
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
  var x = d3.scale.linear()
      .domain([1, totalTime])
      .range([0, width]);
  
  var y = d3.scale.linear()
      .domain( d3.extent(data) )
      .range([height, 0]);
  
  var line = d3.svg.line()
      .interpolate("monotone")
      .x(function(d,i) { return x(i); })
      .y(function(d) { return y(d); });
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
  
  var svg = chartDiv.append("svg").attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  	.append("text")
        .attr("transform", "rotate(0)")
        .attr("x", width - margin.right)
        .attr("y", -6)
        .style("text-anchor", "right")
        .text("Time");
  	
  var ysvg = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
  	.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 12)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
  if ( chartType == 'SINR' ) {
    ysvg.text("SINR (dB)"); 
  } else if ( chartType == "Throughput" ) {
    ysvg.text("Throughput (kbps)");
  }
  	
  svg.append("path")
      .data([data.slice(0,timecounter)])
      .attr("class", "line")
      .attr("d", line);

  function refreshChart() {
    svg.selectAll(".line")
      .data([data.slice(0,timecounter)])
      .attr("d", line);
  }
  return refreshChart;
}
