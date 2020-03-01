// Current Date: Used as default add transaction date and filters
const currentDate = new Date().toISOString().slice(0, 10);

// Main Views Constants
const $unauthenticatedView = $("#loginContent");
const $authenticatedView = $("#viewContent");
const $loader = $("#loader");

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

// Login Consta$nts
const $logoutButton = $("#logout-button");
const $loginButton = $("#login-button");
const $loginEmail = $("#login-email");
const $loginPassword = $("#login-password");
const $showPasswordButton = $(".show-password");
const $loginErrAlert = $("#login-err-alert");
const $loginDismissErr = $("#login-dismiss-err");
const $loginErrMsg = $("#login-err-msg");
const $passwordCapsWarning = $("#password-caps");

// Server
const authTokenCookie = "auth-token";
const URLProxy = "proxy.php";

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

let perPage = 100;
