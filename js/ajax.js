/**
 * @file Performs all 3 AJAX calls made to the proxy and associated error handling
 */

/**
 * @description Creates a Transaction
 * Success: Add transaction to top of table (regardless of filters/search) and modify Transaction Instance
 * Timeout: Ask user to check connection after 5 seconds
 * @param {authToken, amount, created, merchant} transaction
 * @async
 */
const createTransactionAJAX = async ({
  authToken,
  amount,
  created,
  merchant
}) =>
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
      const jsonData = JSON.parse(res);
      const transaction = jsonData.transactionList[0];
      TransactionsInstance.modifyOriginalInstance(transaction);
      addTableRow(transaction, (isRecentTransaction = true));
    }
  });

/**
 * @description Creates a Transaction
 * Success: Set session cookie to response auth token
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
      const jsonData = JSON.parse(res);
      Cookies.set(AUTH_TOKEN_COOKIE, jsonData.authToken);
    }
  });

/**
 * @description Load All Transactions
 * Success: Create a Transactions Singleton (original)
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
      const jsonData = JSON.parse(res);
      TransactionsInstance.createOriginalInstance(jsonData.transactionList);
    }
  });
