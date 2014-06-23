<?php
ini_set('display_errors', true);
error_reporting(E_ALL);
$un = 2;
$data = new stdClass;
//$data->stations = [];
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
}

header('Content-Type:application/json');
echo json_encode($data);
?>
