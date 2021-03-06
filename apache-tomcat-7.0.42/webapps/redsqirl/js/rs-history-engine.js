/********************************************************************/
/********************************************************************/
/********************************************************************/
/*********************** Framework **********************************/

function CommandHistory() {
    this.size_max = 50;
	this.cur_index = -1;
	this.hist_stack = new Array();
	this.saveIndex = -1;
}

CommandHistory.prototype.undoName = function() {
	var name = "";
	if(this.cur_index >= 0 ){
		name = this.hist_stack[this.cur_index].getName();
	}
	return name;
};

CommandHistory.prototype.redoName = function() {
    var name = "";
    if(this.cur_index < this.hist_stack.length -1 ){
        name = this.hist_stack[this.cur_index+1].getName();
    }
    return name;
};

CommandHistory.prototype.update_buttonname = function() {
    var undoName = this.undoName();
    var redoName = this.redoName();
    var buttonUndo = jQuery('#buttonundo');
    if(undoName.length > 0){
        buttonUndo.attr('title',buttonUndo.attr('alt')+": "+undoName);
    }else{
        buttonUndo.attr('title',buttonUndo.attr('alt'));
    }
    var buttonRedo = jQuery('#buttonredo');
    if(redoName.length > 0){
        buttonRedo.attr('title',buttonRedo.attr('alt')+": "+redoName);
    }else{
        buttonRedo.attr('title',buttonRedo.attr('alt'));
    }
};

CommandHistory.prototype.undo = function() {
    jQuery(".tooltipCanvas").remove();
	if(this.cur_index >= 0){
		this.hist_stack[this.cur_index].undo();
		--this.cur_index;
		this.update_buttonname();
		
		var nameHtml = getNameHtml();
		
		if(this.saveIndex == this.cur_index){
			var canvasNameStar = jQuery('#canvasNameStar-'+nameHtml).text();
			if(canvasNameStar[canvasNameStar.length-1] == "*" ){
				jQuery('#canvasNameStar-'+nameHtml).text(getSelectedByName());
				jQuery('#updateCanvasNameStar').click();
			}
		}else if(this.saveIndex == this.cur_index+1){
			var canvasNameStar = jQuery('#canvasNameStar-'+nameHtml).text();
			if(canvasNameStar[canvasNameStar.length-1] != "*" ){
				jQuery('#canvasNameStar-'+nameHtml).text(getSelectedByName()+"*");
				jQuery('#updateCanvasNameStar').click();
			}
		}
		
	}
};

CommandHistory.prototype.redo = function() {
    jQuery(".tooltipCanvas").remove();
	if(this.cur_index < this.hist_stack.length -1 ){
		++this.cur_index;
		this.hist_stack[this.cur_index].redo();
		this.update_buttonname();
		
		var nameHtml = getNameHtml();
		
		if(this.saveIndex == this.cur_index){
			var canvasNameStar = jQuery('#canvasNameStar-'+nameHtml).text();
			if(canvasNameStar[canvasNameStar.length-1] == "*" ){
				jQuery('#canvasNameStar-'+nameHtml).text(getSelectedByName());
				jQuery('#updateCanvasNameStar').click();
			}
		}else if(this.saveIndex == this.cur_index-1){
			var canvasNameStar = jQuery('#canvasNameStar-'+nameHtml).text();
			if(canvasNameStar[canvasNameStar.length-1] != "*" ){
				jQuery('#canvasNameStar-'+nameHtml).text(getSelectedByName()+"*");
				jQuery('#updateCanvasNameStar').click();
			}
		}
		
	}
};

CommandHistory.prototype.addSaveHistoric = function() {
	this.saveIndex = this.cur_index;
};

CommandHistory.prototype.clean = function(){
    if(this.hist_stack.length >= this.size_max ){
        var size_transform = this.size_max / 2;
        var i = 0;
        for(i=0; i < size_transform;++i){
            this.hist_stack[0].clean();
            delete this.hist_stack[0];
            this.hist_stack.shift();
        }
        this.cur_index -= i;
        this.saveIndex -= i;
    }
}

CommandHistory.prototype.push_command = function(command) {
    jQuery(".tooltipCanvas").remove();
	while(this.cur_index + 1 < this.hist_stack.length){
		var el = this.hist_stack.pop();
		el.clean();
		delete el;
	}
	++this.cur_index;
	this.hist_stack[this.cur_index] = command;
	this.clean();
	this.update_buttonname();
	
	var nameHtml = getNameHtml();
	
	if(this.saveIndex == this.cur_index){
		var canvasNameStar = jQuery('#canvasNameStar-'+nameHtml).text();
		if(canvasNameStar[canvasNameStar.length-1] == "*" ){
			jQuery('#canvasNameStar-'+nameHtml).text(getSelectedByName());
			jQuery('#updateCanvasNameStar').click();
		}
	}else if(this.saveIndex == this.cur_index-1){
		var canvasNameStar = jQuery('#canvasNameStar-'+nameHtml).text();
		if(canvasNameStar[canvasNameStar.length-1] != "*" ){
			jQuery('#canvasNameStar-'+nameHtml).text(getSelectedByName()+"*");
			jQuery('#updateCanvasNameStar').click();
		}
	}
	
};

CommandHistory.prototype.execute = function(command) {
	this.push_command(command);
	command.redo();
};

CommandHistory.prototype.removeLastAction = function() {
	this.hist_stack.pop();
	--this.cur_index;
	this.update_buttonname();
	
	var nameHtml = getNameHtml();
	
	if(this.saveIndex == this.cur_index){
		var canvasNameStar = jQuery('#canvasNameStar-'+nameHtml).text();
		if(canvasNameStar[canvasNameStar.length-1] == "*" ){
			jQuery('#canvasNameStar-'+nameHtml).text(getSelectedByName());
			jQuery('#updateCanvasNameStar').click();
		}
	}
};

function Command(){
}

Command.prototype.undo = function(){
};

Command.prototype.redo = function(){
};

Command.prototype.getName = function(){
};

Command.prototype.clean = function(){
};

/********************************************************************/
/********************************************************************/
/*********************** CommandDelete ******************************/
function CommandDelete(selecteds, selectedArrows) {
	Command.call(this);
	this.selecteds = selecteds;
	this.selectedArrows = selectedArrows;
	this.cloneId = "";
};

CommandDelete.prototype = Object.create(Command.prototype);
CommandDelete.prototype.constructor = CommandDelete;

CommandDelete.prototype.undo = function(){
	replaceWFByClone(this.selecteds,this.cloneId, false);
};

CommandDelete.prototype.redo = function(){
	tmpCommandObj = this;
	deleteElements(getAllCanvasesStatus());
};

CommandDelete.prototype.getName = function(){
	return msg_delete_command;
};

CommandDelete.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function deleteSelected(canvasName){
	var cArray = getArrayPos(canvasName);
    if(getSelectedIconsCommaDelimited() || getSelectedArrowsCommaDelimited()){
    	cArray.commandHistory.execute(new CommandDelete(getSelectedIconsCommaDelimited(), getSelectedArrowsCommaDelimited()));
	}
}

function deleteArrow(canvasName,arrowName){
	var cArray = getArrayPos(canvasName);
	cArray.commandHistory.execute(new CommandDelete("",arrowName));
}

/********************************************************************/
/********************************************************************/
/************************** CommandAddObj ***************************/
function CommandAddObj(canvasName, elementType, elementImg, posx, posy, numSides, groupId, selecteds,privilege) {

	Command.call(this);
	this.canvasName = canvasName;
	this.elementType = elementType;
	this.elementImg = elementImg;
	this.posx = posx;
	this.posy = posy;
	this.numSides = numSides;
	this.groupId = groupId;
	this.selecteds = selecteds;
	this.elementId = '';
	this.privilege = privilege;
	
	tmpCommandObj = this;
};

CommandAddObj.prototype = Object.create(Command.prototype);
CommandAddObj.prototype.constructor = CommandAddObj;

CommandAddObj.prototype.undo = function(){
    console.timeStamp("CommandAddObj.undo begin");
	
    console.log("undo add " + this.groupId);
    
    deleteElementsJS(this.groupId, "");
	console.timeStamp("CommandAddObj.undo end");
};

CommandAddObj.prototype.redo = function(){
	console.timeStamp("CommandAddObj.redo begin");
	addElement(this.canvasName,
			this.elementType,
			this.elementImg,
			this.posx,
			this.posy,
			this.numSides,
			this.groupId,
			this.selecteds,
			this.privilege
		);
    tmpCommandObj = this;
    
    var cn = this.canvasName;
    var gi = this.groupId;
    
    addElementBt(this.elementType,this.groupId,this.elementId, true);
    updateTypeObj(this.canvasName, this.groupId, this.groupId);
	
    var cArray = getArrayPos(canvasName);
    
    cArray.stage.draw();
	
	setTimeout(function(){ retrieveVoranoiPolygonTitleJS(cn, tmpCommandObj.elementId, gi); }, 1000);
	
	cArray.polygonLayer.draw();
	console.timeStamp("CommandAddObj.redo end");
};

CommandAddObj.prototype.getName = function(){
	return msg_addelement_command;
};

/********************************************************************/
/********************************************************************/
/********************** CommandAddArrow *****************************/
function CommandAddArrow(canvasName, outId, inId, name) {
	Command.call(this);
	this.canvasName = canvasName;
	this.outId = outId;
	this.inId = inId;
	this.name = name;
	this.cloneId = "";
	
	tmpCommandObj = this;
};

CommandAddArrow.prototype = Object.create(Command.prototype);
CommandAddArrow.prototype.constructor = CommandAddArrow;

CommandAddArrow.prototype.undo = function(){
    //console.timeStamp("CommandAddArrow.undo begin");
    
    //console.log("undo a " + this.cloneId);
    
    deleteElementsJS("", this.name);
	//replaceWFByCloneVoronoi("",this.cloneId, false);
	
	//console.timeStamp("CommandAddArrow.undo end");
};

CommandAddArrow.prototype.redo = function(){
    //console.timeStamp("CommandAddArrow.redo begin");
    
    //console.log("redo clone A ");
    
    tmpCommandObj = this;
    
    //console.log("redo clone B ");
    
    //!ADD A LINK ON BACK-END
    addLinkBt();
	addLink(this.canvasName, this.outId, this.inId);
	updateArrowColor('#{canvasBean.paramOutId}','#{canvasBean.paramInId}', '#{canvasBean.nameOutput}');
	
	//console.timeStamp("CommandAddArrow.redo end");
};

CommandAddArrow.prototype.getName = function(){
	return msg_addarrow_command;
};

/********************************************************************/
/********************************************************************/
/*********************** CommandPaste *******************************/
function CommandPaste(selecteds) {
	Command.call(this);
	this.selecteds = selecteds;
	this.idsToPaste = "";
	this.cloneId = "";
};

CommandPaste.prototype = Object.create(Command.prototype);
CommandPaste.prototype.constructor = CommandPaste;

CommandPaste.prototype.undo = function(){
    //console.timeStamp("CommandPaste.prototype.undo begin");
	deleteElementsJS(this.idsToPaste, "");
	//console.timeStamp("CommandPaste.prototype.undo end");
};

CommandPaste.prototype.redo = function(){
    //console.timeStamp("CommandPaste.prototype.redo begin");
	tmpCommandObj = this;
	if(this.cloneId.empty()){
		//generate clone inside
		pasteJS(this.selecteds);
	}else{
		//use clone
		undoPasteCloneWorkflow(this.selecteds, this.cloneId, true);
	}
	//console.timeStamp("CommandPaste.prototype.redo end");
};

CommandPaste.prototype.getName = function(){
	return msg_paste_command;
};

CommandPaste.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function paste(canvasName,selecteds){
	 var cArray = getArrayPos(canvasName);
	 cArray.commandHistory.execute(new CommandPaste(selecteds));
}

/********************************************************************/
/********************************************************************/
/********************* CommandReplaceAll ****************************/
function CommandReplaceAll(selecteds, oldStr, newStr, changeLabel, regex) {
	Command.call(this);
	this.selecteds = selecteds;
	this.oldStr = oldStr;
	this.newStr = newStr;
	this.changeLabel = changeLabel;
	this.regex = regex;
	this.cloneId = "";
};

CommandReplaceAll.prototype = Object.create(Command.prototype);
CommandReplaceAll.prototype.constructor = CommandReplaceAll;

CommandReplaceAll.prototype.undo = function(){
    console.timeStamp("CommandReplaceAll.prototype.undo begin");
	tmpCommandObj = this;
	rebuildElementsFromClone(this.selecteds, this.cloneId,false);
	console.timeStamp("CommandReplaceAll.prototype.undo end");
};

CommandReplaceAll.prototype.redo = function(){
    console.timeStamp("CommandReplaceAll.prototype.redo begin");
	tmpCommandObj = this;
	replaceJS(getAllCanvasesStatus());
	console.timeStamp("CommandReplaceAll.prototype.redo end");
};

CommandReplaceAll.prototype.getName = function(){
	return msg_replaceAll_command;
};

CommandReplaceAll.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function replaceAll(canvasName,selecteds, oldStr, newStr, changeLabel, regex){
	var cArray = getArrayPos(canvasName);
	cArray.commandHistory.execute(new CommandReplaceAll(selecteds, oldStr, newStr, changeLabel, regex));
}

/********************************************************************/
/********************************************************************/
/************************ CommandMove *******************************/
function CommandMove(oldValues,newValues) {
    Command.call(this);
    this.oldValues = oldValues;
    this.newValues = newValues;
};

CommandMove.prototype = Object.create(Command.prototype);
CommandMove.prototype.constructor = CommandMove;

CommandMove.prototype.undo = function(){
    console.timeStamp("CommandMove.prototype.undo begin");
    
    var cArray = getArrayPos(selectedCanvas);
    
    jQuery.each(this.oldValues, function(index, value) {
        if(value.elementId !== undefined ){
            var group = cArray.polygonLayer.get('#' + value.elementId)[0];
            if(group !== undefined ){
            	group.setPosition(value.X,value.Y);
            	changePositionArrow(cArray, group);
            }else{
            	
            	var group;
            	jQuery.each(cArray.polygonLayer.get('.group1'), function() {
                    var g = this;
                    if(g.getId() == value.elementId){
                    	group = g;
                    }
            	});
                group.setPosition(value.X,value.Y);
            	changePositionArrow(cArray, group);
            	
            }
        }
    });
    cArray.polygonLayer.draw();
    cArray.layer.draw();
    console.timeStamp("CommandMove.prototype.undo end");
};

CommandMove.prototype.redo = function(){
    console.timeStamp("CommandMove.prototype.redo begin");
    
    var cArray = getArrayPos(selectedCanvas);
    
    jQuery.each(this.newValues, function(index, value) {
        if(value.elementId !== undefined ){
            var group = cArray.polygonLayer.get('#' + value.elementId)[0];
            if(group !== undefined ){
            	group.setPosition(value.X,value.Y);
            	changePositionArrow(cArray, group);
            }
        }
    });
    cArray.polygonLayer.draw();
    cArray.layer.draw();
    console.timeStamp("CommandMove.prototype.redo end");
};

CommandMove.prototype.getName = function(){
    return msg_moveelements_command;
};

/********************************************************************/
/********************************************************************/
/********************** CommandChangeId *****************************/
var currentChangeIdGroup = null;

function CommandChangeId(groupId, oldId,newId, oldComment, newComment) {
    Command.call(this);
    this.groupId = groupId;
    this.oldId = oldId;
    this.newId = newId;
    this.oldComment = oldComment; 
    this.newComment = newComment;
};

CommandChangeId.prototype = Object.create(Command.prototype);
CommandChangeId.prototype.constructor = CommandChangeId;

CommandChangeId.prototype.undo = function(){
    console.timeStamp("CommandChangeId.prototype.undo begin");
    jQuery('#canvas-tabs').block({ message: jQuery('#domMessageDivCanvas1') });
    currentChangeIdGroup = this.groupId;
    changeIdElement(this.groupId,this.oldId,this.oldComment);
    updateLabelObj(this.groupId,this.oldId);
    console.timeStamp("CommandChangeId.prototype.undo end");
};

CommandChangeId.prototype.redo = function(){
    console.timeStamp("CommandChangeId.prototype.redo begin");
    jQuery('#canvas-tabs').block({ message: jQuery('#domMessageDivCanvas1') });
    currentChangeIdGroup = this.groupId;
    changeIdElement(this.groupId,this.newId,this.newComment);
    updateLabelObj(this.groupId,this.newId);
    console.timeStamp("CommandChangeId.prototype.redo end");
};

CommandChangeId.prototype.getName = function(){
    return msg_changeelementid_command;
};

function execChangeIdElementCommand(loadMainWindow , groupId, oldId, newId, oldComment, newComment){
    console.log("execChangeIdElementCommand begin"+loadMainWindow+", "+groupId+", "+oldId+", "+newId+", "+oldComment+", "+newComment);
    
	if(oldId != newId || oldComment != newComment){
		if(oldId != newId ){
			if(!(loadMainWindow==='true')){
				if (!confirm(msg_confirm_changeid)) {
					return false;
				}
			}
		}
		
		var cArray = getArrayPos(selectedCanvas);
		
		cArray.commandHistory.execute(
        new CommandChangeId(groupId, oldId,newId, oldComment, newComment));
    }else{
        jQuery('#canvas-tabs').block({ message: jQuery('#domMessageDivCanvas1') });
        currentChangeIdGroup = groupId;
        changeIdElement(groupId,newId,newComment);
        updateLabelObj(groupId,newId);
    }
    console.timeStamp("execChangeIdElementCommand end");
}


/********************************************************************/
/********************************************************************/
/******************** CommandUpdateElement **************************/
var cloneCommandUpdateElementBuffer = null;

function CommandUpdateElement(groupId,beforeCloneId,afterCloneId) {
    Command.call(this);
    //Needed with that name in canvas.xhtml
    this.selecteds = groupId;
    this.beforeCloneId = beforeCloneId;
    this.afterCloneId = afterCloneId;
};

CommandUpdateElement.prototype = Object.create(Command.prototype);
CommandUpdateElement.prototype.constructor = CommandUpdateElement;

CommandUpdateElement.prototype.undo = function(){
    console.timeStamp("CommandUpdateElement.prototype.undo begin");
    tmpCommandObj = this;
    rebuildElementsFromClone(this.selecteds, this.beforeCloneId,true);
    console.timeStamp("CommandUpdateElement.prototype.undo end");
};

CommandUpdateElement.prototype.redo = function(){
    console.timeStamp("CommandUpdateElement.prototype.redo begin");
    tmpCommandObj = this;
    rebuildElementsFromClone(this.selecteds, this.afterCloneId,true);
    console.timeStamp("CommandUpdateElement.prototype.redo end");
};

CommandUpdateElement.prototype.getName = function(){
    return msg_updateelement_command;
};

CommandUpdateElement.prototype.clean = function(){
    removeCloneWorkflow(this.beforeCloneId);
    removeCloneWorkflow(this.afterCloneId);
};

function stackUpdateElement(groupId, beforeCloneId,afterCloneId){
	var cArray = getArrayPos(selectedCanvas);
	cArray.commandHistory.push_command(new CommandUpdateElement(groupId, beforeCloneId,afterCloneId));
}

/********************************************************************/
/********************************************************************/
/********************** CommandChangeCommentWf **********************/
var currentChangeIdGroup = null;

function CommandChangeCommentWf(oldComment, newComment) {
    Command.call(this);
    this.oldComment = oldComment; 
    this.newComment = newComment;
};

CommandChangeCommentWf.prototype = Object.create(Command.prototype);
CommandChangeCommentWf.prototype.constructor = CommandChangeCommentWf;

CommandChangeCommentWf.prototype.undo = function(){
    console.timeStamp("CommandChangeCommentWf.prototype.undo begin");
    updateWfComment(this.oldComment);
    console.timeStamp("CommandChangeCommentWf.prototype.undo end");
};

CommandChangeCommentWf.prototype.redo = function(){
    console.timeStamp("CommandChangeCommentWf.prototype.redo begin");
    updateWfComment(this.newComment);
    console.timeStamp("CommandChangeCommentWf.prototype.redo end");
};

CommandChangeCommentWf.prototype.getName = function(){
    return msg_changeworkflowcomment_command;
};

function execChangeCommentWfCommand(oldComment, newComment){
    console.timeStamp("execChangeCommentWfCommand begin");
    if(oldComment != newComment){
    	var cArray = getArrayPos(selectedCanvas);
    	cArray.commandHistory.execute(
        new CommandChangeCommentWf(oldComment, newComment));
    }
    console.timeStamp("execChangeCommentWfCommand end");
}

/********************************************************************/
/********************************************************************/
/********************* CommandAggregate *****************************/
function CommandAggregate() {
    Command.call(this);
    this.cloneId = "";
    this.nameSA = "";
    this.nameModel = "";
};

CommandAggregate.prototype = Object.create(Command.prototype);
CommandAggregate.prototype.constructor = CommandAggregate;

CommandAggregate.prototype.undo = function(){
    console.timeStamp("CommandAggregate.prototype.undo begin");
	//alert("undo");
	deleteAllElements();
	replaceWFByClone("",this.cloneId, false);
	undoAggregate(this.nameModel,this.nameSA);
	console.timeStamp("CommandAggregate.prototype.undo end");
};

CommandAggregate.prototype.redo = function(){
    console.timeStamp("CommandAggregate.prototype.redo begin");
	//alert("redo");
	tmpCommandObj = this;
	cloneBeforeAggregate(getAllCanvasesStatus());
	console.timeStamp("CommandAggregate.prototype.redo end");
};

CommandAggregate.prototype.getName = function(){
	return msg_aggregate_command;
};

CommandAggregate.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function undoRedoAggregate(){
	var cArray = getArrayPos(selectedCanvas);
	cArray.commandHistory.execute(new CommandAggregate());
}


/********************************************************************/
/********************************************************************/
/************************ CommandExpand *****************************/
function CommandExpand(selectedSAIcons) {
    Command.call(this);
    this.selectedSAIcons = selectedSAIcons;
    this.cloneId = "";
    this.nameSA = "";
};

CommandExpand.prototype = Object.create(Command.prototype);
CommandExpand.prototype.constructor = CommandExpand;

CommandExpand.prototype.undo = function(){
    console.timeStamp("CommandExpand.prototype.undo begin");
	//alert("undo");
	deleteAllElements();
	replaceWFByClone("",this.cloneId, false);
	console.timeStamp("CommandExpand.prototype.undo end");
};

CommandExpand.prototype.redo = function(){
    console.timeStamp("CommandExpand.prototype.redo begin");
	tmpCommandObj = this;
	cloneBeforeExpand(getAllCanvasesStatus());
	console.timeStamp("CommandExpand.prototype.redo end");
};

CommandExpand.prototype.getName = function(){
	return msg_expand_command;
};

CommandExpand.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function undoRedoExpand(selectedSAIcons){
	var cArray = getArrayPos(selectedCanvas);
	cArray.commandHistory.execute(new CommandExpand(selectedSAIcons));
}

/********************************************************************/
/********************************************************************/
/********************* CommandCoordinator ***************************/
function CommandCoordinator(obj) {
    Command.call(this);
    this.nameOld = obj[1]; 
    this.startDateOld = obj[2];
    this.selectedSchedulingOptionOld = obj[3];
    this.periodicOld = obj[4];
    this.positionsArraysOld = obj[5];
    this.isScheduleOld = obj[6];
    
    this.name = obj[7];
    this.startDate = obj[8];
    this.selectedSchedulingOption = obj[9];
    this.periodic = obj[10];
    this.positionsArrays = obj[11];
    this.isSchedule = obj[12];
    	
    this.obj = obj;
};

CommandCoordinator.prototype = Object.create(Command.prototype);
CommandCoordinator.prototype.constructor = CommandCoordinator;

CommandCoordinator.prototype.undo = function(){
	applyUndoRedoCoordinator(this.nameOld, this.startDateOld, this.selectedSchedulingOptionOld, this.periodicOld, this.positionsArraysOld, this.isScheduleOld);
};

CommandCoordinator.prototype.redo = function(){
	applyUndoRedoCoordinator(this.name, this.startDate, this.selectedSchedulingOption, this.periodic, this.positionsArrays, this.isSchedule);
	undoRedoCoordinator(obj);
};

CommandCoordinator.prototype.getName = function(){
	return msg_coordinator_command;
};

CommandCoordinator.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function undoRedoCoordinator(obj){
	console.log(obj);
	if(obj[0] == 'true'){
		var cArray = getArrayPos(selectedCanvas);
		cArray.commandHistory.push_command(new CommandCoordinator(obj));
	}
}

/********************************************************************/
/********************************************************************/
/*********************** MergeCoordinator ***************************/
function MergeCoordinator(coordinatorsSelectedA,coordinatorsSelectedB) {
    Command.call(this);
    this.coordinatorsSelectedA = coordinatorsSelectedA;
    this.coordinatorsSelectedB = coordinatorsSelectedB;
    this.cloneId = "";
    
    tmpCommandObj = this;
};

MergeCoordinator.prototype = Object.create(Command.prototype);
MergeCoordinator.prototype.constructor = MergeCoordinator;

MergeCoordinator.prototype.undo = function(){
	deleteAllElements();
	replaceWFByCloneVoronoi("",this.cloneId, false);
};

MergeCoordinator.prototype.redo = function(){
	undoRedoMergeCoordinator(this.coordinatorsSelectedA, this.coordinatorsSelectedB);
};

MergeCoordinator.prototype.getName = function(){
	return msg_coordinator_merge_command;
};

MergeCoordinator.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function undoRedoMergeCoordinator(coordinatorsSelectedA,coordinatorsSelectedB){
	var cArray = getArrayPos(selectedCanvas);
	cArray.commandHistory.push_command(new MergeCoordinator(coordinatorsSelectedA,coordinatorsSelectedB));
	cloneVoronoi(getAllCanvasesStatus());
	
	setTimeout(function(){ applyMergeCoordinator(coordinatorsSelectedA,coordinatorsSelectedB); }, 1000);
}

/********************************************************************/
/********************************************************************/
/*********************** SplitCoordinator ***************************/
function SplitCoordinator(selectedIconsCommaDelimited) {
    Command.call(this);
    this.selectedIconsCommaDelimited = selectedIconsCommaDelimited;
    this.cloneId = "";
    
    tmpCommandObj = this;
};

SplitCoordinator.prototype = Object.create(Command.prototype);
SplitCoordinator.prototype.constructor = SplitCoordinator;

SplitCoordinator.prototype.undo = function(){
	deleteAllElements();
	replaceWFByCloneVoronoi("",this.cloneId, false);
};

SplitCoordinator.prototype.redo = function(){
	undoRedoSplitCoordinator(this.selectedIconsCommaDelimited);
};

SplitCoordinator.prototype.getName = function(){
	return msg_coordinator_split_command;
};

SplitCoordinator.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function undoRedoSplitCoordinator(selectedIconsCommaDelimited){
	console.log("undoRedoSplitCoordinator " + selectedIconsCommaDelimited);
	var cArray = getArrayPos(selectedCanvas);
	cArray.commandHistory.push_command(new SplitCoordinator(selectedIconsCommaDelimited));
	cloneVoronoi(getAllCanvasesStatus());
	
	setTimeout(function(){ splitCoordinator(selectedIconsCommaDelimited); }, 1000);
}

/********************************************************************/
/********************************************************************/
/*********************** CommandMoveArrow ***************************/
function CommandMoveArrow(selecteds, selectedArrows, canvasName, outId, inId, name) {
	Command.call(this);
	this.addArrow = new CommandAddArrow(canvasName, outId, inId, name);
	this.deleteArrow = new CommandDelete(selecteds, selectedArrows);
	this.deleteArrow.redo();
	this.selecteds = selecteds;
	this.selectedArrows = selectedArrows;
	this.cloneId = "";
};

CommandMoveArrow.prototype = Object.create(Command.prototype);
CommandMoveArrow.prototype.constructor = CommandMoveArrow;

CommandMoveArrow.prototype.undo = function(){
	this.deleteArrow.undo();
	this.addArrow.undo();
};

CommandMoveArrow.prototype.redo = function(){
	this.addArrow.redo();
	this.deleteArrow.redo();
};

CommandMoveArrow.prototype.getName = function(){
	return msg_move_arrow_command;
};

CommandMoveArrow.prototype.clean = function(){
	removeCloneWorkflow(this.cloneId);
};

function moveArrowObj(selecteds, selectedArrows, canvasName, outId, inId, name){
	var cArray = getArrayPos(canvasName);
	var cma = new CommandMoveArrow(selecteds, selectedArrows, canvasName, outId, inId, name);
   	cArray.commandHistory.push_command(cma);
}
