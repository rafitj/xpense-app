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

    var $table = $('table'),
    $bodyCells = $table.find('tbody tr:first').children(),
    colWidth;

    colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();

    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    });  

    $('#password-caps').hide()
    toggleUserView() // Choose view
    toggleLoginButton()
    $transactionCreated.val(currentDate) // Set new transaction default date
})

$(window).resize(function() {
    var $table = $('table'),
    $bodyCells = $table.find('tbody tr:first').children(),
    colWidth;

    console.log

    colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();

    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    });  

}).resize();


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

let query = ''
// Custom Paginated Table
$('#search-table').keyup(()=>{
    query = $('#search-table').val().toLowerCase()
    makeSearch()
    renderTable(1)
})

const makeSearch = () => {
    Singleton.refreshInstance()
    const newInstance = Singleton.getInstance().filter((page)=>
        page.created.includes(query) || page.merchant.toLowerCase().includes(query) || 
        (page.amount/100).toString().includes(query)
    )
    Singleton.changeInstance(newInstance)
}

let currSort = {
    sortBy: 'Merchant',
    ascending: true
}
const sortTable = () => {
    const {sortBy, ascending} = currSort
    const pageInstance = Singleton.getInstance()
    if (sortBy==='Merchant') {
        if(ascending) pageInstance.sort((a,b)=>a.merchant.localeCompare(b.merchant))
        else pageInstance.sort((a,b)=>b.merchant.localeCompare(a.merchant))
    } else if (sortBy ==="Date") {
        if(ascending) pageInstance.sort((a,b)=>a.created < b.created ? 1 : -1)
        else pageInstance.sort((a,b)=>b.created < a.created ? 1 : -1)
    } else {
        if(ascending) pageInstance.sort((a,b)=>a.amount-b.amount)
        else pageInstance.sort((a,b)=>b.amount-a.amount)
    }
    renderTable(1)
}
$('thead tr th').click((e)=>{
    const sortBy = $(e.target).attr('sort-by');
    const isToggleSort = sortBy===currSort.sortBy
    if(isToggleSort) {
        currSort = {...currSort, ascending: !currSort.ascending}
    }
    else {
        currSort = {sortBy, ascending: true}
    }
    sortTable()
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
        amountClass = 'blue-text'
    }
    if (isNew) {
        $('<tr>').prependTo($('tbody'));
        $tr = $('tbody').find('tr:first');
        $tr.addClass('new-row')
    } else {
        $('<tr>').appendTo($('tbody'));
        $tr = $('tbody').find('tr:last');
    }
    $tr.append($('<td>').text(created.substr(0,10)));
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
    $('#curr-page').html(`${page}`).data("page",parseInt(page)).show()
    if(parseInt(page)+1 <= numPages) {
        $('#next-page').html(`${parseInt(page)+1}`).data("page",parseInt(page)+1).show()
        $('#next-button').data("page",parseInt(page)+1).show()
    } 
    if (parseInt(page)+2 <= numPages) {
        $('#next-next-page').html(`${parseInt(page)+2}`).data("page",parseInt(page)+2).show()
    }
    if(parseInt(page)-1 >= 1) {
        $('#prev-page').html(`${parseInt(page)-1}`).data("page",parseInt(page)-1).show()
        $('#prev-button').data("page",parseInt(page)-1).show()
    } 
    if (parseInt(page)-2 >= 1) {
        $('#prev-prev-page').html(`${parseInt(page)-2}`).data("page",parseInt(page)-2).show()
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
    const amount = parseInt($transactionAmount.val())
    if (amount < 0) {
        $('#transaction-amount-paid').click()
    }
    $transactionAmount.val(Math.abs(amount).toFixed(2))
})


// Filtering
$('select').change(()=>{
    makeSearch()
    perPage = $('#display-select option:selected').val()

    const instance = Singleton.getInstance()
    const time = $('#time-select option:selected').val()
    const type = $('#type-select option:selected').val()

    let newInstance = instance
    // Type
    if (type === 'Neutral') {
        newInstance = newInstance.filter(({amount}) => amount == 0 )
    } else if (type === 'Positive') {
        newInstance = newInstance.filter(({amount}) => amount > 0 )
    } else if (type === 'Negative') {
        newInstance = newInstance.filter(({amount}) => amount < 0 )
    } else {
        newInstance = newInstance
    }

    // Date
    if (time === 'Today') {
        newInstance = newInstance.filter(({created}) => created === currentDate)
    } else if (time === 'LastWeek') {
        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 30);
        lastWeek = lastWeek.toISOString().slice(0, 10)
        newInstance = newInstance.filter(({created}) => created <= currentDate && created >= lastWeek )
    } else if (time === 'LastMonth') {
        var lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        lastMonth = lastMonth.toISOString().slice(0, 10)
        newInstance = newInstance.filter(({created}) => created <= currentDate && created >= lastMonth)
    }  else if (time === 'Future') {
        newInstance = newInstance.filter(({created}) => created > currentDate )
    } else {
        newInstance = newInstance
    }
    

    Singleton.changeInstance(newInstance)
    renderTable(1)
})