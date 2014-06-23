<?php
$filename = 'user1.txt';
$latitute = 50 + rand(1,2)/2000;
$longitude = 80 + rand(1,2)/2000;
$sinr = 10 + rand(1,10);
$throughput = 6000 + rand(1,100);

file_put_contents($filename,"latitute,longitude,sinr,throughput\n");

for( $i=1; $i<=2000; $i++)
{
$latitute += rand(1,2)/10000;
$longitude += rand(1,2)/10000;
$sinr += rand(1,10)/100;
$throughput +=  rand(1,100)/1000;
file_put_contents($filename,"$latitute,$longitude,$sinr,$throughput\n",FILE_APPEND);
}
?>
