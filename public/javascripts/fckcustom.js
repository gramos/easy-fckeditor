// CHANGE FOR APPS HOSTED IN SUBDIRECTORY
FCKRelativePath = '';

// DON'T CHANGE THESE
FCKConfig.LinkBrowserURL = FCKConfig.BasePath + 'filemanager/browser/default/browser.html?Connector='+FCKRelativePath+'/fckeditor/command';
FCKConfig.ImageBrowserURL = FCKConfig.BasePath + 'filemanager/browser/default/browser.html?Type=Image&Connector='+FCKRelativePath+'/fckeditor/command';
FCKConfig.FlashBrowserURL = FCKConfig.BasePath + 'filemanager/browser/default/browser.html?Type=Flash&Connector='+FCKRelativePath+'/fckeditor/command';

FCKConfig.LinkUploadURL = FCKRelativePath+'/fckeditor/upload';
FCKConfig.ImageUploadURL = FCKRelativePath+'/fckeditor/upload?Type=Image';
FCKConfig.FlashUploadURL = FCKRelativePath+'/fckeditor/upload?Type=Flash';
FCKConfig.SpellerPagesServerScript = FCKRelativePath+'/fckeditor/check_spelling';
FCKConfig.AllowQueryStringDebug = false;
FCKConfig.SpellChecker = 'WSC' ;	// 'WSC' | 'SpellerPages' | 'ieSpell'

//FCKConfig.Plugins.Add( 'easyUpload', 'es' ) ;		// easyUpload translated to spanish
FCKConfig.Plugins.Add( 'easyUpload', 'en' ) ;

FCKConfig.ContextMenu = ['Generic','Anchor','Flash','Select','Textarea','Checkbox','Radio','TextField','HiddenField','ImageButton','Button','BulletedList','NumberedList','Table','Form'] ;

// ONLY CHANGE BELOW HERE
FCKConfig.SkinPath = FCKConfig.BasePath + 'skins/silver/';

FCKConfig.ToolbarSets["Easy"] = [
        ['Bold','Italic','Underline','StrikeThrough','-'],
        ['OrderedList','UnorderedList','-'],
        ['FontSize'], ['TextColor','BGColor'],
        ['easyImage', 'easyLink', 'Unlink']
] ;

FCKConfig.ToolbarSets["Simple"] = [
        ['Source','-','-','Templates'],
        ['Cut','Copy','Paste','PasteWord','-','Print','SpellCheck'],
        ['Undo','Redo','-','Find','Replace','-','SelectAll'],
        '/',
        ['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
        ['OrderedList','UnorderedList','-','Outdent','Indent'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
        ['Link','Unlink'],
        '/',
        ['Image','Table','Rule','Smiley'],
        ['FontName','FontSize'],
        ['TextColor','BGColor'],
        ['-','About']
] ;
