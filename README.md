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
| Code | Key           | | Code | Key |
| ------ | --------------- | - | ------ | ----- |
|  8 | backspace       | | 85 | u |
|  9 | tab             | | 86 | v |
| 13 | enter           | | 87 | w |
| 16 | shift           | | 88 | x |
| 17 | ctrl            | | 89 | y |
| 18 | alt             | | 90 | z |
| 19 | pause/break     | | 91 | left window key |
| 20 | caps lock       | | 92 | right window key |
| 27 | escape          | | 93 | select key |
| 33 | page up         | | 96 | numpad 0 |
| 34 | page down       | | 97 | numpad 1 |
| 35 | end             | | 98 | numpad 2 |
| 36 | home            | | 99 | numpad 3 |
| 37 | left arrow      | | 00 | numpad 4 |
| 38 | up arrow        | | 01 | numpad 5 |
| 39 | right arrow     | | 02 | numpad 6 |
| 40 | down arrow      | | 03 | numpad 7 |
| 45 | insert          | | 04 | numpad 8 |
| 46 | delete          | | 05 | numpad 9 |
| 48 | 0               | | 06 | multiply |
| 49 | 1               | | 07 | add |
| 50 | 2               | | 09 | subtract |
| 51 | 3               | | 10 | decimal point |
| 52 | 4               | | 11 | divide |
| 53 | 5               | | 12 | f1 |
| 54 | 6               | | 13 | f2 |
| 55 | 7               | | 14 | f3 |
| 56 | 8               | | 15 | f4 |
| 57 | 9               | | 16 | f5 |
| 65 | a               | | 17 | f6 |
| 66 | b               | | 18 | f7 |
| 67 | c               | | 19 | f8 |
| 68 | d               | | 20 | f9 |
| 69 | e               | | 21 | f10 |
| 70 | f               | | 22 | f11 |
| 71 | g               | | 23 | f12 |
| 72 | h               | | 44 | num lock |
| 73 | i               | | 45 | scroll lock |
| 74 | j               | | 86 | semi-colon |
| 75 | k               | | 87 | equal sign |
| 76 | l               | | 88 | comma |
| 77 | m               | | 89 | dash |
| 78 | n               | | 90 | period |
| 79 | o               | | 91 | forward slash |
| 80 | p               | | 92 | grave accent |
| 81 | q               | | 19 | open bracket |
| 82 | r               | | 20 | back slash |
| 83 | s               | | 21 | close braket |
| 84 | t               | | 22 | single quote |
