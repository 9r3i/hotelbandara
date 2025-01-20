<?php
$file=$argv[1]??'';
$ofile=preg_replace('/\.[a-z0-9]+$/','.txt',$file);
$size=getimagesize($file);
print_r($size);
$get=file_get_contents($file);
$data='data:image/svg+xml;base64,'.base64_encode($get);
$put=file_put_contents($ofile,$data);
echo "$put\n";
