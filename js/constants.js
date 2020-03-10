/**
 * @file Contains all constant values, initial values and basic structures
 * - The use of constants avoids mispellings and reduces code errors.=
 */

// Current Date: Used as default add transaction date and filters
const currentDate = new Date().toISOString().slice(0, 10);

// Main Views Constants
const $body = $("body");
const $unauthenticatedContent = $("#login-view");
const $authenticatedContent = $("#view-content, #logout-button");
const $loader = $("#loader");
const $alerts = $(
  "#add-transac-err-alert, #login-err-alert, #load-transac-err-alert, #password-caps"
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
const $addTransactionForm = $("#add-transaction-form");
const $transactionAmountPaidBtn = $("#transaction-amount-paid");
const $transactionAmountEarnedBtn = $("#transaction-amount-earned");

// Load Transactions Constants
const $loadTransactionErrAlert = $("#load-transac-err-alert");
const $loadTransactionErrMsg = $("#load-transac-err-msg");

// Table Constants
const $table = $("table");
const $tbody = $("tbody");
const $tableSearchInput = $("#search-table");
const $noTableResults = $("#no-search-results");
const $filterAmountSelect = $("#amount-type-select");
const $filterDateRangeSelect = $("#date-range-select");
const $filterDisplaySelect = $("#display-select");
const $searchFilters = $("#search-filters select");
const $paginationInput = $("#curr-page-input");
const $pageBtns = $("#page-buttons");
const $currPageBtn = $("#curr-page");
const $prevPrevPageBtn = $("#prev-prev-page");
const $prevPageBtn = $("#prev-page");
const $prevPageArrowBtn = $("#prev-button");
const $nextNextPageBtn = $("#next-next-page");
const $nextPageBtn = $("#next-page");
const $nextPageArrowBtn = $("#next-button");
const $totalPages = $("#total-pages");
const $currPageInput = $("#curr-page-input");

// Login Constants
const $logoutButton = $("#logout-button");
const $loginButton = $("#login-button");
const $loginEmail = $("#login-email");
const $loginPassword = $("#login-password");
const $showPasswordButton = $("#show-password");
const $loginErrAlert = $("#login-err-alert");
const $loginDismissErr = $("#login-dismiss-err");
const $loginErrMsg = $("#login-err-msg");
const $loginForm = $("#login-form");
const $passwordCapsWarning = $("#password-caps");

// Server
const authTokenCookie = "auth-token";
const URL_PROXY = "proxy.php";

// Methods and Commands and Filters Enums
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
  Amount: "amount",
  Date: "date",
  Merchant: "merchant"
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
const TransactionsInstance = (() => {
  var originalInstance; // Primary instance
  var instance; // Secondary instance filtered and periodically refreshed

  // Creates instance on the heap
  createInstance = transactions => {
    const object = new Object(transactions);
    return object;
  };

  return {
    // Fetches secondary instance object
    getInstance: transactions => {
      if (!instance) {
        instance = createInstance(transactions);
      }
      return instance;
    },
    // Creates original instance after loadTransactions
    createOriginalInstance: transactions => {
      originalInstance = createInstance(transactions);
      instance = createInstance(transactions);
      return originalInstance;
    },
    // Change secondary instance transactions
    changeInstance: transactions => {
      instance = createInstance(transactions);
    },
    // Refreshes secondary instance to original primary instance
    refreshInstance: () => {
      instance = originalInstance;
    },
    // When adding new transaction we modify original instance
    modifyOriginalInstance: transaction => {
      originalInstance.push(transaction);
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

const MIN_DATE = new Date("1900-01-01");
const MAX_DATE = new Date("2999-12-31");
