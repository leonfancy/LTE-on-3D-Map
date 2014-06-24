<?php
$un = 2;

$data = new stdClass;

// get the users' data
for( $i=1; $i<=$un; $i++ ) {
  $filename = "data/user$i.txt";
  $fp = fopen($filename,"r");
  $ud = new stdClass;
  $arr = fgetcsv($fp);
  while( $arr = fgetcsv($fp) ) {
    $ud->lat[] = $arr[0];
    $ud->long[] = $arr[1];
    $ud->sinr[] = $arr[2];
    $ud->throughput[] = $arr[3];
  }
  $data->users[] = $ud;
  fclose($fp);
}

// get the stations' data
$fp = fopen('data/stations.txt',"r");
$arr = fgetcsv($fp);
while( $arr = fgetcsv($fp) ) {
  $sd = new stdClass;
  $sd->lat = $arr[0];
  $sd->long = $arr[1];
  $data->stations[] = $sd;
}
fclose($fp);

header('Content-Type:application/json');
echo json_encode($data);
?>
