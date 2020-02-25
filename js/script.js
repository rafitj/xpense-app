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
    $logoutButton.hide()
    $addTransactionErrAlert.hide()
    $loadTransactionErrAlert.hide()
    $authenticatedView.hide()
    $unauthenticatedView.hide()
    $('#transaction-amount-earned').addClass('disabled-amount')


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
    const noEmail = $loginEmail.val() === ''
    const noPassword = $loginPassword.val() === ''
    const autofillEmail = $('#login-email:-webkit-autofill').length > 0 
    const autofillPass = $('#login-password:-webkit-autofill').length > 0 
    if (autofillEmail || !noEmail) {
        $loginButton.prop('disabled', false);
    } else if (autofillPass || !noPassword) {
        $loginButton.prop('disabled', false);
    } else {
        $loginButton.prop('disabled', true);
    }
}

// Add Transaction Event Handler
$addTransactionButton.click(()=>{
    const authToken = Cookies.get(authTokenCookie)
    const amount = $transactionAmount.val() * 100 * (transactionType === 'earned' ? -1 : 1)
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

let currSort
// Custom Paginated Table
$('#search-table').keyup(()=>{
    const query = $('#search-table').val().toLowerCase()
    // const newInstance = Singleton.getInstance().filter((page)=>
    //     page.created.includes(query) || page.merchant.toLowerCase().includes(query)
    // )
    // const pageInstance = Singleton.newInstance(newInstance)
    // renderTable(1)
})
$('thead tr th').click((e)=>{
    const sortBy = e.target.innerText;
    const pageInstance = Singleton.getInstance()
    const isToggleSort = sortBy===currSort
    if (sortBy==='Merchant') {
        if(isToggleSort) pageInstance.sort((a,b)=>a.merchant.localeCompare(b.merchant))
        else pageInstance.sort((a,b)=>b.merchant.localeCompare(a.merchant))
    } else if (sortBy ==="Date") {
        if(isToggleSort) pageInstance.sort((a,b)=>a.created < b.created ? 1 : -1)
        else pageInstance.sort((a,b)=>b.created < a.created ? 1 : -1)
    } else {
        if(isToggleSort) pageInstance.sort((a,b)=>a.amount-b.amount)
        else pageInstance.sort((a,b)=>b.amount-a.amount)
    }
    currSort = sortBy
    renderTable(1)
})
$('#cur-page-input').change(()=>{
    let page = $('#cur-page-input').val()
    const pageInstance = Singleton.getInstance()
    const numPages = Math.ceil(pageInstance.length/perPage)
    if (page > numPages) {
        $('#cur-page-input').val(numPages)
        page = numPages
    } else if (page < 1) {
        $('#cur-page-input').val(1)
        page = 1
    }
    renderTable(page)
})
$('#cur-page-input').keyup(()=>{
    let page = $('#cur-page-input').val()
    const pageInstance = Singleton.getInstance()
    const numPages = Math.ceil(pageInstance.length/perPage)
    if (page > 0 && page <= numPages) {
        renderTable(page)
    }
})

const addToTable = (transaction, isNew) => {
    const {amount,created,merchant} = transaction
    let amountText
    let amountClass
    if (amount !== 0) {
        amountText = `${amount > 0 ? '+ ': '- '}$${Math.abs(amount/100).toFixed(2)}`
        amountClass = amount > 0 ? 'green-text' : 'red-text'
    } else {
        amountText = '$0.00'
        amountClass = 'yellow-text'
    }
    if (isNew) {
        $('<tr>').prependTo($('tbody'));
        $tr = $('tbody').find('tr:first');
        $tr.addClass('new-row')
    } else {
        $('<tr>').appendTo($('tbody'));
        $tr = $('tbody').find('tr:last');
    }
    $tr.append($('<td>').text(created));
    $tr.append($('<td>').text(merchant));
    $tr.append($('<td>').text(amountText).addClass(amountClass))

}

const renderTable = (page) => {
    const pageInstance = Singleton.getInstance()
    const numPages = Math.ceil(pageInstance.length/perPage)
    // Pagination
    $('#total-pages').html(` of ${numPages}`)
    $('#cur-page-input').val(page)
    $('tbody').empty()
    const start = perPage*(page-1);
    const end = Math.min(pageInstance.length, perPage*(page-1)+perPage)
    for(var i = start; i < end; i++){
        const transaction = pageInstance[i]
        addToTable(transaction, false)

    }

    $('#page-buttons div').hide()

    // Buttons
    $('#curr-page').html(`${page}`).show()
    if(parseInt(page)+1 <= numPages) {
        $('#next-page').html(`${parseInt(page)+1}`).data("page",page+1).show()
        $('#next-button').data("page",page+1).show()
    } 
    if (parseInt(page)+2 <= numPages) {
        $('#next-next-page').html(`${parseInt(page)+2}`).data("page",page+2).show()
    }
    if(parseInt(page)-1 >= 1) {
        $('#prev-page').html(`${parseInt(page)-1}`).data("page",page-1).show()
        $('#prev-button').data("page",page-1).show()
    } 
    if (parseInt(page)-2 >= 1) {
        $('#prev-prev-page').html(`${parseInt(page)-2}`).data("page",page-2).show()
    }
}

$('#page-buttons div').click((e)=>{
    const clickedPage = $(e.currentTarget).data('page')
    renderTable(clickedPage)
})

// Custom Table Lazy Loading on Scroll

let transactionType = 'paid'
$('#transaction-amount-paid').click(()=>{
    $('#transaction-amount-paid').removeClass('disabled-amount')
    transactionType = 'paid'
    $('#transaction-amount-earned').addClass('disabled-amount')
})

$('#transaction-amount-earned').click(()=>{
    $('#transaction-amount-earned').removeClass('disabled-amount')
    transactionType = 'earned'
    $('#transaction-amount-paid').addClass('disabled-amount')

})

// Prevent negative numbers
$transactionAmount.change(()=>{
    const amount = $transactionAmount.val()
    if (amount < 0) {
        $('#transaction-amount-paid').click()
        $transactionAmount.val(Math.abs(amount))
    }
})