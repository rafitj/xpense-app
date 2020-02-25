<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Expensify Take-Home Challenge</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <link rel="stylesheet" type="text/css" href="css/view.css">
    <link rel="stylesheet" type="text/css" href="css/header.css">
    <link rel="stylesheet" type="text/css" href="css/footer.css">
</head>
<body>
     <!-- Loader -->
    <div class = "center" id = "loader">
        <div id ="spinner"></div>
        <p>Loading</p>
    </div>

    <!-- Header -->
    <div id="header">
        <img src="./expensifylogoheader.svg" alt = "headerlogo" />
        <input type=button id="logout-button" value = "Logout"/>
    </div>
    <div class="border"></div>

    <!-- View -->
    <?php 
            include_once('view.php');
            include_once('form.php');
    ?>

    <!-- Footer -->
    <div class="footer-border"></div>

    <!-- Javascript Files, we've included JQuery here, feel free to use at your discretion. Add whatever else you may need here too. -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js"></script>
    <script type="text/javascript" src="js/constants.js"></script>
    <script type="text/javascript" src="js/ajax.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
    <script src="https://kit.fontawesome.com/1c78a49af0.js" crossorigin="anonymous"></script>

</body>
</html>
