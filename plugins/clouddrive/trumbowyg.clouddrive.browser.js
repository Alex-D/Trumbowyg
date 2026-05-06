/** Trumbowyg Plugin - Embed / Link content on Google-Drive.
  * Browser Component to separate Clouddrive-Logic from Browing-Logic thus enabling future implementations of e.g. OneDrive, DropBox etc. without the need to develop Browsing-Logic again.
  * 
  * @author Callari, Salvatore (2025) */
// #region WaXCode.CORE
// #region Defintions
if( window['WaXCode'] == undefined ) window['WaXCode']  = {};
if( WaXCode           == undefined ) WaXCode            = {};
// #endregion Defintions
/** The CORE.
  * 
  * @author Callari, Salvatore (2024)
  */
class CORE_Deviant {
    /** Creates the specified path {@param toGenerate } within the object to {@param start } at.
      * 
      * @param {*} start         The object the path starts at.
      * @param {*} toGenerate    The objects ensembling the path to generate.*/
    static createPath = ( start, toGenerate ) => {
        if( toGenerate.length == 0 ) return ;
        else {
            if( start[ toGenerate[ 0 ]] == undefined ) start[ toGenerate[ 0 ]] = {};

            CORE_Deviant.createPath( start[ toGenerate[ 0 ]], toGenerate.slice( 1 ));}
    }
    /** Uses {@link CORE.createPath } by passing it the given path {@param toGenerate } as a {@link string } as an array divided by the specified {@params separator }.
      * 
      * @param {*} start         See {@link CORE.createPath }.
      * @param {*} toGenerate    The dotted - {@link string } describing the path to generate.
      * @param {*} separator     The {@link string } used to split the string into its composing path-elements.*/
    static createPathByString = ( start, toGenerate, separator = '.') => { CORE_Deviant.createPath( start, toGenerate.split( separator ));}
    /** Checks whether the specified path {@param toCheck } exists. The object at the end of the {@link Array } {@param toCheck } may be UNDEFINED.
      * 
      * @param start The object the path starts at.
      * @param toCheck The objects ensembling the path to check.
      * 
      * @returns TRUE if the specified {@param path } is existent, otherwise FALSE. */
    static checkPath = ( start, toCheck ) => {
      if( toCheck.length <= 1 ) return true ;

      if( start[ toCheck[ 0 ]] == undefined ) return false ;

      return CORE_Deviant.checkPath( start[ toCheck[ 0 ]], toCheck.sclice( 1 ));}
    /** Uses {@link CORE.checkPath } by passing it the given path {@param toCheck } as a {@link string } array divided by the specified {@params separator }.
      * 
      * @param {*} start         See {@link CORE.checkPath }.
      * @param {*} toGenerate    The dotted - {@link string } describing the path to check.
      * @param {*} separator     The {@link string } used to split the string into its composing path-elements.*/
    static checkPathByString = ( start, toCheck, seperator = '.') => { return CORE_Deviant.createPath( start, toCheck.split( seperator ));}
    /** Generates a random {@link string } out of the given {@params options }.
      * 
      * @param length The length the resulting {@link string } shall have, defaults to 10.
      * @param options  The characters that shall be included in the result, defaults to 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.
      * 
      * @returns The requested string.
      */
    static generateRandomId({ length = 10, options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'} = {}) {
      let result = '';
  
      for( let i = 0 ; i < length ; i++ ) result += options.charAt( Math.floor( Math.random() * options.length ));
      
      return result ;}
}

if( window.WaXCode.CORE == undefined ) window.WaXCode.CORE = CORE = CORE_Deviant ;
// #endregion WaXCode.CORE
// #region WaXCode.NET
/** Provides methods useful when working with networks.
  * 
  * @author Callari, Salvatore (2024) */
class NET_Deviant {
  /** Uses the {@link XMLHttpRequest } to perform a synchronious call to the specified {@param url }.
    * 
    * @param {*} url The URL to get.
    * 
    * @return The received response.
    */
  static syncGET = ( url ) => {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url, false );
      xhr.send();

      return xhr.responseText ;}
}

if( window.WaXCode.NET == undefined ) window.WaXCode.NET = NET_Deviant ;
// #endregion WaXCode.NET
// #region Namespace Definitions
jQuery.trumbowyg.XC                       = {};
jQuery.trumbowyg.XC.CloudStorage          = {};
jQuery.trumbowyg.XC.CloudStorage.Browser  = {};
// #endregion Namespace Definitions
// #region Modal Config
jQuery.trumbowyg.XC.CloudStorage.Browser.currentDirectory = [];
jQuery.trumbowyg.XC.CloudStorage.Browser.root             = [];
// #endregion Modal Config
/** Shows the loading animation. */
var showLoader = () => { jQuery.trumbowyg.XC.CloudStorage.Browser.form.innerHTML = jQuery.trumbowyg.XC.CloudStorage.Browser.Loader ;}
/** Displays an Upload-Dialogue and sends the selected Files to the server, showing a loading animation meanwhile disabling further input.
  * 
  * @param to                 The folder to upload to.
  * @param updateFilelist     A method (( root ) => undefined ) that is supposed to store an {@link Array } of { id, name, mimeType }-Objects in {@link jQuery.trumbowyg.XC.CloudStorage.Browser.files } according to the specified {@params root }.
  * @param directoryMimeType  The mimetype that identifies directories.
  * @param cmdRename          A (( id, label ) => undefined ) that is supposed to rename a cloudfile according to the specified label.
  * @param getShareableLink   A (( id, embed ) => undefined ) that is invoked to signal that the user requested either the embedding ("embed" is TRUE) or the linking of the file having the specified "id".
  * @param cmdCreate          A (( name, mimeType, root ) => undefined ) that is supposed to create a new cloudfile with the specified "name" and of the specified "mimeType" within the "root" specified.
  * @param cmdUpload          A (( file ) => {@link Promise }) supposed to upload the specified file to the location specified by the {@link jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot }'s last element. */
jQuery.trumbowyg.XC.CloudStorage.Browser.upload = ( to, updateFilelist, directoryMimeType, cmdRename, getShareableLink, cmdCreate, cmdUpload ) => {
  var upload        = document.createElement('input');
  var uploadCounter = 0 ;
  
  upload.setAttribute('type','file');
  upload.setAttribute('multiple','');
  upload.setAttribute('style','display : none ;');

  jQuery.trumbowyg.XC.CloudStorage.Browser.form.appendChild( upload );

  jQuery.trumbowyg.XC.CloudStorage.Browser.form.addEventListener('change',( event ) => {
      uploadCounter = event.target.files.length ;

      for( let file of event.target.files ) {
        cmdUpload( file ).then(( response ) => {
          if( --uploadCounter == 0 ) {
            jQuery.trumbowyg.XC.CloudStorage.Browser.form.innerHTML = '';

            jQuery.trumbowyg.XC.CloudStorage.Browser.showDriveBrowser( jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.length - 1 ], updateFilelist, directoryMimeType, cmdRename, getShareableLink, cmdCreate, cmdUpload );}
          },
        ( X ) => { alert( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.uploadError.replaceAll('[%FILE%]', file.name ).replaceAll('[%ERROR%]', X.result.error ));});

        showLoader();}
      });

  upload.click();}
/** Initiates the renaming of the directory with the specified {@params id }.
  * 
  * @param label      The <button> which is the label for the directory to rename.
  * @param id         The id of the directory to rename.
  * @param cmdRename          A (( id, label ) => undefined ) that is supposed to rename a cloudfile according to the specified label. */
jQuery.trumbowyg.XC.CloudStorage.Browser.renameDirectory = ( label, id, cmdRename ) => {
  let newLabel                = document.createElement('input');
      newLabel.value          = label.querySelector('p').innerHTML ;
  // #region Prevent standard behavior.
  newLabel.addEventListener('keydown',( event ) => {
      if( event.key == 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();}
  });
  // #endregion Prevent standard behavior.
  newLabel.addEventListener('keyup',( event ) => {
      if( event.key == 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          // #region Rename operation.
          cmdRename( id, newLabel.value )
          .then(( response ) => {
            label.setAttribute('onclick', label.getAttribute('onclick').replaceAll( label.querySelector('p').innerHTML, newLabel.value ));

            label.innerHTML = label.innerHTML.replaceAll( label.querySelector('p').innerHTML, newLabel.value );

            newLabel.parentElement.insertBefore( label, newLabel );
            newLabel.remove();})
          .catch(( error ) => { alert( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.unableToRetrieveFiles.replaceAll('[%ERROR%]', error.message ));});
          // #endregion Rename operation.
      }
  });

  newLabel.setAttribute('class','-XC_OS_GD --Renamer');
  newLabel.select();

  label.parentElement.insertBefore( newLabel, label );
  label.remove();
  newLabel.focus();}
/** Displays the files with an initial listing of all files within the specified {@params root}.
  * 
  * @param root               The name of the directory to start browsing at.
  * @param updateFilelist     A method (( root ) => undefined ) that is supposed to store an {@link Array } of { id, name, mimeType }-Objects in {@link jQuery.trumbowyg.XC.CloudStorage.Browser.files } according to the specified {@params root }.
  * @param directoryMimeType  The mimetype that identifies directories.
  * @param cmdRename          A (( id, label ) => undefined ) that is supposed to rename a cloudfile according to the specified label.
  * @param getShareableLink   A (( id, embed ) => undefined ) that is invoked to signal that the user requested either the embedding ("embed" is TRUE) or the linking of the file having the specified "id".
  * @param cmdCreate          A (( name, mimeType, root ) => undefined ) that is supposed to create a new cloudfile with the specified "name" and of the specified "mimeType" within the "root" specified.
  * @param cmdUpload          A (( file ) => {@link Promise }) supposed to upload the specified file to the location specified by the {@link jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot }'s last element. */
jQuery.trumbowyg.XC.CloudStorage.Browser.showDriveBrowser = async ( root, updateFilelist, directoryMimeType, cmdRename, getShareableLink, cmdCreate, cmdUpload ) => {
  // Implement ESC-Handling if not already done.
  if( jQuery.trumbowyg.XC.CloudStorage.Browser.escHandler == undefined ) jQuery.trumbowyg.XC.CloudStorage.Browser.escHandler = document.addEventListener('keyup',( event ) => { if( event.key == 'Escape') jQuery.trumbowyg.XC.CloudStorage.Browser.opened = false ;});

  await updateFilelist( root );

  let fileList = ( jQuery.trumbowyg.XC.CloudStorage.Browser.currentDirectory.length == 0 ? '' : `
      <div class = '-XC_OS_GD --BackPanel'>
          <button id = 'BackButton'><<</button>
                  
          <span>${ jQuery.trumbowyg.XC.CloudStorage.Browser.currentDirectory[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentDirectory.length - 1 ] }</span></div>`) + `
      
      <div class = '---WaXCode --T3 --CX_Editor --GoogleDrive --FileList'>`;

  var currentFileEmbedable ;

  for( let file of jQuery.trumbowyg.XC.CloudStorage.Browser.files ) fileList += `
      <div id = 'Element'>
          <button id      = 'label'
                  class   = '---WaXCode --T3 --CX_Editor --GoogleDrive --FileList --${ file.mimeType !== directoryMimeType ? 'file' : 'directory' }'
                  style   = 'color : ${ file.mimeType !== directoryMimeType ? 'blue' : 'green' } ;'
                  
                  ${ file.mimeType !== directoryMimeType ? '' : 'onclick = "jQuery.trumbowyg.XC.CloudStorage.Browser.form.innerHTML = ``; jQuery.trumbowyg.XC.CloudStorage.Browser.showDriveBrowser(`' + file.id + '`, updateFilelist,`' + directoryMimeType + '`, cmdRename, getShareableLink, cmdCreate, cmdUpload ); jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.push( `' + file.id + '`); jQuery.trumbowyg.XC.CloudStorage.Browser.currentDirectory.push(`' + file.name + '`);"'}><p style = margin-left : 10% ;>${ file.name }</p>${ file.mimeType !== directoryMimeType ? '' : `
                      <span>>></span></button>
                      
                      <div id = 'FolderActions'>
                          <button id      = 'btnRename'
                                  onclick = 'event.target.classList.add("--active"); jQuery.trumbowyg.XC.CloudStorage.Browser.renameDirectory( event.target.parentElement.parentElement.querySelector("#label"),"${ file.id }",${ cmdRename });'>
                              <img src = '${ jQuery.trumbowyg.XC.CloudStorage.Browser.icoRename }'/></button></div>`}</button>` + ( file.mimeType !== directoryMimeType ? `
                  
          <div id = 'Actions'>
              <button id          = 'LinkFile'
                      reference   = '${ file.id }'
                      onclick     = 'event.preventDefault(); if( confirm("` + jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.embedAccessWarning + `")) { getShareableLink("${ file.id }"); showLoader();}'>
                  <img src = '${ jQuery.trumbowyg.XC.CloudStorage.Browser.icoLinkFile }'/></button>
                          
              <button id          = 'EmbedFile'
                      style       = '${( currentFileEmbedable = file.mimeType === directoryMimeType ) ? ' opacity : .5 ;' : ''}${ currentFileEmbedable ? '' : ' cursor : pointer ;'}'
                      reference   = '${ file.id }'` +
                          
                      ( currentFileEmbedable ? '' : `onclick = 'if( confirm("` + jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.embedAccessWarning + `")) { event.preventDefault(); getShareableLink("` + file.id + `",` + true + `); showLoader();}'`) + `>
                  <img src = '${ jQuery.trumbowyg.XC.CloudStorage.Browser.icoEmbedFile }'/></button></div>` : '') + '</div>';

  fileList += '</div>';

  if( jQuery.trumbowyg.XC.CloudStorage.Browser.form == undefined || !jQuery.trumbowyg.XC.CloudStorage.Browser.opened ) {
      window.WaXCode_CX_Editor_GoogleDrive_ModalOpened = true ;

      jQuery.trumbowyg.XC.CloudStorage.Browser.form   = jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.openModal( jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.selectFileToEmbed )[ 0 ].querySelector('form');
      jQuery.trumbowyg.XC.CloudStorage.Browser.opened = true ;}
  
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.querySelector('.trumbowyg-modal-title').innerHTML = `
    <span>${ jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.selectFileToEmbed }
      <button id      = 'Close'
              onclick = 'jQuery.trumbowyg.XC.CloudStorage.Browser.opened = false ; jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.closeModal();'>X</button></span>
        
      <div id = 'Options'>
        <button onclick = "cmdCreate('${ jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.newFolderName }','${ directoryMimeType }','${ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.length - 1 ]}').then(( response ) => { alert('${ jQuery.trumbowyg.XC.CloudStorage.Browser.refTrumbowyg.lang.folderAdded }'); jQuery.trumbowyg.XC.CloudStorage.Browser.showDriveBrowser('${ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.length - 1 ]}', updateFilelist,'${ directoryMimeType }', cmdRename, getShareableLink, cmdCreate, cmdUpload )});"><img src = '${ jQuery.trumbowyg.XC.CloudStorage.Browser.icoCreateDirectory }'/></button>
                        
        <button onclick = "jQuery.trumbowyg.XC.CloudStorage.Browser.upload('${ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.length - 1 ]}', updateFilelist,'${ directoryMimeType }', cmdRename, getShareableLink, cmdCreate, cmdUpload );"><img src = '${ jQuery.trumbowyg.XC.CloudStorage.Browser.icoUpload }'/></button></div>`;
  
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.style.backgroundColor                          = '#FFFFFF50';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.style.backgroundColor            = '#FFFFFF50';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.parentElement.style.overflowY    = 'auto';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.parentElement.style.height       = '80vh';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.parentElement.style.top          = '10vh';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.parentElement.style.overflowX    = 'none';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.parentElement.style.borderRadius = '.5em';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.parentElement.parentElement.style.boxShadow    = '0 0 1em black';
  jQuery.trumbowyg.XC.CloudStorage.Browser.form.innerHTML                                      = fileList + '</div>';

  if( jQuery.trumbowyg.XC.CloudStorage.Browser.currentDirectory.length != 0 )
      jQuery.trumbowyg.XC.CloudStorage.Browser.form.querySelector('#BackButton').addEventListener('click',( event ) => {
          jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.pop();
          jQuery.trumbowyg.XC.CloudStorage.Browser.currentDirectory.pop();
      
          jQuery.trumbowyg.XC.CloudStorage.Browser.form.innerHTML = '';

          jQuery.trumbowyg.XC.CloudStorage.Browser.showDriveBrowser( jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot[ jQuery.trumbowyg.XC.CloudStorage.Browser.currentRoot.length - 1 ], updateFilelist, directoryMimeType, cmdRename, getShareableLink, cmdCreate, cmdUpload );});
}