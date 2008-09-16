/*
 * File Authors:
 * 		Alfonso Martínez de Lizarrondo
 *
 * Based on fck_link.js
 * 
 */

function Import(aSrc) {
   document.write('<scr'+'ipt type="text/javascript" src="' + aSrc + '"></sc' + 'ript>');
}

var oEditor		= window.parent.InnerDialogLoaded() ;
var FCK			= oEditor.FCK ;
var FCKLang		= oEditor.FCKLang ;
var FCKConfig	= oEditor.FCKConfig ;

Import(FCKConfig.FullBasePath + 'dialog/common/fck_dialog_common.js');

//#### Regular Expressions library.
var oRegex = new Object() ;

//adjusted to allow an url starting with / as a good one
oRegex.UriProtocol = new RegExp('') ;
oRegex.UriProtocol.compile( '^(((http|https|ftp|news):\/\/)|mailto:|\/)', 'gi' ) ;



//#### Initialization Code

// oLink: The actual selected link in the editor.
var oLink = FCK.Selection.MoveToAncestorNode( 'A' ) ;
if ( oLink )
	FCK.Selection.SelectNode( oLink ) ;

window.onload = function()
{
	// Translate the dialog box texts.
	oEditor.FCKLanguageManager.TranslatePage(document) ;

	// Load the selected link information (if any).
	LoadSelection() ;

	GetE('txtUrl').focus();
	window.parent.SetAutoSize( true ) ;

	// Activate the "OK" button.
	window.parent.SetOkButton( true ) ;
}


function LoadSelection()
{
	if ( !oLink ) return ;

	// Get the actual Link href.
	var sHRef = oLink.getAttribute( '_fcksavedurl' ) ;
	if ( !sHRef || sHRef.length == 0 )
		sHRef = oLink.getAttribute( 'href' , 2 ) + '' ;
	

	GetE('txtUrl').value = sHRef ;

//	GetE('txtAttTitle').value		= oLink.title ;
}


//#### The OK button was hit.
function Ok()
{
	var sUri, sInnerHtml ;

	sUri = GetE('txtUrl').value ;

	if ( sUri.length == 0 )
	{
		alert( FCKLang.DlnLnkMsgNoUrl ) ;
		return false ;
	}
	oEditor.FCKUndo.SaveUndoStep() ;

	//check that the links have a proper protocol or assume http
	var sProtocol = oRegex.UriProtocol.exec( sUri ) ;
	if ( !sProtocol )
	{
		sUri = "http://" + sUri ;
	}

	// If no link is selected, create a new one (it may result in more than one link creation - #220).
	var aLinks = oLink ? [ oLink ] : oEditor.FCK.CreateLink( sUri, true ) ;

	// If no selection, no links are created, so use the uri as the link text (by dom, 2006-05-26)
	var aHasSelection = ( aLinks.length > 0 ) ;
	if ( !aHasSelection )
	{
		sInnerHtml = sUri;

		var oLinkPathRegEx = new RegExp("//?([^?\"']+)([?].*)?$");
		var asLinkPath = oLinkPathRegEx.exec( sUri );
		if (asLinkPath != null)
			sInnerHtml = asLinkPath[1];  // use matched path

		// Create a new (empty) anchor.
		aLinks = [ oEditor.FCK.InsertElement( 'a' ) ] ;
	}
	
	for ( var i = 0 ; i < aLinks.length ; i++ )
	{
		oLink = aLinks[i] ;

		if ( aHasSelection )
			sInnerHtml = oLink.innerHTML ;		// Save the innerHTML (IE changes it if it is like an URL).


		oLink.href = sUri ;
		SetAttribute( oLink, '_fcksavedurl', sUri ) ;

		oLink.innerHTML = sInnerHtml ;		// Set (or restore) the innerHTML
	}

	// Select the (first) link.
	oEditor.FCKSelection.SelectNode( aLinks[0] );
	
	return true ;
}


function SetUrl( url )
{
	document.getElementById('txtUrl').value = url ;
}


