/**
 * @file Contains all constant values, initial values and basic structures
 * - The use of constants avoids mispellings and reduces code errors.=
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
const $addTransactionForm = $("#addTransactionForm");
const $transactionAmountPaidBtn = $("#transaction-amount-paid");
const $transactionAmountEarnedBtn = $("#transaction-amount-earned");

// Load Transactions Constants
const $loadTransactionErrAlert = $("#load-transac-err-alert");
const $loadTransactionErrMsg = $("#load-transac-err-msg");

// Table Constants
const $table = $("table");
const $tbody = $("tbody");
const $noTableResults = $("#no-search-results");
const $filterAmountSelect = $("#amount-type-select");
const $filterDateRangeSelect = $("#date-range-select");

// Login Constants
const $logoutButton = $("#logout-button");
const $loginButton = $("#login-button");
const $loginEmail = $("#login-email");
const $loginPassword = $("#login-password");
const $showPasswordButton = $("#show-password");
const $loginErrAlert = $("#login-err-alert");
const $loginDismissErr = $("#login-dismiss-err");
const $loginErrMsg = $("#login-err-msg");
const $loginForm = $("#loginForm");
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

const Transaction = {
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

const TransactionType = {
  Earned: "Earned",
  Paid: "Paid"
};

/**
 * @global
 * Transaction Singleton
 *
 * @description
 * The singleton pattern optimizes accessing and updating transaction data. This is
 * done by creating an originalInstance (created only on loadTransactionAJAX)
 * and a modifiable instance for searching/filtering. These two instances are placed
 * on the heap to free up stack space and helper methods allow us to fetch only this
 * instance, modify it or revert instance to original
 *
 */
const TransactionInstance = (() => {
  var originalInstance; // Primary instance
  var instance; // Secondary instance filtered and periodically refreshed

  // Creates instance on the heap
  createInstance = data => {
    const object = new Object(data);
    return object;
  };

  return {
    // Fetches secondary instance object
    getInstance: data => {
      if (!instance) {
        instance = createInstance(data);
      }
      return instance;
    },
    // Creates original instance after loadTransactions
    createOriginalInstance: data => {
      originalInstance = createInstance(data);
      instance = createInstance(data);
      return originalInstance;
    },
    // Change secondary instance data
    changeInstance: data => {
      instance = createInstance(data);
    },
    // Refreshes secondary instance to original primary instance
    refreshInstance: () => {
      instance = originalInstance;
    }
  };
})();

// Global and Default Search/Filtering
let ROWS_PER_PAGE = 100;

let TABLE_SORT = {
  sortBy: Transaction.Date,
  ascending: true
};

let SEARCH_QUERY = ""; // search query for table search

let TRANSACTION_TYPE = TransactionType.Paid; // explicit transaction type, paid = negative or 0, earned = positive or 0
