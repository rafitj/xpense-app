<!-- Unauthenticated Login Form -->
<div class="center" id="loginContent">
    <img class = "login-logo" src = "expensifylogo.svg" alt = "expensify-logo-long" />
        <!-- Form Contents -->
        <form id="loginForm" method="POST" >
            <label for = "login-email">Email</label>
            <input id="login-email" type="text"></input>
            <br/>
            <label for ="login-password">Password</label>
            <input id="login-password" type="password"></input>
            <!-- Password UI -->
            <div id="login-password-utils">
                <!-- Allow User to Toggle Show/Hidden -->
                <div class="show-password">
                    <i class="fas fa-eye"></i> Show
                </div>
                <!-- Warn User if Caps Lock is on -->
                <div id = "password-caps">
                    <i class="fas fa-arrow-alt-circle-up"></i> Caps Lock On
                </div>
            </div>
            <br/>
            <input type="button" value="Login" id = "login-button">
        </form>
    <img class = "login-background" src = "expensifycard.svg" alt = "login-background"/>
</div>
<!-- Login Error UI -->
<div id = "login-err-alert" class = "center">
    <div id = "login-err-msg"></div>
    <div id = "login-dismiss-err"><i class="fas fa-window-close"></i></div>
</div>
