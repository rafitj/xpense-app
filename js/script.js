/**
 * This file contains all jQuery event handling and associated
 * DOM manipulation
 *
 * Comments:
 * - Avoid declaring non-event handler functions (place those in utilities.js)
 * - Define constants for selectors to avoid mistypes
 * - Clearly define variables readability > conciseness
 * - Use utility functions sparingly and for readability
 * - Pass function paramaters as objects to avoid ordering issues
 * - Always try and use const over let/var
 * - Keep $(document).ready() light
 * - Use arrow functions for performance/reduced clutter
 */

// Loader shows and hides on every AJAX call
$(document)
  .ajaxStart(() => {
    $loader.show();
  })
  .ajaxStop(() => {
    $loader.hide();
  });

// Document
$(document).ready(() => {
  // Hide contnet initially
  $loader.hide();
  $allErrAlerts.hide();
  $authenticatedContent.hide();
  $unauthenticatedContent.hide();

  toggleUserView(); // Choose view
  
  $transactionCreated.val(currentDate); // Set new transaction default date to today
});

/**
 * Login
 */

// Login User Event
$loginButton.click(() => {
  const email = $loginEmail.val();
  const password = $loginPassword.val();
  loginUserAJAX({ email, password });
});

// Login Utilities
$loginPassword.keyup(e => {
  if (e.originalEvent.getModifierState("CapsLock")) {
    $passwordCapsWarning.show();
  } else {
    $passwordCapsWarning.hide();
  }
});

$("#loginForm input").keyup(event => {
  if (event.keyCode === 13) {
    event.preventDefault();
    $loginButton.click();
  }
});

$showPasswordButton.click(() => {
  const passwordBox = $loginPassword[0];
  if (passwordBox.type === "password") {
    passwordBox.type = "text";
    $showPasswordButton.html('<i class="fas fa-eye-slash"></i> Hide');
  } else {
    passwordBox.type = "password";
    $showPasswordButton.html('<i class="fas fa-eye"></i> Show');
  }
});

$loginDismissErr.click(() => {
  $loginErrAlert.hide();
});


/**
 * Create Transaction
 */

// Add Transaction Event Handler
$addTransactionButton.click(() => {
  if ($.isNumeric($transactionAmount.val())) {
    const authToken = Cookies.get(authTokenCookie);
    const amount =
      Math.round(parseFloat($transactionAmount.val()) * 100) *
      (transactionType === "earned" ? -1 : 1);
    const created = $transactionCreated.val();
    const merchant = $transactionMerchant.val();
    createTransactionAJAX({ authToken, amount, created, merchant });
  } else {
    $addTransactionErrMsg.html(`Enter Valid Amount`);
    $addTransactionErrAlert.show();
    $transactionAmount.val("");
  }
});

// Reset Transaction Form
$resetTransaction.click(() => {
  $transactionAmount.val("");
  $transactionCreated.val(currentDate);
  $transactionMerchant.val("");
});

$("#addTransactionForm form input").keyup(event => {
  if (event.keyCode === 13) {
    event.preventDefault();
    $addTransactionButton.click();
  }
});

$addTransactionDismissErr.click(() => {
  $addTransactionErrAlert.hide();
});


/**
 * Logout
 */
$logoutButton.click(() => {
  Cookies.remove(authTokenCookie);
  toggleUserView();
});



// Custom Paginated Table
$("#search-table").keyup(() => {
  SEARCH_QUERY = $("#search-table")
    .val()
    .toLowerCase();
  searchTable();
  renderTable();
});

$("thead tr th").click(e => {
  const sortBy = $(e.target).attr("sort-by");
  const isToggleSort = sortBy === TABLE_SORT.sortBy;
  if (isToggleSort) {
    TABLE_SORT = { ...TABLE_SORT, ascending: !TABLE_SORT.ascending };
  } else {
    TABLE_SORT = { sortBy, ascending: true };
  }
  sortTable();
  renderTable();
});

$("#curr-page-input").change(() => {
  let page = $("#curr-page-input").val();
  const pageInstance = Singleton.getInstance();
  const numPages = Math.ceil(pageInstance.length / ROWS_PER_PAGE);
  if (page > numPages) {
    $("#curr-page-input").val(numPages);
    page = numPages;
  } else if (page < 1) {
    $("#curr-page-input").val(1);
    page = 1;
  }
  renderTable(page);
});

$("#curr-page-input").keyup(() => {
  let page = $("#curr-page-input").val();
  const pageInstance = Singleton.getInstance();
  const numPages = Math.ceil(pageInstance.length / ROWS_PER_PAGE);
  if (page > 0 && page <= numPages) {
    renderTable(page);
  }
});

$("#page-buttons div").click(e => {
  const clickedPage = $(e.currentTarget).data("page");
  renderTable(parseInt(clickedPage));
});

// Custom Table Lazy Loading on Scroll

let transactionType = "paid";
$("#transaction-amount-paid").click(() => {
  $("#transaction-amount-paid").removeClass("disabled-amount");
  transactionType = "paid";
  $("#transaction-amount-earned").addClass("disabled-amount");
});

$("#transaction-amount-earned").click(() => {
  $("#transaction-amount-earned").removeClass("disabled-amount");
  transactionType = "earned";
  $("#transaction-amount-paid").addClass("disabled-amount");
});

// Prevent negative numbers
$transactionAmount.change(() => {
  if ($.isNumeric($transactionAmount.val())) {
    const amount = parseFloat($transactionAmount.val());
    $addTransactionErrAlert.hide();
    if (amount < 0) {
      $("#transaction-amount-paid").click();
    }
    $transactionAmount.val(Math.abs(amount).toFixed(2));
  } else {
    $addTransactionErrMsg.html(`Enter Valid Amount`);
    $addTransactionErrAlert.show();
    $transactionAmount.val("");
  }
});

// Filtering
$("select").change(() => {
  searchTable();
  ROWS_PER_PAGE = parseInt($("#display-select option:selected").val());
  const instance = Singleton.getInstance();

  const newInstance = filterTable(instance);

  Singleton.changeInstance(newInstance);
  renderTable();
});
