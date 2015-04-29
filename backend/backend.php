<?php
	require_once("includes/inc_db_settings.php");
	$mysqli_connection = new mysqli($host = $address, $username = $user, $password = $pass, $dbname = $dbname);

	$data = file_get_contents('php://input');
	
	if (!$mysqli_connection->query("INSERT INTO staging (IPAddress, IPAddress_forwarded, Result) VALUES ('{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_X_FORWARDED_FOR']}', '{$data}')")) { 
		printf("Error: %s\n", $mysqli_connection->error); 
	}
	
	echo $data;
?>