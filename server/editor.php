<section id="editor-wrapper" class="flx flx-row">
    <?php /*============ SIDE EDITOR OPTIONS =====================*/?>
    <div class="flx flx-col">
        <header id="header" class="header">LEVEL EDITOR</header>
        <div id="editor-options" class="side-menu">
            <!-- Editor Tabs -->
            <div id="editor-tabs" class="flx flx-row">
                <div id="tab-level" class="tab tab-on">LEVEL</div>          
                <div id="tab-objects"  class="tab tab-off">OBJECTS</div>
            </div>
            <?php /*+++++++ TAB _________ LEVEL FORM __________ */?>
            <div id="level-options" class="side-menu-options">
                <br>
                <div class="flx flx-col">
                    <div class="side-menu-title">CURRENT LEVEL</div>
                    <select name="loadedLevels" id="level-dropdown" class="level-select">
                        <?php /* GENERATED - LEVEL LIST */?>
                    </select>
                </div>
                <form id="level-data-form"  action="save_data.php" method="get" _target="_blank" class="side-menu-form">
                    <div class="flx flx-row">
                        <div class="flx flx-col">
                            <?php /*--------- Level Ammo Count ---------*/?>
                            <div class="flx flx-row">
                                <div class="side-menu-label full-width">Ammo</div>
                                <input name="ammoCount" type="number" min="1" value="4" class="input-field level-data-input" required/>
                            </div>
                            <?php /*--------- 1 Star Score Count ---------*/?>
                            <div class="flx flx-row">
                                <div class="side-menu-label">1 Star Score</div>
                                <input name="starScore1" type="number" min="0" max="" value="0" class="input-field level-data-input" required/>
                            </div>
                            <?php /*--------- 2 Star Score Count ---------*/?>
                            <div class="flx flx-row full-width">
                                <div class="side-menu-label">2 Star Score</div>
                                <input name="starScore2" type="number" min="0" max="" value="1" class="input-field level-data-input" required/>
                            </div>
                            <?php /*--------- 3 Star Score Count ---------*/?>
                            <div class="flx flx-row full-width">
                                <div class="side-menu-label">3 Star Score</div>
                                <input name="starScore3" type="number" min="0" max="" value="3" class="input-field level-data-input" required/>
                            </div>
                            <?php /*--------- Background Image ---------*/?>
                            <div class="flx flx-row full-width">
                                <div class="side-menu-label">Background</div>
                                <select name="backgroundName" class="full-width">
                                    <?php /* GENERATED - Background Images */ ?>
                                </select>
                            </div>
                            <div class="flx flx-row full-width">
                                <div class="side-menu-label full-width">Targets</div>
                                <div id="target-count" class="side-menu-label level-target-count full-width">0</div>
                            </div>
                        </div>
                        <?php /*--------- SAVE OR DELETE LEVEL ---------*/?>
                        <div class="flx flx-col ">
                            <input name="saveLevel" type="submit" value="SAVE" class="btn side-menu-btn"/>
                            <div id="delete-level-btn" class="btn side-menu-btn" >DELETE</div>
                        </div>
                    </div>
                </form>
                <br>
                <hr class="side">
                <div class="flx flx-col">
                    <div class="side-menu-title">CREATE NEW LEVEL</div>
                    <?php /*--------- NEW LEVEL NAME ---------*/?>
                    <div class="flx flx-row">
                        <div class="level-label">Name</div>
                        <input name="levelName" type="text" value="" 
                            title="Letter characters between 1-30 in length for the name (including '-' and '_') and not
                            an existing level name" autocomplete="off"
                            pattern="[a-zA-Z0-9_-]{1,30}" class="input-field level-input"/>
                    </div>
                    <?php /*--------- NEW LEVEL BUTTONS ---------*/?>
                    <div class="flx flx-row full-width">
                        <div id="new-level-btn" class="btn side-menu-btn">EMPTY LEVEL</div>
                        <div id="save-as-level-btn" class="btn side-menu-btn">SAVE LEVEL AS</div>
                    </div>
                </div>
                <br>
                <hr class="side">
                <br>
                <?php /*--------- REFRESH BUTTONS ---------*/?>
                <div class="flx flx-row">
                    <div id="level-refresh-btn" class="btn side-menu-btn">REFRESH LEVEL</div>
                    <div id="library-refresh-btn" class="btn side-menu-btn">REFRESH LIBRARY </div>
                </div>
                <div class="flx flx-row">
                    <div id="back-to-main" class="btn mainmenu-btn">BACK TO MAIN MENU</div>
                </div>
            </div>
            <?php /*+++++++ TAB _________ OBJECTS __________ */?>
            <div id="objects-options" class="hide side-menu-options">
                <div class="flx flx-col">
                    <select id="objects-list" name="objects" size="10" class="full-width">
                        <!-- GENERATED - List of objects in viewport -->
                    </select>
                    <?php /*--------- CHANGE STACKING ORDER OF OBJECTS ---------*/?>
                    <div class="flx flx-row full-width">
                        <?php /*--------- MOVE ONE BY ONE ---------*/?>
                        <div class="flx flx-col full-width">
                            <div id="objects-move-up" class="btn object-move-btn">Up / Backward</div>
                            <div id="objects-move-down" class="btn object-move-btn">Down / Forward</div>
                        </div>
                        <?php /*--------- MOVE TO BACK OR FRONT ---------*/?>
                        <div class="flx flx-col full-width">
                            <div id="objects-move-top" class="btn object-move-btn">To Top / Back</div>
                            <div id="objects-move-bottom" class="btn object-move-btn">To Bottom / Front</div>
                        </div>
                    </div>
                    <br>
                    <?php /* ____ OBJECT INFO FORM ____ */?>
                    <form id="object-data-form" action="" class="object-form">
                        <div id="objects-data" class="flx flx-col">
                            <?php /*--------- Object Settings Name ---------*/?>
                            <div class="flx flx-row">
                                <div class="flx flx-col object-form-label"> Name </div>
                                <input name="objectName" type="text" value="" autocomplete="off"
                                    title="Letter characters between 1-30 in length for the name (including '-' and '_') and not an already existing name"  
                                    pattern="[a-zA-Z0-9\_-]{1,30}" class="input-field object-input-txt" required disabled/>
                            </div>   
                            <hr class="object-break">
                            <?php /*--------- Object Settings Position ---------*/?>
                            <div class="flx flx-row">
                                <?php /* Top */?>
                                <div class="flx flx-row full-width">
                                    <div class="object-form-label"> Top </div>
                                    <input name="objectTop" type="number" value="" step="1" min="0" max="720" class="input-field object-input-num" disabled/>
                                </div>
                                <?php /* Left */?>
                                <div class="flx flx-row full-width">
                                    <div class="object-form-label"> Left </div>
                                    <input name="objectLeft" type="number" value="" step="1" min="0" max="1280" class="input-field object-input-num" disabled/>
                                </div>
                            </div>
                            <hr class="object-break">
                            <?php /*--------- Object Settings Size ---------*/?>
                            <div class="flx flx-row full-width">
                                <?php /* Height */?>
                                <div class="flx flx-row full-width">
                                    <div class="object-form-label"> Height </div>
                                    <input name="objectHeight" type="number" value="" step="1" min="5" max="400" class="input-field object-input-num" disabled/>
                                </div>
                                <?php /* Width */?>
                                <div class="flx flx-row full-width">
                                    <div class="object-form-label"> Width </div>
                                    <input name="objectWidth" type="number" value="" step="1" min="5" max="550" class="input-field object-input-num" disabled/>
                                </div>
                            </div>
                            <hr class="object-break">
                            <div class="flx flx-row">
                                <?php /*--------- Object Settings Mass ---------*/?>
                                <div class="flx flx-col full-width">
                                    <div class="object-form-label"> Mass </div>
                                    <input name="objectMass" type="number" value="" min="0" max="1000" step="0.1" class="input-field object-input-num" disabled/>
                                </div>
                                <?php /*--------- Object Settings Friction ---------*/?>
                                <div class="flx flx-col full-width">
                                    <div class="object-form-label"> Friction </div>
                                    <input name="objectFriction" type="number" value="" min="0" max="1" step="0.01" class="input-field object-input-num" disabled/>
                                </div>
                                <?php /*--------- Object Settings Restitution ---------*/?>
                                <div class="flx flx-col full-width">
                                    <div class="object-form-label"> Restitution </div>
                                    <input name="objectRestitution" type="number" value="" min="0" max="1" step="0.01" class="input-field object-input-num" disabled/>
                                </div>
                                <div class="flx flx-col full-width">
                                    <div class="object-form-label"> HP </div>
                                    <input name="objectHP" type="number" value="" min="0" max="100" step="1" class="input-field object-input-num" disabled/>
                                </div>
                            </div>
                            <hr class="object-break">
                            <div class="flx flx-row">
                                <?php /*--------- Object Settings Type ---------*/?>
                                <div class="flx flx-row full-width">
                                    <div class="object-form-label">Type </div>
                                    <input name="objectType" type="text" class="input-field object-input-num" disabled/>
                                </div>
                                <?php /*--------- Object Settings Shape ---------*/?>
                                <div class="flx flx-row full-width">
                                    <div class="object-form-label">Shape </div>
                                    <input name="objectShape" type="text"  class="input-field object-input-num" disabled/>
                                </div>
                            </div>
                            <hr class="object-break">
                            <?php /*--------- Object Settings Texture ---------*/?>
                            <div class="flx flx-row full-width">
                                <div class="object-form-label">Texture </div>
                                <input name="objectTexture" type="text" class="input-field object-input-txt" disabled/>
                            </div>
                        </div>
                    </form>
                    <hr class="object-break">
                    <?php /* ____ OBJECT FORM COMMANDS ____ */?>
                    <div class="flx flx-row side-menu">
                        <div id="objects-copy" class="btn side-menu-btn">COPY OBJECT</div>
                        <div id="objects-delete" class="btn side-menu-btn">DELETE OBJECT</div>
                    </div>
                </div>
            </div>
            <div id="info" class="debug-menu"></div>
        </div>
    </div>
    <?php /*============ NEW LIBRARY ITEM MODAL ==================*/?>
    <div id="library-add-modal" class="hide modal">
        <div class="flx flx-row full-width modal-content">
            <div id="modal-viewport"><div id="modal-view" class="modal-view"></div></div>
            <form id="modal-data-form" action="save_library.php" class="flx flx-col ">
                <div id="modal-title" class="modal-title">ADD ITEM TO LIBRARY</div>
                <br>
                <?php /*--------- Modal Item Name ---------*/?>
                <div class="flx flx-row">
                    <div class="modal-label">Name </div>
                    <input name="itemName"  type="text" value="" autocomplete="off"
                            title="Letter characters between 1-30 for item name (including '-' and '_')"  
                            pattern="[a-zA-Z0-9_-]{1,30}" class="input-field full-width" required/>
                </div>
                <br>
                <div class="flx flx-row">
                    <?php /*--------- Modal Item Height ---------*/?>
                    <div class="flx flx-row full-width">
                        <div class="modal-label full-width">Height </div>
                        <input name="itemHeight" type="number" value="75" step="1" min="5" max="400" class="input-field full-width"/>
                    </div>
                    <?php /*--------- Modal Item Width ---------*/?>
                    <div class="flx flx-row full-width">
                        <div class="modal-label">Width </div>
                        <input name="itemWidth" type="number" value="75" step="1" min="5" max="550" class="input-field full-width"/>
                    </div>
                </div>
                <br>
                <div class="modal-form flx flx-row">
                    <?php /*--------- Modal Item Type ---------*/?>
                    <div class="flx flx-row full-width">
                        <div class="modal-label full-width">Type </div>
                        <select name="itemType" class="full-width">
                            <option value="target">Target</option>
                            <option value="collidable">Collidable</option>
                            <option value="static">Static</option>
                            <option value="ghost">Ghost</option>
                            <option value="catapult">Catapult</option>  
                        </select>
                    
                    </div>
                    <?php /*--------- Modal Item Shape ---------*/?>
                    <div class="flx flx-row full-width">
                        <div class="modal-label">Shape</div>
                        <select name="itemShape" class="full-width">
                            <option value="rectangle">Rectangle</option>
                            <option value="circle">Circle</option>
                        </select>
                    </div>
                </div>
                <br>
                <div class="flx flx-row">
                    <?php /*--------- Modal Item Mass ---------*/?>
                    <div class="flx flx-col full-width modal-label">
                        <div class="full-width">Mass</div>
                        <input name="itemMass" type="number" value="50" min="0" max="1000" step="0.1" class="input-field full-width"/>
                    </div>
                    <?php /*--------- Modal Item Friction ---------*/?>
                    <div class="flx flx-col full-width modal-label">
                        <div class="full-width">Friction</div>
                        <input name="itemFriction" type="number" value="0" min="0" max="1" step="0.01" class="input-field full-width"/>
                    </div>
                    <?php /*--------- Modal Item Restitution ---------*/?>
                    <div class="flx flx-col full-width modal-label">
                        <div class="full-width">Restitution</div>
                        <input name="itemRestitution" type="number" value="0" min="0" max="1" step="0.01" class="input-field full-width"/>
                    </div>
                    <?php /*--------- Modal Item Restitution ---------*/?>
                    <div class="flx flx-col full-width modal-label">
                        <div class="full-width">HP</div>
                        <input name="itemHP" type="number" value="1" min="0" max="100" step="1" class="input-field full-width"/>
                    </div>
                </div>
                <br>
                <div class="flx flx-row full-width">
                    <div class="flx flx-col full-width modal-label">
                        <div class="modal-label">Texture</div>
                        <select name="itemTexture" class="full-width">
                            <?php /* GENERATED - Object Textures*/ ?>
                        </select>
                    </div>
                    <div class="flx flx-col full-width modal-label">
                        <div class="full-width">Spritesheet Size</div>
                        <input name="itemCrop" type="number" value="0" min="0" max="10000" step="0.5" class="input-field full-width"/>
                    </div>
                </div>
                <br>
                <input id="modal-submit" name="submitItem" type="submit" value="ADD" class="btn"/>
                <div class="flx flx-row full-width">
                    <input id="modal-reset" type="reset" value="RESET" class="btn full-width"/>
                    <input id="modal-close" type="reset" value="CLOSE" class="btn full-width"/>
                </div>
            </form>
        </div>
    </div>
    <?php /*============ EDITOR VIEWPORT and LIBRARY =============*/?>
    <div id="editor-area" class="flx-col">
        <?php /* ================= LIBRARY ================*/?>
        <div id="editor-library" class="flx flx-row">
            <div id="library-items-container" class="flx">
                <div id="library-items" class="flx flx-row">
                    <?php /* GENERATED - Library Objects */?>
                </div>
            </div>
            <?php /* Button to add items to library*/?>
            <div id="library-add" class="add-btn"></div>
        </div>
        <?php /* ================= VIEWPORT ================*/?>
        <div id="editor-viewport" class="viewport">
            <?php /* GENERATED - Level Objects*/?>
        </div>
        <?php /* ================= CONTECT MENU ================*/?>
        <div id="ctx-menu" class="hide">
            <div class="hide flx flx-col">
                <div id="ctx-menu-name" class="ctx-title">
                    <?php /* GENERATED - Object Name*/?>
                </div>
                <hr>
                <?php /* Context Menu Options for Viewport*/?>
                <div id="ctx-game-item-opts" class="hide">
                    <div id="ctx-game-item-copy" class="btn ctx-btn">Copy</div>
                    <div id="ctx-game-item-up" class="btn ctx-btn">Backward</div>
                    <div id="ctx-game-item-down" class="btn ctx-btn">Forward</div>
                    <div id="ctx-game-item-delete" class="btn ctx-btn">Delete</div>
                </div>
                <?php /* Context Menu Options for Library*/?>
                <div id="ctx-lib-item-opts" class="hide">
                    <div id="ctx-lib-item-edit" class="btn ctx-btn">Edit</div>
                    <div id="ctx-lib-item-delete" class="btn ctx-btn">Delete</div>
                </div>
            </div>
        </div>
    </div>
</section>
