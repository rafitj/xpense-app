<div class="center" id = "load-transac-err-alert">
        <div id = "load-transac-err-msg"></div>
</div>

<div id="viewContent">    
    <div id="transactionTable">
        <h2>My Transactions</h2>
        <input id ="search-table" type="text" placeholder="Search Transactions By Merchant, Date or Amount...">
        <div id ="search-filters">
            Date Transacted:
            <select class="filter-select" id="time-select">
                <option value = "AllTime">All Time </option>
                <option value="Today">Today </option>
                <option value="LastWeek" >Last Week </option>
                <option value = "LastMonth">Last Month </option>
            </select>
            Transaction Type:
            <select class="filter-select" id="type-select" >
                <option value="All">All </option>
                <option value="Positive">Positive </option>
                <option value = "Negative">Negative </option>
                <option value = "Neutral">Neutral </option>
            </select>
            Display:
            <select class="filter-select" id="display-select"> 
                <option value=100>100 rows</option>
                <option value=50>50 rows</option>
                <option value=10>10 rows</option>
            </select>
        </div>
        <table id="main-table">

            <thead>
                <tr>
                    <th sort-by="Date">Date</th>
                    <th sort-by="Merchant">Merchant</th>
                    <th sort-by="Amount">Amount</th>
                </tr>
               </thead>

            <tbody id="transactionTableBody">
            </tbody>
        </table>
        <div id = "table-pages">
            <div id="page-buttons">
                <div id = "prev-button">
                    <i class="fas fa-angle-left"></i>
                </div>
                <div id = "prev-prev-page">
                </div>
                <div id = "prev-page">
                </div>
                <div id = "curr-page">
                </div>
                <div id = "next-page">
                </div>
                <div id = "next-next-page">
                </div>
                <div id = "next-button">
                <i class="fas fa-angle-right"></i>
                </div>
            </div>
            <div id="jump-pages-input">
                Go to page <input id ="cur-page-input" min="1" type="number"> <p id="total-pages"></p>
            </div>
        </div>
    </div>

    <div id="transactionForm">
        <h2>Add Transaction</h2>
        <div id = "main-form">
            <form id="addForm" method="POST" >
                <div class = "transactionElement">
                    <label for ="transaction-merchant">Merchant </label>
                    <input id="transaction-merchant" placeholder = "Flower Shop" type="text"></input>
                </div>    
                <div class = "transactionElement">
                    <label id="amount-label" for ="transaction-amount">Amount ($) </label> 
                    <div id="transaction-amount-paid">Paid</div>
                    <div id="transaction-amount-earned">Earned</div> <br/>
                    <input id="transaction-amount"  min = 0 step = 0.01 placeholder = 1.00 type="number"></input>
                </div>
                <div class = "transactionElement">
                    <label for ="transaction-created">Date </label>
                    <input id="transaction-created" type="date"></input>
                </div>
            </form>
        </div>
        <input class = "green" type="button" value="Add" id="add-transaction"/>
        <input class = "yellow" type="button" value="Reset" id="reset-transaction"/>
        <div id = "add-transac-err-alert">
        <div id = "add-transac-err-msg"></div>
            <div id = "add-transac-dismiss-err"><i class="fas fa-window-close"></i></div>
        </div>
    </div>
</div>