<div class="center" id="loginContent">
    <img class = "login-logo" src = "expensifylogo.svg" alt = "expensify-logo-long" />
        <form id="loginForm" method="POST" >
            <label for = "login-email">Email</label>
            <input id="login-email" type="text"></input>
            <br/>
            <label for ="login-password">Password</label>
            <input id="login-password" type="password"></input>
            <div id="login-password-utils">
                <div class="show-password">
                    <i class="fas fa-eye"></i> Show
                </div>
                <div id = "password-caps">
                    <i class="fas fa-arrow-alt-circle-up"></i> Caps Lock On
                </div>
            </div>
            <br/>
            <input type="button" value="Login" id = "login-button">
        </form>
    <img class = "login-background" src = "expensifycard.svg" alt = "login-background"/>
</div>
<div id = "login-err-alert" class = "center">
<div id = "login-err-msg"></div>
    <div id = "login-dismiss-err"><i class="fas fa-window-close"></i></div>
</div>
