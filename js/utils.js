/**
 * @file Contains mostly atomic (isolated) utility functions called in AJAX functions and event handler functions
 * - Avoid interdependencies between functions
 * - Prevent excessive modularizaiton
 * - Consume DOM values, avoid DOM style manipulations
 */


/**
 * @description Toggles view depending on user authentication status
 * - If there is an authToken cookie set, we hide unauthenticated view and loadTransactions
 * - If there is no authToken cookie we show unauthenticated view and hide authenticated view
 */
const toggleUserView = () => {
  const authToken = Cookies.get(authTokenCookie);
  if (authToken) {
    $unauthenticatedContent.hide();
    loadTransactionsAJAX(authToken); // authenticatedContent shown within AJAX call
  } else {
    $unauthenticatedContent.show();
    $authenticatedContent.hide();
  }
};

/**
 * @description Seaches transaction table with SEARCH_QUERY against amount, date and merchant
 * - We refresh the Transactions instance each search
 * - We update the instance with the filtered instance
 */
const searchTable = () => {
  TransactionsInstance.refreshInstance(); // Refresh instance with original loaded transactions
  let newInstance = TransactionsInstance.getInstance();
  if (SEARCH_QUERY !== "") {
    newInstance = newInstance.filter(
      ({ created, merchant, amount }) =>
        created.includes(SEARCH_QUERY) ||
        merchant.toLowerCase().includes(SEARCH_QUERY) ||
        (amount / 100).toString().includes(SEARCH_QUERY)
    );
  }
  const filteredNewInstance = filterTable(newInstance); // Filter table after search
  TransactionsInstance.changeInstance(filteredNewInstance);
};

/**
 * @description Sorts transaciton table by merchant, date or amount (ascending or descending)
 *  - We use the current page instance and sort the instance in place
 */
const sortTable = () => {
  const { sortBy, ascending } = TABLE_SORT;
  const transactionsInstance = TransactionsInstance.getInstance();
  if (sortBy === Transaction.Merchant) {
    if (ascending) {
      transactionsInstance.sort((a, b) => a.merchant.localeCompare(b.merchant));
    } else {
      transactionsInstance.sort((a, b) => b.merchant.localeCompare(a.merchant));
    }
  } else if (sortBy === Transaction.Date) {
    if (ascending) {
      transactionsInstance.sort((a, b) => (a.created < b.created ? 1 : -1));
    } else {
      transactionsInstance.sort((a, b) => (b.created < a.created ? 1 : -1));
    }
  } else {
    if (ascending) {
      transactionsInstance.sort((a, b) => a.amount - b.amount);
    } else {
      transactionsInstance.sort((a, b) => b.amount - a.amount);
    }
  }

};

/**
 * @description Adds a transaction as a row to the transaction table
 * - New transactions are appended to top, otherwise append to end (loadTransactions)
 * - Add appropriate classes depending on amount for UX
 * - Highlight newly added transactions
 * @param transaction - transaction object
 * @param {boolean} [isRecentTransaction = false] - if just made from CreateTransaction form
 */
const addTableRow = (transaction, isRecentTransaction = false) => {
  const { amount, created, merchant } = transaction;
  let amountText;
  let amountClass;
  // Explicit switch stmnt over ternaries when dealing with UI branching
  if (amount !== 0) {
    if (amount > 0) {
      amountText = `+ $${Math.abs(amount / 100).toFixed(2)}`;
      amountClass = "green-text";
    } else {
      amountText = `- $${Math.abs(amount / 100).toFixed(2)}`;
      amountClass = "red-text";
    }
  } else {
    amountText = "$0.00";
    amountClass = "blue-text";
  }
  // Highlight recent transaction
  if (isRecentTransaction) {
    $("<tr>").prependTo($tbody);
    $tr = $tbody.find("tr:first");
    $tr.addClass("new-row");
  } else {
    $("<tr>").appendTo($tbody);
    $tr = $tbody.find("tr:last");
  }
  // Append date, merchant and amount
  $tr.append($("<td>").text(created.substr(0, 10)).addClass('date-col'));
  $tr.append($("<td>").text(merchant).addClass('merchant-col'));
  $tr.append(
    $("<td>")
      .text(amountText)
      .addClass(amountClass)
      .addClass('amount-col')
  );
};

/**
 * @description Render transaction table by page number along with pagination contents
 * - Use a new instance
 * - Display error message if no results found via search/filters
 * - Display pagination conditionally depending on current page number
 * @param {number} [page = 1] - page to render
 */
const renderTable = (page = 1) => {
  const transactionsInstance = TransactionsInstance.getInstance();
  if (transactionsInstance.length === 0) {
    console.log('hey')
    // Clear table and display error
    $tbody.empty();
    $noTableResults.show();
  } else {
    // Remove error and clear table
    $noTableResults.hide();
    $tbody.empty();

    // Populate table from page to table end or
    const startIndex = ROWS_PER_PAGE * (page - 1);
    const endIndex = Math.min(
      transactionsInstance.length,
      (ROWS_PER_PAGE * (page - 1)) + ROWS_PER_PAGE
    );
    for (var i = startIndex; i < endIndex; i++) {
      const transaction = transactionsInstance[i];
      addTableRow(transaction);
    }

    // Total num pages (with desired rows per page)
    const numPages = Math.ceil(transactionsInstance.length / ROWS_PER_PAGE);

    // Pagination input UI
    $("#total-pages").html(` of ${numPages}`);
    $("#curr-page-input").val(page);


    // Pagination buttons UI - conditionally rendered if in range
    const pageNum = parseInt(page);
    $("#page-buttons div").hide(); // Initially hide all buttons

    $("#curr-page")
      .html(`${page}`)
      .data("page", pageNum)
      .show();
    if (pageNum + 1 <= numPages) {
      $("#next-page")
        .html(`${pageNum + 1}`)
        .data("page", pageNum + 1)
        .show();
      $("#next-button")
        .data("page", pageNum + 1)
        .show();
    }
    if (pageNum + 2 <= numPages) {
      $("#next-next-page")
        .html(`${pageNum + 2}`)
        .data("page", pageNum + 2)
        .show();
    }
    if (pageNum - 1 >= 1) {
      $("#prev-page")
        .html(`${pageNum - 1}`)
        .data("page", pageNum - 1)
        .show();
      $("#prev-button")
        .data("page", pageNum - 1)
        .show();
    }
    if (pageNum - 2 >= 1) {
      $("#prev-prev-page")
        .html(`${pageNum - 2}`)
        .data("page", pageNum - 2)
        .show();
    }
  }
};

/**
 * @description Filter a transactionInstance with the set table filters: amount_type and created_date
 * @param {*} instance 
 */
const filterTable = instance => {
  const filterDate = $filterDateRangeSelect.children("option:selected").val();
  const filterAmountType = $filterAmountSelect.children("option:selected").val();

  let newInstance = instance;

  // Amount Type
  if (filterAmountType === FilterAmount.Neutral) {
    newInstance = newInstance.filter(({ amount }) => amount == 0);
  } else if (filterAmountType === FilterAmount.Positive) {
    newInstance = newInstance.filter(({ amount }) => amount > 0);
  } else if (filterAmountType === FilterAmount.Negative) {
    newInstance = newInstance.filter(({ amount }) => amount < 0);
  } else {
    newInstance = newInstance; // Any Type
  }

  // Transaction Created Date
  if (filterDate === FilterDate.Today) {
    newInstance = newInstance.filter(({ created }) => created === currentDate);
  } else if (filterDate === FilterDate.LastWeek) {
    let lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 30);
    lastWeek = lastWeek.toISOString().slice(0, 10);
    newInstance = newInstance.filter(
      ({ created }) => created <= currentDate && created >= lastWeek
    );
  } else if (filterDate === FilterDate.LastMonth) {
    let lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    lastMonth = lastMonth.toISOString().slice(0, 10);
    newInstance = newInstance.filter(
      ({ created }) => created <= currentDate && created >= lastMonth
    );
  } else if (filterDate === FilterDate.Future) {
    newInstance = newInstance.filter(({ created }) => created > currentDate);
  } else {
    newInstance = newInstance; // All Time
  }

  return newInstance;
};
