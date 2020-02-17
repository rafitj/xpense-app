$(document).ready(()=>{

    $("#login").click(()=>{
        const email = $("#login-email").val();
        const password = $("#login-password").val();
        console.log(email,password)
        $.ajax({
            url: 'proxy.php',
            method: 'POST',
            data: {
                command: 'Authenticate',
                partnerName: 'applicant',
                partnerPassword: 'd7c3119c6cdab02d68d9',
                partnerUserID: email,
                partnerUserSecret: password
            },
        })
    })

})