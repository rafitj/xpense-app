const createTransactionAJAX = ({authToken,amount,created,merchant}) => {
    $.ajax({
        url: URLProxy,
        method: Methods.POST,
        data: {
            command: Commands.CreateTransaction,
            created,
            amount,
            merchant,
            authToken
        },
        success: (res) => {
            console.log(res)
            const jsonRes = JSON.parse(res)
            if (jsonRes.error) {
                $addTransactionErrMsg.html(`<i class="fas fa-exclamation-triangle"></i>  ${jsonRes.msg}`)
                $addTransactionErrAlert.show()
            } else {
                const data = JSON.parse(jsonRes.msg)
                const transaction = data.transactionList[0]
                const {amount,created,merchant} = transaction
                $('<tr>').prependTo($('tbody'));
                $tr = $('tbody').find('tr:first');
                $tr.append($('<td>').text(created));
                $tr.append($('<td>').text(merchant));
                $tr.append($('<td>').text(amount));
            }
        },
    })
}

const loginUserAJAX = ({email,password}) => {
    $.ajax({
        url: URLProxy,
        method: Methods.POST,
        data: {
            command: Commands.Authenticate ,
            partnerUserID: email,
            partnerUserSecret: password
        },
        success: (res) => {
            const jsonRes = JSON.parse(res)
            if (jsonRes.error){
                $loginErrMsg.html(`<i class="fas fa-exclamation-triangle"></i> &nbsp; ${jsonRes.msg}`)
                $loginErrAlert.show()
                $unauthenticatedView.addClass('shake-error')
                setTimeout( () => {
                    $unauthenticatedView.removeClass('shake-error');
                }, 500);
            } else {
                $loginErrAlert.hide()
                toggleUserView()
            }
        },
    })
}

const loadTransactionsAJAX = (authToken) => {
    $.ajax({
        url: URLProxy,
        method: Methods.GET,
        data: {
            command: Commands.Get,
            authToken,
            returnValueList: 'transactionList',
        },
        success: (res) => {
            const jsonRes = JSON.parse(res)
            if (jsonRes.error){
                console.log(jsonRes.msg)
            } else {
                const data = JSON.parse(jsonRes.msg)
                Singleton.getInstance(data.transactionList)
                renderTable(1)
                $authenticatedView.show()
                $logoutButton.show()
            }
        },
    })
}