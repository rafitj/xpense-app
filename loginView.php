<!-- Unauthenticated Login Form -->
<div class="center" id="login-view">

    <!-- Form Contents -->
    <form method="POST" id="login-form">

        <img id="login-logo" src="assets/images/expensify_logo_main.svg" alt="expensify-logo-long" />

        <label class="form-label" for="login-email">Email</label>
        <input class="form-input" id="login-email" type="text"></input>

        <label class="form-label" for="login-password">Password</label>
        <input class="form-input" id="login-password" type="password"></input>

        <!-- Password UI -->
        <div id="login-password-utils">

            <!-- Allow User to Toggle Show/Hidden -->
            <div id="show-password">
                <i class="fas fa-eye"></i> Show
            </div>

            <!-- Warn User if Caps is on -->
            <div id="password-caps">
                <i class="fas fa-arrow-alt-circle-up"></i> Caps/Shift On
            </div>

        </div>

        <!-- Login Button -->
        <input class="button" type="button" value="Login" id="login-button">

    </form>


</div>

<!-- Login Error UI -->
<div id="login-err-alert" class="alert center">
    <i class="fas fa-exclamation-triangle"></i>
    <div id="login-err-msg">
    </div>
    <div class="dismiss-err" id="login-dismiss-err"><i class="fas fa-window-close"></i></div>
</div>