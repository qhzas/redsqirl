
var time;

function canvasResizeSplitter(){
	//<![CDATA[
	console.log("canvasResizeSplitter");

	isResizing = true;
	
	var leftSize = jQuery(window).width() - 46 - jQuery("#splitHCanvas").width();
	var topSize = jQuery(".splitter-bar-horizontal").css("top").replace(/[^-\d\.]/g, '');

	jQuery("#body").css('width', jQuery(window).width()-20+'px');
	jQuery("#body").css('height', jQuery(window).height()-20+'px');
	jQuery("#splitVCanvas").css("height", jQuery(window).height()-100+'px').trigger("resize", [leftSize]);
	jQuery("#splitVCanvas").css('width', jQuery(window).width()-30+'px');
	jQuery("#splitVCanvas").css('height', jQuery(window).height()-80+'px');
	jQuery(".splitter-pane").css("height", jQuery(window).height()-160+'px');
	jQuery("#splitHCanvas").css("height", jQuery("#splitVCanvas").height()+'px');
	jQuery(".splitter-bar-horizontal").css("width", jQuery(window).width()-jQuery(".splitter-pane").width()-46 +'px').trigger("resize", [topSize]);
	jQuery("#splitVCanvas").css("height", jQuery(window).height()-60+'px').trigger("resize", [leftSize]);
	jQuery("#tabs1").css("width", jQuery("#splitHCanvas").width() +'px');
	jQuery("#tabs2").css("width", jQuery("#splitHCanvas").width() +'px');
	
	if(jQuery("#tabFlowchart ul:first li[aria-labelledby$=idtabFlowchart-1]").hasClass('ui-state-active')){
		jQuery("#tabFlowchart").css("height", jQuery(window).height()-50+'px');
		jQuery("#tabFlowchart-1").css("height", jQuery(window).height()-205+'px');
		jQuery("#canvas-tabs").css("height", jQuery(window).height()-125+'px');
		jQuery("#canvas-tabs").find("#flowchart-canvas-1").css("height","50% !important");
		jQuery("#canvas").css("height", jQuery("#canvas-tabs").height()-160+'px');
		jQuery("#canvas").css("width", jQuery("#canvas-tabs").width()+'px');
		jQuery("#tabsFooter").css("width", jQuery("#canvas-tabs").width()-0+'px');
	}
	
	resizeCanvas(30,45);

	resizeTabs();

	jQuery("#divTabHelp").css("height", jQuery("#tabs-1").height()-56+'px');

	configureLeft();

	validateArrowsAll();

	isResizing = false;
	
	//]]>
}

function resizeBlockUICanvas(){
	//console.log("resizeBlockUICanvas");

	jQuery(".blockOverlay").css("height", jQuery("#container-"+selectedCanvas).find(".kineticjs-content").find("canvas").eq(2).attr("height"));
	jQuery(".blockOverlay").css("width", jQuery("#container-"+selectedCanvas).find(".kineticjs-content").find("canvas").eq(2).attr("width"));
}

function resizeBlockUICanvasOnLoad(){
	//console.log("resizeBlockUICanvasOnLoad");

	jQuery(".blockOverlay").css("top", "18px");
}

function resizeCanvas(val1, val2){
	console.log("resizeCanvas");

	for (var i in nameTabs){
		//alert(nameTabs[i]);
		
		if(jQuery("#tabFlowchart ul:first li[aria-labelledby$=idtabFlowchart-1]").hasClass('ui-state-active')){
			jQuery("#"+getCanvasId(nameTabs[i])).css("height", jQuery("#canvas-tabs").height()-jQuery("#tabsFooter").height()-val1+'px');
			jQuery("#"+getCanvasId(nameTabs[i])).css("width", jQuery("#canvas-tabs").width()+'px');
			jQuery("#flowchart-"+nameTabs[i]).css("height", jQuery("#canvas-tabs").height()-jQuery("#tabsFooter").height()-val2+'px');
		}
		
	}

}

function resizeTables(){
	console.log("resizeTables");

	jQuery("#processManager .extdt-content").css("height", jQuery("#tabs-2").height()-105+"px", "important");
	//jQuery("#processManager .extdt-content").css("width", jQuery("#splitHCanvas").width(), "important");
	jQuery("#processManager .extdt-innerdiv").css("overflow", "overlay");

	jQuery("#errorTable .extdt-content").css("height", jQuery("#tabs-3").height()-35+"px", "important");

	jQuery("#hdfsFileSystem .extdt-content").style("height", jQuery("#tabs-4").height()-160+"px", "important");

	jQuery("#jdbcFileSystem .extdt-content").style("height", jQuery("#tabs-5").height()-160+"px", "important");
	
	jQuery("#hcatFileSystem .extdt-content").style("height", jQuery("#tabs-6").height()-160+"px", "important");

	jQuery("#remotefsFileSystem .extdt-content").css("height", jQuery("#tabs-9").height()-205+"px", "important");

}

function onPageReady(){
	//console.log("onPageReady");

	var leftSize = jQuery(window).width()*2/3;
	var topSize = jQuery(".splitter-bar-horizontal").css("top").replace(/[^-\d\.]/g, '');

	jQuery("#body").css('width', jQuery(window).width()-20+'px');
	jQuery("#body").css('height', jQuery(window).height()-20+'px');
	jQuery(".splitter-pane").css("height", jQuery(window).height()-160+'px');
	jQuery(".splitter-bar-horizontal").css("width", jQuery(window).width()-jQuery(".splitter-pane").width()-46 +'px').trigger("resize", [topSize]);
	jQuery("#splitVCanvas").css("height", jQuery(window).height()-100+'px').trigger("resize", [leftSize]);
	jQuery("#splitVCanvas").css('width', jQuery(window).width()-30+'px');
	jQuery("#splitVCanvas").css('height', jQuery(window).height()-60+'px');
	jQuery("#tabFlowchart").css("height", 'inherit');
	jQuery("#splitHCanvas").css("width", jQuery(window).width()-jQuery("#tabFlowchart").width()-3+'px');
	jQuery("#splitHCanvas").css("height", jQuery("#splitVCanvas").height()+'px');
	jQuery("#tabs1").css("width", jQuery("#splitHCanvas").width() +'px');
	jQuery("#tabs1").css("height", jQuery("#splitHCanvas").height()/2 +'px');
	jQuery("#tabs2").css("width", jQuery("#splitHCanvas").width()+'px');
	jQuery("#tabs2").css("height", jQuery("#splitHCanvas").height()/2 +'px');
	jQuery("#tabs1").children('ul').first().css("left", 0+'px');
	jQuery("#tabs2").children('ul').first().css("left", 0+'px');
	jQuery("#tabFlowchart-1").css("height", jQuery(window).height()-205+'px');
	jQuery("#canvas-tabs").css("height", jQuery(window).height()-125+'px');
	jQuery("#canvas").css("height", jQuery("#canvas-tabs").height()-160+'px');
	jQuery("#canvas").css("width", jQuery("#canvas-tabs").width()+'px');
	jQuery("#tabsFooter").css("width", jQuery("#canvas-tabs").width()-0+'px');

	resizeTabs();

	jQuery("#divTabHelp").css("height", jQuery("#tabs-1").height()-63+'px');

	jQuery("#buttonsTabsFooter").hide();

	jQuery("#splitHCanvas").css("overflow", "hidden");
	jQuery("#canvas-tabs").css("overflow", "hidden");
	jQuery("#tabFlowchart").css("overflow", "hidden");
	jQuery("#tabs1").css("overflow", "hidden");
	jQuery("#tabs2").css("overflow", "hidden");
	jQuery(".splitter-pane").css("overflow", "hidden");
	jQuery("#tabRemote").css("overflow", "hidden");

	resizeCanvas(30,45);

	validateArrowsAll();

	console.log("onPageReady END");
}

function resiziRemoteFileSystem(){
	//console.log("resiziRemoteFileSystem");

	setTimeout(function(){
		jQuery("div[id$='fileSysGridFormSshTab\\:sshfs\\:sd']").css("height", jQuery("#tabFlowchart").height()-255+"px", "important");
	},500);
}

function resiziFileSystem(){
	//console.log("resiziFileSystem");

	var leftSize = jQuery(window).width()*2/3;
	var topSize = jQuery(".splitter-bar-horizontal").css("top").replace(/[^-\d\.]/g, '');
	jQuery(".splitter-bar-horizontal").css("width", jQuery(window).width()-jQuery(".splitter-pane").width()-46 +'px').trigger("resize", [topSize]);
	jQuery("#splitVCanvas").css("height", jQuery(window).height()-100+'px').trigger("resize", [leftSize]);
	jQuery("#splitHCanvas").css("width", jQuery(window).width()-jQuery("#tabFlowchart").width()-3+'px');
	jQuery("#splitHCanvas").css("height", jQuery("#splitVCanvas").height()+'px');
	jQuery("#tabs1").css("width", jQuery("#splitHCanvas").width() +'px');
	jQuery("#tabs1").css("height", jQuery("#splitHCanvas").height()/2 +'px');
	jQuery("#tabs2").css("width", jQuery("#splitHCanvas").width()+'px');
	jQuery("#tabs2").css("height", jQuery("#splitHCanvas").height()/2 +'px');
	jQuery("#tabs1").children('ul').first().css("left", 0+'px');
	jQuery("#tabs2").children('ul').first().css("left", 0+'px');

	resiziRemoteFileSystem();
}

function startTutorialResizi(){
	
	var leftSize = jQuery(window).width()*2/4;
	var topSize = jQuery(".splitter-bar-horizontal").css("top").replace(/[^-\d\.]/g, '');

	jQuery("#body").css('width', jQuery(window).width()-20+'px');
	jQuery("#body").css('height', jQuery(window).height()-20+'px');
	jQuery(".splitter-pane").css("height", jQuery(window).height()-160+'px');
	jQuery(".splitter-bar-horizontal").css("width", jQuery(window).width()-jQuery(".splitter-pane").width()-46 +'px').trigger("resize", [topSize]);
	jQuery("#splitVCanvas").css("height", jQuery(window).height()-100+'px').trigger("resize", [leftSize]);
	jQuery("#splitVCanvas").css('width', jQuery(window).width()-30+'px');
	jQuery("#splitVCanvas").css('height', jQuery(window).height()-60+'px');
	jQuery("#tabFlowchart").css("height", 'inherit');
	jQuery("#splitHCanvas").css("width", jQuery(window).width()-jQuery("#tabFlowchart").width()-3+'px');
	jQuery("#splitHCanvas").css("height", jQuery("#splitVCanvas").height()+'px');
	jQuery("#tabs1").css("width", jQuery("#splitHCanvas").width() +'px');
	jQuery("#tabs1").css("height", jQuery("#splitHCanvas").height()/2 +'px');
	jQuery("#tabs2").css("width", jQuery("#splitHCanvas").width()+'px');
	jQuery("#tabs2").css("height", jQuery("#splitHCanvas").height()/2 +'px');
	jQuery("#tabs1").children('ul').first().css("left", 0+'px');
	jQuery("#tabs2").children('ul').first().css("left", 0+'px');
	
	if(jQuery("#tabFlowchart ul:first li[aria-labelledby$=idtabFlowchart-1]").hasClass('ui-state-active')){
		jQuery("#tabFlowchart-1").css("height", jQuery(window).height()-205+'px');
		jQuery("#canvas-tabs").css("height", jQuery(window).height()-125+'px');
		jQuery("#canvas").css("height", jQuery("#canvas-tabs").height()-160+'px');
		jQuery("#canvas").css("width", jQuery("#canvas-tabs").width()+'px');
		jQuery("#tabsFooter").css("width", jQuery("#canvas-tabs").width()-0+'px');
	}
	
	resizeTabs();

	jQuery("#divTabHelp").css("height", jQuery("#tabs-1").height()-63+'px');

	jQuery("#buttonsTabsFooter").hide();
	jQuery("#splitHCanvas").css("overflow", "hidden");
	jQuery("#canvas-tabs").css("overflow", "hidden");
	jQuery("#tabFlowchart").css("overflow", "hidden");
	jQuery("#tabs1").css("overflow", "hidden");
	jQuery("#tabs2").css("overflow", "hidden");
	jQuery(".splitter-pane").css("overflow", "hidden");
	jQuery("#tabRemote").css("overflow", "hidden");

	resizeCanvas(30,45);

	validateArrowsAll();
	
}

function configureFooterCss(){
	//console.log("configureFooterCss");

	jQuery("#tabsFooter").css("width", jQuery("#canvas-tabs").width()+15+'px');
	jQuery("#tabsFooter").css("overflow", "hidden");
	jQuery("#tabsFooter").css("position", "fixed");
	jQuery("#tabsFooter").css("bottom", "3px");
	jQuery("#tabsFooter").css("z-index", jQuery("#canvas-tabs").zIndex()+1);

}

function resizing(){
	console.log("resizing");

	isResizing = true;
	var leftSize = jQuery(window).width() - 46 - jQuery("#splitHCanvas").width();
	var topSize = jQuery(".splitter-bar-horizontal").css("top").replace(/[^-\d\.]/g, '');

	jQuery("#body").css('width', jQuery(window).width()-20+'px');
	jQuery("#body").css('height', jQuery(window).height()-20+'px');
	jQuery("#splitVCanvas").css("height", jQuery(window).height()-100+'px').trigger("resize", [leftSize]);
	jQuery("#splitVCanvas").css('width', jQuery(window).width()-30+'px');
	jQuery("#splitVCanvas").css('height', jQuery(window).height()-60+'px');
	jQuery(".splitter-pane").css("height", jQuery(window).height()-160+'px');
	jQuery("#splitHCanvas").css("height", jQuery("#splitVCanvas").height()+'px');
	jQuery(".splitter-bar-horizontal").css("width", jQuery(window).width()-jQuery(".splitter-pane").width()-46 +'px').trigger("resize", [topSize]);
	jQuery("#splitVCanvas").css("height", jQuery(window).height()-60+'px').trigger("resize", [leftSize]);
	jQuery("#tabs1").css("width", jQuery("#splitHCanvas").width() +'px');
	jQuery("#tabs2").css("width", jQuery("#splitHCanvas").width() +'px');
	
	if(jQuery("#tabFlowchart ul:first li[aria-labelledby$=idtabFlowchart-1]").hasClass('ui-state-active')){
		jQuery("#tabFlowchart").css("height", jQuery(window).height()-50+'px');
		jQuery("#tabFlowchart-1").css("height", jQuery(window).height()-205+'px');
		jQuery("#canvas-tabs").css("height", jQuery(window).height()-125+'px');
		jQuery("#canvas-tabs").find("#flowchart-canvas-1").css("height","50% !important");
		jQuery("#canvas").css("height", jQuery("#canvas-tabs").height()-160+'px');
		jQuery("#canvas").css("width", jQuery("#canvas-tabs").width()+'px');
	}
	
	//jQuery("#tabsFooter").css("width", jQuery("#canvas-tabs").width()+'px');

	isResizing = false;

	//resizeCanvas(30,45);

	resizeTabs();

	configureLeft();

	validateArrowsAll();

	jQuery("#divTabHelp").css("height", jQuery("#tabs-1").height()-56+'px');

	resiziRemoteFileSystem();

}

function configureLeft(){
	//console.log("configureLeft");

	jQuery("#buttonsTabsFooter").css("left", jQuery("#tabsFooter").width()-70+'px');

}

function validateArrowsAll(){
	//console.log("validateArrowsAll");

	validateArrows(jQuery("#tabsFooter"),jQuery("#buttonsTabsFooter"));
}

function validateArrows(tabPrincipal, spanButtons){
	//console.log("validateArrows");

	var ul = tabPrincipal.tabs().children('ul').first();
	var tabsRealWidth = 0;

	ul.find('li').each(function (index, element) {
		tabsRealWidth += jQuery(element).width();
		tabsRealWidth += jQuery(element).css('margin-right').replace('px', '') / 1;
	});

	if(tabsRealWidth - tabPrincipal.width() > -35 && tabPrincipal.width() != 0){

		spanButtons.show();

		var disTab = tabsRealWidth - -1*ul.css("left");
		//var disTab = tabsRealWidth - -1*ul.css("left").replace('px', '');

		if( tabPrincipal.tabs().children('span').first().css("left") - disTab > 40 ){

			var dist = tabPrincipal.tabs().children('span').first().css("left") - disTab - 40;
			ul.stop().animate({ left: parseInt(ul.css("left")) + parseInt(dist) + 'px' }, 'slow');

		}

	}else{

		spanButtons.hide();
		ul.stop().animate({ left: '0' }, 'slow');

	}

}

function resizeTabs(){
	console.log("resizeTabs");
	
	resizeParent("#tabs-1");
	resizeParent("#tabs-2");
	resizeParent("#tabs-3");
	resizeParent("#tabs-4");
	resizeParent("#tabs-5");
	resizeParent("#tabs-6");
	resizeParent("#tabs-9");
	
	setTimeout(function(){ resizeTables(); }, 400);
}

function resizeParent(name){
	
	//var border = 44;
	//var borderFlowchart = 45;
	//alert(jQuery("#ulTabs1").height());
	
	if(jQuery(name).parent("div").attr('id') == jQuery("#tabs1").attr('id')){
		var border = jQuery("#ulTabs1").height();
		jQuery(name).css("height", jQuery("#tabs1").height()-border+'px');
	}else if(jQuery(name).parent("div").attr('id') == jQuery("#tabs2").attr('id')){
		var border = jQuery("#ulTabs2").height();
		jQuery(name).css("height", jQuery("#tabs2").height()-border+'px');
	}else{
		var borderFlowchart = jQuery("#ulTabFlowchart").height();
		jQuery(name).css("height", jQuery(".splitter-pane").height()-borderFlowchart+'px');
	}
}


function showImg(url){
	var img = jQuery("<img src="+url+">");
	jQuery("#helpImg").append(img);
	jQuery("#helpPage").hide();
	jQuery("#btIndex").show();
}

function addtooltip(text, event){
	jQuery('div.help').remove();
	jQuery('div.tooltip').remove();
	var x = event.pageX;
	var y = event.pageY;
	var help = jQuery('<div class="tooltip">'+text+'</div>');
	help.css("left",(x+80)+"px" );
	help.css("top",(y)+"px" );
	help.css("background-color", "#F1F1F1");
	help.css("color", "black");
	
	help.css("-webkit-user-select", "text");
	help.css("-khtml-user-select", "text");
	help.css("-moz-user-select", "text");
	help.css("-o-user-select", "text");
	help.css("user-select", "text");
	
	jQuery("body").append(help);
	help.fadeIn("slow");
	help.dblclick(function() {
		removetoottip();
	});
	help.mouseleave(function() {
		removetoottip();
	});
}

function removetoottip(){
	jQuery("div.tooltip").remove();
	jQuery('div.help').remove();
}

/*function to select all checkbox in a table*/
function selectAllCheckbox(checkbox, checkboxId) {
	var elements = checkbox.form.elements;
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		if (checkboxId.test(element.id)) {
			element.checked = checkbox.checked;
		}
	}
}

(function(jQuery) {
	if (jQuery.fn.style) {
		return;
	}

	// Escape regex chars with \
	var escape = function(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};

	// For those who need them (< IE 9), add support for CSS functions
	var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
	if (!isStyleFuncSupported) {
		CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
			return this.getAttribute(a);
		};
		CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
			this.setAttribute(styleName, value);
			var priority = typeof priority != 'undefined' ? priority : '';
			if (priority != '') {
				// Add priority manually
				var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
						'(\\s*;)?', 'gmi');
				this.cssText =
					this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
			}
		};
		CSSStyleDeclaration.prototype.removeProperty = function(a) {
			return this.removeAttribute(a);
		};
		CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
			var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
			'gmi');
			return rule.test(this.cssText) ? 'important' : '';
		}
	}

	// The style function
	jQuery.fn.style = function(styleName, value, priority) {
		// DOM node
		var node = this.get(0);
		// Ensure we have a DOM node
		if (typeof node == 'undefined') {
			return;
		}
		// CSSStyleDeclaration
		var style = this.get(0).style;
		// Getter/Setter
		if (typeof styleName != 'undefined') {
			if (typeof value != 'undefined') {
				// Set style property
				priority = typeof priority != 'undefined' ? priority : '';
				style.setProperty(styleName, value, priority);
			} else {
				// Get style property
				return style.getPropertyValue(styleName);
			}
		} else {
			// Get CSSStyleDeclaration
			return style;
		}
	};
})(jQuery);

function nospaces(t){
	if(t.value.match(/\s/g)){
		t.value=t.value.replace(/\s/g,'');
	}
}
function noLetters(t){
	if(t.value.match(/\D+/)){
		t.value=t.value.replace(/\D+/,'');
	}
}

function setPropValueFocus(index){
	jQuery("[id$='"+index+":browserPropValueInput']").focus();
}

function changeHelpAnchor(index){
	setTimeout(function() {changeHelpAnchorPriv(index)}, 1);
}

function changeHelpAnchorPriv(index){
	index++;

	console.log("changeHelpAnchorPriv " + index);
	if(!pinHelp){
		jQuery("#divTabHelp").scrollTop( 0 );
		if(jQuery("#page"+index).position()){
			jQuery("#divTabHelp").animate({scrollTop: jQuery("#page"+index).position().top-jQuery("#helpButtons").height()-50}, 800);
		}
	}
}

function changeTableInteractionAnchorBottom(){
	jQuery("#divTableInteraction").animate({ scrollTop: jQuery("[id$='tableInteraction']").height()}, 800);
}
function changeTableInteractionAnchorTop(){
	jQuery("#divTableInteraction").animate({ scrollTop: 0}, 800);
}
function changeTableInteractionAnchorUp(){
	jQuery("#divTableInteraction").animate({ scrollTop: jQuery("[id$='divTableInteraction']").scrollTop()-30 }, 800);
}
function changeTableInteractionAnchorDown(){
	jQuery("#divTableInteraction").animate({ scrollTop: jQuery("[id$='divTableInteraction']").scrollTop()+30 }, 800);
}

function enableEnterKey(e, id){
	var key;
	if(window.event)
		key = window.event.keyCode;
	else
		key = e.keyCode;

	if (key == 13){
		e.preventDefault();
		jQuery("[id$='"+id+"']").click();
	}
	return (key != 13);
}

function enableEnterKeyByClass(e, id){
	var key;
	if(window.event)
		key = window.event.keyCode;
	else
		key = e.keyCode;

	if (key == 13){
		e.preventDefault();
		jQuery("."+id).click();
	}
	return (key != 13);
}

function updatedComboboxTableInteraction(element, index){
	var idx=element.selectedIndex;
	var val=element.options[idx].value;
	var content=element.options[idx].innerHTML;
	jQuery("[id$=combo"+index+"]").children().val(val);
	//alert(val + " " + content);
	reLoadInputHidden();
}

function updatedComboboxListInteraction(element, index){
	var idx=element.selectedIndex;
	var val=element.options[idx].value;
	var content=element.options[idx].innerHTML;
	jQuery("[id$=listInteraction"+index+"]").children().val(val);
	//alert(val + " " + content);
	reLoadlistInteractionInputHidden();
}

function updatedComboboxListScheduling(element){
	var idx=element.selectedIndex;
	var val=element.options[idx].value;
	var content=element.options[idx].innerHTML;
	jQuery("[id$=selectedListScheduling]").children().val(val);
	//alert(val + " " + content);
	reLoadlistSchedulingInputHidden();
}

function updatedComboboxMergeCoordinatorA(element){
	var idx=element.selectedIndex;
	var val=element.options[idx].value;
	var content=element.options[idx].innerHTML;
	jQuery("[id$=selectedListMergeA]").children().val(val);
	//alert(val + " " + content);
	reLoadlistMergeAInputHidden();
}

function updatedComboboxMergeCoordinatorB(element){
	var idx=element.selectedIndex;
	var val=element.options[idx].value;
	var content=element.options[idx].innerHTML;
	jQuery("[id$=selectedListMergeB]").children().val(val);
	//alert(val + " " + content);
	reLoadlistMergeBInputHidden();
}

function disableAllButton(){
	jQuery("input[type=button]").attr("disabled", "disabled");
}

function enableAllButton(){
	jQuery("input[type=button]").removeAttr("disabled");
}

var inputFocus;
var inputLastPosition;
var inputIndex;

function changeFocusInput(value){
	console.log(value);
	inputFocus = value;
	inputLastPosition = inputFocus.selectionEnd;
	console.log(inputLastPosition);

	jQuery('#divTableInteraction input:text').each(function(idx){
		if(jQuery(this).attr('id') === jQuery(value).attr('id')){
			inputIndex = idx;
		}
	});

}

function selectText(obj, idx){
	var arr = jQuery(obj).val().match(jQuery('[id$="stringToReplace"]').val());
	var search_text = arr[0];
	var n = search_text.length;
	var input = obj;
	var input_text = jQuery(obj).val();
	var x = input_text.indexOf(search_text);
	var y = x+n;
	input.focus();
	input.setSelectionRange(x, y);
	inputFocus = input;
	inputLastPosition = inputFocus.selectionEnd;
	inputIndex = idx;
	return false;
}

function findTable(showMsg){
	console.log("findTable");

	if(jQuery('[id$="stringToReplace"]').val() == '' || jQuery('[id$="stringToReplace"]').val() == undefined ){
		alert('No value found.');
		return false;
	}

	var check = false;
	var next = true;
	var found = false;
	jQuery('#divTableInteraction input:text').each(function(idx){

		if(inputIndex != undefined && inputIndex != "" && inputIndex > idx){
			return true;
		}
		
		if(jQuery(this).val().match(jQuery('[id$="stringToReplace"]').val())){
			
			if(jQuery(inputFocus).val() != undefined && inputFocus != ""){

				if(jQuery(this).attr('id') === jQuery(inputFocus).attr('id')){

					if(jQuery(inputFocus).val().match(jQuery('[id$="stringToReplace"]').val())){

						var s = jQuery(inputFocus).val().substr(inputLastPosition);

						if(s.length >= 1){

							var arr = jQuery(this).val().match(jQuery('[id$="stringToReplace"]').val());
							var search_text = arr[0];

							if(s.match(search_text)){
								found = true;
								var n = search_text.length;
								var input = inputFocus;
								var input_text = s;
								var x = input_text.indexOf(search_text);
								var y = x+n;
								var dif = jQuery(inputFocus).val().length - s.length;
								x = x + dif;
								y = y + dif;
								input.focus();
								input.setSelectionRange(x, y);
								inputLastPosition = inputFocus.selectionEnd;
								inputIndex = idx;
								return false;
							}

						}else{
							check = true;
							return true;
						}
					}
					check = true;
					return true;
				}else{
					check = true;
				}

				if(check){
					found = true;
					return selectText(this, idx);
				}

			}else{
				found = true;
				return selectText(this, idx);
			}
		}
	});
	
	if(!found){
		if(showMsg === undefined || showMsg){
			inputFocus = "";
			inputLastPosition = "";
			inputIndex = "";
			alert('No value found.');
		}
	}

}

function replaceTable(){
	console.log("replaceTable");

	if(jQuery(inputFocus).val() != undefined){
		if(inputFocus.selectionStart == inputFocus.selectionEnd){
			alert('Please select something after');
			return false;
		}
		
		var s = jQuery(inputFocus).val().substr(inputFocus.selectionStart);

		if(s.length >= 1){

			var search_text = jQuery('[id$="stringToReplace"]').val();

			if(s.match(search_text)){

				var input = inputFocus;
				
				var value = jQuery(inputFocus).val();
				var size = value.length;

				jQuery(inputFocus).val( jQuery(inputFocus).val().substr(0, inputFocus.selectionStart) + jQuery('[id$="replaceValue"]').val() + jQuery(inputFocus).val().substr(inputFocus.selectionEnd, size) );
				
				input.focus();
				inputLastPosition = inputFocus.selectionEnd;

			}else{
				console.log("s search");
			}

		}else{
			console.log("s size");
		}
		
	}else{
		alert('Please select something after');
	}

}

function replacefindTable(){
	console.log("replacefindTable");
	if(jQuery(inputFocus).val() != undefined && inputFocus.selectionStart != inputFocus.selectionEnd){
		replaceTable();
		findTable(true);
	}else{
		alert('Please select something after');
	}
}

function replaceAllTable(){
	console.log("replaceAllTable");
	
	inputFocus = "";
	inputLastPosition = "";
	inputIndex = "";
	var idx = 0;
	
	jQuery('#divTableInteraction input:text').each(function(){
		findTable(false);
		if(jQuery(inputFocus).val() != undefined && inputFocus.selectionStart != inputFocus.selectionEnd){
			replaceTable();
			idx++;
		}else{
			return false;
		}
	});
	
	alert(idx + ' value replaced');

}

function setInputFocus(){
	inputFocus = undefined;
	inputLastPosition = undefined;
	resetValuesReplace();
}

function resetValuesReplace(){
	jQuery('[id$="stringToReplace"]').val('');
	jQuery('[id$="replaceValue"]').val('');
}

function scrollToAnchorVersion(){
    var aTag = jQuery("[id$='versions']");
    jQuery('#divScrollModuleDetail').animate({scrollTop: aTag.offset().top},'slow');
}

function scrollToAnchorDependency(){
    var aTag = jQuery("[id$='dependencies']");
    jQuery('#divScrollModuleDetail').animate({scrollTop: aTag.offset().top},'slow');
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
