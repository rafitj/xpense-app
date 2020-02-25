const currentDate = new Date().toISOString().slice(0, 10)

// Views Constants
const $unauthenticatedView = $('#loginContent')
const $authenticatedView = $('#viewContent')
const $loader = $('#loader')

// Create Transaction Constants
const $transactionAmount = $('#transaction-amount')
const $transactionCreated = $('#transaction-created')
const $transactionMerchant = $('#transaction-merchant')
const $addTransactionButton = $('#add-transaction')
const $resetTransaction = $('#reset-transaction')
const $addTransactionErrAlert = $('#add-transac-err-alert')
const $addTransactionDismissErr = $('#add-transac-dismiss-err')
const $addTransactionErrMsg = $('#add-transac-err-msg')

const $loadTransactionErrAlert = $('#load-transac-err-alert')
const $loadTransactionErrMsg = $('#load-transac-err-msg')

// Login Consta$nts
const $logoutButton = $('#logout-button')
const $loginButton = $('#login-button')
const $loginEmail = $('#login-email')
const $loginPassword = $('#login-password')
const $showPasswordButton = $('.show-password')
const $loginErrAlert = $('#login-err-alert')
const $loginDismissErr = $('#login-dismiss-err')
const $loginErrMsg = $('#login-err-msg')

// Server
const authTokenCookie = 'auth-token'
const URLProxy = 'proxy.php'

// Methods and Commands
const Methods = {
    POST: 'POST',
    GET: 'GET',
}

const Commands = {
    Get: 'Get',
    CreateTransaction: 'CreateTransaction',
    Authenticate: 'Authenticate'
}

// Data
const Singleton = (() => {
    var instance;
 
     createInstance = (data) => {
        const object = new Object(data);
        return object;
    }

 
    return {
        getInstance: (data) => {
            if (!instance) {
                instance = createInstance(data);
            }
            return instance;
        }
    };
})();
 
const perPage = 100
