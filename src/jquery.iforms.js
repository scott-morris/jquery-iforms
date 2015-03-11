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
;(function( $ ){
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
        style: 'iform-style',
        attr: {
            defaultValue: 'iform-defaultValue',
            maxSize: 'iform-maxSize'
        }
    };

    //==============================================================================================
    var opt_default = {
        stopAction: false,
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
                    if (($(this).val().length < opt.maxSize)&&($(this).attr(lib_settings.attr.maxSize)==true)) {
                        $(this).attr(lib_settings.attr.maxSize,false);
                        if ($.isFunction(opt.onNotMaxSize)) opt.onNotMaxSize.apply(this);
                    }
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
                    if ($this.val().length >= opts.maxSize) {
                        $this.val($this.val().substring(0,opts.maxSize));
                        $(this).attr(lib_settings.attr.maxSize,true);
                        if ($.isFunction(opt.onMaxSize)) { opt.onMaxSize.apply($this); }
                    }
                    
                    // If the resulting value is less than our maxSize and it previously was at maxSize..
                    if (($(this).val().length < opt.maxSize)&&($(this).attr(lib_settings.attr.maxSize)==true)) {
                        $(this).attr(lib_settings.attr.maxSize,false);
                        if ($.isFunction(opt.onNotMaxSize)) opt.onNotMaxSize.apply(this);
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
    
    // RADIO BUTTON FUNCTIONS ######################################################################
    $.getRadio = function(radioName) { return $('input:radio[name="' + radioName + '"]'); }
    //----------------------------------------------------------------------------------------------
    $.fn._uniqueRadioNames = function() {
        var radioNameArray = $(this).map(function() { return $(this).attr('name'); }).get();
        radioNameArray = $.unique(radioNameArray);
        return radioNameArray;
    }
    
    //==============================================================================================
    $.getRadioValue = function(radioName, opt) { return $.getRadio(radioName).getRadioValue(opt); }
    //----------------------------------------------------------------------------------------------
    $.fn.getRadioValue = function(opt) {
        opt = $.extend({},opt_default,opt);
        
        var radioNameArray = $(this)._uniqueRadioNames();        
        var returnArray = [];
        
        $.each(radioNameArray,function(i,rdoName) {
            var $thisGroup = $.getRadio(rdoName);
            var thisValue = ($thisGroup.is(':checked')) ? $thisGroup.filter(':checked').val() : '';
            returnArray.push(thisValue);
        });
        return returnArray;
    }
    
    //==============================================================================================
    $.setRadioValue = function(radioName, newVal, opt) { return $.getRadio(radioName).setRadioValue(newVal, opt); }
    //----------------------------------------------------------------------------------------------
    $.fn.setRadioValue = function(newVal, opt) {
        opt = $.extend({},opt_default,opt);
        
        var radioNameArray = $(this)._uniqueRadioNames();        
        $.each(radioNameArray,function(i,rdoName) {
            var $thisGroup = $.getRadio(rdoName);
            var $oldChecked = $thisGroup.filter(':checked');
            var $newChecked = $thisGroup.filter('[value="' + newVal + '"]');
            if (($newChecked.length > 0) && ($oldChecked.val() != newVal)) {
                $newChecked.check();
                $oldChecked.trigger(lib_settings.triggers.update);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            }
        });

        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;    
    }

    //==============================================================================================
    $.fn.makeUncheckable = function(opt) {
        opt = $.extend({},opt_default,opt);
        
        $(this).each(function(i) {
            $(this)
                .mousedown(function() { $(this).data("checkedOnMouseDown",$(this).isChecked()); })
                .click(function() { if ($(this).data("checkedOnMouseDown")) { $(this).uncheck(); } });
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
                $(this).triggerUpdate(opt);
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
                $(this).triggerUpdate(opt);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            }
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.toggleChecked = function(checked, opt) {
        if (typeof checked !== "boolean") {
            opt = checked;
            checked = undefined;
        }
        opt = $.extend({},opt_default,opt);
        if (checked !== undefined) {
            $(this).each(function() {
                var triggerUpdate = ($(this).isChecked() != checked);
                $(this).attr('checked',checked);
                if (triggerUpdate) {
                    $(this).triggerUpdate(opt);
                    if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
                }
            });
        } else {
            $(this).each(function() { 
                $(this).attr('checked',!($(this).isChecked())); 
                $(this).triggerUpdate(opt);
                //$(this).trigger(lib_settings.triggers.update);
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
    $.fn.isChecked = function() { return ($(this).is(':checked')); }

    // COMBOBOX FUNCTIONS ##########################################################################
    $.fn.setCombobox = function(newVal, opt) {
        opt = $.extend({},opt_default,opt);
        $(this).each(function(i){
            // If newVal is found in the list of value options
            if ($(this).children('option[value="' + newVal + '"]').length != 0) {
                $(this).val(newVal);
                $(this).triggerUpdate(opt);

            // If newVal was not found in the list of values, but is found in the visible text options
            } else if ($(this).children('option:textMatches("' + newVal + '")').length != 0) {
                $(this).children('option:textMatches("' + newVal + '")').attr('selected',true);
                $(this).val(newVal).triggerUpdate(opt);
            }
            if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
        });        
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.comboboxText = function(opt) { 
        opt = $.extend({},opt_default,opt);
        var returnArray = $(this).map(function() { return $(this).children('option:selected').text(); });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return returnArray;
    }
    
    // RELATED OBJECTS FUNCTIONS ###################################################################
    $.fn.radioCheckbox = function(opt) {
        opt = $.extend({},opt_default,opt);
        var $wholeGroup = ($(this).is('input:checkbox')) ? $(this) : $(this).find('input:checkbox');
        
        $wholeGroup.onUpdate(function () {
            if ($(this).isChecked()) {
                $wholeGroup.not($(this)).uncheck();
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            }
        });
        $wholeGroup.addUpdateTrigger();

        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.cascadeCheckbox = function(relObj, opt) {
        var fn_default = {
            checkParentIfChildChecked: true,
            uncheckParentIfNoChildChecked: true
        };
        opt = $.extend({},opt_default,fn_default,opt);
        
        var $parent = $(this);
        var $relObj = $(relObj);
        
        $parent.onUpdate(function(t_opt) {
            t_opt = $.extend({stopAction:false},t_opt);
            if (!t_opt.stopAction) $relObj.toggleChecked($(this).isChecked()); 
        });
        
        if (opt.checkParentIfChildChecked) {
            $relObj.each(function(i,obj) {
                $(this).onUpdate(function() {
                    if ($(this).isChecked()) $parent.check({stopAction:true});
                });
            });
        }
        
        if (opt.uncheckParentIfNoChildChecked) {
            $relObj.each(function(i,obj) {
                $(this).onUpdate(function() {
                    if ($relObj.filter(':checked').length == 0) $parent.uncheck({stopAction:true});
                });
            });
        }
        
        // Trigger Updates on Child Objects
        $relObj.triggerUpdate(opt);
        
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }

    //==============================================================================================
    $.fn.relatedVisible = function(relObj, opt) {
        var fn_default = {
            triggerValues: [],
            negativeCorrelation: false
        };
        opt = $.extend({},opt_default,fn_default,opt);
        
        var $parent = $(this),
            $relObj = $(relObj),
            relObjVisible;
        
        if ($parent.is('input:checkbox, input:radio')) {
            $parent.onUpdate(function() {
                relObjVisible = ($parent.isChecked() ^ opt.negativeCorrelation) ? true : false;
                $relObj.toggle(relObjVisible);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            });
        } else {
            $parent.onUpdate(function() {
                relObjVisible = ($parent.triggerCriteriaMet(opt) ^ opt.negativeCorrelation) ? true : false;
                $relObj.toggle(relObjVisible);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            });
        }

        $parent.triggerUpdate(opt);
        
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
/*    
    //==============================================================================================
    $.fn.relatedEnabled = function(relObj, opt) {
        var fn_default = {
            triggerValues: [],
            negativeCorrelation: false
        };
        opt = $.extend({},opt_default,fn_default,opt);
        
        var $parent = $(this),
            $relObj = $(relObj),
            relObjEnabled;
        
        if ($parent.is('input:checkbox, input:radio')) {
            $parent.onUpdate(function() {
                relObjEnabled = ($parent.isChecked() ^ opt.negativeCorrelation) ? true : false;
                
            });
        } else {
            $parent.onUpdate(function() {
                relObjEnabled = ($parent.triggerCriteriaMet(opt) ^ opt.negativeCorrelation) ? true : false;
                
            });
        }

        $parent.triggerUpdate(opt);

        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
*/    
    //==============================================================================================
    $.fn.relatedToggleClass = function(relObj, className, opt) {
        var fn_default = {
            triggerValues: [],
            negativeCorrelation: false
        };
        opt = $.extend({},opt_default,fn_default,opt);
        
        var $parent = $(this),
            $relObj = $(relObj),
            relObjApplyClass;
        
        if ($parent.is('input:checkbox, input:radio')) {
            $parent.onUpdate(function() {
                relObjApplyClass = ($parent.isChecked() ^ opt.negativeCorrelation) ? true : false;
                $relObj.toggleClass(className, relObjApplyClass);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            });
        } else {
            $parent.onUpdate(function() {
                relObjApplyClass = ($parent.triggerCriteriaMet(opt) ^ opt.negativeCorrelation) ? true : false;
                $relObj.toggleClass(className, relObjApplyClass);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            });
        }

        $parent.triggerUpdate(opt);

        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    //==============================================================================================
    $.fn.relatedSetValue = function(relObj, newValue, opt) {
        var fn_default = {
            triggerValues: [],
            negativeCorrelation: false
        };
        opt = $.extend({},opt_default,fn_default,opt);
        
        var $parent = $(this),
            $relObj = $(relObj),
            relObjSetValue;
        
        if ($parent.is('input:checkbox, input:radio')) {
            $parent.onUpdate(function() {
                relObjSetValue = ($parent.isChecked() ^ opt.negativeCorrelation) ? true : false;
                $relObj.set(relObjSetValue);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            });
        } else {
            $parent.onUpdate(function() {
                relObjSetValue = ($parent.triggerCriteriaMet(opt) ^ opt.negativeCorrelation) ? true : false;
                $relObj.set(relObjSetValue);
                if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply(this);
            });
        }

        $parent.triggerUpdate(opt);

        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }

/*    
    //==============================================================================================
    function triggerRelation(opt) {
        var fn_default = {
            
        };
        opt = $.extend({},opt_default,fn_default,opt);
    }
*/  
    //==============================================================================================
    $.fn.triggerCriteriaMet = function(opt) {
        var fn_default = {
            triggerValues: []
        };
        opt = $.extend({},opt_default,fn_default,opt);

        var $relObj = $(this),
            objType = $relObj.getObjectType()[0],
            triggered = false;
        
        if ($.inArray(objType,['checkbox','radio']) > -1) {
            if (opt.triggerValues.length == 0) {
                triggered = $relObj.isChecked();
            } else {
                if ($relObj.isChecked()) {
                    if ($.inArray(true,opt.triggerValues)) triggered = true;
                    if ($.inArray("true",opt.triggerValues)) triggered = true;
                    if ($.inArray("checked",opt.triggerValues)) triggered = true;
                } else { // not checked
                    if ($.inArray(false,opt.triggerValues)) triggered = true;
                    if ($.inArray("false",opt.triggerValues)) triggered = true;
                    if ($.inArray("unchecked",opt.triggerValues)) triggered = true;
                }
            }
        } else {
            if ($.inArray($relObj.val(),opt.triggerValues) > -1) triggered = true;
        }

        return triggered;
    }
    //==============================================================================================
    $.fn.toggleVisibilityOnClick = function(relObj, opt) {
        var fn_default = {
            startHidden: true
        };
        opt = $.extend({},opt_default,fn_default,opt);
        var $relObj = $(relObj);

        $(this).click(function() { $relObj.toggle(); });
        $relObj.toggle(!opt.startHidden);
        
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }
    
    // TRIGGER FUNCTIONS ###########################################################################
    $.fn.onUpdate = function(f) {
        if ($.isFunction(f)) {
            $(this).bind(lib_settings.triggers.update, function(e,args) { f.call(this,args); });
            $(this).addUpdateTrigger();
        }
    }
    
    //==============================================================================================
    $.triggerUpdateOnAll = function(opt) { 
        var opt = $.extend({},opt_default,opt);
        $('input').triggerUpdate(opt); 
    }
    
    //==============================================================================================
    $.fn.addUpdateTrigger = function() {
        $(this).each(function(i) {
            var eventName = ($(this).is('input:checkbox, input:radio')) ? 'click' : 'change';
            $(this).on(eventName,function() { $(this).trigger(lib_settings.triggers.update); }); 
        });
    }

    //==============================================================================================
    $.fn.triggerUpdate = function(opt) { 
        opt = $.extend({},opt);
        $(this).trigger(lib_settings.triggers.update,opt); 
        return this;
    }

    //==============================================================================================
    $.fn.hasTrigger = function(triggerName) {
        var triggers = $.data($(this)[0],'events');
        var triggerPresent = false;        
        try {
            triggerPresent = (triggers[triggerName] !== undefined);
        } catch(err) { /* do nothing */ }
        return triggerPresent;
    }
    
    //==============================================================================================
    $.fn.triggerList = function() {
        var triggers = $.data($(this)[0],'events');
        return triggers;
    }
    
    // OTHER FUNCTIONS #############################################################################
    $.fn.reset = function(opt) {
        opt = $.extend({},opt_default,opt);
        $(this).each(function(i) {
            this.reset();
            $(this).find('input, select, textarea').triggerUpdate();
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
    }

    //==============================================================================================
    $.fn.tryFocus = function(opt) {
        opt = $.extend({},opt_default,opt);
        var found = false;
        $(this).each(function(i) {
            if ($(this).is(":visible")) {
                $(this).focus();
                found = true;
                return false;
            }
        });
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        
        return found;
    }
    
    //==============================================================================================
    $.fn.addCSSrule = function(css, id) {
        if (id === undefined) id = lib_settings.style;
        if ($('style#' + id).length == 0) {
            var newCSSrule = $('<style type="text/css">').attr('id',id).append(css);
            $('head').append(newCSSrule);
        } else {
            var cssRule = $('style#' + id).append(css);
        }
    }
    
    //==============================================================================================
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
    
    //==============================================================================================
    $.submitOnTimeout = function(submitButton, opt) {
        var fn_default = { 
            seconds: 585, /* 9.75 minutes, just before the default 10 minute timeout of HEO */
            onTimeout: function() { $(submitButton).click(); }
        };
        opt = $.extend({},opt_default,fn_default,opt);
        var timeoutMilliseconds = opt.seconds * 1000;
        setTimeout(opt.onTimeout, timeoutMilliseconds);
    }
    
    //==============================================================================================
    $.expr[":"].textMatches = function(obj, index, meta, stack){
        return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
    }
    
    //==============================================================================================
    $.vgr_init = function(opt) {
        var fn_default = { 
            outputTo: 'newWindow' // valid options: newWindow, console, jquery object
        };
        opt = $.extend({},opt_default,fn_default,opt);

        var output = [], 
            line = '', 
            itemVal = '', 
            strOutput;

        // Drop Down Boxes -------------------------------------------------------------------------
        if ($('select').length > 0) output.push('# Drop Down Boxes ' + Array(81).join('-'));
        $.each($('select'),function(i,item) {
            itemVal = ($(item).val() !== '') ? '"' + $(item).val() + '"' : '';
            line = 'INIT,SET,SELECT,' + $(item).attr('id') + ',TO,' + itemVal;
            output.push(line);
        });

        // Checkboxes ------------------------------------------------------------------------------
        if ($('input:checkbox').length > 0) output.push('# Checkboxes ' + Array(86).join('-'));
        $.each($('input:checkbox'),function(i,item) {
            itemVal = ($(item).isChecked()) ? '"' + $(item).val() + '"' : '';
            line = 'INIT,SET,CHECKBOX,' + $(item).attr('id') + ',TO,' + itemVal;
            output.push(line);
        });
        
        // Radio Buttons ---------------------------------------------------------------------------
        if ($('input:radio').length > 0) output.push('# Radio Buttons ' + Array(83).join('-'));
        var radioGroups = $('input:radio')._uniqueRadioNames();
        $.each(radioGroups, function(i,rdoGroup) {
            itemVal = ($.getRadioValue(rdoGroup)[0] !== '') ? '"' + $.getRadioValue(rdoGroup)[0] + '"' : '';
            line = 'INIT,SET,RADIO,' + rdoGroup + ',TO,' + itemVal;
            output.push(line);
        });
        
        // Text Boxes ------------------------------------------------------------------------------
        if ($('input:text').length > 0) output.push('# Text Boxes ' + Array(86).join('-'));
        $.each($('input:text'), function(i,item) {
            itemVal = ($(item).val() !== '') ? '"' + $(item).val() + '"' : '';
            line = 'INIT,SET,TEXT,' + $(item).attr('id') + ',TO,' + itemVal;
            output.push(line);
        });
        
        // Buttons ---------------------------------------------------------------------------------
        if ($('input:button, input:reset, input:submit').length > 0) output.push('# Buttons ' + Array(89).join('-'));
        $.each($('input:button, input:reset, input:submit'),function(i,item) {
            line = 'INIT,SET,HIDDEN,' + $(item).attr('id') + ',TO,';
            output.push(line);
        });

        switch (opt.outputTo) {
            case 'newWindow':
                opt.separator = opt.separator || '<br />';
                strOutput = output.join(opt.separator);
                
                myWindow=window.open('','','width=650,height=600,location=no,left=10,top=10');
                myWindow.document.write(strOutput);
                myWindow.focus();                    
            break;
            
            case 'console':
                opt.separator = opt.separator || '\n';
                strOutput = output.join(opt.separator);
                console.log(strOutput);
            break;
            
            default:
                opt.separator = opt.separator || '<br />';
                strOutput = output.join(opt.separator);
                if ($(opt.outputTo).length > 0) $(opt.outputTo).append(strOutput);
            break;
        }
     
        return strOutput;
    }

    //==============================================================================================
    $.fn.set = function(newVal,opt) {
        opt = $.extend({},opt_default,opt);
        $.each($(this),function(i,item) {
            switch ($(item).getObjectType()[0]) {
                case 'select':
                    $(this).setCombobox(newVal);
                break;
                
                case 'radio':
                    $(this).setRadioValue(newVal);
                break;
                
                case 'checkbox':
                    var checked = false;
                    if (typeof newVal == 'boolean') {
                        checked = newVal;
                    } else {
                        checked = (newVal.toLowerCase() == 'checked');
                    }
                    $(this).toggleChecked(checked);
                break;
                
                default:
                    $(this).val(newVal).trigger(lib_settings.triggers.update);
                break;
            }
            
            if ($.isFunction(opt.afterUpdate)) opt.afterUpdate.apply($textArea);
        });
        
        if ($.isFunction(opt.callback)) opt.callback.apply(this);
        return this;
    }    
})( jQuery );

/* TO DO ###########################################################################################
*/

/*
FUNCTION LIST
====================================================================================================
Text Input Functions
    [x] clearDefaultText
    [x] maskInput (includes functions for maxSize)
    [x] textboxToTextArea
Radio Button Functions
    [x] getRadio
    [x] _uniqueRadioNames
    [x] getRadioValue
    [x] setRadioValue
    [x] makeUncheckable
Checkbox Functions
    [x] check
    [x] uncheck
    [x] toggleChecked
    [x] checkAll
    [x] uncheckAll
    [x] isChecked
Combobox Functions
    [x] setCombobox
    [x] comboboxText
Related Objects Functions
    [x] radioCheckbox
    [x] cascadeCheckbox (incl callback in options)
    [ ] relatedEnabled
    [x] relatedVisible
    [x] relatedToggleClass
    [x] relatedSetValue
    [ ] selectOnUpdate (old ChildCallbackToParentCheckbox function)
Trigger Functions
    [x] triggerUpdateOnAll
    [x] addUpdateTrigger
    [x] triggerUpdate
    [x] hasTrigger
Other Functions
    [x] reset
    [x] tryFocus
    [x] addCSSrule
    [x] getObjectType
    [x] submitOnTimeout
    [x] ':textMatches' expression
    [x] vgr_init
    [x] set
    [ ] checkSubmit (preventSubmit?)
    [ ] synchControls (?)
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