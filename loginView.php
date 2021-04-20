<!-- This file is the main login view when user is unauthenticated -->

<!-- Unauthenticated Login Form -->
<div class="col-flex" id="login-view-container">
    <div class="rounded" id="login-view">

        <!-- Form Contents -->
        <form method="POST" id="login-form">

            <img id="login-logo" src="assets/images/logo_main.svg" alt="logo-long" />

            <label class="white-text form-label" for="login-email">Email</label>
            <input class="grey form-input" id="login-email" type="text"></input>

            <label class="white-text form-label" for="login-password">Password</label>
            <input class="grey form-input" id="login-password" type="password"></input>

            <!-- Password UI -->
            <div class="bold-text white-text row-flex" id="login-password-utils">

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
            <input class="grey-text button" type="button" value="Sign In" id="login-button">

        </form>
    </div>

    <!-- Login Error UI -->
    <div id="login-err-alert" class="alert">
            <div id="login-err-msg"></div>
            <div class="dismiss-err" id="login-dismiss-err"><i class="fas fa-window-close fa-sm"></i></div>
        </div>
</div>