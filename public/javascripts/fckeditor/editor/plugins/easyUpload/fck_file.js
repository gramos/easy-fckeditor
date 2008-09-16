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


	GetE('frmUpload').action = FCKConfig.LinkUploadURL ;

	// Activate the "OK" button.
	window.parent.SetOkButton( true ) ;
}


function LoadSelection()
{
	if ( !oLink ) {
		//set the focus on the file selector
		GetE("txtUploadFile").focus();
		return ;
	}
	
	// Get the actual Link href.
	var sHRef = oLink.getAttribute( '_fcksavedurl' ) ;
	if ( !sHRef || sHRef.length == 0 )
		sHRef = oLink.getAttribute( 'href' , 2 ) + '' ;
	

	GetE('txtUrl').value = sHRef ;

	GetE('txtAttTitle').value		= oLink.title ;
}


//#### The OK button was hit.
function Ok()
{
	var sUri, sInnerHtml ;

	//check if the user has selected a file to upload (we're overiding the default behaviour of the link dialog)
	var sFile = GetE('txtUploadFile').value ;
	if (sFile.length > 0) 
	{
		//upload the file
		if ( CheckUpload() )
			GetE('frmUpload').submit();

		return false ; //we'll finish once the file is at the server
	}

	sUri = GetE('txtUrl').value ;
	if ( sUri.length == 0 )
	{
		//if the url is empty check to see if they have already selected a file
		CheckUpload();
		return false ; 
	}
	oEditor.FCKUndo.SaveUndoStep() ;

	// If no link is selected, create a new one (it may result in more than one link creation - #220).
	var aLinks = oLink ? [ oLink ] : oEditor.FCK.CreateLink( sUri, true ) ;
	
	// If no selection, no links are created, so use the uri as the link text (by dom, 2006-05-26)
	var aHasSelection = ( aLinks.length > 0 ) ;
	if ( !aHasSelection )
	{
		sInnerHtml = sUri;

		// Try to built better text for empty link
		// Adjusted to get only the file name and exclude the path:
		var oLinkPathRegEx = new RegExp("(^.*\\/|^)([^\\/]*?)(\\?.*$|$)");
		var asLinkPath = oLinkPathRegEx.exec( sUri );
		if (asLinkPath != null)
			sInnerHtml = asLinkPath[2];  // use matched path

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

		// Target
		SetAttribute( oLink, 'target', '_blank' ) ;

		// Advances Attributes
		SetAttribute( oLink, 'title', GetE('txtAttTitle').value ) ;

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

function OnUploadCompleted( errorNumber, fileUrl, fileName, customMsg )
{
	switch ( errorNumber )
	{
		case 0 :	// No errors
//			alert( 'Your file has been successfully uploaded' ) ;
			break ;
		case 1 :	// Custom error
			alert( customMsg ) ;
			return ;
		case 101 :	// Custom warning
			alert( customMsg ) ;
			break ;
		case 201 :
//			alert( 'A file with the same name is already available. The uploaded file has been renamed to "' + fileName + '"' ) ;
			break ;
		case 202 :
			alert( 'Invalid file type' ) ;
			return ;
		case 203 :
			alert( "Security error. You probably don't have enough permissions to upload. Please check your server." ) ;
			return ;
		default :
			alert( 'Error on file upload. Error number: ' + errorNumber ) ;
			return ;
	}

	SetUrl( fileUrl ) ;
	GetE('frmUpload').reset() ;

	//Press the Ok button if we had only a warning or it was succesful
	if (errorNumber == 0 || errorNumber == 101  || errorNumber == 201 )
		window.parent.Ok();
}

var oUploadAllowedExtRegex	= new RegExp( FCKConfig.LinkUploadAllowedExtensions, 'i' ) ;
var oUploadDeniedExtRegex	= new RegExp( FCKConfig.LinkUploadDeniedExtensions, 'i' ) ;

function CheckUpload()
{
	var sFile = GetE('txtUploadFile').value ;
	
	if ( sFile.length == 0 )
	{
		alert( 'Please select a file to upload' ) ;
		return false ;
	}
	
	if ( ( FCKConfig.LinkUploadAllowedExtensions.length > 0 && !oUploadAllowedExtRegex.test( sFile ) ) ||
		( FCKConfig.LinkUploadDeniedExtensions.length > 0 && oUploadDeniedExtRegex.test( sFile ) ) )
	{
		OnUploadCompleted( 202 ) ;
		return false ;
	}
	
	return true ;
}