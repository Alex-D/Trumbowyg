/** Trumbowyg Plugin - Embed / Link content on Google-Drive.
  * 
  * @author Callari, Salvatore (2025) */
// #region Globals
var gAPI_Initialized, gIS_Initialized, tokenClient ;

jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot = ['root']; // Has to be an array. Browser will push an pop from it when changing directories.
// #endregion Globals
// #region 3rd Party Libraries Injection.
var initializeGAPI = () => {
    if(!window.WaXCode.CORE.checkPathByString( window,'WaXCode.Interact.script')) {
        // #region Interact Injection
        window.WaXCode.CORE.createPathByString( window,'WaXCode.Interact');

        window.WaXCode.Interact.script     = document.createElement('script');
        window.WaXCode.Interact.script.src = 'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js';
        
        document.head.appendChild( window.WaXCode.Interact.script );
        // #endregion Interact Injection
    }

    if(!window.WaXCode.CORE.checkPathByString( window,'WaXCode.gAPI')) {
        // #region Google API Injection
        window.WaXCode.CORE.createPathByString( window,'WaXCode.gAPI');

        window.WaXCode.gAPI           = document.createElement('script');
        window.WaXCode.gAPI.src       = 'https://apis.google.com/js/api.js';
        window.WaXCode.gAPI.onload    = () => {
            console.log('gAPI Loaded.');
            // #region Check for API Key.
            try         { var apiKey = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.clientID ;}
            catch( X )  {
                console.error('Google / Drive - API Key not available (is the "Google / Drive (cx_editor)" - TypoScript included in your template?). Unable to initialize Google Drive. Internal: ');
            
                throw X ;}
            // #endregion Check for API Key.
            // #region Load gAPI.
            gapi.load('client', async () => {
                await gapi.client.init({
                    apiKey          : apiKey,
                    discoveryDocs   : ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']});
            
            gAPI_Initialized = true ;
            // #endregion Load gAPI.
        });}

        document.head.appendChild( window.WaXCode.gAPI );
        // #endregion Google API Injection
    }

    if(!window.WaXCode.CORE.checkPathByString( window,'WaXCode.gIS')) {
        // #region Google API Injection
        window.WaXCode.CORE.createPathByString( window,'WaXCode.gIS');

        window.WaXCode.gIS        = document.createElement('script');
        window.WaXCode.gIS.src    = 'https://accounts.google.com/gsi/client';

        window.WaXCode.gIS.onload = () => {
            console.log('gIS Loaded.');
            // #region Check for Client ID.
            try {
                    jQuery.trumbowyg.XC.CloudStorage.Browser.Loader = WaXCode.NET.syncGET( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.cDriveLoaderHTML );
                    
                    jQuery.trumbowyg.XC.CloudStorage.Browser.icoLinkFile         = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.cDriveLinkIcon ;
                    jQuery.trumbowyg.XC.CloudStorage.Browser.icoEmbedFile        = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.cDriveEmbedIcon ;
                    jQuery.trumbowyg.XC.CloudStorage.Browser.icoCreateDirectory  = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.cDriveDirecotryIcon ;
                    jQuery.trumbowyg.XC.CloudStorage.Browser.icoRename           = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.cDriveRenameIcon ;
                    jQuery.trumbowyg.XC.CloudStorage.Browser.icoUpload           = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.cDriveUploadIcon ;
                    
                var clientID            = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.clientID ;
                var scopes              = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.WaXCode_OnlineStorage_Google.scopes ;}
            catch( X )  {
                console.error('Google / Drive - Client ID not available (is the "Google / Drive (cx_editor)" - TypoScript included in your template?). Unable to initialize Google Drive. Internal: ' + X.message );
            
                throw X ;}
            // #endregion Check for Client ID.
            // #region Load gIS.
            tokenClient     = google.accounts.oauth2.initTokenClient({ client_id : clientID, scope : scopes, callback : ''});
            gIS_Initialized = true ;
            // #endregion Load gIS.
        }

        document.head.appendChild( window.WaXCode.gIS );
        // #endregion Google API Injection
    }
}
// #endregion 3rd Party Libraries Injection.
// #region Google Drive Binding.
/** Generates either an URL linking to the resource with the specified {@params id } or {@params embed}s that resource within the editor.
  * 
  * @param id       The identification of the resource.
  * @param embed    A {@link boolean } specifying whether to embed the resource or not.
  */
var getShareableLink = async ( id, embed ) => {
    gapi.client.drive.files.get({ fileId : id, fields : embed ? 'webContentLink' : 'webViewLink'}).then(( response ) => {
        window.WaXCode_CX_Editor_GoogleDrive_ModalOpened = false ;
        
        if( embed ) 
            gapi.client.drive.permissions.create({'fileId' : id,'resource' : {'role' : 'reader','type' : 'anyone'}}).then(( result ) => {
                // #region Use WebView as alternative, if WebContent not available.
                if( response.result.webContentLink == undefined )
                    gapi.client.drive.files.get({ fileId : id, fields : 'webViewLink'}).then(( response ) => {
                        jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.execCmd('insertHTML', `
                            <a  href    = '${ response.result.webViewLink }'
                                target  = 'blank'
                                class   = '-XC_OS_GD --Link'>${ jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.getRangeText() != '' ? jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.getRangeText() : ( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.webContentUnavailable )}</a>`);});
                // #endregion Use WebView as alternative, if WebContent not available.
                let randomID ;

                jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.execCmd('insertHTML',`
                    <iframe id      = "${( randomID = WaXCode.CORE.generateRandomId({ options : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'}))}"
                            src     = "${ response.result.webContentLink.replace('&export=download','').replace('https://drive.google.com/uc?id=','https://drive.google.com/file/d/') + '/preview'}"
                            class   = '-XC_OS_GD --Embedded'></iframe>`); // Wa[XC]ode [O]nline[S]torage [G]oogle[D]rive

                interact('#' + randomID ).resizable({
                    edges       : { left : true, right : true, bottom : true, top : true },
                    listeners   : {
                        move ( event ) {
                            // #region Resize & reposition.
                            // In Style-Attribute to preserve when Editor-HTML is restored.
                            var target                   = event.target ;
                            var x                        = ( parseFloat( target.getAttribute('data-x')) || 0 );
                            var y                        = ( parseFloat( target.getAttribute('data-y')) || 0 );

                            target.setAttribute('style','width : ' + event.rect.width + 'px ; height : ' + event.rect.height + 'px ; translate( ' + event.deltaRect.left + 'px, ' + event.deltaRect.top + 'px );');
                            target.setAttribute('data-x', x );
                            target.setAttribute('data-y', y );

                            target.textContent = Math.round( event.rect.width ) + '\u00D7' + Math.round( event.rect.height );
                            // #endregion Resize & reposition.
                        }}});});
        else jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.execCmd('insertHTML', `
            <a  href    = "${ response.result.webViewLink }"
                target  = "blank" >${ jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.getRangeText() != '' ? jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.getRangeText() : ( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.link )}</a>`);
        
        jQuery.trumbowyg.XC.CloudStorage.Browser.opened = false ;

        jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.closeModal();});}
/** Updates {@link drive } to contain the listing of all files within the specified {@params root }.
  * 
  * @params root The folder which's files shall be contained in {@link drive }. */
var updateFilelist = async ( root ) => {
    let response ;
    
    try         { response = await gapi.client.drive.files.list({'q' : "'" + root + "' in parents",'fields' : 'files( id, name, mimeType )','orderBy' : 'name'});}
    catch( X )  {
        console.log( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.unableToRetrieveFiles.replaceAll('[%ERROR%]', X.message ));

        throw X ;}
    
    jQuery.trumbowyg.XC.CloudStorage.Browser.files = response.result.files ;}
/** Renames the file with the specified {@params id } to it's new {@params label }.
  * 
  * @param {*} id       The id of the file to rename.
  * @param {*} label    The new label / name of the file. */
let cmdRename = async ( id, label ) => {
    return gapi.client.drive.files.update({
        fileId  : id,
        name    : label });}
/** Creates a new file / directory of the {@params mimeType } specified and the {@params name } specified in the directory specified by {@params root }.
  * 
  * @param {*} name     The name of the new file / directory. 
  * @param {*} mimeType The type of the new file / directory.
  * @param {*} root     The parent of the file / directory to be created. */
let cmdCreate = ( name, mimeType, root ) => {
    return gapi.client.drive.files.create({
        resource : {
            name        : name,
            mimeType    : mimeType,
            parents     : [ root ]}});}
/** Uploads the given {@params file } to the {@link jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot }'s last entry.
  * 
  * @param {*} file The file to upload. */
let cmdUpload = async ( file ) => {
    return new Promise(( resolve, reject ) => {
        // #region Perform the upload.
        let reader          = new FileReader();
            reader.onload   = async ( result ) => {
            let data = new FormData();
            
            data.append('metadata', new Blob([ JSON.stringify({
                name        : file.name,
                mimeType    : file.type,
                parents     : [ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.length - 1 ]]})],{ type : 'application/json'}));
            data.append('file', new Blob([ new Uint8Array( result.target.result )],{ type : file.type }));

            try {
                await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                        method  : 'POST',
                        headers : new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
                        body    : data });}
            catch( X ) { reject( X );}

            resolve();}
        // #region Perform the upload.
        reader.readAsArrayBuffer( file );})};
// #endregion Google Drive Binding.
// #region Setup Trymbowyg Plugin
( function ( $ ) {
    'use strict';
  
    $.extend( true, $.trumbowyg, {
        // #region Internationalization.
        langs : {
            it      : { WaXCode_OnlineStorage_Google : 'Collegare/Incorporare Contenuti da Google Drive'},
            en      : { WaXCode_OnlineStorage_Google : 'Link/Embed Content From Google Drive'},
            az      : { WaXCode_OnlineStorage_Google : 'Google Disk-dən Məzmunu Bağlamaq/Yerləşdirmək'},
            by      : { WaXCode_OnlineStorage_Google : 'Падключыць/Убудаваць змесціва з Google Drive'},
            da      : { WaXCode_OnlineStorage_Google : 'Google Drive'},
            de      : { WaXCode_OnlineStorage_Google : 'Inhalte auf Google Drive verlinken / einbetten'},
            et      : { WaXCode_OnlineStorage_Google : 'Google Drive'},
            fr      : { WaXCode_OnlineStorage_Google : 'Lier/Intégrer du contenu depuis Google Drive'},
            hu      : { WaXCode_OnlineStorage_Google : 'Google Drive'},
            ko      : { WaXCode_OnlineStorage_Google : 'Google Drive'},
            pt_br   : { WaXCode_OnlineStorage_Google : 'Google Drive'},
            ru      : { WaXCode_OnlineStorage_Google : 'Ссылка/Встраивание контента из Google Drive'},
            sl      : { WaXCode_OnlineStorage_Google : 'Prepojiť/Vložiť obsah z Google Drive'},
            tr      : { WaXCode_OnlineStorage_Google : 'Google Drive'},
            zh_tw   : { WaXCode_OnlineStorage_Google : '點擊這裡開啟檔案'}},
        // #endregion Internationalization.
        plugins : { // Register plugin in Trumbowyg
            myplugin : {
                init        : ( trumbowyg ) => { // Code called by Trumbowyg core to register the plugin
                    console.log(trumbowyg);jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg = trumbowyg ;

                    initializeGAPI();
                    
                    jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.myplugin = $.extend( true, {},{}, jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.o.plugins.myplugin || {}); // Fill current Trumbowyg instance with the plugin default options
                    // #region Generate & inject icon.
                    const iconWrap = $( document.createElementNS('http://www.w3.org/2000/svg','svg'));

                    iconWrap.addClass("trumbowyg-icons");
                    
                    iconWrap.html(`
                        <symbol id = 'trumbowyg-waxcode_cx_editor_google_drive' viewBox = '0 0 87.3 78'>
                            <path d = 'm6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z'                 fill = '#0066da'/>
                            <path d = 'm43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z'                fill = '#00ac47'/>
                            <path d = 'm73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z' fill = '#ea4335'/>
                            <path d = 'm43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z'                         fill = '#00832d'/>
                            <path d = 'm59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z'                      fill = '#2684fc'/>
                            <path d = 'm73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z'       fill = '#ffba00'/></symbol>`).appendTo( document.body );
                    // #endregion Generate & inject icon.
                    jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.addBtnDef('WaXCode_OnlineStorage_Google',{
                        ico : 'waxcode_cx_editor_google_drive',
                        fn  : () => {
                            if( jQuery.trumbowyg.XC.CloudStorage.Browser.files == undefined ) { // If drive's API initialization has not yet been performed.
                                if( gAPI_Initialized == undefined || gIS_Initialized == undefined ) alert( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.loadingGAPI );
                                if(!gAPI_Initialized || !gIS_Initialized )                          alert( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.GAPI_NA );

                                tokenClient.callback = async ( resp ) => {
                                    if( resp.error !== undefined ) throw ( resp );
                                    // #region Activate Modal
                                    jQuery.trumbowyg.XC.CloudStorage.Browser.showDriveBrowser('root', updateFilelist,'application/vnd.google-apps.folder', cmdRename, getShareableLink, cmdCreate, cmdUpload );
                                    
                                    jQuery.trumbowyg.XC.CloudStorage.Browser.opened = true ;
                                    // #endregion Activate Modal
                                    // #endregion Retrieve Root-Files if not yet done.
                                };
                                // #region Session
                                if( gapi.client.getToken() === null )   tokenClient.requestAccessToken({ prompt : 'consent'}); // Prompt the user to select a Google Account and ask for consent to share their data when establishing a new session.
                                else                                    tokenClient.requestAccessToken({ prompt: ''}); // Skip display of account chooser and consent dialog for an existing session.
                                // #endregion Session
                            }
                            
                            if(!jQuery.trumbowyg.XC.CloudStorage.Browser.opened ) jQuery.trumbowyg.XC.CloudStorage.Browser.showDriveBrowser( jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.length - 1 ], updateFilelist,'application/vnd.google-apps.folder', cmdRename, getShareableLink, cmdCreate, cmdUpload );
                        }});},
                tagHandler  : ( element, trumbowyg ) => { return [];}, // Return a list of button names which are active on current element
                destroy     : ( trumbowyg ) =>          {}}}});})( jQuery );
// #endregion Setup Trymbowyg Plugin