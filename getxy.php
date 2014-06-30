
<html>
<head>
   <title>mousemove_listener_example.html</title>
   <script src="//www.google.com/jsapi?key=ABQIAAAA5El50zA4PeDTEMlv-sXFfRSsTL4WIgxhMZ0ZK_kHjwHeQuOD4xTdBhxbkZWuzyYTVeclkwYHpb17ZQ"></script>
     <script type="text/javascript" src="assets/js/jquery-1.11.1.min.js"> </script>
   <script type="text/javascript">
      var ge;
      google.load("earth", "1", {"other_params":"sensor=false"});

      function init() {
        google.earth.createInstance('map3d', initCB, failureCB);
      }

      function initCB(instance) {
         ge = instance;
         ge.getWindow().setVisibility(true);
		 // Move the camera.
         var lookAt = ge.createLookAt('');
          // 设置位置的值。
       lookAt.setLatitude(37.80769684195154);
       lookAt.setLongitude(-122.41233782046058);
       lookAt.setRange(200.0); //default is 0.0
	   lookAt.setTilt(45.0);

         // 更新 Google 地球中的视图。
       ge.getView().setAbstractView(lookAt);
        
		  ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS_LOW_RESOLUTION, true);
          ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
          ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
          ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);

         // Define what happens when a mousemove is detected on the globe.
         var maxAlt = -1000000;
         function recordxy(event) {
            var currentLat = event.getLatitude();
			 var currentLong = event.getLongitude();
			
			$('#recordxy').append( '<p>'+ currentLat + ', ' + currentLong + '</p>');
         }
         function showxy(event) {
            var currentLat = event.getLatitude();
			 var currentLong = event.getLongitude();
			
            document.getElementById('showxy').innerHTML = 
                  '<p>Current altitude: ' + currentLat + '</p>'+'<p>Current longititude: ' + currentLong + '</p>';
         }		 
		 

         // Listen to the mousemove event on the globe.
         google.earth.addEventListener(ge.getGlobe(), 'click', recordxy);
		 google.earth.addEventListener(ge.getGlobe(), 'mousemove', showxy);
      }

      function failureCB(errorCode) {
      }

      google.setOnLoadCallback(init);
   </script>

</head>
<body>

   <div id="map3d" style="height:800px; width:1300px;"></div>
   <div id="showxy"><p>Current altitude: </p><p>Current longititude: </p></div>
   <div id="recordxy"><p>Current altitude,longititude</p></div>

</body>
</html>
