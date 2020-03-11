<!-- This file is the main user view when user is authenticated -->

<!-- Authenticated View Content -->
<div class="row-flex" id="view-content">
    <!-- Transaction Table -->
    <div id="transaction-table-container">
        <h2 class="grey-text header-text">My Transactions</h2>
        <!-- Table Search -->
        <input class="grey form-input" id="search-table" type="text" placeholder="Search Transactions By Merchant, Date or Amount...">
        <!-- Table Filters -->
        <div class="grey-text" id="search-filters">

            <i class="fas fa-calendar-alt"></i> <span class="filter-label">Date Created</span>
            <select class="grey-text filter-select" id="date-range-select">
                <option value="AllTime">All Time </option>
                <option value="Today">Today </option>
                <option value="LastWeek">Last Week </option>
                <option value="LastMonth">Last Month </option>
            </select>

            <i class="fas fa-money-check-alt"></i> <span class="filter-label">Amount Type</span>
            <select class="grey-text filter-select" id="amount-type-select">
                <option value="AllTypes">All Types </option>
                <option value="Positive">Positive </option>
                <option value="Negative">Negative </option>
                <option value="Neutral">Neutral </option>
            </select>

            <i class="fas fa-table"></i> <span class="filter-label">Display</span>
            <select class="grey-text filter-select" id="display-select">
                <option value=100>100 rows</option>
                <option value=50>50 rows</option>
                <option value=10>10 rows</option>
            </select>

        </div>
        <!-- Table Data -->
        <div class="grey-text" id="tableview">
            <div id="tableview-holder">
                <table id="transaction-table">
                    <thead>
                        <tr>
                            <th sort-by="Date"></th>
                            <th sort-by="Merchant"></th>
                            <th sort-by="Amount"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div class="bold-text alert" id="no-search-results">Oops! No Transactions Found.</div>
            </div>
        </div>
        <!-- Table Pages/Button -->
        <div class="row-flex" id="table-pages">
            <!-- Pages Buttons -->
            <div id="page-buttons">
                <div class="blue small-button pg-btn" id="prev-button">
                    <i class="fas fa-angle-left"></i>
                </div>
                <div class="blue small-button pg-btn" id="prev-prev-page"></div>
                <div class="blue small-button pg-btn" id="prev-page"></div>
                <div class="grey small-button pg-btn" id="curr-page"></div>
                <div class="blue small-button pg-btn" id="next-page"></div>
                <div class="blue small-button pg-btn" id="next-next-page"></div>
                <div class="blue small-button pg-btn" id="next-button">
                    <i class="fas fa-angle-right"></i>
                </div>
            </div>
            <!-- Pages Via Input -->
            <div class="grey-text" id="jump-pages-input">
                Go to page <input class="rounded" id="curr-page-input" min="1" type="number">
                <span id="total-pages"></span>
            </div>
        </div>
    </div>

    <!-- Add Transaction Form -->
    <div id="create-transaction-container">

        <h2 class="grey-text header-text">Add Transaction</h2>
        <form class="col-flex rounded" id="create-transaction-form" method="POST">
            <div class="transaction-element">
                <label class="grey-text form-label" for="transaction-merchant">Merchant </label>
                <input class="grey form-input" id="transaction-merchant" placeholder="Flower Shop" type="text"></input>
            </div>
            <div class="transaction-element">
                <label class="grey-text form-label" id="amount-label" for="transaction-amount">Amount ($) </label>
                <!-- Explicit User Amounts (Positive/Negative) -->
                <div class="red small-button" id="transaction-amount-paid">Paid</div>
                <div class="green small-button disabled-amount" id="transaction-amount-earned">Earned</div>
                <br />
                <input class="grey form-input" id="transaction-amount" min=0 step=0.01 placeholder=1.00 type="number"></input>
            </div>
            <div class="transaction-element">
                <label class="grey-text form-label" for="transaction-created">Date </label>
                <input class="grey form-input" id="transaction-created" min="1900-01-01" max="2999-12-31" type="date"></input>
            </div>
        </form>

        <!-- Add Transaction Buttons -->
        <input class="green button" type="button" value="Add" id="add-transaction-btn" />
        <input class="yellow button" type="button" value="Reset" id="reset-transaction-btn" />

        <!-- Add Transaction Error -->
        <div class="alert" id="add-transac-err-alert">
            <div id="add-transac-err-msg">
            </div>
            <div class="dismiss-err" id="add-transac-dismiss-err"><i class="fas fa-window-close fa-sm"></i></div>
        </div>

    </div>
</div>

<!-- Load Transaction Error -->
<div class="alert center" id="load-transac-err-alert">
    <div id="load-transac-err-msg"></div>
</div>