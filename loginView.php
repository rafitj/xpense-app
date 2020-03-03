<!-- Unauthenticated Login Form -->
<div class="center" id="loginView">
    <img id="login-logo" src="assets/images/expensify_logo_main.svg" alt="expensify-logo-long" />
    <!-- Form Contents -->
    <form method="POST">
        <label class="form_label" for="login-email">Email</label>
        <input class="form_input" id="login-email" type="text"></input>
        <br />
        <label class="form_label" for="login-password">Password</label>
        <input class="form_input" id="login-password" type="password"></input>
        <!-- Password UI -->
        <div id="login-password-utils">
            <!-- Allow User to Toggle Show/Hidden -->
            <div id="show-password">
                <i class="fas fa-eye"></i> Show
            </div>
            <!-- Warn User if Caps Lock is on -->
            <div id="password-caps">
                <i class="fas fa-arrow-alt-circle-up"></i> Caps Lock On
            </div>
        </div>
        <br />
        <input class="button" type="button" value="Login" id="login-button">
    </form>
    <img id="login-background" src="assets/images/expensify_card.svg" alt="login-background" />
</div>
<!-- Login Error UI -->
<div id="login-err-alert" class="alert center">
    <div id="login-err-msg"></div>
    <div class="dismiss-err" id="login-dismiss-err"><i class="fas fa-window-close"></i></div>
</div>