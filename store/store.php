<?php 
$xml = $_REQUEST['xml'];
$hash = $_REQUEST['hash'];
$path = realpath(dirname(__FILE__)) . "/" . $hash . ".xml";

$exists = file_exists($path);
if (!$exists) {
   $ret = file_put_contents($path, $xml);
}


echo "<html><body>";
if ($exists) {
    echo "I think the file <tt>$path</tt> already exists.  Doing nothing";
} else if ($ret) {
    echo "I think I wrote a file to <tt> $path</tt>, woot";
} else {
    echo "I think I failed writing <tt>$path</tt>, sorry";
}
echo "</body></html>";


?>
