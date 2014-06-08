//=================================================================
//    Author: Jesse "G3NJ0" Zurawel
//    Created: 5/16/2014
//
//    Builds a large string of all of the autoexec.cfg which is 
//    printed to a text area.
//=================================================================
var printEvent;
var updateDelay = 500; // delay for which to update cfg text in milliseconds
var autoexecText;  // We will concatenate all of the autoexec text into this var

writeCfgFile = function () {
    autoexecText = $('#cfgtextarea').val(""); // clear text area and autoexecText

    autoexecText = "// ================== Rates ===================\n\n";
    appendNewCommand("rate", $("#rate_slider"));                        // 17
    appendNewCommand("cl_cmdrate", $("#cmdrate_slider"));               // 8
    appendNewCommand("cl_updaterate", $("#updaterate_slider"));         // 8
    appendNewCommand("cl_interp", $("#interp_slider"));                 // 6
    appendNewCommand("cl_interp_ratio", $("#interp_ratio_slider"));     // 8

    autoexecText += "\n// ============== Video settings ==============\n\n";
    appendNewCommand("mat_monitorgamma", $('#gamma_slider'));           // 9
    appendNewCommand("fps_max", $('#maxfps_slider'));                   // 9
    appendNewCommand("fps_max_menu", $('#maxfps_menu_slider'));         // 9                 
    appendNewCheckedCommand("r_dynamic", $('#dynshadow'));
    appendNewCheckedCommand("r_drawtracers_firstperson", $('#fptracer'));
    autoexecText += "mat_savechanges\n";

    autoexecText += "\n// ============== Audio settings ==============\n\n";
    appendNewCommand("volume", $('#volume_slider'));                    // 7
    appendNewCheckedCommand("voice_enable", $('#voiceenable'));
    appendNewCommand("voice_scale", $('#voicescale_slider'));           // 7 -10

    // Special case for speaker config
    autoexecText += "windows_speaker_config \"";
    if ($("select[name=speaker]").val() == 0)
        autoexecText += "-1";
    else
        autoexecText += $("select[name=speaker]").val();                //== 3

    autoexecText += "\"\n";

    appendNewCommand("snd_musicvolume", $("#music_slider"));                   // 7
    appendNewCommand("snd_mixahead", $("#soundmixahead_slider"));              // 7
    appendNewCommand("snd_headphone_pan_exponent", $("#panexp_slider"));       // 8
    appendNewCommand("snd_headphone_pan_radial_weight", $("#panrad_slider"));  // 8
    appendNewCheckedCommand("snd_legacy_surround", $('#legacy'));
    appendNewCheckedCommand("snd_mute_losefocus", $('#mutelosefocus'));
    appendNewCheckedCommand("lobby_voice_chat_enabled", $('#voiceenablelobby'));

    autoexecText += "\n// =============== HUD settings ===============\n\n";
    appendNewCommand("hud_scaling", $("#hudscale_slider"));             // 7
    appendNewCommand("safezonex", $("#hudsafex_slider"));               // 7
    appendNewCommand("safezoney", $("#hudsafey_slider"));               // 7
    appendNewCommand("cl_hud_background_alpha", $("#hudalpha_slider")); // 7
    appendNewCommand("cl_hud_color", $("#hudcolor"));                   // == 4
    appendNewCheckedCommand("cl_hud_playercount_showcount", $("#showplayercount"));
    appendNewCheckedCommand("cl_hud_playercount_pos", $("#playercountpos"));
    appendNewCheckedCommand("cl_show_clan_in_death_notice", $("#showclandeath"));
    appendNewCheckedCommand("cl_hud_bomb_under_radar", $("#bombunderradar"));
    appendNewCheckedCommand("cl_hud_healthammo_style", $("#healthammo"));
    appendNewCheckedCommand("cl_showloadout", $("#showloadout"));
    appendNewCheckedCommand("cl_loadout_colorweaponnames", $("#loadoutcolor"));
    appendNewCheckedCommand("hud_showtargetid", $("#showtargetid"));
    //================================================================
    autoexecText += "\n";
    appendNewCommand("cl_hud_radar_scale", $("#hudradarscale_slider"));       // 8
    appendNewCommand("cl_radar_scale", $("#radarmapscale_slider"));           // 7
    appendNewCommand("cl_radar_icon_scale_min", $("#radariconscale_slider")); // 7 -21
    appendNewCheckedCommand("cl_radar_always_centered", $("#radarcentered"));
    appendNewCheckedCommand("cl_radar_rotate", $("#radarrotates"));
    //================================================================
    autoexecText += "\n";
    appendNewCheckedCommand("developer", $("#developer"));

    //appendNewCommand("con_filter_enable", $("select[name=confilterenable]"));  //== 2
    if ($("select[name=confilterenable]").val() == 0)
        autoexecText += "con_filter_enable \"0\"\ncon_filter_text \"\"\n";
    else if ($("select[name=confilterenable]").val() == 1)
        autoexecText += "con_filter_enable \"1\"\ncon_filter_text \"damage\"\n";
    else
        autoexecText += "con_filter_enable \"2\"\ncon_filter_text \"damage\"\n";

    if ($("#filterplayer").prop("checked"))
        autoexecText += "con_filter_text_out \"Player:\"\n";

    appendNewCheckedCommand("gameinstructor_enable", $("#gameinstruct"));
    //================================================================
    autoexecText += "\n";
    appendNewCommand("cl_showfps", $("#showfps"));                                        //== 3
    appendNewCheckedCommand("net_graph", $("#netgraph"));
    appendNewCheckedCommand("net_graphproportionalfont", $("#netgraphfont"));
    appendNewCommand("net_graphheight", $("#netgraphheight_slider"));                     // 12
    appendNewCommand("net_graphpos", $("#netgraphpos_slider"));                           // 12

    autoexecText += "\n// ============= Viewmodel settings =============\n\n";
    appendNewCommand("cl_bob_lower_amt", $("#lowerbobamt_slider"));                       // 5
    appendNewCommand("cl_bobamt_lat", $("#boblat_slider"));                               // 8
    appendNewCommand("cl_bobamt_vert", $("#bobvert_slider"));                             // 8
    appendNewCommand("cl_viewmodel_shift_left_amt", $("#viewmodel_shift_left_slider"));   // 8
    appendNewCommand("cl_viewmodel_shift_right_amt", $("#viewmodel_shift_right_slider")); // 8
    // ========================================================================
    appendNewCommand("viewmodel_presetpos", $("select[name=viewmodel_preset]")); //== 2
    appendNewCommand("viewmodel_fov", $("#viewmodel_fov"));                      // 7
    appendNewCommand("viewmodel_offset_x", $("#viewmodel_offset_x_slider"));     // 9
    appendNewCommand("viewmodel_offset_y", $("#viewmodel_offset_y_slider"));     // 9
    appendNewCommand("viewmodel_offset_z", $("#viewmodel_offset_z_slider"));     // 9
    
    autoexecText += "\n// =============== Mouse settings ===============\n\n"; // Mouse
    autoexecText += "// DPI = " + $('#dpi_slider').val() + "\n"
    appendNewCommand("sensitivity", $('#sens_slider'));                     // 10
    appendNewCommand("zoom_sensitivity_ratio_mouse", $('#zoom_slider'));    // 10
    appendNewCheckedCommand("m_rawinput", $("#raw"));                       
    appendNewCommand("m_customaccel", $('#accel_slider'));                  // 10

    autoexecText += "\n// ============ Crosshair settings ============\n\n";  // Crosshair
    appendNewCommand("cl_crosshairstyle", $("select[name=crosshairstyle]"));                        //== 3
    appendNewCommand("cl_crosshair_dynamic_maxdist_splitratio",$('#crosshairdynmaxdist_slider'));   // 7
    appendNewCommand("cl_crosshair_dynamic_splitalpha_innermod",$('#crosshairalphainner_slider'));  // 7
    appendNewCommand("cl_crosshair_dynamic_splitalpha_outermod", $('#crosshairalphaouter_slider')); // 7
    appendNewCommand("cl_crosshair_dynamic_splitdist", $('#crosshairsplitdist_slider'));            // 7
    appendNewCommand("cl_crosshaircolor", $("select[name=crosshaircolor]"));                        //== 3
    // ========================================================================
    appendNewCommand("cl_crosshaircolor_r", $("#crosshaircolorr_slider"));  // 8
    appendNewCommand("cl_crosshaircolor_g", $("#crosshaircolorg_slider"));  // 8
    appendNewCommand("cl_crosshaircolor_b", $("#crosshaircolorb_slider"));  // 8
    appendNewCommand("cl_crosshairalpha", $("#crosshairalpha_slider"));     // 8
    // ========================================================================
    appendNewCommand("cl_crosshairsize", $("#crosshairsize_slider"));           // 7
    appendNewCommand("cl_crosshairthickness", $("#crosshairthickness_slider")); // 7
    appendNewCommand("cl_crosshairgap", $("#crosshairgap_slider"));             // 8
    appendNewCheckedCommand("cl_crosshairdot", $("#crosshairdot"));              
    appendNewCheckedCommand("cl_crosshair_drawoutline", $("#crosshairoutline"));
    appendNewCommand("cl_crosshair_outlinethickness", $("#crosshairoutlinethickness_slider")); // 2

    autoexecText += "\n// ============== MISC settings ==============\n\n";  // MISC
    appendNewCheckedCommand("cl_autohelp", $("#autohelp"));
    appendNewCheckedCommand("cl_autowepswitch", $("#autoweapon"));
    appendNewCheckedCommand("cl_righthand", $("#righthand"));
    appendNewCheckedCommand("cl_disablefreezecam", $("#freezecam"));
    appendNewCheckedCommand("cl_freezecameffects_showholiday", $("#holidayeffect"));
    appendNewCheckedCommand("cl_disablehtmlmotd", $("#disablemotd"));
    appendNewCheckedCommand("cl_forcepreload", $("#forcepreload"));
    appendNewCommand("cl_downloadfilter", $("select[name=downloadfilter]"));        //== 2
    appendNewCommand("cl_teammate_colors_show", $("select[name=teammatecolors]"));  //== 2
    appendNewCommand("cl_color", $("select[name=selfcolor]"));                      //== 3
    appendNewCheckedCommand("cl_use_opens_buy_menu", $("#usebuymenu"));
    appendNewCheckedCommand("closeonbuy", $("#closeonbuy"));
    appendNewCheckedCommand("option_duck_method", $("#toggleduck"));
    appendNewCheckedCommand("option_speed_method", $("#togglewalk"));

    autoexecText += "\nhost_writeconfig\n";

    autoexecText += "echo \"AUTOEXEC.CFG LOADED SUCCESSFULLY!!!\"\n";
    autoexecText += "echo \"\"\n";
    autoexecText += "echo \"This file was generated at www.csgoautoexec.com\"\n";
    $('#cfgtextarea').val(autoexecText);
    EncodeCfgValues();
};
//$(document).ready(writeCfgFile);

// Appends a new command to the autoexecText variable
// commandName:String  domObj:DOMObject (object which you want the corresponding value of)
// appendNewCommand("cl_crosshaircolor_r" $('#crosshaircolorr'));
appendNewCommand = function (commandName, domObj) {
    autoexecText += commandName + " \"" + domObj.val() + "\"\n";
};
// Used for checkboxes
appendNewCheckedCommand = function (commandName, checkObj) {
    autoexecText += commandName + " \"" + (checkObj.prop("checked") ? 1 : 0) + "\"\n";  
};

StringToBinary = function (str) {
    var b;
    var data = "";
    for (var i = 0; i < str.length; i++)
    {
        b = str.charCodeAt(i).toString(2);
        while (b.length < 8) { b = "0" + b; } // pad with zeroes
        
        data += b;
    }

    while ((data.length % 64) != 0) { data = "0" + data; }

    return data;
};

EncodeBinaryToBase62 = function (bin) {
    var sixtytwostr = "";
    for(var i = 0; i < bin.length; i+=64)
        sixtytwostr += Base62.encode(parseInt(bin.substring(i, i+63), 2)) + "/";

    return sixtytwostr;
};



