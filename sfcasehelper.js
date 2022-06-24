// ==UserScript==
// @name         SalesForce Case List Helper for CSEs
// @namespace    https://raw.githubusercontent.com/gokhanatil/tampermonkey/main/sfcasehelper.js
// @version      0.3
// @description  bringing back the correct colors to the indicator field, and enchancing the SupportRepComments column
// @author       Gokhan Atil
// @match        https://snowforce.lightning.force.com/*
// @grant        unsafeWindow
// ==/UserScript==



setInterval(function() {
    'use strict';

    if (document.URL.match('Case/list')) {


        var list_table = document.getElementsByTagName('table')[0];

        for( var i = 1; i < list_table.rows.length; i++ ) {
            myFunction( list_table.rows[i] );
        }

    }

    function ChangeColor( element, text, color ) {

        let original_string = element.getElementsByClassName('uiOutputTextArea')[0].innerHTML;
        let new_string = original_string.replace( text, '<span style="color:' + color + '">' + text + '</span>' );
        element.getElementsByClassName('uiOutputTextArea')[0].innerHTML = new_string;

    }

    function myFunction( cases ) {


        if (cases._data.record.SupportRepComments__c) {

            if (cases.getElementsByClassName('uiOutputTextArea')[0].innerHTML.includes( '<span>' )) return;

            let date_string = cases._data.record.SupportRepComments__c.split(':')[0];
            let target_date = new Date( date_string );
            let today = new Date( new Date().toISOString().slice(0, 10) );
            let diff = Math.ceil((target_date - today ) / (1000 * 3600 * 24));

            if (diff == 0 ) ChangeColor( cases, date_string, 'green' );
            if (diff < 0 ) ChangeColor( cases, date_string, 'red' );


        }

        if ( cases._data.record.Status == "Awaiting Customer" ) {
            cases.getElementsByClassName('forceOutputFormulaHtml')[0].innerHTML = '<img src="/resource/1555628358000/GREEN?" alt="Green" border="0" >';
        }

        if ( cases._data.record.Status == "Customer Responded" ) {
            cases.getElementsByClassName('forceOutputFormulaHtml')[0].innerHTML = '<img src="/resource/1555628379000/RED?" alt="RED" border="0" >';
        }

        if ( cases._data.record.Status == "New" ) {
            cases.getElementsByClassName('forceOutputFormulaHtml')[0].innerHTML = '<img src="/resource/1555628379000/RED?" alt="RED" border="0" >';
        }

        if ( cases._data.record.Sub_Status__c == "Investigating" ) {
            cases.getElementsByClassName('forceOutputFormulaHtml')[0].innerHTML = '<img src="/resource/1555628379000/YELLOW?" alt="YELLOW" border="0" >';
        }


    }
}, 1000 );
