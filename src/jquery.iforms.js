/*
* jquery.iforms.js - iForm Script Library based using the jQuery framework
* http://heo-iforms.blogger.com/
*
* This file contains scripts that deal with the FUNCTIONALITY of an iForm
* If you are looking for scripts that deal with STYLING, please also include jquery.iforms.style.js
* If you are looking for scripts that deal with UI ELEMENTS, please also include jquery.iforms-ui.js
*
* There are also additional scripts for QTIP and Date Functions
*
* Version: 0.1
* Copyright 2012 Scott Morris - http://heo-iforms.blogger.com/
*
* Dual licensed under MIT or GPLv2 licenses
*   http://en.wikipedia.org/wiki/MIT_License
*   http://en.wikipedia.org/wiki/GNU_General_Public_License
*
* Requires: jQuery
*/
(function( $ ){
    // DECLARATIONS ################################################################################
    var lib_settings = { 
        classes: {
            hidden: 'iform-hidden',
            clickable: 'iform-clickable',
            hangingIndent: 'iform-hanging-indent',
            noPrint: 'iform-no-print',
            floatLeft: 'iform-float-left',
            floatRight: 'iform-float-right'
        },
        triggers: {
            update: 'update',
            checkSubmit: 'iform-check-submit'
        },
        queue: 'iform-queue',
        attr: {
            defaultValue: 'iform-defaultValue',
            maxSize: 'iform-maxSize'
        }
    };

    //==============================================================================================
    var opt_default = {
        afterUpdate: undefined,
        callback: undefined
    };

    
    // TEXT INPUT FUNCTIONS ########################################################################
    $.fn.clearDefaultText = function(opt) {
        opt = $.extend({},opt_default,opt);
        $(this).each(function(i) {
            $(this).attr(lib_settings.attr.defaultValue, $(this).val())
                .focus(function() { if ($(this).val() == $(this).attr(lib_settings.attr.defaultValue)) $(this).val(''); })
                .blur(function() { if ($(this).val() == '') $(this).val($(this).attr(lib_settings.attr.defaultValue)); });            
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.maskInput = function(opt) {
        // Define option defaults
        var fn_default = {
            allowText: true,        // change to false when you want just numbers; useful for doses, quantities, etc
            allowNumbers: true,     // not sure where you would want to prevent numbers, but it's here
            allowEnterKey: false,   // prevent the user from prematurely submitting the form
            blacklist: {
                noModifier: [106,109,186,187,192,219,220,221,222], // see table at bottom for keycode reference
                shiftKey: [49,51,52,53,54,55,56,106,109,192,219,220,222],
                ctrlKey: [],
                altKey: [],
                ctrlAltKey: [],
                chars: '\'\\!#$%^&*_=+|[]{}"~`<>;' // chars to remove when text is pasted
            },
            maxSize: 255,               // The most that an HEO field can accept
            onKeyDown: undefined,       // triggers after the key is evaluated
            onKeyAllowed: undefined,    // triggers after a key is allowed in maskInput
            onKeyNotAllowed: undefined, // triggers after a key is not allowed in maskInput
            onMaxSize: undefined,       // triggers on a change that causes the value's length to be maxSize
            onNotMaxSize: undefined,    // triggers on a change that causes the value's length to go from maxSize to something smaller
            onPaste: undefined          // triggers after the Paste event
        };
        opt = $.extend({},opt_default,fn_default,opt);
        
        $(this).each(function(i) {
            // Keydown Event -----------------------------------------------------------------------
            $(this).keydown(function(e) {
                // Start with the assumption that the key will be allowed and only deny it if the criteria are met.
                var allow = true, isSpecialKey = (e.which <= 46) ? true : false;
                
                // Check for the ENTER key ---------------------------------------------------------
                if ((!opt.allowEnterKey) && (e.which == 13)) { allow = false; }

                // Check to see if you've already reached the maxSize ------------------------------
                if ((allow) && ($(this).val().length >= opt.maxSize) && (!isSpecialKey)) { allow = false; }
                
                // No CTRL or ALT ------------------------------------------------------------------
                if ((allow) && (!e.ctrlKey) && (!e.altKey)) {
                    // Check Text First (doesn't matter whether SHIFT or not)
                    if ((!opt.allowText) && (e.which >= 65) && (e.which <= 90)) { allow = false; }

                    // Specific to No Modifier -----------------------------------------------------
                    if ((allow) && (!e.shiftKey) &&
                        (((!opt.allowText) && ($.inArray(e.which,[188,189]) > -1)) ||
                         ((!opt.allowNumbers) && (e.which >= 48) && (e.which <= 57)) ||
                         ((!opt.allowNumbers) && (e.which >= 96) && (e.which <= 105)) ||
                         ($.inArray(e.which, opt.blacklist.noModifier) > -1)
                        )) { allow = false; }

                    // Specific to Shift -----------------------------------------------------------
                    if ((allow) && (e.shiftKey) &&
                        (((!opt.allowText) && ($.inArray(e.which,[188,190,191]) > -1)) ||
                         ($.inArray(e.which, opt.blacklist.shiftKey) > -1)
                        )) { allow = false; }
                }

                // Check Against Ctrl+Key, Alt+Key, and Ctrl+Alt+Key Blacklists --------------------
                if (((allow) && (e.ctrlKey) && (!e.altKey)) && ($.inArray(e.which, opt.blacklist.ctrlKey) > -1)) { allow = false; }
                if (((allow) && (!e.ctrlKey) && (e.altKey)) && ($.inArray(e.which, opt.blacklist.altKey) > -1)) { allow = false; }
                if (((allow) && (e.ctrlKey) && (e.altKey)) && ($.inArray(e.which, opt.blacklist.ctrlAltKey) > -1)) { allow = false; }

                // Finally, if not allowed by a set of criteria, stop it from happening ------------
                if (allow) { 
                    if (($(this).val().length < opt.maxSize)&&($(this).attr(lib_settings.attr.maxSize)==true)) if ($.isFunction(opt.onNotMaxSize)) opt.onNotMaxSize.apply(this);
                    if ($.isFunction(opt.onKeyAllowed)) opt.onKeyAllowed.apply(this);
                } else {
                    e.preventDefault(); 
                    if ($(this).val().length >= opt.maxSize) { 
                        $(this).attr(lib_settings.attr.maxSize,true);
                        if ($.isFunction(opt.onMaxSize)) opt.onMaxSize.apply(this); 
                    }
                    else { if ($.isFunction(opt.onKeyNotAllowed)) opt.onKeyNotAllowed.apply(this); }
                }
                
                if ($.isFunction(opt.onKeyDown)) { opt.onKeyDown.apply(this); }
            });
            
            // Paste Event -------------------------------------------------------------------------
            $(this).on('paste',function(e) {
                // Since there's not a good way to get the contents of the clipboard, run this function just after the text is pasted and change the value as needed.
                setTimeout(function() {
                    // If there are carriage returns, replace them with regular spaces
                    if ($this.val().indexOf('\n') > -1) { $this.val($this.val().split('\n').join(' ')); }

                    // If there are any values in the blacklisted character list, remove them
                    for (var i=0;i<opts.blacklist.chars.length;i++) {
                        var blacklistChar = opts.blacklist.chars.substr(i,1);
                        if ($this.val().indexOf(blacklistChar) > -1) { $this.val($this.val().split(blacklistChar).join('')); }
                    }

                    // If the resulting value is greater than our maxSize, trim off the end
                    if ($this.val().length > opts.maxSize) {
                        $this.val($this.val().substring(0,opts.maxSize));
                        if ($.isFunction(opt.onMaxSize)) { opt.onMaxSize.apply($this); }
                    }
                    
                    if ($.isFunction(opts.onPaste)) { opts.onPaste.apply($this); }
                });
            });
        });
        
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.textboxToTextArea = function(opt) {
        var fn_default = { cols: 30, rows: 1 };
        opt = $.extend({},opt_default,fn_default,opt);
        $(this).each(function(i) {
            var $textArea = $("<textarea>")
                .attr('id',$(this).attr('id'))
                .attr('name',$(this).attr('name'))
                .addClass($(this).attr('class'))
                .attr('value',$(this).val());
                
            $(this).replaceWith($textArea);
            if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply($textArea);
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return null;
    }
    
    // CHECKBOX FUNCTIONS ##########################################################################
    $.fn.check = function(opt) {
        opt = $.extend({},opt_default,opt);
        $(this).each(function(i) {
            var triggerUpdate = !($(this).isChecked());
            $(this).attr('checked',true);
            if (triggerUpdate) {
                $(this).trigger(lib_settings.triggers.update);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            }
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.uncheck = function(opt) {
        opt = $.extend({},opt_default,opt);
        $(this).each(function(i) {
            var triggerUpdate = $(this).isChecked();
            $(this).attr('checked',false);
            if (triggerUpdate) {
                $(this).trigger(lib_settings.triggers.update);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            }
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.toggleChecked = function(checked, opt) {
        if (typeof checked !== boolean) opt = checked;
        opt = $.extend({},opt_default,opt);
        if (checked !== undefined) {
            $(this).each(function() {
                var triggerUpdate = ($(this).isChecked() != checked);
                $(this).attr('checked',checked);
                if (triggerUpdate) {
                    $(this).trigger(lib_settings.triggers.update);
                    if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
                }
            });
        } else {
            $(this).each(function() { 
                $(this).attr('checked',!($(this).isChecked())); 
                $(this).trigger(lib_settings.triggers.update);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            });
        }
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.checkAll = function(opt) {
        opt = $.extend({},opt_default,opt);
        var $unchecked = $('input[type=checkbox]').not(':checked');
        $unchecked.check(opt);
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return $unchecked;
    }
    
    //==============================================================================================
    $.uncheckAll = function(opt) {
        opt = $.extend({},opt_default,opt);
        var $checked = $('input[type=checkbox]:checked');
        $checked.uncheck(opt);
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return $checked;
    }

    //==============================================================================================
    $.fn.isChecked = function() { return ($(this).attr('checked') !== undefined); }

    // OTHER FUNCTIONS #############################################################################
    $.fn.getObjectType = function(opt) {
        opt = $.extend({},opt_default,opt);
        var returnArray = $(this).map(function() {
            var objType = "";
            try { objType = (this.tagName.toLowerCase() === "input") ? this.type : this.tagName.toLowerCase(); } 
                catch(err) { objType = "unknown";  }
            return objType;
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return returnArray;
    }
    
    $.fn.timeout = function(timeSeconds, submitButton, opt) {
        var timeoutMilliseconds = timeSeconds * 1000;
        var fn_default = { timeout: 600000 };
        opt = $.extend({},opt_default,fn_default,opt);
    }
})( jQuery );

/* TO DO ###########################################################################################
- fix the toggleChecked w/ options
- finish $.fn.timeout
*/

/*
FUNCTION LIST
====================================================================================================
Text Input Functions
    [x] clearDefaultText
    [x] maskInput
    [x] textboxToTextArea
Checkbox Functions
    [x] isChecked
    [x] check
    [x] uncheck
    [x] toggleChecked
    [x] checkAll
    [x] uncheckAll
Radio Button Functions
    [ ] getRadioValue
    [ ] setRadioValue
Related Objects Functions
    [ ] RadioCheckboxes
    [ ] CascadeParentCheckbox
    [ ] CascadeParentCheckboxWithCallback
    [ ] ParentCheckboxEnabled
    [ ] ParentCheckboxVisibility
    [ ] ParentCheckboxToggleClass
    [ ] ParentCheckboxSetValue
    [ ] ParentCheckForRadioButtons
    [ ] ParentComboBoxEnabled
    [ ] ParentComboBoxVisibility
    [ ] ParentComboBoxToggleClass
    [ ] ParentComboBoxSetValue
    [ ] ParentComboBoxChildValues
    [ ] ChildCallbackToParentCheckbox
NEW Related Objects Functions
    [ ] RadioCheckbox
    [ ] CascadeCheckbox (incl callback in options)
    [ ] RelatedEnabled
    [ ] RelatedVisible
    [ ] RelatedToggleClass
    [ ] RelatedSetValue
Other Functions
    [ ] checkSubmit (preventSubmit?)
    [ ] vgr_init (rename to generateVGR?)
    [ ] jQueryFindItem (rename to jqFind?) 
    [x] getObjectType
    [ ] timeout
*/

/*
KEYCODE REFERENCE FOR maskInput
====================================================================================================
Code   Key                                    Code   Key
####   ########################               ####   ########################
  8    backspace                               85    u
  9    tab                                     86    v
 13    enter                                   87    w
 16    shift                                   88    x
 17    ctrl                                    89    y
 18    alt                                     90    z
 19    pause/break                             91    left window key
 20    caps lock                               92    right window key
 27    escape                                  93    select key
 33    page up                                 96    numpad 0
 34    page down                               97    numpad 1
 35    end                                     98    numpad 2
 36    home                                    99    numpad 3
 37    left arrow                             100    numpad 4
 38    up arrow                               101    numpad 5
 39    right arrow                            102    numpad 6
 40    down arrow                             103    numpad 7
 45    insert                                 104    numpad 8
 46    delete                                 105    numpad 9
 48    0                                      106    multiply
 49    1                                      107    add
 50    2                                      109    subtract
 51    3                                      110    decimal point
 52    4                                      111    divide
 53    5                                      112    f1
 54    6                                      113    f2
 55    7                                      114    f3
 56    8                                      115    f4
 57    9                                      116    f5
 65    a                                      117    f6
 66    b                                      118    f7
 67    c                                      119    f8
 68    d                                      120    f9
 69    e                                      121    f10
 70    f                                      122    f11
 71    g                                      123    f12
 72    h                                      144    num lock
 73    i                                      145    scroll lock
 74    j                                      186    semi-colon
 75    k                                      187    equal sign
 76    l                                      188    comma
 77    m                                      189    dash
 78    n                                      190    period
 79    o                                      191    forward slash
 80    p                                      192    grave accent
 81    q                                      219    open bracket
 82    r                                      220    back slash
 83    s                                      221    close braket
 84    t                                      222    single quote
















































*/