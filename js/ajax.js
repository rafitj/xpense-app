/**
 * This file contains all 3 AJAX calls made to the proxy
 * for this application and associated error handling
 *
 * Comments:
 *  - Use string constants over loose strings
 *  - We return the AJAX call itself so we can perform .then() if needed
 *  - The proxy can't throw an error instead the response is given an error key that we validate in success
 *  - The AJAX error is strictly to check for timeouts to prevent hanging if connection lost during call
 */

/**
 * Creates a Transaction
 * Success: Add transaction to top of table (regardless of filters/search)
 * Error: Show detailed error message
 * Timeout: Ask user to check connection
 * @param {authToken, amount, created, merchant}
 */
const createTransactionAJAX = ({ authToken, amount, created, merchant }) =>
  $.ajax({
    url: URLProxy,
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
        const data = JSON.parse(jsonRes.msg);
        const transaction = data.transactionList[0];
        addToTable(transaction, true);
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
 * Creates a Transaction
 * Success: Set cookie to response auth token and toggle view to authenticated
 * Error: Show detailed error message and shake login card
 * Timeout: Ask user to check connection
 * @param {email, password}
 */
const loginUserAJAX = ({ email, password }) =>
  $.ajax({
    url: URLProxy,
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
        $unauthenticatedView.addClass("shake-error");
        setTimeout(() => {
          $unauthenticatedView.removeClass("shake-error");
        }, 500);
      } else {
        $loginErrAlert.hide();
        toggleUserView();
      }
    },
    error: jqXHR => {
      if (jqXHR.statusText === "timeout") {
        $unauthenticatedView.addClass("shake-error");
        setTimeout(() => {
          $unauthenticatedView.removeClass("shake-error");
        }, 500);
        $loginErrMsg.html(`Please Check Network Connection`);
        $loginErrAlert.show();
      }
    }
  });

/**
 * Load All Transactions
 * Success: Create a Transactions Singleton, render transactions table, sort transaction table and show authenticated view
 * Error: Show detailed error message and prevent showing authenticated view
 * Timeout: Ask user to check connection and prevent showing authenticated view
 * @param {authToken}
 */
const loadTransactionsAJAX = authToken =>
  $.ajax({
    url: URLProxy,
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
        console.log(jsonRes.msg);
      } else {
        const data = JSON.parse(jsonRes.msg);
        Singleton.createOriginalInstance(data.transactionList);
        renderTable(1);
        sortTable();
        $authenticatedView.show();
        $logoutButton.show();
      }
    },
    error: jqXHR => {
      if (jqXHR.statusText === "timeout") {
        $loadTransactionErrMsg.html(`Please Check Network Connection`);
        $loadTransactionErrAlert.show();
      }
    }
  });
