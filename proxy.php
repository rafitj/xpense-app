<?php

/** This file acts as a proxy for the Expensify API */

/**
 * Global Constants
 */

// ENV variables for secret keys 
$PARTNER_NAME = $_ENV['PARTNER_NAME'];
$PARTNER_PASSWORD = $_ENV['PARTNER_PASSWORD'];

// URL & Requests
$BASE_URL = 'https://api.expensify.com/';
$AUTHENTICATE_REQUEST = "Authenticate";
$GET_REQUEST = "Get";
$CREATE_TRANSACTION_REQUEST = "CreateTransaction";

// POST/GET variables
$POST_COMMAND = $_POST["command"];
$GET_COMMAND = $_GET["command"];
$REQUEST_MADE = isset($POST_COMMAND) || isset($GET_COMMAND);


// Auth Params
$PARTNER_USER_ID = $_POST["partnerUserID"];
$PARTNER_USER_SECRET = $_POST["partnerUserSecret"];
$GET_AUTH_TOKEN = $_GET["authToken"];

// Load Transactions Params
$POST_AUTH_TOKEN = $_POST["authToken"];
$GET_RETURN_VALUE_LIST = $_GET["returnValueList"];

// Create Transaction Params
$POST_CREATED = $_POST["created"];
$POST_MERCHANT = $_POST["merchant"];
$POST_AMOUNT = $_POST["amount"];

/**
 * Helper functions
 */

// Fetch file contents with built URL
function getFileContents($paramaters)
{
	$requestUrl = $GLOBALS['BASE_URL'] . '?' . http_build_query($paramaters);
	return file_get_contents($requestUrl);
}

// Send success JSON response with data
function jsonSuccess($data, $status)
{
	header('HTTP/1.1 ' . $status);
	exit(json_encode($data));
}

// Send error JSON response with message
function jsonError($msg, $status)
{
	header('HTTP/1.1 ' . $status);
	exit(json_encode(array('msg' => $msg)));
}

/**
 * Proxy Switch
 */

 // No command made
if ($requestMade === false) {
	jsonError('No Command Issued', 500);
}

// Authenticate User
if ($POST_COMMAND === $AUTHENTICATE_REQUEST) {
	if (isset($PARTNER_USER_ID) && isset($PARTNER_USER_SECRET)) {

		// Create request params and fetch
		$reqParams = array(
			"command" => $AUTHENTICATE_REQUEST,
			"partnerName" => $PARTNER_NAME,
			"partnerPassword" => $PARTNER_PASSWORD,
			"partnerUserID" => $PARTNER_USER_ID,
			"partnerUserSecret" => $PARTNER_USER_SECRET
		);
		$content = getFileContents($reqParams);

		// Handle fetch fail
		if ($content === FALSE) {
			jsonError('Please Check Network Connection & Refresh', 500);
		}

		// Send response depending on status code
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
				jsonError('Please Provide Registered Credentials', 400);
		}
	} else {
		// Incomplete form
		jsonError('Please Provide Credentials', 400);
	}
}

// Get Transactions
if ($GET_COMMAND === $GET_REQUEST) {
	if (isset($GET_AUTH_TOKEN)) {

		// Create request params and fetch
		$reqParams = array(
			"command" => $GET_REQUEST,
			"authToken" => $GET_AUTH_TOKEN,
			"returnValueList" => $GET_RETURN_VALUE_LIST
		);
		$content = getFileContents($reqParams);

		// Handle fetch fail
		if ($content === FALSE) {
			jsonError('Please Check Network Connection & Refresh', 500);
		}

		// Send response depending on status code
		$jsonData = json_decode($content);

		switch ($jsonData->jsonCode) {
			case 200:
				jsonSuccess($jsonData, 200);
			case 404:
				jsonError('Transactions Not Found', 404);
			default:
				jsonError('Authentication Failed - Please Login Again', 401);
		}

	} else {
		// Authentication Failure
		jsonError('Authentication Failed - Please Login Again', 401);
	}
}

// Create Transaction
if ($POST_COMMAND === $CREATE_TRANSACTION_REQUEST) {
	if (isset($POST_AUTH_TOKEN)) {
		if (isset($POST_MERCHANT) && isset($POST_AMOUNT) && isset($POST_CREATED)) {

			// Create request params and fetch
			$reqParams = array(
				"command" => $CREATE_TRANSACTION_REQUEST,
				"authToken" => $POST_AUTH_TOKEN,
				"created" => $POST_CREATED,
				"amount" => $POST_AMOUNT,
				"merchant" => $POST_MERCHANT,
			);
			$content = getFileContents($reqParams);

			// Handle fetch fail
			if ($content === FALSE) {
				jsonError('Please Check Network Connection & Refresh', 500);
			}

			// Send response depending on status code
			$jsonData = json_decode($content);

			if ($jsonData->jsonCode == 200) {
				jsonSuccess($jsonData, 200);
			} else {
				// These error messages are sufficiently descriptive
				jsonError($jsonData->message, $jsonData->jsonCode);
			}

		} else {
			// Incomplete form
			jsonError('Please Include All Transaction Data', 400);
		}
	} else {
		// Authentication Failure
		jsonError('Authentication Failed - Please Login Again', 401);
	}
}

// Invalid Command Default
jsonError('Invalid Command Issued', 400);