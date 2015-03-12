# jquery-iforms

iForm Script Library based using the jQuery framework
http://heo-iforms.blogger.com/

<!-- This file contains scripts that deal with the *FUNCTIONALITY* of an iForm
If you are looking for scripts that deal with *STYLING*, please also include `jquery.iforms.style.js`
If you are looking for scripts that deal with *UI ELEMENTS*, please also include `jquery.iforms-ui.js`

There are also additional scripts for `QTIP` and Date Functions
 -->
Version: 0.1

Dual licensed under MIT or GPLv2 licenses
  http://en.wikipedia.org/wiki/MIT_License
  http://en.wikipedia.org/wiki/GNU_General_Public_License

Requires: jQuery

### Function List
* Text Input Functions
    * [x] clearDefaultText
    * [x] maskInput (includes functions for maxSize)
    * [x] textboxToTextArea
* Radio Button Functions
    * [x] getRadio
    * [x] _uniqueRadioNames
    * [x] getRadioValue
    * [x] setRadioValue
    * [x] makeUncheckable
* Checkbox Functions
    * [x] check
    * [x] uncheck
    * [x] toggleChecked
    * [x] checkAll
    * [x] uncheckAll
    * [x] isChecked
* Combobox Functions
    * [x] setCombobox
    * [x] comboboxText
* Related Objects Functions
    * [x] radioCheckbox
    * [x] cascadeCheckbox (incl callback in options)
    * [ ] relatedEnabled
    * [x] relatedVisible
    * [x] relatedToggleClass
    * [x] relatedSetValue
    * [ ] selectOnUpdate (old ChildCallbackToParentCheckbox function)
* Trigger Functions
    * [x] triggerUpdateOnAll
    * [x] addUpdateTrigger
    * [x] triggerUpdate
    * [x] hasTrigger
* Other Functions
    * [x] reset
    * [x] tryFocus
    * [x] addCSSrule
    * [x] getObjectType
    * [x] submitOnTimeout
    * [x] ':textMatches' expression
    * [x] vgr_init
    * [x] set
    * [ ] checkSubmit (preventSubmit?)
    * [ ] synchControls (?)

### To Do:
* fix the `toggleChecked` w/ options
* finish `$.fn.timeout`

### Keycode Reference for `maskInput`
| Code | Key |
| ---- | --- |
|  8 | <kbd>backspace</kbd>   |      
|  9 | <kbd>tab</kbd>         |      
| 13 | <kbd>enter</kbd>       |     
| 16 | <kbd>shift</kbd>       |     
| 17 | <kbd>ctrl</kbd>        |     
| 18 | <kbd>alt</kbd>         |     
| 19 | <kbd>pause/break</kbd> | 
| 20 | <kbd>caps lock</kbd>   | 
| 27 | <kbd>escape</kbd>      | 
| 33 | <kbd>page up</kbd>     | 
| 34 | <kbd>page down</kbd>   | 
| 35 | <kbd>end</kbd>         | 
| 36 | <kbd>home</kbd>        | 
| 37 | <kbd>left arrow</kbd>  | 
| 38 | <kbd>up arrow</kbd>    | 
| 39 | <kbd>right arrow</kbd> | 
| 40 | <kbd>down arrow</kbd>  | 
| 45 | <kbd>insert</kbd>      | 
| 46 | <kbd>delete</kbd>      | 
| 48 | <kbd>0</kbd> | 
| 49 | <kbd>1</kbd> | 
| 50 | <kbd>2</kbd> | 
| 51 | <kbd>3</kbd> | 
| 52 | <kbd>4</kbd> | 
| 53 | <kbd>5</kbd> | 
| 54 | <kbd>6</kbd> | 
| 55 | <kbd>7</kbd> | 
| 56 | <kbd>8</kbd> | 
| 57 | <kbd>9</kbd> | 
| 65 | <kbd>a</kbd> | 
| 66 | <kbd>b</kbd> | 
| 67 | <kbd>c</kbd> | 
| 68 | <kbd>d</kbd> | 
| 69 | <kbd>e</kbd> | 
| 70 | <kbd>f</kbd> | 
| 71 | <kbd>g</kbd> | 
| 72 | <kbd>h</kbd> | 
| 73 | <kbd>i</kbd> | 
| 74 | <kbd>j</kbd> | 
| 75 | <kbd>k</kbd> | 
| 76 | <kbd>l</kbd> | 
| 77 | <kbd>m</kbd> | 
| 78 | <kbd>n</kbd> | 
| 79 | <kbd>o</kbd> | 
| 80 | <kbd>p</kbd> | 
| 81 | <kbd>q</kbd> | 
| 82 | <kbd>r</kbd> | 
| 83 | <kbd>s</kbd> | 
| 84 | <kbd>t</kbd> | 
| 85 | <kbd>u</kbd> |
| 86 | <kbd>v</kbd> |
| 87 | <kbd>w</kbd> |
| 88 | <kbd>x</kbd> |
| 89 | <kbd>y</kbd> |
| 90 | <kbd>z</kbd> |
| 91 | left <kbd>window</kbd> |
| 92 | right <kbd>window</kbd> |
| 93 | <kbd>select</kbd> |
| 96 | numpad <kbd>0</kbd> |
| 97 | numpad <kbd>1</kbd> |
| 98 | numpad <kbd>2</kbd> |
| 99 | numpad <kbd>3</kbd> |
| 00 | numpad <kbd>4</kbd> |
| 01 | numpad <kbd>5</kbd> |
| 02 | numpad <kbd>6</kbd> |
| 03 | numpad <kbd>7</kbd> |
| 04 | numpad <kbd>8</kbd> |
| 05 | numpad <kbd>9</kbd> |
| 06 | numpad <kbd>*</kbd> |
| 07 | numpad <kbd>+</kbd> |
| 09 | numpad <kbd>-</kbd> |
| 10 | numpad <kbd>.</kbd> |
| 11 | numpad <kbd>/</kbd> |
| 12 | <kbd>f1</kbd> |
| 13 | <kbd>f2</kbd> |
| 14 | <kbd>f3</kbd> |
| 15 | <kbd>f4</kbd> |
| 16 | <kbd>f5</kbd> |
| 17 | <kbd>f6</kbd> |
| 18 | <kbd>f7</kbd> |
| 19 | <kbd>f8</kbd> |
| 20 | <kbd>f9</kbd> |
| 21 | <kbd>f10</kbd> |
| 22 | <kbd>f11</kbd> |
| 23 | <kbd>f12</kbd> |
| 44 | <kbd>num lock</kbd> |
| 45 | <kbd>scroll lock</kbd> |
| 86 | <kbd>;</kbd> |
| 87 | <kbd>=</kbd> |
| 88 | <kbd>,</kbd> |
| 89 | <kbd>-</kbd> |
| 90 | <kbd>.</kbd> |
| 91 | <kbd>/</kbd> |
| 92 | <kbd>`</kbd> |
| 19 | <kbd>[</kbd> |
| 20 | <kbd>\\</kbd> |
| 21 | <kbd>]</kbd> |
| 22 | <kbd>'</kbd> |
