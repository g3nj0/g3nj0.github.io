//==============================================================
//    Author: Jesse "G3NJ0" Zurawel
//    Created: 5/16/2014/
//
//    This file houses the script which will encode the input 
//    values into the URL and also decode them to allow sharing
//    of autoexec.cfg settings.
//==============================================================

//                 0                            10                            20                              30                               40
var inputBits  = [17, 8, 8, 6, 8, 9, 9, 9, 7, 7, 7, 7, 8, 8, 7, 7, 7, 7, 8, 7, 7, 12, 12, 5, 8, 8, 8, 8, 7, 9, 9, 9, 12, 10, 10, 10, 7, 7, 7, 7, 8, 8, 8, 8, 12, 12, 8, 2];
var inputBitTotal = 399;
var selectBits = [3, 4, 2, 3, 2, 3, 3, 3, 2, 3];
var selectBitTotal = 28;

var crosshairColorpicker = $('#xhair_colorpicker');
var crosshaircolorrObj = $('#crosshaircolorr');
var crosshaircolorgObj = $('#crosshaircolorg');
var crosshaircolorbObj = $('#crosshaircolorb');

/*
var meow = 0;

for (var i = 0; i < inputBits.length; i++)
    meow += inputBits[i];

alert(meow);
//*/

DecodeCfgValues = function () {
    var hashSet = window.location.hash.substring(1);

    //var hashSet = window.location.href;
    if (hashSet.length == 0) return;

    var hashValues = hashSet.split("+");

    // pick out the first hash
    var checkboxValues = Base62.decode(hashValues[0]).toString(2);
    //var checkboxValues = Base62.decode(hashValues.splice(0,1)).toString(2);
    while (checkboxValues.length < $('input[type=checkbox]').length) { checkboxValues = "0" + checkboxValues; }
    //console.log(checkboxValues);

    $('input[type=checkbox]').each(function (index) {
        if (checkboxValues.charAt(index) == "1")
            $(this).prop('checked', true);
        else
            $(this).prop('checked', false);
    })

    var selectBitString = Base62.decode(hashValues[1]).toString(2);
    //var selectBitString = Base62.decode(hashValues.splice(0,1)).toString(2);
    while (selectBitString.length < selectBitTotal) { selectBitString = "0" + selectBitString; } // pad wit dem zeros
    //console.log(selectBitString);
    //console.log("selectBitsString length: " + selectBitString.length);
    var selectIndex = 0;

    $('select').each(function (index) {        
        var selectInfo = selectBitString.substring(selectIndex, (selectIndex += selectBits[index]));
        var selectValue = parseInt(selectInfo, 2);

        if ($(this).is($('select[name=downloadfilter]'))) {
            if (selectValue == 0)
                $(this).val("all");
            else if (selectValue == 1)
                $(this).val("nosounds");
            else if (selectValue == 2)
                $(this).val("none");
            else
                $(this).val("mapsonly");
        }
        else
            $(this).val(selectValue);
    })
    var blah = "";

    // Gather all bits for the input data - 387 in total
    var rangeBitString = (Base62.decode(hashValues[2])).toString(2);
    var rangeStr = "";
    //console.log(hashValues.length);
    for (var i = 3; i < hashValues.length; i++)
    {
        rangeStr = (Base62.decode(hashValues[i])).toString(2);
        
        while (rangeStr.length < 32) { rangeStr = "0" + rangeStr; }
        //console.log(rangeStr.length);
        rangeBitString += rangeStr;
    }

    while (rangeBitString.length < inputBitTotal) { rangeBitString = "0" + rangeBitString; }

    var rangeNum = $('input[type=number]');
    var rangeIndex = 0;
    
    $('input[type=range]').each(function (index) {
        //console.log(rangeIndex);
        var rangeInfo = rangeBitString.substring(rangeIndex, (rangeIndex += inputBits[index]));
        var rangeValue = parseInt(rangeInfo, 2);
        //console.log(rangeIndex);
        //console.log(rangeValue + "\n");
        if ($(this).is($('#sens_slider')))
            console.log("Desired index - " + index);

        if ($(this).attr('step') < 1){
            rangeValue *= 0.01;

            if (($(this).is($('#viewmodel_offset_x_slider'))) ||
               ($(this).is($('#viewmodel_offset_y_slider'))) ||
               ($(this).is($('#viewmodel_offset_z_slider')))) {
                rangeValue -= 2;
            }
        }

        if ($(this).is($('#crosshairgap_slider')))
             rangeValue -= 100;

        $(this).val(rangeValue);
        rangeNum[index].value = rangeValue;
    })

    $('#xhair_colorpicker').val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));

    //*/
};

EncodeCfgValues = function () {
    //alert("meow");
    var hashStr = "";
    var binStr = "";

    // assemble all checkboxes into a binary string
    $('input[type=checkbox]').each(function (index) {
        $(this).prop('checked') ? binStr += "1" : binStr += "0"
    })
    hashStr += Base62.encode(parseInt(binStr, 2));

    binStr = "";

    $('select').each(function (index) {
        var s = "";
        s = $(this).find('option:selected').val();
        var n = 0;
        if ($(this).is($('select[name=downloadfilter]'))) {
            if (s == "all")
                s = 0;
            else if (s == "nosounds")
                s = 1;
            else if (s == "none")
                s = 2;
            else
                s = 3;
        }

        s = (+s).toString(2);
        while (s.length < selectBits[index]) { s = "0" + s; }
        binStr += s;
    })
    hashStr += "+" + Base62.encode(parseInt(binStr, 2));

    ///*
    binStr = "";
    // grab all range type inputs and make a huge bit string
    $('input[type=range]').each(function (index) {
        var s = (+$(this).val());
        var valueStr = "";
        // If the step is less than 1 than this is a float
        // Store it as an integer by multiplying the value by 100
        if ($(this).attr('step') < 1) {
            //s = (+$(this).val());

            if (($(this).is($('#viewmodel_offset_x_slider'))) ||
                ($(this).is($('#viewmodel_offset_y_slider'))) ||
                ($(this).is($('#viewmodel_offset_z_slider')))) {
                s += 2;
            }

            s *= 100;
        }
        else if ($(this).is($('#crosshairgap_slider'))){
            s += 100;
        }
        //console.log(s.toString(2));

        valueStr = s.toString(2);

        while (valueStr.length < inputBits[index]) { valueStr = "0" + valueStr; } // pad with zeroes

        if (valueStr.length != inputBits[index])
            console.log(index + " : " + $(this).attr('id'));

        binStr += valueStr;
    })
    //console.log(binStr.length);

    while ((binStr.length % 32) != 0) { binStr = "0" + binStr; } // pad with zeroes

    for (var i = 0; i < binStr.length; i += 32)
        hashStr += "+" + Base62.encode(parseInt(binStr.substring(i, i + 32), 2));
    //*/

    //window.location.hash = hashStr;
    window.history.replaceState(null, "", "#" + hashStr);
};

RGBToColorValue = function (r, g, b) {
    var rhex = parseInt(r, 10).toString(16);
    var ghex = parseInt(g, 10).toString(16);
    var bhex = parseInt(b, 10).toString(16);

    if (rhex.length == 1)
        rhex = "0" + rhex;
    if (ghex.length == 1)
        ghex = "0" + ghex;
    if (bhex.length == 1)
        bhex = "0" + bhex;

    return "#" + rhex + ghex + bhex;
};

$(document).ready(function () {
    DecodeCfgValues();
    writeCfgFile();

    $('input[type=number]').change(function () {
        window.clearTimeout(printEvent);
        printEvent = window.setTimeout(writeCfgFile, updateDelay);
    })
    // Same as the function above but with .keypress as the event which triggers the update
    $('input[type=number]').keypress(function () {
        window.clearTimeout(printEvent);
        printEvent = window.setTimeout(writeCfgFile, updateDelay);
    })
    // Updates the cfg text when a checkbox is changed
    $('input[type=checkbox]').change(function () {
        window.clearTimeout(printEvent);
        printEvent = window.setTimeout(writeCfgFile, 0);
    })
    // When any slider is changed the writeCfgFile method is called
    $('input[type=range]').change(function () {
        window.clearTimeout(printEvent);
        printEvent = window.setTimeout(writeCfgFile, updateDelay);
    })
    // When can select box is changed the writeCfgFile method is called
    $("select").change(function () {
        window.clearTimeout(printEvent);
        printEvent = window.setTimeout(writeCfgFile, 0);
    })
});

//Transfers the color picked for the crosshair to the input textboxes and sliders for each color
$(document).ready(function () {
    crosshairColorpicker.change(function () {
        var crosshairHexColor = crosshairColorpicker.val(); // #rrggbb

        //var crosshairRed = (crosshairHexColor.charAt(1) + crosshairHexColor.charAt(2)).toString();
        var crosshairRed = parseInt(crosshairHexColor.charAt(1) + crosshairHexColor.charAt(2), 16);
        var crosshairGreen = parseInt(crosshairHexColor.charAt(3) + crosshairHexColor.charAt(4), 16);
        var crosshairBlue = parseInt(crosshairHexColor.charAt(5) + crosshairHexColor.charAt(6), 16);

        crosshaircolorrObj.val(crosshairRed);
        $('#crosshaircolorr_slider').val(crosshairRed);
        crosshaircolorgObj.val(crosshairGreen);
        $('#crosshaircolorg_slider').val(crosshairGreen);
        crosshaircolorbObj.val(crosshairBlue);
        $('#crosshaircolorb_slider').val(crosshairBlue);
        window.setTimeout(writeCfgFile, 0);
    })
});

// Send new color value to the color picker
$(document).ready(function () {

    // Red ===================
    $('#crosshaircolorr').change(function () {
        crosshairColorpicker.val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });
    $('#crosshaircolorr').keypress(function () {
        crosshairColorpicker.val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });
    // Green ===================
    $('#crosshaircolorg').change(function () {
        crosshairColorpicker.val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });
    $('#crosshaircolorg').keypress(function () {
        crosshairColorpicker.val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });
    // Blue ===================
    $('#crosshaircolorb').change(function () {
        crosshairColorpicker.val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });
    $('#crosshaircolorb').keypress(function () {
        crosshairColorpicker.val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });

    // Sliders ================
    $('#crosshaircolorr_slider').change(function () {
        $('#xhair_colorpicker').val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });
    $('#crosshaircolorg_slider').change(function () {
        $('#xhair_colorpicker').val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });
    $('#crosshaircolorb_slider').change(function () {
        $('#xhair_colorpicker').val(RGBToColorValue(crosshaircolorrObj.val(), crosshaircolorgObj.val(), crosshaircolorbObj.val()));
    });

    // Download ===============
    $('#downloadButton').click(function (e) {
        alert("meow");
        $.generateFile({
            filename: 'autoexec.cfg',
            content: $('#cfgtextarea').val(),
            script: 'download.php'
        });

        e.preventDefault();
    });
});
