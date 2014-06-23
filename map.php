<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>3D Map for Simulation</title>

  <!-- Bootstrap -->
  <link href="assets/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->

  <link href="assets/css/style.css" rel="stylesheet">
</head>

<body>

<h1>3D地图演示程序</h1>
<div class="container-fluid" style="margin-top:20px">
<div class="row">

  <div class="col-md-8">
    <div id="map3d" style="height:600px"></div>
  </div>

  <div class="col-md-4">
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">User Information</h3>
      </div>
      <table class="table table-striped">
        <tbody>
          <tr>
            <td>User ID</td>
            <td id="userid"></td>
          </tr>
          <tr>
            <td>SINR</td>
            <td id="sinr"></td>
          </tr>
          <tr>
            <td>Throughput</td>
            <td id="throughput"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
</div>

<script type="text/javascript" src="https://www.google.com/jsapi"> </script>
<script type="text/javascript" src="assets/js/jquery-1.11.1.min.js"> </script>
<script type="text/javascript" src="assets/lib/bootstrap/js/bootstrap.min.js"> </script>
<script type="text/javascript" src="assets/js/main.js"> </script>
</body>
</html>
