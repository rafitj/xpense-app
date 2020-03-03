<!-- Load Transaction Error -->
<div class="alert center" id="load-transac-err-alert">
    <div id="load-transac-err-msg"></div>
</div>


<!-- Authenticated View Content -->
<div id="viewContent">
    <!-- Transaction Table -->
    <div id="transactionTable">
        <h2>My Transactions</h2>
        <!-- Table Search -->
        <input class="form_input" id="search-table" type="text" placeholder="Search Transactions By Merchant, Date or Amount...">
        <!-- Table Filters -->
        <div id="search-filters">
            Date Transacted:
            <select class="filter-select" id="time-select">
                <option value="AllTime">All Time </option>
                <option value="Today">Today </option>
                <option value="LastWeek">Last Week </option>
                <option value="LastMonth">Last Month </option>
            </select>
            Transaction Type:
            <select class="filter-select" id="type-select">
                <option value="AllTypes">All Types </option>
                <option value="Positive">Positive </option>
                <option value="Negative">Negative </option>
                <option value="Neutral">Neutral </option>
            </select>
            Display:
            <select class="filter-select" id="display-select">
                <option value=100>100 rows</option>
                <option value=50>50 rows</option>
                <option value=10>10 rows</option>
            </select>
        </div>
        <!-- Table Data -->
        <div class="tableview">
            <div class="tableview-holder">
                <table id="main-table">
                    <thead>
                        <tr>
                            <th sort-by="Date"></th>
                            <th sort-by="Merchant"></th>
                            <th sort-by="Amount"></th>
                        </tr>
                    </thead>
                    <tbody id="transactionTableBody"></tbody>
                </table>
                <div id="no-search-results">Oops! No Transactions Found.</div>
            </div>
        </div>
        <!-- Table Pages/Button -->
        <div id="table-pages">
            <!-- Pages Buttons -->
            <div id="page-buttons">
                <div id="prev-button">
                    <i class="fas fa-angle-left"></i>
                </div>
                <div id="prev-prev-page"></div>
                <div id="prev-page"></div>
                <div id="curr-page"></div>
                <div id="next-page"></div>
                <div id="next-next-page"></div>
                <div id="next-button">
                    <i class="fas fa-angle-right"></i>
                </div>
            </div>
            <!-- Pages Via Input -->
            <div id="jump-pages-input">
                Go to page <input id="curr-page-input" min="1" type="number">
                <p id="total-pages"></p>
            </div>
        </div>
    </div>

    <!-- Add Transaction Form -->
    <div id="addTransactionForm">
        <h2>Add Transaction</h2>
            <form method="POST">
                <div class="transactionElement">
                    <label class="form_label" for="transaction-merchant">Merchant </label>
                    <input class="form_input" id="transaction-merchant" placeholder="Flower Shop" type="text"></input>
                </div>
                <div class="transactionElement">
                    <label class="form_label" id="amount-label" for="transaction-amount">Amount ($) </label>
                    <!-- Explicit User Amounts (Positive/Negative) -->
                    <div class="red small-button" id="transaction-amount-paid">Paid</div>
                    <div class="green small-button disabled-amount" id="transaction-amount-earned">Earned</div> <br />
                    <input class="form_input" id="transaction-amount" min=0 step=0.01 placeholder=1.00 type="number"></input>
                </div>
                <div class="transactionElement">
                    <label class="form_label" for="transaction-created">Date </label>
                    <input class="form_input" id="transaction-created" min="1900-01-01" max="2999-12-31" type="date"></input>
                </div>
            </form>
        <!-- Add Transaction Buttons -->
        <input class="green button" type="button" value="Add" id="add-transaction" />
        <input class="yellow button" type="button" value="Reset" id="reset-transaction" />
        <div class="alert" id="add-transac-err-alert">
            <!-- Add Transaction Error -->
            <div id="add-transac-err-msg"></div>
            <div class="dismiss-err" id="add-transac-dismiss-err"><i class="fas fa-window-close"></i></div>
        </div>
    </div>
</div>