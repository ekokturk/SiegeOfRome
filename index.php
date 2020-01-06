<!DOCTYPE html>
<?php /*Copyright 2019 (C) Eser Kokturk. All Rights Reserved.*/?>
<html>
<head>
    <title>Siege of Rome</title>
    <link rel="icon" href="./static/images/game-html-icon.png">
    <meta name="description" constent="Catapult Level Editor">
    <link rel="stylesheet" type="text/css" href="static/css/style_base.css">
    <link rel="stylesheet" type="text/css" href="static/css/style.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="//code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
    <script src="./static/scripts/lib/jquery.keyframes.min.js"></script>
    <script src="static/scripts/lib/Box2dWeb-2.1.a.3.min.js"></script>

</head>
<body>
    <?php /*=================== LOGIN MODAL ============================*/?>
    <div id="user-modal" class="modal">
        <div class="flx flx-row full-width modal-content user-modal">
            <form id="user-form" class="flx flx-col ">
                <div id="user-modal-info" class="debug-error"></div>
                <br>
                <div class="modal-title">USER LOGIN / REGISTER</div>
                <br>
                <hr class="side">
                <br>
                <?php /*--------- Modal Username ---------*/?>
                <div class="flx flx-col full-width">
                    <div class="modal-label ">User ID</div>
                    <br>
                    <input name="userID"  type="text" value="" autocomplete="off"
                            title="Letter characters between 4-15 for user ID"  
                            pattern="[a-zA-Z0-9]{3,15}" class="input-field full-width" required/>
                </div>
                <br>
                <?php /*--------- Modal Password ---------*/?>
                <div class="flx flx-col full-width">
                    <div class="modal-label ">Password</div>
                    <br>
                    <input name="userPassword"  type="password" value="" autocomplete="off"
                            pattern="\w{3,30}\b" class="input-field full-width" required/>
                </div>
                <br>
                <div class="flx flx-row full-width">
                    <input name="user-login"  type="submit" class="btn" value="LOGIN">
                    <input name="user-register" type="submit" class="btn" value="REGISTER">
                </div>
            </form>
        </div>
    </div>
    <?php /*=================== MAIN MENU ============================*/?>
    <section id="main-menu">
        <div class="main-menu-title font-rome">SIEGE OF ROME</div>
        <div id="main-menu-options" class="flx flx-row">
            <?php /*=================== LEVEL EDITOR ====================*/?>
            <div id="main-menu-editor" class="hide">
                <div class="main-menu-opt flx flx-col ">
                    <div id="level-editor-button" class="main-menu-img editor-btn"></div>
                    <div class="main-menu-opt-title">LEVEL EDITOR</div>
                </div>
            </div>
            <?php /*=================== GAME ====================*/?>
            <div id="main-menu-play">
                <div class="main-menu-opt flx flx-col ">
                    <div id="play-game-button" class="main-menu-img play-btn"></div>
                    <div class="main-menu-opt-title">PLAY GAME</div>
                </div>
            </div>
        </div>
        <div class="flx flx-row">
            <div id="main-menu-info" class="mainmenu-info"></div>
        </div>
        <div class="flx flx-row full-width">
            <div id="user-logout" class="btn mainmenu-btn">LOGOUT</div>
        </div>
    </section>
    <?php /*=================== APPLICATION CONTAINER ============================*/?>
    <section id="app-wrapper" class="flx flx-col ">
    </section>
    <footer class="footer">
        Copyright (C) 2019 Eser Kokturk and Alejandro Silva Torres in cooperation with Vancouver Film School. All Rights Reserved.
    </footer>
    <script type="module" src="static/scripts/main.js"></script>
</body>
</html>