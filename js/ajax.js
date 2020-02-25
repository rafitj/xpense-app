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
        timeout: 5000,
        success: (res) => {
            const jsonRes = JSON.parse(res)
            if (jsonRes.error) {
                $addTransactionErrMsg.html(`<i class="fas fa-exclamation-triangle"></i>  ${jsonRes.msg}`)
                $addTransactionErrAlert.show()
            } else { 
                $addTransactionErrAlert.hide()
                const data = JSON.parse(jsonRes.msg)
                const transaction = data.transactionList[0]
                addToTable(transaction, true)
            }
        },
        error: (jqXHR) => {
            if(jqXHR.statusText === 'timeout')
            {     
                $addTransactionErrMsg.html(`Failed: Please Check Network Connection`)
                $addTransactionErrAlert.show()
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
        timeout: 5000,
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
        error: (jqXHR) => {
            if(jqXHR.statusText === 'timeout')
            {     
                $unauthenticatedView.addClass('shake-error')
                setTimeout( () => {
                    $unauthenticatedView.removeClass('shake-error');
                }, 500);
                $loginErrMsg.html(`Failed: Please Check Network Connection`)
                $loginErrAlert.show()
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
        timeout: 10000,
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
        error: (jqXHR) => {
            if(jqXHR.statusText === 'timeout')
            {     
                $loadTransactionErrMsg.html(`Failed: Please Check Network Connection`)
                $loadTransactionErrAlert.show()
            }
        },
    })
}