/**
 * @file Handles all jQuery events and associated DOM manipulations
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

// Document on Ready
$(document).ready(() => {
  // Hide all content initially
  $loader.hide();
  $alerts.hide();
  $authenticatedContent.hide();
  $unauthenticatedContent.hide();

  // Choose view
  toggleUserView();

  // Set new transaction default date to today
  $transactionCreated.val(currentDate);
});

/**
 *  LOGIN EVENTS
 */

// Login User Event
$loginButton.click(() => {
  const email = $loginEmail.val();
  const password = $loginPassword.val();
  loginUserAJAX({ email, password });
});

// Allow submit on "Enter"
$loginForm.children("input").keyup(event => {
  if (event.keyCode === 13) {
    event.preventDefault();
    $loginButton.click();
  }
});

// Indicate capslock when enteirng passowrd
$loginPassword.keyup(e => {
  if (e.originalEvent.getModifierState("CapsLock")) {
    $passwordCapsWarning.show();
  } else {
    $passwordCapsWarning.hide();
  }
});

// Allow show/hide password
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

// Dismiss login error alert
$loginDismissErr.click(() => {
  $loginErrAlert.hide();
});

/**
 *  CREATE TRANSACTION EVENTS
 */

// Add Transaction
$addTransactionButton.click(() => {
  // Minimum input validation since API sends general response
  const isValidAmount = $.isNumeric($transactionAmount.val()); 
  const isValidDate = MIN_DATE <= Date.parse($transactionCreated.val()) && Date.parse($transactionCreated.val()) <= MAX_DATE
  const isValidMerchant = $transactionMerchant.val().trim().length > 0
  if (!isValidAmount) {
    $addTransactionErrMsg.html("Enter Valid Amount");
    $addTransactionErrAlert.show();
  } else if (!isValidDate) {
    $addTransactionErrMsg.html("Enter Date from 1900-01-01 to 2999-12-31");
    $addTransactionErrAlert.show();

  } else if (!isValidMerchant) {
    $addTransactionErrMsg.html("Enter Non-Empty Merchant Name");
    $addTransactionErrAlert.show();
  }
  else {
    const authToken = Cookies.get(authTokenCookie);
    const amountValue = Math.round(parseFloat($transactionAmount.val()) * 100);

    // Depending on "earned"/"paid" select amount sign
    const amount = amountValue * (TRANSACTION_TYPE === TransactionType.Earned ? -1 : 1); 
    const created = $transactionCreated.val();
    const merchant = $transactionMerchant.val();
    createTransactionAJAX({ authToken, amount, created, merchant });
  }
});

// Reset Transaction Form
$resetTransaction.click(() => {
  $transactionAmount.val("");
  $transactionCreated.val(currentDate);
  $transactionMerchant.val("");
});

// Set TransactionType to Paid (negative or zero dollar transaction)
$transactionAmountPaidBtn.click(() => {
  $transactionAmountPaidBtn.removeClass("disabled-amount");
  TRANSACTION_TYPE = TransactionType.Paid;
  $transactionAmountEarnedBtn.addClass("disabled-amount");
});

// Set TransactionType to Earned (positive or zero dollar transaction)
$transactionAmountEarnedBtn.click(() => {
  $transactionAmountEarnedBtn.removeClass("disabled-amount");
  TRANSACTION_TYPE = TransactionType.Earned;
  $transactionAmountPaidBtn.addClass("disabled-amount");
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

// Allow submit on "Enter"
$addTransactionForm.children("form input").keyup(event => {
  if (event.keyCode === 13) {
    event.preventDefault();
    $addTransactionButton.click();
  }
});

// Dismiss create transaction err alert
$addTransactionDismissErr.click(() => {
  $addTransactionErrAlert.hide();
});

/**
 * LOGOUT EVENT
 */

// Logout - remove cookie and refresh view
$logoutButton.click(() => {
  Cookies.remove(authTokenCookie);
  toggleUserView();
});

/**
 * Table Filter and Searching
 */

// Search table on search input keyup
$("#search-table").keyup(() => {
  SEARCH_QUERY = $("#search-table")
    .val()
    .toLowerCase();
  searchTable();
  renderTable();
});

// Sort table based on selected column and bolden column
$("thead tr th").click(e => {
  const sortBy = $(e.target)
    .attr("sort-by")
    .toLowerCase();
  const isToggleSort = sortBy === TABLE_SORT.sortBy;
  if (isToggleSort) {
    TABLE_SORT = { ...TABLE_SORT, ascending: !TABLE_SORT.ascending };
  } else {
    TABLE_SORT = { sortBy, ascending: true };
  }
  sortTable();
  renderTable();
  $(`.${sortBy}-col`).css("font-weight", "bold");
});

// Jump table page on input
$paginationInput.change(() => {
  let page = $paginationInput.val();
  const pageInstance = TransactionsInstance.getInstance();
  const numPages = Math.ceil(pageInstance.length / ROWS_PER_PAGE);
  if (page > numPages) {
    $paginationInput.val(numPages);
    page = numPages;
  } else if (page < 1) {
    $paginationInput.val(1);
    page = 1;
  }
  renderTable(page);
});

// Jump table page on input
$paginationInput.keyup(() => {
  let page = $paginationInput.val();
  const pageInstance = TransactionsInstance.getInstance();
  const numPages = Math.ceil(pageInstance.length / ROWS_PER_PAGE);
  if (page > 0 && page <= numPages) {
    renderTable(page);
  }
});

// Traverse pages via buttons to render associated page
$pageButtons.click(e => {
  const clickedPage = $(e.currentTarget).data("page");
  renderTable(parseInt(clickedPage));
});

// Update table filtering on filter option change
$searchFilters.change(() => {
  searchTable(); // We research with current global SEARCH_QUERY to get correct transaction instance

  ROWS_PER_PAGE = parseInt($filterDisplaySelect.children("option:selected").val()); // Update rows to display per page

  const instance = TransactionsInstance.getInstance();

  // Filter table and rerender table
  const newInstance = filterTable(instance);
  TransactionsInstance.changeInstance(newInstance);
  renderTable();
});
