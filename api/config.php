<?php
//ob_start("ob_gzhandler");
error_reporting(0);

session_start();
date_default_timezone_set('Europe/Rome');


//Access-Control-Allow-Origin "*"
//Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
//Access-Control-Allow-Headers "append,delete,entries,foreach,get,has,keys,set,values,Authorization"
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: append,delete,entries,foreach,get,has,keys,set,values,Authorization');


/* DATABASE CONFIGURATION */
define('DB_SERVER', 'eu-cdbr-west-02.cleardb.net'); //eu-cdbr-west-02.cleardb.net
define('DB_USERNAME', 'ba6f60be182ebf');
define('DB_PASSWORD', 'cb7bed8d');
define('DB_DATABASE', 'heroku_4cc435c8203054a');
define("BASE_URL", "https://odonto3.herokuapp.com/api/");
define("SITE_KEY", 'banana2018');
define("UPLOAD_FOLDER", 'api/upload');

function getDB() 
{
	$dbhost=DB_SERVER;
	$dbuser=DB_USERNAME;
	$dbpass=DB_PASSWORD;
	$dbname=DB_DATABASE;
	$dbConnection = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbConnection->exec("set names utf8");
	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbConnection;
}
/* DATABASE CONFIGURATION END */

/* API key encryption */
function apiToken($session_uid)
{
$key=md5(SITE_KEY.$session_uid);
return hash('sha256', $key);
}



?>