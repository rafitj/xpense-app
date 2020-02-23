/**
 * jQuery General Standards Comments
 * - Define constants for selectors to avoid mistypes
 * - Clearly define variables readability > conciseness
 * - Use utility functions sparingly and for readability
 * - Pass function paramaters as objects to avoid ordering issues
 * - Always try and use const over let/var
 * - Keep $(document).ready() light
 * - Use arrow functions for performance/reduced clutter
 */

// Loader
$(document)
  .ajaxStart(() => {
    $loader.show()
  })
  .ajaxStop(() => {
    $loader.hide()
  })

// Document
$(document).ready(()=>{
    $loader.hide()  // Hide it initially
    $loginErrAlert.hide()
    $addTransactionErrAlert.hide()
    $authenticatedView.hide()
    $unauthenticatedView.hide()


    $('#password-caps').hide()
    toggleUserView() // Choose view
    toggleLoginButton()
    $transactionCreated.val(currentDate) // Set new transaction default date
})

// Checks Cookies and presents view
const toggleUserView = () => {
    if (Cookies.get(authTokenCookie)){
        const authToken = Cookies.get(authTokenCookie)
        loadTransactionsAJAX(authToken)
        $unauthenticatedView.hide()
    } else {
        $unauthenticatedView.show()
        $authenticatedView.hide()
        $logoutButton.hide()
    }
}

const toggleLoginButton = () => {
    const email = $loginEmail.val()
    const password = $loginPassword.val()
    if (email === '' || password === '') {
        $loginButton.prop('disabled', true);
    } else {
        $loginButton.prop('disabled', false);
    }
}

// Add Transaction Event Handler
$addTransactionButton.click(()=>{
    const authToken = Cookies.get(authTokenCookie)
    const amount = $transactionAmount.val() * 100
    const created = $transactionCreated.val()
    const merchant = $transactionMerchant.val()
    createTransactionAJAX({authToken,amount,created,merchant})
})

// Reset Transaction form Handler
$resetTransaction.click(()=>{
    $transactionAmount.val('')
    $transactionCreated.val(currentDate)
    $transactionMerchant.val('')
})

// Login User Event Handler
$loginButton.click(()=>{
    const email = $loginEmail.val()
    const password = $loginPassword.val()
    loginUserAJAX({email,password})
})

// Login Utilities
$loginPassword.keyup((e)=>{
    if (e.originalEvent.getModifierState("CapsLock")) {
        $('#password-caps').show()
      } else {
        $('#password-caps').hide()
      }
})

$('#loginForm input').keyup((event)=>{
    toggleLoginButton()
    if (event.keyCode === 13) {
        event.preventDefault();
        $loginButton.click();
    }
})

$showPasswordButton.click(()=>{
    const passwordBox = $loginPassword[0]
    if (passwordBox.type === "password") {
        passwordBox.type = "text"
        $showPasswordButton.html('<i class="fas fa-eye-slash"></i> Hide')
    } else {
        passwordBox.type = "password"
        $showPasswordButton.html('<i class="fas fa-eye"></i> Show')
    }
})

$addTransactionDismissErr.click(()=>{
    $addTransactionErrAlert.hide()
})


$loginDismissErr.click(()=>{
    $loginErrAlert.hide()
})


// Logout User
$logoutButton.click(()=>{
    Cookies.remove(authTokenCookie)
    toggleUserView()
})

// Custom Paginated Table
const renderTable = (page) => {
    const pageInstance = Singleton.getInstance()
    const numPagesPer = pageInstance.length/110
    for(var i = 0; i < numPagesPer*page; i++){
        const transaction = pageInstance[i]
        const {amount,created,merchant} = transaction
        $('<tr>').appendTo($('tbody'));
        $tr = $('tbody').find('tr:last');
        $tr.append($('<td>').text(created));
        $tr.append($('<td>').text(merchant));
        $tr.append($('<td>').text(amount/100));
    }
    for(var i = 0; i < numPagesPer; i++){
        $('#dropdown-content').append(`<p class = "table-page" id = "page-${i}" >${i}</p>`)
    }
}

// Custom Table Lazy Loading on Scroll
// $('tbody').scroll((e)=>{
//     const tableRowHeight = $('tbody tr').height()
//     const tableBodyHeight = $('tbody').height()
//     const numRowsInView = Math.ceil(tableBodyHeight/tableRowHeight)
//     const scrollPos = $('tbody').scrollTop()
//     const viewStart = Math.floor(scrollPos/tableRowHeight)
//     const viewEnd = viewStart+numRowsInView

//     console.log(viewStart,viewEnd)
// })