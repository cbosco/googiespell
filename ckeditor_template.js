/*
 * Markup: <textarea id="CKeditor1" name="CKeditor1"></textarea>
 * Depends on googiespell_editor.js
 */


// CKEditor - Handler for when editor is ready to set custom events.

CKEDITOR.on('instanceReady', function(e) {
  var editorObj = CKEDITOR.instances.CKeditor1,
      editorDocument = editorObj.document.$,
      googie = new GoogieSpell('/demo/googiespell/', '/demo/googiespell/sendReq.php?lang=');
    
  //  Attach GoogieSpell to editor's iframe document now that it's ready
  googie.setSpellContainer('spell_container');
  googie.decorateTextarea(editorDocument.body);
  
  /*
   * add googiespell CSS to editor iframe page
   */
  var googieCSS = editorDocument.createElement('link');
  googieCSS.setAttribute('rel', 'stylesheet');
  googieCSS.setAttribute('type', 'text/css');
  googieCSS.setAttribute('href', '/demo/googiespell/googiespell.css');
  editorDocument.getElementsByTagName('head')[0].appendChild(googieCSS);
  
  /*
   * Replace AJS.DIV() with an element generated in the editor's iframe document
   * so it can be appended to the editor in all browsers (looking at you, IE!)
   */
  googie.createInFrame = function(tag, className) {
    var o = editorDocument.createElement(tag);
    if (className)
      o.className = className;
    return o;
  };
  
  //  Add GoogieSpell observers and pass along the editor instance
  googie.spelling_state_observer = function(state, googie) {
    onGoogieStateChange(state, googie, editorObj);
  };
  googie.edit_layer_ready_observer = function(googie) {
    onGoogieLayerReady(googie, editorObj);
  };
  googie.error_window_ready_observer = function(googie) {
    onGoogieSuggestionsReady(googie, editorObj);
  };

});


/*
 * GoogieSpell spellcheck state callback
 * states: spell_check,checking_spell,no_error_found,resume_editing
 */
function onGoogieStateChange(state, googie, editorObj) {
  if (state === "checking_spell") {
      //  No good way to disable/enable the toolbar in CKEditor so this is omitted...  
      // editorObj.ToolbarSet.Disable();
  }
  else if (state === "spell_check"){  //inactive
      //  No good way to disable/enable the toolbar in CKEditor so this is omitted...  
      //editorObj.ToolbarSet.Enable();
  }
}


/*
 * Modify GoogieSpell edit layer styles
 * It's no longer a descendant of body, so it won't inherit much
 */
function onGoogieLayerReady(googie, editorObj) {
  var layerStyle = googie.edit_layer.style;
  layerStyle.margin = "8px"; // match CKEditor margin
  layerStyle.border = 'none';
  layerStyle.fontFamily = "Arial,Verdana,sans-serif";
  layerStyle.fontSize = "12px";

  //  Height specified to avoid additional scrollbars
  //  TODO: IE6/7 - Googie layer invisible
  AJS.setHeight(googie.edit_layer, 'auto');
  AJS.setWidth(googie.edit_layer, 'auto');
}


/*
 * Adjust position of GoogieSpell suggestions popup (error_window)
 * with reference to the editor's iframe
 */
function onGoogieSuggestionsReady(googie, editorObj) {
  var w = googie.error_window,
      w_pos = AJS.absolutePosition(w),
      editorFrame = document.getElementById('cke_contents_' + editorObj.name);
  
  if (editorFrame) {
    var e_pos = AJS.absolutePosition(editorFrame);
    w_pos.y += e_pos.y;
    w_pos.x += e_pos.x;
  }  
  
  AJS.setTop(w, w_pos.y);
  AJS.setLeft(w, w_pos.x);
  
  //  Adjust IE's iframe shim to match, if present
  if (googie.error_window_iframe) {
    AJS.setTop(googie.error_window_iframe, w_pos.y);
    AJS.setLeft(googie.error_window_iframe, w_pos.x);
  }
}


/*
 * Kick off CKEditor on load
 */
window.onload = function()
{
  CKEDITOR.config.toolbar = 'Basic';
  CKEDITOR.config.scayt_autoStartup = false;  //  disable default spellchecker
	CKEDITOR.replace( 'CKeditor1' );
}
