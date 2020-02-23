<?php

$partnerName = $_ENV['PARTNER_NAME'];
$partnerPassword = $_ENV['PARTNER_PASSWORD'];

function createRequestUrl($command, $paramaters){
	$url = 'https://api.expensify.com/?command=' . $command;
	//parse the paramaters
	foreach($paramaters as $key => $value){
		$url .= '&' . $key . '=' . $value;
	}
	return $url;
}

//is valid command coming in?
if( isset($_POST["command"]) || isset($_GET["command"]) ){
	if($_POST["command"]==="Authenticate" ){
		//do we have correct paramaters
		if( isset($_POST["partnerUserID"]) && isset($_POST["partnerUserSecret"]) ){
			$partnerUserID = $_POST["partnerUserID"];
            $partnerUserSecret = $_POST["partnerUserSecret"];
			$paramaters = array(
				"partnerName" => $partnerName,
				"partnerPassword" => $partnerPassword,
				"partnerUserID" => $partnerUserID,
				"partnerUserSecret" => $partnerUserSecret);
			$url = createRequestUrl("Authenticate", $paramaters);
			
			//api request
			$request =  file_get_contents($url);
			$phpData = json_decode($request);

			if($phpData->jsonCode == 200){
				//all good
				$task = $phpData->authToken;
				setcookie("auth-token",$task, time()+3500);
			
				$response = array('error' => false, 'msg' => 'Successful Auth'); 
				$msg = json_encode($response);
				exit($msg);
			}elseif ($phpData->jsonCode == 401){
				//password
				$response = array('error' => true, 'msg' => 'Incorrect Password'); 
				$msg = json_encode($response);
				die($msg);
			}elseif( $phpData->jsonCode == 404){
				//account
				$response = array('error' => true, 'msg' => 'Incorrect Account'); 
				$msg = json_encode($response);
				die($msg);
			}elseif ($phpData->jsonCode == 405){
				$response = array('error' => true, 'msg' => 'Incorrect Email'); 
				$msg = json_encode($response);
				die($msg);
			}else{
				//other code or something
				$response = array('error' => true, 'msg' => 'Authorization Unsuccessful Please Try Again'); 
				$msg = json_encode($response);
				die($msg);
			}//end if else status


		}else{
		//lacking correct paramaters
			$response = array('error' => true, 'msg' => 'User Credentials were not provided.'); 
			$msg = json_encode($response);
			die($msg);
		}//end if else credentials present
	//end if Authenticate command

	}else if($_GET["command"]==="Get"){
		//are we authed
		if( isset($_GET["authToken"])){
			//good token lets request
			$paramaters = array(
				"authToken" => $_GET["authToken"],
				"returnValueList" => $_GET["returnValueList"]
				);
			$url = createRequestUrl("Get", $paramaters);

			//api returns json
			$jsonData =  file_get_contents($url);
			//php is like this
			$phpData = json_decode($jsonData);
			
			//check codes
			if($phpData->jsonCode == 200){
				//all good send the data	reset cookie 
				$task = $phpData->authToken;
				$response = array('error' => false, 'msg' => json_encode($phpData), 'status' => 200); 
				$msg = json_encode($response);
				die($msg);

			}else if($phpData->jsonCode == 404){
				$response = array('error' => true, 'msg' => 'Resource Not Found', 'status' => 404); 
				$msg = json_encode($response);
				die($msg);

			}else if($phpData->jsonCode == 408){
				$response = array('error' => true, 'msg' => 'Bad Token', 'status' => 408); 
				$msg = json_encode($response);
				die($msg);
			}//end else if request codes


		}else{
			//no auth
			$response = array('error' => true, 'msg' => 'Bad Token'); 
			$msg = json_encode($response);
			die($msg);
		}//end if token not set

	//end Get command	
	}else if($_POST["command"]==="CreateTransaction"){

		//check auth
		if(isset($_POST["authToken"])){
			//input check
			if( isset($_POST["merchant"]) && isset($_POST["amount"]) && isset($_POST["created"]) ){
				//we have everything lets make the request
				$paramaters = array(
					"authToken" => $_POST["authToken"],
					"created" => $_POST["created"],
					"amount" => $_POST["amount"],
					"merchant" => $_POST["merchant"],
				);
				$url = createRequestUrl("CreateTransaction", $paramaters);
				//api returns json
				$jsonData =  file_get_contents($url);

				//php is like this
				$phpData = json_decode($jsonData);

				//check codes
				if($phpData->jsonCode == 200){
					$response = array('error' => false, 'msg' => json_encode($phpData), 'status' => 200); 
					$msg = json_encode($response);
					die($msg);
				} else{
					$response = array('error' => true, 'msg' => $phpData->message, 'status' => $phpData->jsonCode); 
					$msg = json_encode($response);
					die($msg);
				}
			}else{
				$response = array('error' => true, 'msg' => 'Please Provide Valid Transaction Data', 'status' => 400); 
				$msg = json_encode($response);
				die($msg);
			}//end if we have input
		}else{
			//no auth
			$response = array('error' => true, 'msg' => 'Bad Token', 'status' => 401); 
			$msg = json_encode($response);
			die($msg);
		}//end if authed
	//end CreateTransaction
	}else{
	//not valid command: auth, get, or create
		$response = array('error' => true, 'msg' => 'Valid Command Not Issued', 'status' => 400); 
		$msg = json_encode($response);
		die($msg);
	}//end if command type


}else{ 
	//no POST commandset
	$response = array('error' => true, 'msg' => 'No Command Issued'); 
	$msg = json_encode($response);
	die($msg);

}//end if else command set



?>