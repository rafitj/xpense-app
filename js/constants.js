/**
 * This file contants all constant values, initial values and basic structures
 * The use of constants avoids mispellings and reduces code errors.
 */

// Current Date: Used as default add transaction date and filters
const currentDate = new Date().toISOString().slice(0, 10);

// Main Views Constants
const $unauthenticatedContent = $("#loginView");
const $authenticatedContent = $("#viewContent, #logout-button");
const $loader = $("#loader");
const $allErrAlerts = $(
  "#add-transac-err-alert, #login-err-alert, #load-transac-err-alert"
);

// Create Transaction Constants
const $transactionAmount = $("#transaction-amount");
const $transactionCreated = $("#transaction-created");
const $transactionMerchant = $("#transaction-merchant");
const $addTransactionButton = $("#add-transaction");
const $resetTransaction = $("#reset-transaction");
const $addTransactionErrAlert = $("#add-transac-err-alert");
const $addTransactionDismissErr = $("#add-transac-dismiss-err");
const $addTransactionErrMsg = $("#add-transac-err-msg");

// Load Transactions Constants
const $loadTransactionErrAlert = $("#load-transac-err-alert");
const $loadTransactionErrMsg = $("#load-transac-err-msg");

// Table Constants
const $table = $("table");
const $tbody = $("tbody");
const $noTableResults = $("#no-search-results");
const $filterAmountSelect = $("#amount-type-select");
const $filterDateRangeSelect = $("#date-range-select");

// Login Consta$nts
const $logoutButton = $("#logout-button");
const $loginButton = $("#login-button");
const $loginEmail = $("#login-email");
const $loginPassword = $("#login-password");
const $showPasswordButton = $("#show-password");
const $loginErrAlert = $("#login-err-alert");
const $loginDismissErr = $("#login-dismiss-err");
const $loginErrMsg = $("#login-err-msg");
const $passwordCapsWarning = $("#password-caps");

// Server
const authTokenCookie = "auth-token";
const URL_PROXY = "proxy.php";

// Methods and Commands
const Methods = {
  POST: "POST",
  GET: "GET"
};

const Commands = {
  Get: "Get",
  CreateTransaction: "CreateTransaction",
  Authenticate: "Authenticate"
};

const Transactions = {
  Amount: "Amount",
  Date: "Date",
  Merchant: "Merchant"
};

const FilterDate = {
  Today: "Today",
  LastWeek: "LastWeek",
  LastMonth: "LastMonth",
  AllTime: "AllTime"
};

const FilterAmount = {
  Negative: "Negative",
  Positive: "Positive",
  Neutral: "Neutral",
  AllTypes: "AllTypes"
};
/**
 * Transaction Singleton
 *
 * The singleton pattern optimizes accessing and updating transaction data
 *
 * This is done by creating an originalInstance (created only on loadTransactionAJAX)
 * and a modifiable instance for searching/filtering
 *
 * This singleton is placed on the heap to free up stack space and helper methods allow
 * us to fetch only this instance, modify it or revert instance to original
 *
 */
const Singleton = (() => {
  var instance;
  var originalInstance;

  createInstance = data => {
    const object = new Object(data);
    return object;
  };

  return {
    getInstance: data => {
      if (!instance) {
        instance = createInstance(data);
      }
      return instance;
    },
    createOriginalInstance: data => {
      originalInstance = createInstance(data);
      instance = createInstance(data);
      return originalInstance;
    },
    changeInstance: data => {
      instance = createInstance(data);
    },
    refreshInstance: () => {
      instance = originalInstance;
    }
  };
})();

// Initial filter settings
let ROWS_PER_PAGE = 100;

let TABLE_SORT = {
  sortBy: "Date",
  ascending: true
};

let SEARCH_QUERY = "";
