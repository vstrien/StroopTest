<?php
	require_once("includes/inc_db_settings.php");
	$mysqli_connection = new mysqli($host = $address, $username = $user, $password = $pass, $dbname = $dbname);

	
	if($result = $mysqli_connection->query("SELECT * FROM staging WHERE ID > (SELECT MAX(staging_ID) FROM loadinfo)")) {
		while($row = $result->fetch_array())
		{
			$woordnummer = 0;
			
			//print nl2br(print_r($row, true));
			$ID = $row["ID"];
			$testresult = json_decode($row["Result"]);
			for($i = 0; $i < count($testresult); $i++)
			{
				if($testresult[$i]->event == "vraag")
				{
					$sql = "INSERT INTO event_vraag (
						staging_ID
						, variabele
						, antwoord
					) VALUES (
						{$row["ID"]}
						, \"{$testresult[$i]->variabele}\"
						, \"{$testresult[$i]->antwoord}\"
					);";
				}
				else if ($testresult[$i]->event == "click" || $testresult[$i]->event == "timeout")
				{
					$woordnummer++;
					$sql = "INSERT INTO event_click (
						staging_ID
						, startTime
						, endTime
						, totalTime
						, word
						, wordColor
						, clickedColor
						, woordnummer
					) VALUES (
						{$row["ID"]}
						, {$testresult[$i]->startTime}
						, {$testresult[$i]->endTime}
						, {$testresult[$i]->totalTime}
						, \"{$testresult[$i]->word}\"
						, \"{$testresult[$i]->wordColor}\"
						, \"{$testresult[$i]->clickedColor}\"
						, {$woordnummer}
					);";
				}
				else
				{
					print("Fout! Onbekend testresultaat!");
					print(nl2br(print_r($testresult[$i], true)));
				}
				$mysqli_connection->query($sql);
			}
				
			// ID = result-id
			// IPAddress
			// IPAddress_forwarded
			// Result = JSON
			//	-event=vraag
			//		--variabele
			//		--antwoord
			//	-event=click
			//		--startTime
			//		--endTime
			//		--totalTime
			//		--word
			//		--wordColor
			//		--clickedColor
			//  -variabele
			//  -
			
		}
		if($result->num_rows > 0)
		{
			$mysqli_connection->query("INSERT INTO loadinfo(staging_ID) SELECT MAX(staging_ID) FROM event_click");
		}
	}

	$mysqli_connection->close();
?>