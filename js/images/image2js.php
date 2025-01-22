<?php
$files=scandir('.');
$types=[
  'svg'=>'image/svg+xml',
  'jpg'=>'image/jpeg',
  'jpeg'=>'image/jpeg',
  'png'=>'image/png',
  'gif'=>'image/gif',
  'webp'=>'image/webp',
  'bmp'=>'image/bmp',
  ''=>'',
];
$res=';const IMAGES={';
foreach($files as $file){
  if(preg_match('/\.([a-z]+)$/',$file,$ext)
    &&array_key_exists($ext[1],$types)){
    $type=$types[$ext[1]];
    $raw=file_get_contents($file);
    $res.='"'.$file.'":'
      .'"data:'.$type.';base64,'.base64_encode($raw).'",';
  }
}
$res.='};';

$put=file_put_contents('images.js',$res);
echo "$put\n";

