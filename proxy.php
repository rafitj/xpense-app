<?php

// Use ENV variables for keys 
$partnerName = $_ENV['PARTNER_NAME'];
$partnerPassword = $_ENV['PARTNER_PASSWORD'];

// Constants
$BASE_URL = 'https://api.expensify.com/?';
$AUTHENTICATE_REQUEST = "Authenticate";
$GET_REQUEST = "Get";
$CREATE_TRANSACTION_REQUEST = "CreateTransaction";

// POST/GET variables
$POST_COMMAND = $_POST["command"];
$GET_COMMAND = $_GET["command"];
$requestMade = isset($POST_COMMAND) || isset($GET_COMMAND);


// Auth Params
$partnerUserID = $_POST["partnerUserID"];
$partnerUserSecret = $_POST["partnerUserSecret"];
$getAuthToken = $_GET["authToken"];

// Load Transactions Params
$postAuthToken = $_POST["authToken"];
$getReturnValueList = $_GET["returnValueList"];

// Create Transaction Params
$postCreated = $_POST["created"];
$postMerchant = $_POST["merchant"];
$postAmount = $_POST["amount"];

// Fetch file contents depending on built URL
function getFileContents($paramaters){
	$requestUrl = $GLOBALS['BASE_URL'] . http_build_query($paramaters);
	return @file_get_contents($requestUrl);
}

// Helper function for forming JSON responses
function formResponse($err, $msg, $status){
	$response = array('error' => $err, 'msg' => $msg, 'status'=>$status); 
	return json_encode($response);
}

/**
 * Proxy Switches
 *  - Early exits
 * 	- Avoid branching pyramid of doom
 *  - Avoid using API error messages (not user-friendly)
 */

if($requestMade === false){
	$jsonResponse = formResponse(true, 'No Command Issued', 000);
	exit($jsonResponse);
}

// Authenticate User
if($POST_COMMAND===$AUTHENTICATE_REQUEST){
	if(isset($partnerUserID) && isset($partnerUserSecret)){
		
		$reqParams = array(
			"command" => $AUTHENTICATE_REQUEST,
			"partnerName" => $partnerName,
			"partnerPassword" => $partnerPassword,
			"partnerUserID" => $partnerUserID,
			"partnerUserSecret" => $partnerUserSecret);

		$content = getFileContents($reqParams);
		
		if ($content === FALSE) {
			$jsonResponse = formResponse(true, 'Please Check Network Connection', 500);
			exit($jsonResponse);
		}
		
		$jsonData = json_decode($content);

		switch ($jsonData->jsonCode) {
			case 200:
				$jsonResponse = formResponse(false, json_encode($jsonData), 200);
				break;
			case 401:
				$jsonResponse = formResponse(true, 'Incorrect Password', 401);
				break;
			case 404:
				$jsonResponse = formResponse(true, 'Incorrect Account and/or Password', 404);
				break;
			case 405:
				$jsonResponse = formResponse(true, 'Incorrect Email', 405);
				break;
			default:
				$jsonResponse = formResponse(true, 'Authorization Unsuccessful', 400);
		}
		exit($jsonResponse);

	} else {
		$jsonResponse = formResponse(true, 'Please Provide Credentials', 400);
		exit($jsonResponse);
	}

}

// Get Transactions
if($GET_COMMAND===$GET_REQUEST){
	if( isset($getAuthToken)){

		$reqParams = array(
			"command" => $GET_REQUEST,
			"authToken" => $getAuthToken,
			"returnValueList" => $getReturnValueList
		);

		$content = getFileContents($reqParams);
	
		if ($content === FALSE) {
			$jsonResponse = formResponse(true, 'Please Check Network Connection', 500);
			exit($jsonResponse);
		}
		
		$jsonData = json_decode($content);
		
		switch ($jsonData->jsonCode) {
			case 200:
				$jsonResponse = formResponse(false, json_encode($jsonData), 200);
				break;
			case 404:
				$jsonResponse = formResponse(true, 'Transactions Not Found', 404);
				break;
			case 408:
				$jsonResponse = formResponse(true, 'Bad Auth Token', 408);
				break;
			default:
				$jsonResponse = formResponse(true, 'Authorization Unsuccessful', 400);
		}
		exit($jsonResponse);

	} else {
		$jsonResponse = formResponse(true, 'Bad Auth Token', 400);
		exit($jsonResponse);
	}

} 

// Create Transaction
if($POST_COMMAND===$CREATE_TRANSACTION_REQUEST){

	if(isset($postAuthToken)){

		if( isset($postMerchant) && isset($postAmount) && isset($postCreated) ){

			$paramaters = array(
				"command" => $CREATE_TRANSACTION_REQUEST,
				"authToken" => $postAuthToken,
				"created" => $postCreated,
				"amount" => $postAmount,
				"merchant" => $postMerchant,
			);

			$content = getFileContents($paramaters);
	
			if ($content === FALSE) {
				$jsonResponse = formResponse(true, 'Please Check Network Connection', 500);
				exit($jsonResponse);
			}
			
			$jsonData = json_decode($content);

			if($jsonData->jsonCode == 200){
				$jsonResponse = formResponse(false, json_encode($jsonData), 200);
				exit($jsonResponse);
			} else {
				$jsonResponse = formResponse(true, $jsonData->message, $jsonData->jsonCode);
				exit($jsonResponse);
			}
		} else {
			$jsonResponse = formResponse(true, 'Please Include All Transaction Data', 400);
			exit($jsonResponse);
		}
	} else {
		$jsonResponse = formResponse(true, 'Bad Token', 401);
		exit($jsonResponse);
	}

}

// Invalid Command Default
$jsonResponse = formResponse(true, 'Invalid Command Issued', 400);
exit($jsonResponse);
