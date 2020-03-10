<?php

// Use ENV variables for keys 
$partnerName = $_ENV['PARTNER_NAME'];
$partnerPassword = $_ENV['PARTNER_PASSWORD'];

// Constants
$BASE_URL = 'https://api.expensify.com/';
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
function getFileContents($paramaters)
{
	$requestUrl = $GLOBALS['BASE_URL'] . '?' . http_build_query($paramaters);
	return file_get_contents($requestUrl);
}

// Helper function for forming JSON responses
function jsonSuccess($data, $status)
{
	header('HTTP/1.1 ' . $status);
	exit(json_encode($data));
}

function jsonError($msg, $status)
{
	header('HTTP/1.1 ' . $status);
	exit(json_encode(array('msg' => $msg)));
}

/**
 * Proxy Switches
 *  - Early exits
 * 	- Avoid branching pyramid of doom
 *  - Avoid using API error messages (not user-friendly)
 */

if ($requestMade === false) {
	jsonError('No Command Issued', 500);
}

// Authenticate User
if ($POST_COMMAND === $AUTHENTICATE_REQUEST) {
	if (isset($partnerUserID) && isset($partnerUserSecret)) {

		$reqParams = array(
			"command" => $AUTHENTICATE_REQUEST,
			"partnerName" => $partnerName,
			"partnerPassword" => $partnerPassword,
			"partnerUserID" => $partnerUserID,
			"partnerUserSecret" => $partnerUserSecret
		);

		$content = getFileContents($reqParams);

		if ($content === FALSE) {
			jsonError('Please Check Network Connection & Refresh', 500);
		}

		$jsonData = json_decode($content);

		switch ($jsonData->jsonCode) {
			case 200:
				jsonSuccess($jsonData, 200);
			case 401:
				jsonError('Incorrect Password', 401);
			case 404:
				jsonError('Incorrect Email and/or Password', 404);
			case 405:
				jsonError('Incorrect Email', 405);
			default:
				jsonError('Authorization Unsuccessful', 400);
		}
	} else {
		jsonError('Please Provide Credentials', 400);
	}
}

// Get Transactions
if ($GET_COMMAND === $GET_REQUEST) {
	if (isset($getAuthToken)) {

		$reqParams = array(
			"command" => $GET_REQUEST,
			"authToken" => $getAuthToken,
			"returnValueList" => $getReturnValueList
		);

		$content = getFileContents($reqParams);

		if ($content === FALSE) {
			jsonError('Please Check Network Connection & Refresh', 500);
		}

		$jsonData = json_decode($content);

		switch ($jsonData->jsonCode) {
			case 200:
				jsonSuccess($jsonData, 200);
			case 404:
				jsonError('Transactions Not Found', 404);
			case 408:
				jsonError('Bad Auth Token', 408);
			default:
				jsonError('Authorization Unsuccessful', 400);
		}
		exit($jsonResponse);
	} else {
		jsonError('Bad Auth Token', 400);
		exit($jsonResponse);
	}
}

// Create Transaction
if ($POST_COMMAND === $CREATE_TRANSACTION_REQUEST) {

	if (isset($postAuthToken)) {

		if (isset($postMerchant) && isset($postAmount) && isset($postCreated)) {

			$paramaters = array(
				"command" => $CREATE_TRANSACTION_REQUEST,
				"authToken" => $postAuthToken,
				"created" => $postCreated,
				"amount" => $postAmount,
				"merchant" => $postMerchant,
			);

			$content = getFileContents($paramaters);

			if ($content === FALSE) {
				jsonError('Please Check Network Connection & Refresh', 500);
			}

			$jsonData = json_decode($content);

			if ($jsonData->jsonCode == 200) {
				jsonSuccess($jsonData, 200);
			} else {
				jsonError($jsonData->message, $jsonData->jsonCode);
			}

		} else {
			jsonError('Please Include All Transaction Data', 400);
		}
	} else {
		jsonError('Bad Token', 401);
	}
}

// Invalid Command Default
jsonError('Invalid Command Issued', 400);
