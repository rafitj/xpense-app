<?php include_once('header.php') ?>
<div id="viewContent">    
    <div id="transactionTable">
        <h2>My Transactions</h2>
        <table id="main-table">

            <thead>
                <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Amount</th>
                </tr>
               </thead>

            <tbody id="transactionTableBody">
                <!-- Add the transaction rows here -->
            </tbody>
        </table>
        <div id = "table-pages"></div>
        <div id="dropdown">
            <button id="dropbtn">Page</button>
            <div id="dropdown-content">
            </div>
        </div>
    </div>

    <div id="transactionForm">
        <h2>Add Transaction</h2>
        <div id = "main-form">
            <form id="addForm" method="POST" >
                <label for ="transaction-merchant">Merchant </label>
                <input id="transaction-merchant" placeholder = "Shop" type="text"></input>

                <label for ="transaction-amount">Amount </label>
                <input id="transaction-amount"  min = 0 step = 0.01 placeholder = 1.00 type="number"></input>

                <label for ="transaction-created">Date </label>
                <input id="transaction-created" type="date"></input>
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

<?php include_once('footer.php') ?>
