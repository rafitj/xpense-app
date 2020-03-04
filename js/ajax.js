/**
 * @file Performs all 3 AJAX calls made to the proxy and associated error handling
 *  - We return the AJAX call itself so we can perform .then() if needed
 *  - The proxy can't throw an error instead the response is given an error key that we validate in success
 *  - The AJAX error is strictly to check for timeouts to prevent hanging if connection lost during call
 */

/**
 * @description Creates a Transaction
 * Success: Add transaction to top of table (regardless of filters/search) and reset form
 * Error: Show detailed error message
 * Timeout: Ask user to check connection after 5 seconds
 * @param {authToken, amount, created, merchant} transaction 
 */
const createTransactionAJAX = async ({ authToken, amount, created, merchant }) =>
  $.ajax({
    url: URL_PROXY,
    method: Methods.POST,
    data: {
      command: Commands.CreateTransaction,
      created,
      amount,
      merchant,
      authToken
    },
    timeout: 5000,
    success: res => {
      const jsonRes = JSON.parse(res);
      if (jsonRes.error) {
        $addTransactionErrMsg.html(
          `<i class="fas fa-exclamation-triangle"></i>  ${jsonRes.msg}`
        );
        $addTransactionErrAlert.show();
      } else {
        $addTransactionErrAlert.hide();
        const jsonData = JSON.parse(jsonRes.msg);
        const transaction = jsonData.transactionList[0];
        addTableRow(transaction, isRecentTransaction = true);
        $resetTransaction.click();
      }
    },
    error: jqXHR => {
      if (jqXHR.statusText === "timeout") {
        $addTransactionErrMsg.html(`Please Check Network Connection`);
        $addTransactionErrAlert.show();
      }
    }
  });

/**
 * @description Creates a Transaction
 * Success: Set session cookie to response auth token and toggle view to authenticated
 * Error: Show detailed error message and shake login card
 * Timeout: Ask user to check connection after 5 seconds
 * @param {email, password} loginCredentials
 * @async
 */
const loginUserAJAX = async ({ email, password }) =>
  $.ajax({
    url: URL_PROXY,
    method: Methods.POST,
    data: {
      command: Commands.Authenticate,
      partnerUserID: email,
      partnerUserSecret: password
    },
    timeout: 5000,
    success: res => {
      const jsonRes = JSON.parse(res);
      if (jsonRes.error) {
        $loginErrMsg.html(
          `<i class="fas fa-exclamation-triangle"></i> &nbsp; ${jsonRes.msg}`
        );
        $loginErrAlert.show();
        $unauthenticatedContent.addClass("shake-error");
        setTimeout(() => {
          $unauthenticatedContent.removeClass("shake-error");
        }, 500);
      } else {
        const jsonData = JSON.parse(jsonRes.msg);
        Cookies.set(authTokenCookie, jsonData.authToken)
        $loginErrAlert.hide();
        toggleUserView();
      }
    },
    error: jqXHR => {
      if (jqXHR.statusText === "timeout") {
        $unauthenticatedContent.addClass("shake-error");
        setTimeout(() => {
          $unauthenticatedContent.removeClass("shake-error");
        }, 500);
        $loginErrMsg.html(`Please Check Network Connection`);
        $loginErrAlert.show();
      }
    }
  });

/**
 * @description Load All Transactions
 * Success: Create a Transactions Singleton, render transactions table, sort transaction table and show authenticated view
 * Error: Show detailed error message and prevent showing authenticated view
 * Timeout: Ask user to check connection and prevent showing authenticated view after 12 seconds
 * @param {authToken}
 * @async
 */
const loadTransactionsAJAX = async authToken =>
  $.ajax({
    url: URL_PROXY,
    method: Methods.GET,
    data: {
      command: Commands.Get,
      authToken,
      returnValueList: "transactionList"
    },
    timeout: 12000,
    success: res => {
      const jsonRes = JSON.parse(res);
      if (jsonRes.error) {
        $loadTransactionErrMsg.html(`Failed To Load Transactions`);
        $loadTransactionErrAlert.show();
      } else {
        const jsonData = JSON.parse(jsonRes.msg);
        TransactionsInstance.createOriginalInstance(jsonData.transactionList);
        sortTable();
        renderTable();
        $authenticatedContent.show();
      }
    },
    error: jqXHR => {
      if (jqXHR.statusText === "timeout") {
        $loadTransactionErrMsg.html(`Please Check Network Connection`);
        $loadTransactionErrAlert.show();
      }
    }
  });
