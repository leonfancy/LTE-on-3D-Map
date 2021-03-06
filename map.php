<!DOCTYPE html>
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

<div class="container-fluid" style="margin-top:20px">
  <div class="row">
    <div class="col-md-8">
      <div id="map3d" style="height:600px"></div>
    </div>
    <div class="col-md-4">
      <h1>LTE仿真3D地图演示程序</h1>
      <hr></hr>
      <div id="controls" class="btn-group btn-group-justified">
        <a id="switcher" type="button" class="btn btn-success"><span class="glyphicon glyphicon-play"></span> 开始</a>
        <a id="restart" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-repeat"></span> 重新开始</a>
      </div>
      <div class="panel panel-info">
        <table class="table table-striped">
          <tbody>
            <tr>
              <td>仿真总时间(s)</td>
              <td id="totaltime"></td>
            </tr>
            <tr>
              <td>现在时刻(s)</td>
              <td id="curtime"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr></hr>
      <div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title">用户信息</h3>
        </div>
        <table class="table table-striped">
          <tbody>
            <tr>
              <td>User ID</td>
              <td id="userid">0</td>
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

  <!-- Chart Area -->
  <hr></hr>
  <div id="charts" class="row">
    <div id="sinr-chart" class="col-md-6">
      <svg></svg>
    </div>
    <div id="thrput-chart" class="col-md-6">
      <svg></svg>
    </div>
  </div>
</div>

  <script type="text/javascript" src="https://www.google.com/jsapi"> </script>
  <script type="text/javascript" src="assets/js/jquery-1.11.1.min.js"> </script>
  <script type="text/javascript" src="assets/lib/bootstrap/js/bootstrap.min.js"> </script>
  <script type="text/javascript" src="assets/lib/d3/d3.min.js"> </script>
  <script type="text/javascript" src="assets/js/main.js"> </script>
</body>
</html>
