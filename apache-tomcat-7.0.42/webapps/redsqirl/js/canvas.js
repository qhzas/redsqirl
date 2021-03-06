function Canvas(name){
    this.name=name;
    this.realName = null;
    this.commandHistory = new CommandHistory();
    this.rectSelect = null;
    this.arrow = null;
    this.countObj = 0;
    this.positionX = 0;
    this.positionY = 0;
    
    // control of the rectangle to select objects on the screen
    this.moving = false;

    // checks if something was selected on method:rectSelectAllObj
    this.select = false;

    // checks if an arrow was clicked on metohd:arrow.'click'
    this.clickArrow = false;

    // checks if a drag and drop of a group
    this.dragDropGroup = false;

    this.down = false;
    this.canvasContainer = null;
    this.legendCanvasContainer = null;
    this.stage = null;
    this.layer = null;
    this.polygonLayer = null;
    this.running = false;
    this.saved = false;
    this.pathFile = null;
    this.oldIdSelected = null;
    this.legendStage = null;
    this.legendLayer = null;
    this.legend = null;
    this.legendWidth = 170;
    this.legendHidden = false;
    this.outputTypeColours = [];
    this.workflowType = null;
    this.pointsList = [];
    this.voronoi = null;
    this.voronoiLayer = null;
    this.voronoiButtonLayer = null;
    this.defaultVoronoi = false;
    this.isSchedule = false;
    this.scheduleNoPastDate = true;
    this.arrowToMove = null;
    this.circleMousedown = false;
}

var selectedCanvas = "canvas-1";
var canvasArray = {};
var allPositionIcons;
var rightClickGroup;
var curToolTip;
var curElementHovered;
var isSaveAll = false;
var indexSaving;
var contSaving;
var tmpCommandObj;
var stageArrayTab = [];
var canvasModalParam;
var timestampLastElementClicked;
var lastElementClicked
var coloursList = ['blue', 'green', 'red', 'black', 'yellow', 'orange', 'grey']

var menu_createLink = "Create Link";
var menu_rename = "Rename Object...";
var menu_configure = "Configure...";
var menu_dataoutput = "Data Output...";
var menu_clean = "Clean the Data";
var menu_oozieLog = "Oozie Action Logs";
var menu_editSa = "Edit SuperAction";
var menu_expand = "Expand";
var menu_refreshSa = "Refresh SuperAction";

var contextMenuCanvasAction = [
                               {"Create Link": function(menuItem,menu){createLink(rightClickGroup.getChildren()[0]);}},
                               {"Rename Object...": function(menuItem,menu){openChangeIdModalJS(rightClickGroup);}},
                               {"Configure...": function(menuItem,menu){openCanvasModalJS(rightClickGroup);}},
                               {"Data Output...": function(menuItem,menu){openCanvasModalJS(rightClickGroup,"outputTab");}},
                               {"Clean the Data":function(menuItem,menu){cleanElementJS(rightClickGroup);}},
                               {"Oozie Action Logs": function(menuItem,menu){openWorkflowElementUrl(rightClickGroup.getId());}},
                               {"Edit SuperAction": function(menuItem,menu){if(rightClickGroup.privilege == null){openSubWorkflow(rightClickGroup.elementType);}}},
                               {"Expand": function(menuItem,menu){checkExpand(rightClickGroup.getId());}},
                               {"Refresh SuperAction": function(menuItem,menu){refreshSubWorkflowJS(rightClickGroup);}}
                               ];

var cmenuCanvas = jQuery.contextMenu.create(contextMenuCanvasAction);

window.onload = function() {
    var canvasName = "canvas-1";
    configureCanvas(canvasName, true, 'W');
    mountObj(canvasName);
};

function configureCanvas(canvasName, reset, workflowType){
    
	console.log("configureCanvas");
	
	var nameReal = canvasName;
	if(canvasName.includes(".")){
		canvasName = canvasName.replace(/\./g, "");
	}
	
    if(reset){
        canvasArray[canvasName] = new Canvas(canvasName);
    }
    canvasArray[canvasName].realName = nameReal;
    
    canvasArray[canvasName].workflowType = workflowType;
    
    var canvasContainer = "container-"+canvasName;
    var legendCanvasContainer = "container-legend-"+canvasName;
    canvasArray[canvasName].canvasContainer = canvasContainer;
    canvasArray[canvasName].legendCanvasContainer = legendCanvasContainer;
    
    
    console.log("configureCanvas A " + canvasContainer);
    
    // main stage
    var stage = new Kinetic.Stage({
        container : canvasContainer,
        width : 800,
        height : jQuery("#canvas-tabs").height()-jQuery("#tabsFooter").height()-45
    });
    canvasArray[canvasName].stage = stage;
    
    // stage for the legend
    var legendStage = new Kinetic.Stage({
        container : legendCanvasContainer,
        width : 170,
        height : 400
    });
    canvasArray[canvasName].legendStage = legendStage;

    console.log("configureCanvas B");
    
    // layer to the arrows
    var layer = new Kinetic.Layer();
    canvasArray[canvasName].layer = layer;

    // layer to polygons
    var polygonLayer = new Kinetic.Layer();
    canvasArray[canvasName].polygonLayer = polygonLayer;
    
    //layer voronoi
    var voronoiLayer = new Kinetic.Layer();
    canvasArray[canvasName].voronoiLayer = voronoiLayer;
    
    //layer button voronoi
    var voronoiButtonLayer = new Kinetic.Layer();
    canvasArray[canvasName].voronoiButtonLayer = voronoiButtonLayer;
    
    // layer to legend
    var legendLayer = new Kinetic.Layer();
    canvasArray[canvasName].legendLayer = legendLayer;
    
    console.log("configureCanvas C");
    
    
    // set width of the canvas
    //jQuery("#"+canvasContainer).css("width", jQuery("#"+getCanvasId(canvasName)).width() + 'px');
    //jQuery("#"+canvasContainer).css("height", jQuery("#flowchart-"+canvasName).height() + 'px');
    
    // white background
    var background = new Kinetic.Rect({
        x : 0,
        y : 0,
        //fill : "white",
        width : stage.getWidth(),
        height : stage.getHeight()
    });
    
    // puts a different colour on the canvas before it is opened
    jQuery("#"+canvasContainer).css("background-color", "#FFFAFA");
    jQuery("#"+canvasContainer).find(".kineticjs-content").css("background-color", "white");
    jQuery("#"+canvasContainer).find(".kineticjs-content").css("background-image", "url('../image/canvas_squirl.png')");
    jQuery("#"+canvasContainer).find(".kineticjs-content").css("background-size", "920px");
    
    canvasArray[canvasName].background = background;

    // add the background on layer
    layer.add(background);

    // dotted rectangle to select objects
    canvasArray[canvasName].rectSelect = new Kinetic.Rect({
        x : 0,
        y : 0,
        width : 0,
        height : 0,
        stroke : 'black',
        strokeWidth : 1,
        opacity : 0.5,
        dashArray : [ 33, 10 ]
    });

    canvasArray[canvasName].arrow = new Kinetic.Line({
        // name: 'arrow',
        // dashArray: [33, 10],
        strokeWidth : 4,
        stroke : "black",
        draggable : false
    });

    configureStage(canvasName);

    var arrowClick = false;
    
    canvasArray[canvasName].arrow.on('click', function(e) {
    	jQuery(".tooltipCanvas").remove();
        if (!e.ctrlKey) {
            jQuery.each(layer.getChildren(), function(index, value) {
                if (value.isArrow == true) {
                    value.setStroke(value.originalColor);
                    value.selected = false;
                }
            });
        }
        this.setStroke("#FFDB99");
        this.selected = true;
        canvasArray[canvasName].clickArrow = true;
        
        if (e.ctrlKey) {
        	arrowClick = true;
        	configureChangeArrow(canvasArray[canvasName]);
        	this.setOpacity(0.4);
        	canvasArray[canvasName].clickArrow = false;
        }
        
     	stage.draw();
        
    });
    
    canvasArray[canvasName].arrow.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
    });

    canvasArray[canvasName].arrow.on('mouseout', function() {
        document.body.style.cursor = 'default';
    });
    

    jQuery("#"+canvasContainer).click(function(e) {
    	console.log("canvasContainer click");
    	
    	if(!canvasArray[canvasName].circleMousedown){
    	
			if(!arrowClick){
	            // remove the arrows that are outside the standard
	            deleteArrowOutsideStandard(canvasArray[canvasName]);
			}
	            
	        if (!e.ctrlKey) {
	
	            // checks if something was selected on method:rectSelectAllObj
	            if (!canvasArray[canvasName].select) {
	
	                jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
	                    //value.setStroke('white');
	                    value.getParent().getChildren()[0].setFill("white");
	                    value.getParent().getChildren()[1].setFill("white");
	                    value.selected = false;
	                });
	
	                // checks if an arrow was clicked on metohd:arrow.'click'
	                if (!canvasArray[canvasName].clickArrow) {
	                    jQuery.each(layer.getChildren(), function(index, value) {
	                        if (value.isArrow == true) {
	                            value.setStroke(value.originalColor);
	                            value.selected = false;
	                            value.setOpacity(1);
	                        }
	                    });
	                    //layer.draw();
	                }
	                canvasArray[canvasName].clickArrow = false;
	            }
	        }
	
	        if(!arrowClick){
		        canvasArray[canvasName].down = false;
		        canvasArray[canvasName].moving = false;
		        canvasArray[canvasName].select = rectSelectAllObj(canvasArray[canvasName], e);
		        canvasArray[canvasName].rectSelect.destroy();
		        canvasArray[canvasName].arrowToMove = null;
	        }
        
    	}
        
        for ( var i = 0; i < polygonLayer.getChildren().length; i++) {
        	polygonLayer.getChildren()[i].setDraggable(true);
        }
        
        layer.draw();
        polygonLayer.draw();

        
		arrowClick = false;
		canvasArray[canvasName].circleMousedown = false;
    });
    
    console.log("configureCanvas D");
    
    
    createLegend(canvasArray[canvasName]);
    
    stage.add(voronoiLayer);
    stage.add(layer);
    stage.add(polygonLayer);
    stage.add(voronoiButtonLayer);
    
    legendStage.add(legendLayer);
    
    console.log("configure END");
}

function configureChangeArrow(cArray) {
    var arrow;
    jQuery.each(cArray.layer.getChildren(), function(index, value) {
        if (value.isArrow == true && value.selected == true) {
        	arrow = value;
        	return false;
        }
    });
    var polygonGroup = getElement(cArray.polygonLayer, arrow.idOutput);
    createLink(polygonGroup.getChildren()[0]);
    cArray.arrowToMove = arrow;
}

function createLegend(cArray) {
	
	//console.log("createLegend");
	
    var posX = 0;
    var posY = 10;
    var width = cArray.legendWidth;

    var legendLayer = cArray.legendLayer;
    var legendStage = cArray.legendStage;

    var linkTypeColours = cArray.outputTypeColours;

    var outputTypeColours = [['RECORDED',getColorOutputType('RECORDED')],
                             ['BUFFERED',getColorOutputType('BUFFERED')],
                             ['TEMPORARY',getColorOutputType('TEMPORARY')]];

    var outputExistenceColours = [
                             ['At least one dataset exists',getColorOutputExistence('true')],
                             ['No Dataset exist',getColorOutputExistence('false')]];

    var runningStatusColours = [
                             ['OK',getColorRunning('OK')],
                             ['KILLED',getColorRunning('KILLED')],
                             ['ERROR',getColorRunning('ERROR')]];
        
    var arcColoursArray = {};
        arcColoursArray['Running Status'] = runningStatusColours;
        arcColoursArray['Output Dataset'] = outputExistenceColours;
        arcColoursArray['Output Type'] = outputTypeColours;

    var arcColoursArrayLength = outputTypeColours.length + outputExistenceColours.length + runningStatusColours.length + linkTypeColours.length + 4;
    
    var groupLegend = new Kinetic.Group({
        draggable : false,
        id : "legend",
        dragBoundFunc : function(pos) {
            return rulesDragAndDropObj(cArray, pos, 80, 80);
        }
    });
        
    groupLegend.on('dragstart dragmove', function(e) {
    	cArray.rectSelect.destroy();
    });
        
    
    var contPosition = 0;
    
    var labelTitle = new Kinetic.Text({
        text : 'Arc',
        fontSize : 14,
        fill : 'black',
        fontStyle : 'bold',
        x : posX + 25,
        y : posY + 20*contPosition
    });
    
    groupLegend.add(labelTitle);
    ++contPosition;
    
    var rec = new Kinetic.Rect({
        x : posX + 10,
        y : posY + 20*contPosition,
        width : 10,
        height : 10,
        stroke : getColorOutputType('UNDEFINED'),
        fill: getColorOutputType('UNDEFINED'),
        strokeWidth : 1,
        draggable : false
    });
        
    var labelRec = new Kinetic.Text({
        text : 'Undefined',
        fontSize : 10,
        fill : 'black',
        x : posX + 25,
        y : posY + 20*contPosition
    });
    groupLegend.add(rec);
    groupLegend.add(labelRec);
    ++contPosition;
    
    //Arcs Colours Sub Types
    for (var v in arcColoursArray){
            
        var array = arcColoursArray[v];
        
        if (array.length > 0){
        
            labelTitle = new Kinetic.Text({
                text : v,
                fontSize : 10,
                fill : 'black',
                fontStyle : 'bold',
                x : posX + 45,
                y : posY + 20*contPosition
            });
            
            groupLegend.add(labelTitle);
            ++contPosition;
        
            for (var i = 0; i < array.length; i++) {
                rec = new Kinetic.Rect({
                    x : posX + 10,
                    y : posY + 20*contPosition,
                    width : 10,
                    height : 10,
                    stroke : array[i][1],
                    fill: array[i][1],
                    strokeWidth : 1,
                    draggable : false
                });
                    
                labelRec = new Kinetic.Text({
                    text : capitaliseFirstLetter(array[i][0]),
                    fontSize : 10,
                    fill : 'black',
                    x : posX + 25,
                    y : posY + 20*contPosition
                });
                    
                groupLegend.add(rec);
                groupLegend.add(labelRec);
                ++contPosition;
            }
        }
    }
    var arc2 = new Kinetic.Shape({
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            var x = 40;
            var y = 56;
            var radius = 15;
            var startAngle = (0.1+0.7) * Math.PI;
            var endAngle = (0.6+0.7) * Math.PI;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            canvas.stroke(this);
        },
        fill: '#00D2FF',
        stroke: '#c0c0c0',
        strokeWidth: 3,
        draggable:false
    });
    groupLegend.add(arc2);
    
    var arc3 = new Kinetic.Shape({
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            var x = 20;
            var y = 142;
            var radius = 15;
            var startAngle = (0.1+0.7*2) * Math.PI;
            var endAngle = (0.6+0.7*2) * Math.PI;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            canvas.stroke(this);
        },
        fill: '#00D2FF',
        stroke: '#c0c0c0',
        strokeWidth: 3,
        draggable:false
    });
    groupLegend.add(arc3);
    
	var arc1 = new Kinetic.Shape({
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            var x = 20;
            var y = 185;
            var radius = 15;
            var startAngle = (0.1) * Math.PI;
            var endAngle = (0.6) * Math.PI;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            canvas.stroke(this);
        },
        fill: '#00D2FF',
        stroke: '#c0c0c0',
        strokeWidth: 3,
        draggable:false
    });
    groupLegend.add(arc1);
    
	//Link colours
    if (linkTypeColours.length > 0){
        var labelTitle = new Kinetic.Text({
            text : 'Link',
            fontSize : 14,
            fill : 'black',
            fontStyle : 'bold',
            x : posX + 25,
            y : posY + 20*contPosition
        });
        
        groupLegend.add(labelTitle);
        ++contPosition;
        
            
        for (var i = 0; i < linkTypeColours.length; i++) {
            var rec = new Kinetic.Rect({
                x : posX + 10,
                y : posY + 20*contPosition,
                width : 10,
                height : 10,
                stroke : linkTypeColours[i][1],
                fill: linkTypeColours[i][1],
                strokeWidth : 1,
                draggable : false
            });
                        
            var labelRec = new Kinetic.Text({
                text : capitaliseFirstLetter(linkTypeColours[i][0]),
                fontSize : 10,
                fill : 'black',
                x : posX + 25,
                y : posY + 20*contPosition
            });
                        
            groupLegend.add(rec);
            groupLegend.add(labelRec);
               ++contPosition;
        }
    }
    
    legendStage.setWidth(width+10);
    legendStage.setHeight((arcColoursArrayLength * 20) + 40);
    
    // set width of the canvas
    var legendCanvasContainer = cArray.legendCanvasContainer;
    jQuery("#"+legendCanvasContainer).css("width", legendStage.getWidth()+ 20 + 'px');
    jQuery("#"+legendCanvasContainer).css("height", legendStage.getHeight()+ 30 + 'px');
    
    jQuery("#header-legend-"+cArray.name).css("width", legendStage.getWidth()+ 20 + 'px');
    
    cArray.legend = groupLegend;
    legendLayer.add(groupLegend);
    legendLayer.draw();
}

// a = retangle, b = object, bx = object.getX() and by = object.getY()
function collidesObj(a, b, bx, by) {

    if (a.getX() < bx + b.getWidth() && a.getX() + a.getWidth() > bx && a.getY() < by + b.getHeight() && a.getY() + a.getHeight() > by) {
        return true;
    } else if (a.getX() > bx + b.getWidth() && a.getX() + a.getWidth() < bx && a.getY() < by + b.getHeight() && a.getY() + a.getHeight() > by) {
        return true;
    } else if (a.getX() > bx + b.getWidth() && a.getX() + a.getWidth() < bx && a.getY() > by + b.getHeight() && a.getY() + a.getHeight() < by) {
        return true;
    }
    if (a.getX() < bx + b.getWidth() && a.getX() + a.getWidth() > bx && a.getY() > by + b.getHeight() && a.getY() + a.getHeight() < by) {
        return true;
    } else {
        return false;
    }

}

function rectSelectAllObj(cArray, e) {
	//console.log("rectSelectAllObj");
	
    var polygonLayer = cArray.polygonLayer;

    cArray.select = false;

    jQuery.each(polygonLayer.get('.group1'),
            function(index, value) {
                if (collidesObj(cArray.rectSelect, value, value.getX() + 40, value.getY() + 50)) {
                    value.getChildren()[0].setFill("#FFDB99");
                    value.getChildren()[1].setFill("#FFDB99");
                    value.getChildren()[2].selected = true;
                    //polygonLayer.draw();
                    cArray.select = true;
                } else {
                    if (!e.ctrlKey && !cArray.dragDropGroup
                    		&& cArray.rectSelect){
                    	if(cArray.rectSelect.getWidth() > 10 
                    			&& cArray.rectSelect.getHeight() > 10) {
                    		value.getChildren()[2].selected = false;
                    		value.getChildren()[0].setFill("white");
                    		value.getChildren()[1].setFill("white");
                    		//polygonLayer.draw();
                    	}
                    }
                }
            });
    polygonLayer.draw();

    return cArray.select;
}

function toggleSelectOnClick(cArray, obj, e) {
    // <![CDATA[
    
	//console.log("toggleSelectOnClick");
	
    var layer = cArray.layer;
    var polygonLayer = cArray.polygonLayer;
    var stage = cArray.stage;

    if (!e.ctrlKey) {
    	
    	//console.log("toggleSelectOnClick no ctrl");
    	
        jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
            //value.setStroke('white');
        	if(value.getParent().getId() != obj.getParent().getId()){
        		value.getParent().getChildren()[0].setFill("white");
        		value.getParent().getChildren()[1].setFill("white");
        		value.selected = false;
        	}
        });

        jQuery.each(layer.getChildren(), function(index, value) {
            if (value.isArrow == true) {
                value.setStroke(value.originalColor);
                value.selected = false;
            }
        });
    }

    //obj.setStroke("red");
    obj.selected = !obj.selected;
    if(obj.selected){
    	obj.getParent().getChildren()[0].setFill("#FFDB99");
        obj.getParent().getChildren()[1].setFill("#FFDB99");
    }else{
    	obj.getParent().getChildren()[0].setFill("white");
        obj.getParent().getChildren()[1].setFill("white");
    }
    getSelectedIcons();
    stage.draw();

    // ]]>
}

function dragAndDropGroup(cArray, obj, e) {
	//console.log("dragAndDropGroup");
	
	var layer = cArray.layer;
    var polygonLayer = cArray.polygonLayer;
    var stage = cArray.stage;
    var background = cArray.background;

    var xCanvas = stage.getWidth();
    var yCanvas = stage.getHeight();
    var group = obj;
    var newX = 0;
    var newY = 0;
    var differenceX = 0;
    var differenceY = 0;
    var positionX = cArray.positionX;
    var positionY = cArray.positionY;
    var mousePos = stage.getMousePosition();
    if (mousePos !== undefined) {
        differenceX = mousePos.x - positionX;
        differenceY = mousePos.y - positionY;
        //console.log("Main obj: "+group.getId()); 
        jQuery.each(polygonLayer.get('.group1'), function(index, value) {
        	if (value.getChildren()[2] !== undefined && value.getChildren()[2].selected == true) {

        		
        		if (group.getX() != positionX) {
        			//console.log("Manual move: "+value.getId());
        			newX = value.getX() + differenceX;
        		} else{
        			newX = group.getX();
        		}

        		if (group.getY() != positionY) {
        			newY = value.getY() + differenceY;
        		} else{
        			newY = group.getY();
        		}

        		if (mousePos.x < 60) {
        			newX = value.getX();
        		}
        		if (mousePos.y < 60) {
        			newY = value.getY();
        		}


        		if (newX < 5) {
        			newX = 5;
        		} else if (newX + 200 > xCanvas) {
        			stage.setWidth(xCanvas + 200);
        			background.setWidth(stage.getWidth());
        			xCanvas = stage.getWidth();
        		}

        		if (newY < 5) {
        			newY = 5;
        		} else if (newY + 200 > yCanvas) {
        			stage.setHeight(yCanvas + 200);
        			background.setHeight(stage.getHeight());
        			yCanvas = stage.getHeight();
        		}

        		value.setPosition(newX, newY);
        		changePositionArrow(cArray, value);
        	}
        });
    }

    if (group.getX() != positionX) {
    	cArray.positionX = positionX + differenceX;
    }

    if (group.getY() != positionY) {
    	cArray.positionY = positionY + differenceY;
    }
    
    changePositionArrow(cArray, group);

    layer.draw();
    polygonLayer.draw();
}

function getPositionGivenIcons(icons, group){
	//console.log("getPositionGivenIcons");
	
	var cArray = getArrayPos(selectedCanvas);
	
    var polygonLayer = cArray.polygonLayer;
    var ans = new Array();
    var i = -1;

    // update element positions
    jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        if(value.selected && value !== undefined && value.getParent().getId() !== undefined){
            var arrayEl = new Object();
            arrayEl.elementId = value.getParent().getId();
            arrayEl.X = value.getParent().getX();
            arrayEl.Y = value.getParent().getY();
            ans[++i] = arrayEl;
        }
    });
    var arrayEl = new Object();
    if( group !== undefined && group.getId() !== undefined){
        arrayEl.elementId = group.getId();
        arrayEl.X = group.getX();
        arrayEl.Y = group.getY();
        ans[++i] = arrayEl;
    }
            
    return ans;
}

function getSelectedIcons(){
	//console.log("getSelectedIcons");
	
	var cArray = getArrayPos(selectedCanvas);
	
    var polygonLayer = cArray.polygonLayer;
    var ans = new Array();
    var i = -1;
    
    // update element positions
    jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        //alert(index+" "+value.selected);
        if(value.getParent().getId() !== undefined && value.selected){
            ans[++i] = value.getParent();
            //console.log("selected: "+value.getParent().getId());
        }
    });
    return ans;
}

function selectAll(cArray) {
	//console.log("selectAll");
	
    var polygonLayer = cArray.polygonLayer;
    var layer = cArray.layer;
    
    jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        //value.setStroke("red");
        value.getParent().getChildren()[0].setFill("#FFDB99");
        value.getParent().getChildren()[1].setFill("#FFDB99");
        value.selected = true;
    });

    jQuery.each(layer.getChildren(), function(index, value) {
        if (value.isArrow == true) {
            value.setStroke("red");
            value.selected = true;
        }
    });
    
    polygonLayer.draw();
    layer.draw();
}

function deselectAll(cArray) {
	//console.log("deselectAll");
	
    var polygonLayer = cArray.polygonLayer;
    var layer = cArray.layer;

    jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        //value.setStroke('white');
        value.getParent().getChildren()[0].setFill("white");
        value.getParent().getChildren()[1].setFill("white");
        value.selected = false;
    });
    jQuery.each(layer.getChildren(), function(index, value) {
        if (value.isArrow == true) {
            value.setStroke(value.originalColor);
            value.selected = false;
        }
    });
    polygonLayer.draw();
    layer.draw();
}

function checkIfExistID(nameId, listIds) {
    var ids = listIds.split(",");
    for ( var i = 0; i < ids.length; i++) {
        if(ids[i] == nameId){
            return true;
        }
    }
    return false;
}

function deleteElementsJS(listIds, listArrowsIds) {
	console.log("deleteElementsJS");
	
	console.log(listIds);
	console.log(listArrowsIds);
	
	var cArray = getArrayPos(selectedCanvas);
	
	var polygonLayer = cArray.polygonLayer;
	var layer = cArray.layer;
    
    if(listIds){
        var toDelete = []; 
        var iter=-1;
	    jQuery.each(polygonLayer.get('.group1'), function(index, value) {
	    	var group = this;
	    	console.log("a " + group.getId());
		    if(checkIfExistID(group.getId(),listIds)){
			     deleteLayerChildren(cArray, group.getId());
			     toDelete[++iter] = group;
		    }
	    });
        for(iter = 0; iter < toDelete.length;++iter){
            removeElement(toDelete[iter].getId());
            toDelete[iter].destroy();
        }
    }

	if(listArrowsIds){
	    var toDelete = [];
	    var iter=-1;
    	jQuery.each(layer.getChildren(), function(index, value) {
		    if (value !== undefined && value.isArrow == true) {
			    if (checkIfExistID(value.getName(), listArrowsIds)) {
                    removeLinkBt(value.idOutput, value.nameOutput, value.idInput, value.nameInput);
                    toDelete[++iter] = value;
                }
            }
        });
        for(iter = 0; iter <  toDelete.length;++iter){
            if (toDelete[iter].label){
                toDelete[iter].label.destroy();
            }
            toDelete[iter].destroy();
        }
    }
	
	layer.draw();
	polygonLayer.draw();
	
	//deleteSelectedVoronoi(listIds);
	undoRedoVoronoi();
}

//erase all objects from the canvas
function refreshCanvas() {
	console.log("refreshCanvas");
	
    //var layer = canvasArray[selectedCanvas].layer;
    //var polygonLayer = canvasArray[selectedCanvas].polygonLayer;
    //layer.destroyChildren();
    //polygonLayer.destroyChildren();
    
    deleteAllElements();
	rebuildJS();
}

function deleteAllElements() {
	console.log("deleteAllElements");
	
	var cArray = getArrayPos(selectedCanvas);
	
	selectAll(cArray);
	
	var polygonLayer = cArray.polygonLayer;
	var layer = cArray.layer;
    
	var toDelete = [];
	var iter=-1;
	jQuery.each(polygonLayer.get('.group1'), function(index, value) {
		var group = this;
		deleteLayerChildren(cArray, group.getId());
		toDelete[++iter] = group;
	});
	for(iter = 0; iter <  toDelete.length;++iter){
        toDelete[iter].destroy();
    }
	
	toDelete = [];
	iter=-1;
	jQuery.each(layer.getChildren(), function(index, value) {
        if (value !== undefined && value.isArrow == true) {
        	removeLinkBt(value.idOutput, value.nameOutput, value.idInput, value.nameInput);
            toDelete[++iter] = value;
        }
    });
	for(iter = 0; iter <  toDelete.length;++iter){
        toDelete[iter].destroy();
    }
	
	//layer.draw();
	//polygonLayer.draw();
	
	console.log("deleteAllElements END");
}

// remove the arrows that are outside the standard
function deleteArrowOutsideStandard(cArray) {
	//console.log("deleteArrowOutsideStandard");
	
	var toDelete = [];
	var iter=-1;
    var layer = cArray.layer;
        jQuery.each(layer.getChildren(), function(index, value) {
            if (value) {
                if (value.isArrow && (!value.idOutput||!value.idInput)) {
                    toDelete[++iter] = value;
                }
            }
        });
    for(iter = 0; iter <  toDelete.length;++iter){
        toDelete[iter].destroy();
    }
}

function getCircleLineIntersectionPoint(pointAx, pointAy, pointBx, pointBy,
        circleX, circleY, radius) {

    var baX = pointBx - pointAx;
    var baY = pointBy - pointAy;
    var caX = circleX - pointAx;
    var caY = circleY - pointAy;

    var a = 1 / (baX * baX + baY * baY);

    var pBy2 = (baX * caX + baY * caY) * a;

    var tmpSqrt = Math.sqrt(pBy2 * pBy2 - (caX * caX + caY * caY - radius * radius) * a);

    var px = pointAx - baX * (tmpSqrt - pBy2);
    var py = pointAy - baY * (tmpSqrt - pBy2);

    return [ px, py ];
}

function deleteLayerChildren(cArray, idGroup) {
    var toDelete = []; 
    var iter=-1;
	//console.log("deleteLayerChildren");
        jQuery.each(cArray.layer.getChildren(), function(index, value) {
                if (value && value.isArrow == true) {
                    //console.log(value.idOutput+","+value.idInput);
                    if (value.idOutput == idGroup || value.idInput == idGroup){
                        toDelete[++iter] = value;
                    }
                }
            });
    for(iter = 0; iter <  toDelete.length;++iter){
        if (toDelete[iter].label){
            toDelete[iter].label.destroy();
        }
        toDelete[iter].destroy();
    }
}

function changePositionArrow(cArray, obj) {
	//console.log("changePositionArrow");
	
    var polygonLayer = cArray.polygonLayer;
    var layer = cArray.layer;
    var group = obj;
    var idGroup = obj.getId();
    
    jQuery.each(layer.getChildren(), function(index, value) {
        if (value.isArrow == true) {
            if (value.idOutput == idGroup) {
                value.getPoints()[0].x = group.getX() + 40;
                value.getPoints()[0].y = group.getY() + 50;
   
                var g = getElement(polygonLayer, value.idInput);

                if (g !== undefined) {
                    
                    var newPoint = null;
                    var newPoint2 = null;
                    var angle = null;

                    newPoint = getArrowPositions2(g, group, 47, 40);
                    newPoint2 = getArrowPositions2(g, group, 60, 40);
                    angle = getArrowAngle(newPoint, group);

                    updatePositionArrow(value, newPoint, newPoint2, 20, 10, angle);
                }
            }else if (value.idInput == idGroup) {
                var newPoint = getArrowPositions(value, group, 47);
                var newPoint2 = getArrowPositions(value, group, 60);
                
                var angle = getArrowAngle2(newPoint, value);
                
                updatePositionArrow(value, newPoint, newPoint2, 20, 10, angle);
            }
        }
    });
}

function addLinks(cArray, positions) {
	//console.log("addLinks");
	
    var linkArrays = JSON.parse(positions);

    for ( var i = 0; i < linkArrays.length; i++) {
        addLink(cArray.realName, linkArrays[i][0], linkArrays[i][2],false);
        updateLink("arrow" + linkArrays[i][0] + "-" + linkArrays[i][2],linkArrays[i][1] , linkArrays[i][3]);
    }
}

function addLink(canvasName, outId, inId,updateLayer) {
	//console.log("addLink");
	
	var cArray = getArrayPos(canvasName);
	
	updateLayer = typeof updateLayer !== 'undefined' ? updateLayer : true;
    // out
    var layer = cArray.layer;
    var polygonLayer = cArray.polygonLayer;
    var arrow = cArray.arrow;
    
    var polygonGroupOut = getElement(polygonLayer, outId);
    arrow.setPoints([ polygonGroupOut.getX() + 40, polygonGroupOut.getY() + 50,
            polygonGroupOut.getX() + 40 + 1, polygonGroupOut.getY() + 50 + 1 ]);

    // in
    var polygonGroupIn = getElement(polygonLayer, inId);

    arrow.setName("arrow" + outId + "-" + inId);

    var newPoint = getArrowPositions(arrow, polygonGroupIn, 47);
    var newPoint2 = getArrowPositions(arrow, polygonGroupIn, 60);

    var angle = getArrowAngle2(newPoint, arrow);
    
    updatePositionArrow(arrow, newPoint, newPoint2, 20, 10, angle);

    var arrowClone = arrow.clone();
    arrowClone.idInput = inId;
    arrowClone.idOutput = outId;
    arrowClone.isArrow = true;
    layer.add(arrowClone);
    
    if(updateLayer){
       layer.draw();
       polygonLayer.draw();
    }
    
    console.log("arrow " + outId + " - " + inId);
    
    return arrowClone;
}

function getArrowAngle(newPoint, group){
    return Math.atan2(newPoint[1] - group.getY() - 50,
            newPoint[0] - group.getX() - 40);
}

function getArrowAngle2(newPoint, value){
    return Math.atan2(newPoint[1] - value.getPoints()[0].y,
            newPoint[0] - value.getPoints()[0].x);
}

function getArrowPositions(value, group, position){
    return getCircleLineIntersectionPoint(value.getPoints()[0].x, 
            value.getPoints()[0].y, group.getX() + 40, group.
            getY() + 50, group.getX() + 40,
            group.getY() + 50, position);
}

function getArrowPositions2(g, group, position, offsetX){
    return getCircleLineIntersectionPoint(
            group.getX() + 40, group.getY() + 50, g
            .getX() + offsetX, g.getY() + 50, g
            .getX() + offsetX, g.getY() + 50, position);
}

function updatePositionArrow(arrow, newPoint, newPoint2, headlen, headlen2, angle){
	//console.log("updatePositionArrow");
	
    sin_angle = Math.sin(angle);
    cos_angle = Math.cos(angle);
    cos6 = 0.866025;
    sin6 = 0.5;
    cos3 = 0.5;
    sin3 = 0.866025;
    
    arrow.setPoints([ arrow.getPoints()[0].x, arrow.getPoints()[0].y,
    newPoint2[0], newPoint2[1], newPoint2[0], newPoint2[1],
    newPoint[0] - headlen * (cos_angle*cos6 + sin_angle*sin6), // Math.cos(angle - Math.PI / 6)
    newPoint[1] - headlen * (sin_angle*cos6 - cos_angle*sin6), newPoint[0], // Math.sin(angle - Math.PI / 6)
    newPoint[1], newPoint[0] - headlen * (cos_angle*cos6 - sin_angle*sin6), //Math.cos(angle + Math.PI / 6)
    newPoint[1] - headlen * (sin_angle*cos6 + cos_angle*sin6), //Math.sin(angle + Math.PI / 6)
    newPoint2[0], newPoint2[1],
    newPoint2[0] - headlen2 * (cos_angle*cos3 + sin_angle*sin3), //Math.cos(angle - Math.PI / 3)
    newPoint2[1] - headlen2 * (sin_angle*cos3 - cos_angle*sin3), //Math.sin(angle - Math.PI / 3)
    newPoint2[0], newPoint2[1],
    newPoint2[0] - headlen2 * (cos_angle*cos3 - sin_angle*sin3) , //Math.cos(angle + Math.PI / 3)
    newPoint2[1] - headlen2 * (sin_angle*cos3 + cos_angle*sin3) ]); //Math.sin(angle + Math.PI / 3)
    
    if (arrow.label != null){
        var x1 = arrow.getPoints()[0].x
        var y1 = arrow.getPoints()[0].y
        
        var x2 = arrow.getPoints()[1].x
        var y2 = arrow.getPoints()[1].y
        
        arrow.label.setX((x1 + x2 + (cos_angle * 42))*0.5  - Math.abs((cos_angle * arrow.label.getText().length*2.7)));
        arrow.label.setY((y1 + y2 + (sin_angle * 42))*0.5);
    }
}

function rulesDragAndDropObj(cArray, pos, valueX, valueY) {
	//console.log("rulesDragAndDropObj");
	
    var stage = cArray.stage;
    var background = cArray.background;

    var xCanvas = stage.getWidth();
    var yCanvas = stage.getHeight();
    
    var newX;
    if (pos.x < 5) {
        newX = 5;
    } else if (pos.x + valueX + 200 > xCanvas) {
        newX = pos.x;
        stage.setWidth(xCanvas + 200);
        background.setWidth(stage.getWidth());
    } else {
        newX = pos.x;
    }

    var newY;
    if (pos.y < 5) {
        newY = 5;
    } else if (pos.y + valueY + 200 > yCanvas) {
        newY = pos.y;
        stage.setHeight(yCanvas + 200);
        background.setHeight(stage.getHeight());
    } else {
        newY = pos.y;
    }

    return {
        x : newX,
        y : newY
    };
}

function rulesDragAndDropGroupObj(canvasName, pos, valueX, valueY) {
    // <![CDATA[
    
	//console.log("rulesDragAndDropGroupObj");
	
	var cArray = getArrayPos(canvasName);
	
    var stage = cArray.stage;
    var background = cArray.background;
    var canvasContainer = cArray.canvasContainer;

    var xCanvas = stage.getWidth();
    var yCanvas = stage.getHeight();
    var newX = pos.x;
    var newY = pos.y;

    if (pos.x < 5) {
        newX = 5;
    } else if (valueX != null && pos.x < valueX) {
        newX = valueX;
    } else if (pos.x + 200 > xCanvas) {
        newX = pos.x;
        stage.setWidth(xCanvas + 200);
        background.setWidth(stage.getWidth());
    }

    if (pos.y < 5) {
        newY = 5;
    } else if (valueY != null && pos.y < valueY) {
        newY = valueY;
    } else if (pos.y + 200 > yCanvas) {
        newY = pos.y;
        stage.setHeight(yCanvas + 200);
        background.setHeight(stage.getHeight());
    }

    return {
        x : newX,
        y : newY
    };

    // ]]>
}

function addElements(cArray, positions, selecteds, isStartVoronoi) {
	console.log("addElements");
	
    var positionsArrays = JSON.parse(positions);
    var numSides = 4;
    
	//try{
	
    var polygonLayer = cArray.polygonLayer;
    
	for ( var i = 0; i < positionsArrays.length; i++) {
		
		if(getElement(polygonLayer, positionsArrays[i][0]) == null){
			
			/*
			alert(positionsArrays[i][0]);
			alert(positionsArrays[i][1]);
			alert(positionsArrays[i][2]);
			alert(positionsArrays[i][3]);
			alert(positionsArrays[i][4]);
			alert(positionsArrays[i][5]);
			alert(positionsArrays[i][6]);
			alert(positionsArrays[i][7]);
			*/
			
			var group = addElement(
					cArray.realName, 
					positionsArrays[i][1],
					positionsArrays[i][2],
					positionsArrays[i][3],
					positionsArrays[i][4],
					numSides,
					positionsArrays[i][0],
					selecteds,
					positionsArrays[i][6],
					positionsArrays[i][7],
					positionsArrays[i][8],
					isStartVoronoi
					);
			//updateIdObj(positionsArrays[i][0], positionsArrays[i][0]);
			updateTypeObj(cArray.realName, positionsArrays[i][0], positionsArrays[i][0]);
			updateLabelObj(positionsArrays[i][0], positionsArrays[i][5],false);
			group.hasChangedId = true;
		}
		
	}
    
    /*}catch(exception){
        alert(exception);
    }*/
    
}

function checkImg(src){
   var jqxhr = jQuery.get(src, function() {
     return true;
   }).fail(function() { 
    return false;
   });
}

function addElement(canvasName, elementType, elementImg, posx, posy, numSides, idElement, selecteds, privilege, elementTypeName, voranoiPolygonTitle, isStartVoronoi) {
	console.log("addElement");
    
	var cArray = getArrayPos(canvasName);
	
//	console.log("canvasName " + canvasName);
//	console.log("elementType " + elementType);
//	console.log("elementImg " + elementImg);
//	console.log("posx " + posx);
//	console.log("posy " + posy);
//	console.log("numSides " + numSides);
//	console.log("idElement " + idElement);
//	console.log("selecteds " + selecteds);
//	console.log("privilege " + privilege);
//	console.log("elementTypeName " + elementTypeName);
//	console.log("voranoiPolygonTitle " + voranoiPolygonTitle);
	
	if(voranoiPolygonTitle == undefined){
		voranoiPolygonTitle = "title";
	}
	isStartVoronoi = typeof isStartVoronoi !== 'undefined' ? isStartVoronoi : true;
	
	//console.log("Size X canvas: " + canvasArray[canvasName].stage.getWidth());
	//console.log("Size Y canvas: " + canvasArray[canvasName].stage.getHeight());
	
    if(cArray.stage.getWidth()  < posx +  500){
       console.log("Make X bigger: " + posx +", "+ cArray.stage.getWidth());
       cArray.stage.setWidth(posx + 500);
       cArray.background.setWidth(posx + 500);
    }
    if(cArray.stage.getHeight() < posy+ 500 ){
       console.log("Make Y bigger: " + posy +", "+ cArray.stage.getHeight());
       cArray.stage.setHeight(posy + 500);
       cArray.background.setHeight(posy + 500);
    }
    
    
    //alert(idElement+": "+privilege);
    
    var polygonLayer = cArray.polygonLayer;

    var img = new Image();
    img.src = elementImg;

    var result = createPolygon(img, 40, 50, numSides, canvasName);
    var polygon = result[0];
    
    var circle0 = new Kinetic.Circle({
        x : 40,
        y : 50,
        radius : 32,
        draggable : false,
        //fill :'white',
        opacity: 0
        //stroke : 'white',
        //strokeWidth : 5
    });
    configureCircle(cArray, circle0);

    var circle1 = new Kinetic.Circle({
        x : 40,
        y : 50,
        radius : 42,
        draggable : false,
        opacity: 0.5,
        fill :'white',
        //stroke : 'white',
        //strokeWidth : 5
    });
    configureCircle(cArray, circle1);
    
    
    var arc1 = new Kinetic.Shape({
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            var x = 40;
            var y = 50;
            var radius = 42;
            var startAngle = 0.1 * Math.PI;
            var endAngle = 0.6 * Math.PI;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            canvas.stroke(this);
        },
        fill: '#00D2FF',
        stroke: '#c0c0c0',
        strokeWidth: 4,
        draggable:false
    });
    
    var arc2 = new Kinetic.Shape({
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            var x = 40;
            var y = 50;
            var radius = 42;
            var startAngle = 0.8 * Math.PI;
            var endAngle = 1.3 * Math.PI;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            canvas.stroke(this);
        },
        fill: '#00D2FF',
        stroke: '#c0c0c0',
        strokeWidth: 4,
        draggable:false
    });
    
    var arc3 = new Kinetic.Shape({
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            var x = 40;
            var y = 50;
            var radius = 42;
            var startAngle = 1.5 * Math.PI;
            var endAngle = 1.9 * Math.PI;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            canvas.stroke(this);
        },
        fill: '#00D2FF',
        stroke: '#c0c0c0',
        strokeWidth: 4,
        draggable:false
    });
    
    var cArraySelected = getArrayPos(selectedCanvas);
    var stage = cArraySelected.stage;
    
    arc1.on('mouseover', function(e) {
    	if(!cArray.dragDropGroup &&!cArray.moving){
    		var help = jQuery('<div class="tooltipCanvas" style="background-color:white;" >'+ getLabelOutputType(this.getStroke()) +'</div>');
    		help.css("top",(e.pageY)+"px" );
    		help.css("left",(e.pageX)+"px" );
    		jQuery("body").append(help);
    		help.fadeIn("slow");
    	}
    });
    
    arc1.on('mouseout', function(e) {
        jQuery(".tooltipCanvas").remove();
        curToolTip = null;
    });
    
    arc2.on('mouseover', function(e) {
    	if(!cArray.dragDropGroup &&!cArray.moving){
    		var help = jQuery('<div class="tooltipCanvas" style="background-color:white;" >'+ getLabelRunning(this.getStroke()) +'</div>');
    		help.css("top",(e.pageY)+"px" );
    		if(this.getStroke() == '#008000'){
    			help.css("left",(e.pageX)-140+"px" );
    		}else{
    			help.css("left",(e.pageX)-190+"px" );
    		}
    		jQuery("body").append(help);
    		help.fadeIn("slow");
    	}
    });
    
    arc2.on('mouseout', function(e) {
        jQuery(".tooltipCanvas").remove();
        curToolTip = null;
    });
    
    arc3.on('mouseover', function(e) {
    	if(!cArray.dragDropGroup &&!cArray.moving){
    		var help = jQuery('<div class="tooltipCanvas" style="background-color:white;" >'+ getLabelOutputExistence(this.getStroke()) +'</div>');
    		help.css("top",(e.pageY)+"px" );
    		help.css("left",(e.pageX)+"px" );
    		jQuery("body").append(help);
    		help.fadeIn("slow");
    	}
    });
    
    arc3.on('mouseout', function(e) {
        jQuery(".tooltipCanvas").remove();
        curToolTip = null;
    });
    

    var srcImageText = new Kinetic.Text({
        text : "srcImageText"
    });
    srcImageText.setStroke(null);

    
    var typeText = new Kinetic.Text({
        text : elementType
    });
    var helpId = elementType;
    if(helpId.indexOf('>') === 0){
    	helpId = helpId.substring(1).replace(">","_");
    }

    var group = createGroup(cArray, circle0, circle1, polygon, srcImageText, typeText, helpId, idElement, arc1,arc2,arc3);
    
    polygonLayer.add(group);
    
    //check if need start voronoi
    if(isStartVoronoi){
    	//add point to voronoi list
    	cArray.pointsList.push([posx+40,posy+50]);
        startVoronoi(canvasName, idElement, voranoiPolygonTitle);
    }
    
    var selectedObj = false
    if(selecteds != null){
        var res = selecteds.split(",");
        for (var i in res) {
            if(res[i] == idElement){
                selectedObj = true;
            }
        }
    }

    configureGroup(cArray, group, posx, posy, polygon, selectedObj);
    
    group.tooltipObj = "Type: " + ucFirstAllWords(elementType.split("_").join(" "));
    
    if(elementTypeName){
        group.elementType = elementTypeName;
    }else{
        group.elementType = elementType;
    }
    
    group.privilege = privilege;
    
    return group;
}

function ready(canvasName) {
	//console.log("ready");

	var cArray = getArrayPos(canvasName);
	
    var layer = cArray.layer;
    var polygonLayer = cArray.polygonLayer;
    var stage = cArray.stage;
    var background = cArray.background;

    // variable to control image of the object
    var imgTab1 = new Image();

    // control of the rectangle to select objects on the screen
    cArray.moving = false;

    stage.destroy();

    // main stage
    stage = new Kinetic.Stage({
        container : "canvas",
        width : 800,
        height : 600
    });
    cArray.stage = stage;

    stage.setWidth(layer.getChildren()[1].getWidth());
    stage.setHeight(layer.getChildren()[1].getHeight());
    background.setWidth(stage.getWidth());
    background.setHeight(stage.getHeight());

    // add the background on layer
    layer.add(background);
    background.moveToBottom();

    // set width of the canvas
    jQuery("#"+cArray.canvasContainer).css("width", jQuery(canvasName).width() + 'px');

    stage.add(layer);
    stage.add(polygonLayer);

    configureStage(canvasName);

    jQuery.each(polygonLayer.get('.group1'), function(index, value) {
        var group = this;

        var circle1 = group.getChildren()[1];
        var polygon1 = group.getChildren()[2];
        var text = group.getChildren()[3];

        // alert(text.getText().substring(2));
        imgTab1.src = './' + text.getText().substring(2);
        polygon1.setFillPatternImage(imgTab1);

        group.setDragBoundFunc(function(pos) {
            return rulesDragAndDropObj(cArray, pos, 80, 80);
        });

        try{
        	configureCircle(cArray, circle1);
        }catch(exception){
            console.log(exception);
        }
        
        //configureGroupListeners(canvasName, group);

        polygon1.on('mousedown', function(e) {
            toggleSelectOnClick(cArray, this, e);
        });

    });
    polygonLayer.draw();
}

/**
 * 
 * Method to mount the footer of canvas and your tabs. Makes one for the 'divs'
 * and 'images' to create the objects and put their functionalities. generates
 * javascript for HTML5 canvas
 * 
 */
function mountObj(canvasName) {
	console.log("mountObj");

	var cArray = getArrayPos(canvasName);
	//var cArraySelected = getArrayPos(selectedCanvas);
	
	// for list divs
	jQuery("#tabsFooter ul:first li").each(function(index) {

		var posInitX = 40;
		var poxInitY = 35;
		
		var posInitTextX = 16;
		var posInitTextY = 65;

		var nameDiv = jQuery(this).attr("aria-controls");
		
		var stageTab;
		var ind = 0;
		
        if (nameDiv != undefined) { // groupNumber

            // ------------ START TAB

            // stage to footer
            stageTab = new Kinetic.Stage({
                container : nameDiv,
                width : jQuery("#canvas-tabs").width()-15,
                height : 100
            });
            
            jQuery("#" +  nameDiv).find(".kineticjs-content").css("background-image", "none");

            // layer to footer tab1
            var layerTab = new Kinetic.Layer();
            
            var numSides = 4;

            var numObjs = 0;
            
            // for list of obj imagens
            jQuery("#" + nameDiv).find("img").each(function(index) {

                numObjs++;
                
                // variable to control image of the object
                var imgTab = new Image();
                
                //alert(jQuery(this).attr("src"));
                
                imgTab.src = jQuery(this).attr("src");
                var srcImageText = jQuery(this).attr("src");
                
                //label on footer
                var nameObj = jQuery(this).next().text();
                
                var priv = jQuery(this).next().next().text();
                if(!priv){
                	priv = null;
                }
                

                var helpId = nameObj;
                var labelText = nameObj;
                if(nameObj.indexOf('>') === 0){
                	helpId = nameObj.substring(1).replace(">","_");
                	labelText = nameObj.substring(1+nameObj.lastIndexOf(">"));
                }
                var labelTextSize8 = labelText;
                if(labelText.length > 8){
                    labelTextSize8 = labelText.substring(0,7).concat(".");
                }
                
                labelTextSize8 = labelTextSize8.replace("_"," ");
                labelTextSize8 = ucFirstAllWords(labelTextSize8);
                
                
                var typeLabel = new Kinetic.Text({
                    x:posInitTextX,
                    y:posInitTextY,
                    fontSize: 12,
                    fill: 'black',
                    text : labelTextSize8
                });
                typeLabel.setPosition(posInitTextX,posInitTextY);

                // GROUP
                var result = createPolygon(
                    imgTab, 
                    posInitX,
                    poxInitY,
                    numSides,
                    canvasName);
                var polygonTab = result[1];
                var polygonTabImage = result[2];
                
                var rotateDeg = 0;
                if (numSides%2 == 0 ){
                    rotateDeg = 360/(2*numSides);
                }
                var polygonTabFake = new Kinetic.RegularPolygon({
                    x : 40,
                    y : 50,
                    opacity : 0,
                    radius : 35,
                    sides : numSides,
                    draggable : true
                });
                polygonTabFake.rotateDeg(rotateDeg);
                polygonTabFake.setAbsolutePosition(posInitX,poxInitY);
                polygonTabFake.posInitX = posInitX;
                polygonTabFake.posInitY = poxInitY;

                posInitX = posInitX + 70;
                posInitTextX = posInitTextX + 70;

                polygonTabFake.on('dragstart',function() {
                    jQuery("#help_"+helpId).click();
                    jQuery('#body').css('cursor','url('+ polygonTabImage + ') 30 30,default');
                });
                
                polygonTabFake.on('mouseup',function() {
                    jQuery("#help_"+helpId).click();
                });
                
                polygonTabFake.on('mouseover',function(e) {
                	if(cArray != undefined && !cArray.dragDropGroup && !cArray.moving){
                		var help = jQuery('<div class="tooltipCanvas" style="background-color:white;" >'+ ucFirstAllWords(labelText.split("_").join(" ")) +'</div>');
                		help.css("top",(e.pageY)+"px" );
                		help.css("left",(e.pageX)+"px" );
                		jQuery("body").append(help);
                		help.fadeIn("slow");
                	}
                });
                
                polygonTabFake.on('mouseout', function(e) {
                    jQuery(".tooltipCanvas").remove();
                    curToolTip = null;
                });
                
                polygonTabFake.on('dragend',function() {
                    
                	console.log("polygonTabFake dragend");
                	
                    //var stage = cArray.stage;
                	var stage = canvasArray[removeDot(selectedCanvas)].stage;
                    
                    console.log("polygonTabFake stage " + stage);

                    var mousePosStage = stage.getMousePosition();
                    
                    console.log("polygonTabFake mousePosStage " + stage.getMousePosition());
                    
                    
                    if (mousePosStage !== undefined){
                    
                    	console.log("polygonTabFake mousePosStage");
                    	
                    	var idx = "group" + (+cArray.countObj++);
                    	
                    	cArray.commandHistory.push_command(new CommandAddObj(selectedCanvas,
                                nameObj,
                                srcImageText,
                                mousePosStage.x - 30,
                                mousePosStage.y - 30,
                                numSides,
                                idx,
                                "",
                                priv)
                        );
                        
                        addElementFirstTime(
                        		selectedCanvas,
                        		nameObj,
                                srcImageText,
                                mousePosStage.x - 30,
                                mousePosStage.y - 30,
                                numSides,
                                idx,
                                "",
                                priv);
                        
                    }
                    document.body.style.cursor = 'default';
                    
                    var polygonTabFakeClone = polygonTabFake.clone();
                    polygonTabFakeClone.name = nameObj;
                    polygonTabFakeClone.setAbsolutePosition(polygonTabFake.posInitX,polygonTabFake.posInitY);
                    layerTab.add(polygonTabFakeClone);
                    this.destroy();
                    
                    layerTab.draw();
                    cArray.polygonLayer.draw();
                });

                polygonTabFake.on('mouseup',function() {
                    document.body.style.cursor = 'default';
                    
                    var polygonTabFakeClone = polygonTabFake.clone();
                    polygonTabFakeClone = nameObj;
                    polygonTabFakeClone.setAbsolutePosition(polygonTabFake.posInitX,polygonTabFake.posInitY);
                    layerTab.add(polygonTabFakeClone);
                    this.destroy();
                    
                    layerTab.draw();
                });
				
				polygonTabFake.on('mouseout', function(e) {
					jQuery(".tooltipCanvas").remove();
					curToolTip = null;
				});

				
				polygonTab.name = nameObj;
				polygonTabFake.name = nameObj;
				//typeLabel.name = nameObj;
				
				var polygonTabFakeC = polygonTabFake.clone();
				polygonTabFakeC.name = nameObj;
				
				layerTab.add(polygonTab);
				layerTab.add(polygonTabFakeC);
				layerTab.add(typeLabel);

				// jQuery( "#"+nameDiv ).find("img").remove();

			});
			// END for obj imagens

			if(stageTab.getWidth() < numObjs * 70){
				stageTab.setWidth(numObjs * 70);
			}
			
			stageTab.add(layerTab);

			stageArrayTab[stageArrayTab.length] = stageTab;
			
		}// END IF
        
	});
	// END for divs

	changeFooter(canvasName);
}

function addElementFirstTime(canvasName, elementType, elementImg, posx, posy, numSides, groupId, selecteds,privilege){
	console.log("addElementFirstTime");
	
	var cArray = getArrayPos(canvasName);
	
	addElement(canvasName,
			elementType,
			elementImg,
			posx,
			posy,
			numSides,
			groupId,
			selecteds,
			privilege
		);
    
    addElementBt(elementType,groupId,'');
    updateTypeObj(canvasName, groupId, groupId);
    cArray.stage.draw();
	
	setTimeout(function(){ retrieveVoranoiPolygonTitleJS(canvasName, tmpCommandObj.elementId, groupId); }, 1000);
	
	cArray.polygonLayer.draw();
}

function changeFooter(canvasName) {
	//console.log("changeFooter");
	
	var type = getWorkflowType(canvasName);
	
	//console.log(stageArrayTab.length);
	
	for (var int = 0; int < stageArrayTab.size(); int++) {
		var list = stageArrayTab[int].getChildren()[0].getChildren();
		
		for ( var i = 0; i < list.length; i++) {
			
			var e = list[i];
			//console.log(e.name);
			
			if(type == "S"){
				
				if(e.name == "superactioninput" || e.name == "superactionoutput"){
					e.setDraggable(true);
					e.setOpacity(1);
				}
				
				if(e.name == "synchronous_sink" || e.name == "synchronous_source"	|| e.name == "synchronous_sink_filter"){
					e.setDraggable(false);
					e.setOpacity(0.4);
				}
				
			}else{
				
				if(e.name == "superactioninput" || e.name == "superactionoutput"){
					e.setDraggable(false);
					e.setOpacity(0.4);
				}
				
				if(e.name == "synchronous_sink" || e.name == "synchronous_source"	|| e.name == "synchronous_sink_filter"){
					e.setDraggable(true);
					e.setOpacity(1);
				}
				
			}
			
		}
		
		stageArrayTab[int].draw();
	}
	
	removeEmpytyCanvas();
	 
	canvasResizeSplitter();
}

function removeEmpytyCanvas() {
	
	jQuery(".kineticjs-content").each(function(index) {
		
		console.log(jQuery(this).children("canvas").length);
		if(jQuery(this).children("canvas").length == 0){
			jQuery(this).remove();
		}
		
	});
	
}

function clearCanvas() {
	//console.log("clearCanvas");
	
	var cArray = getArrayPos(selectedCanvas);
	
	cArray.polygonLayer.destroyChildren();
	cArray.layer.destroyChildren();
	cArray.stage.draw();
}

function getElement(polygonLayer, id) {
    for ( var i = 0; i < polygonLayer.getChildren().length; i++) {
        if (polygonLayer.getChildren()[i].getChildren()[4].getText() == id) {
            return polygonLayer.getChildren()[i];
        }
    }
}

/**
 * 
 * Method to update the new id of element. call by a4j:jsFunction oncomplete add
 * the new Element and retrieve the new id.
 * 
 */
function updateTypeObj(canvasName, groupID, elementId) {
	//console.log("updateTypeObj");
	
	var cArray = getArrayPos(canvasName);
	
    var polygonLayer = cArray.polygonLayer;

    var text = polygonLayer.get('#' + groupID)[0].getChildren()[4];
    text.setText(elementId);

}

function updateLink(linkName, nameOutput, nameInput) {
	//console.log("updateLink");
	
    //alert("updateLink "+ linkName + " " + nameOutput + " " + nameInput);
    
	var cArray = getArrayPos(selectedCanvas);
	
    var layer = cArray.layer;

    jQuery.each(layer.getChildren(), function(index, value) {
        if (value.getName() == linkName) {
            value.nameOutput = nameOutput;
            value.nameInput = nameInput;
        }
    });

}

function getSelectedIconsCommaDelimited(){
	//console.log("getSelectedIconsCommaDelimited");
	
	var cArray = getArrayPos(selectedCanvas);
	
	var polygonLayer = cArray.polygonLayer;
    var ans = "";

    jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        if(value.selected){
            ans = ans.concat(",",value.getParent().getChildren()[4].getText());
        }
    });
    if(ans.length > 0){
        return ans.substring(1);
    }
    return ans;
}

function getSelectedSAIconsCommaDelimited(){
	//console.log("getSelectedSAIconsCommaDelimited");
	
	var cArray = getArrayPos(selectedCanvas);
	
    var polygonLayer = cArray.polygonLayer;
    var ans = "";

    jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        if(value.selected){
        	if(value.getParent().elementType.indexOf('>')==0){
        		ans = ans.concat(",",value.getParent().getChildren()[4].getText());
        	}
        }
    });
    if(ans.length > 0){
        return ans.substring(1);
    }
    return ans;
}

function getSelectedArrowsCommaDelimited(){
	//console.log("getSelectedArrowsCommaDelimited");
	
	var cArray = getArrayPos(selectedCanvas);
    
    var layer = cArray.layer;
    var listSize = layer.getChildren().size();
    var ans = "";
    
    jQuery.each(layer.getChildren(), function(index, value) {
        if (value !== undefined && value.isArrow == true) {
            if (value.selected) {
                ans = ans.concat(",",value.getName());
            }
        }
    });
    if(ans.length > 0){
        return ans.substring(1);
    }
    return ans;
}

function getCanvasStatus(){
	console.log("getCanvasStatus");
	
	var cArray = getArrayPos(selectedCanvas);
	
    var polygonLayer = cArray.polygonLayer;
    var canvas={}
    var canvasNameStar = jQuery('#canvasNameStar-'+selectedCanvas).text();
    canvas["modified"]= canvasNameStar[canvasNameStar.length-1] == "*"?"true":"false";
    var positions = {};

    // update element positions
    for ( var i = 0; i < polygonLayer.getChildren().length; i++) {
        var element = polygonLayer.getChildren()[i];
        positions[element.getId()] = [ element.getX(), element.getY() ];
    }
    canvas["positions"] = positions;
    return JSON.stringify(canvas);
}

function getAllCanvasesStatus(){
	console.log("getAllCanvasesStatus");
	
    var canvasPos = {};
    
    jQuery.each(canvasArray, function(index, value) {
        var polygonLayer = value.polygonLayer;
        var canvas={}
        var canvasNameStar = jQuery('#canvasNameStar-'+index).text();
        canvas["modified"]= canvasNameStar[canvasNameStar.length-1] == "*"?"true":"false";
        console.log(JSON.stringify(canvas));
        var positions = {};
        // update element positions
        if(polygonLayer){
            for ( var i = 0; i < polygonLayer.getChildren().length; i++) {
                var element = polygonLayer.getChildren()[i];
                positions[element.getId()] = [ element.getX(), element.getY() ];
            }
        }
        canvas["positions"] = positions;
        canvas["name"] = value.realName;
        canvasPos[index] = canvas;
        console.log(JSON.stringify(canvas));
    });
    console.log(JSON.stringify(canvasPos));
    return JSON.stringify(canvasPos);
}

function save(path) {
	console.log("save " + path);
	
    setSaved(selectedCanvas, true);
    setPathFile(selectedCanvas, path);
    saveWorkflow(selectedCanvas, path, getCanvasStatus(), getSelectedIconsCommaDelimited(), getWorkflowType(selectedCanvas));
    jQuery(".tooltipCanvas").remove();
    curToolTip = null;
}

function configureCircle(cArray, circle1) {
	console.log("configureCircle");
    
	cArray.down = false;
	
    circle1.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
    });

    circle1.on('mouseout', function() {
        document.body.style.cursor = 'default';
    });
    
    circle1.on("mouseup", function(e) {
    	console.log("mouseup");
    	var g = this.getParent();
    	g.setDraggable(true);
    });
    
    circle1.on("mousedown", function(e) {
    	console.log("mousedown");
    	
    	cArray.circleMousedown = true;
    	
    	var g = this.getParent();
    	g.setDraggable(false);
    	
    	console.log("configureCircle circle1 on click " + e.button);
    	
        if(e.button != 2){
        	
        	console.log("if configureCircle");
        	
            createLink(this);
        }else{
        	console.log("configureCircle button ");
        }
    });

    return circle1;
}

function createLink(circleGp){
	console.log("createLink");

		var cArray = getArrayPos(selectedCanvas);
        
        var arrow = cArray.arrow;
        
        //console.log(arrow);

        if(cArray.down){
        	cArray.down = false;
            cArray.moving = false;
            
            deleteArrowOutsideStandard(cArray);
            
            var output = arrow.output.getChildren()[4].getText();
            var input = circleGp.getParent().getChildren()[4].getText();
            var arrowClone = addLink(selectedCanvas, output, input);
            cArray.commandHistory.push_command(new CommandAddArrow(selectedCanvas, output, input, arrowClone.getName()));
            
            console.log("createLink  " + arrow.output.getId() + "  " + circleGp.getParent().getId() + "  " + arrowClone.getName());
            addLinkModalBt(arrow.output.getId(), circleGp.getParent().getId(), arrowClone.getName());
            console.log("END");
            
            setTimeout(function(){ updateSelectedOutputStatus(input); }, 1000);
            
            if(cArray.arrowToMove != null){
            	cArray.commandHistory.removeLastAction();
            	moveArrowObj("", getSelectedArrowsCommaDelimited(), selectedCanvas, output, input, arrowClone.getName());
            }

        }else{
        	
        	console.log("createLink down false"); 
        	
            var polygonLayer = cArray.polygonLayer;
            var layer = cArray.layer;
            cArray.down = true;
            cArray.moving = true;

            var polygonGroup = getElement(polygonLayer, circleGp.getParent().getId());
            arrow.setPoints([ polygonGroup.getX() + 40,
                    polygonGroup.getY() + 50,
                    polygonGroup.getX() + 40 + 1,
                    polygonGroup.getY() + 50 + 1 ]);

            var idOutput = circleGp.getName();
            arrow.setName("arrow" + idOutput);

            arrow.output = circleGp.getParent();

            var cloneArrow = arrow.clone();
            cloneArrow.isArrow = true;
            layer.add(cloneArrow);
            

            layer.draw();
            
            console.log("createLink down false end");
        }
}

function configureStage(canvasName) {
	//console.log("configureStage");

	var cArray = getArrayPos(canvasName);
    
    var layer = cArray.layer;
    var stage = cArray.stage;
    var rectSelect = cArray.rectSelect;
    
    stage.on("mousedown", function(e) {
        if (cArray.moving) {
        	cArray.moving = false;
            layer.draw();
        } else {
            var mousePos = stage.getMousePosition();
            layer.add(rectSelect);
            rectSelect.setX(mousePos.x);
            rectSelect.setY(mousePos.y);
            rectSelect.setWidth(0);
            rectSelect.setHeight(0);
            cArray.moving = true;
            layer.drawScene();
        }
    });

    stage.on("mousemove", function() {
        var mousePos = stage.getMousePosition();
        //click for arrow
        if (cArray.down) {
        	cArray.arrow.getPoints()[1].x = mousePos.x;
        	cArray.arrow.getPoints()[1].y = mousePos.y;
        	cArray.down = true;
            layer.draw();
        }
        //click for rectangle
        if (cArray.moving) {
            rectSelect.setWidth(mousePos.x - rectSelect.getX());
            rectSelect.setHeight(mousePos.y - rectSelect.getY());
            cArray.moving = true;
            layer.draw();
        }
    });

    stage.on("mouseup", function(e) {
    	cArray.moving = false;
    	cArray.select = rectSelectAllObj(cArray, e);
        rectSelect.destroy();
    });
}

function configureGroupListeners(cArray, group) {
	//console.log("configureGroupListeners");
	
	group.on('click', function(e) {
    	
    	console.log("group on click " + e.button);
        
        jQuery(".tooltipCanvas").remove();
        curToolTip = null;
        if(e.button != 2){
        
        	console.log("group on click A ");
        	
          group.getChildren()[2].on('click', function(e) {
            polygonOnClick(this, e, cArray);
          });
          
        }else{
        	
        	console.log("group on click B ");
        	
        	var isWindows = navigator.platform.toUpperCase().indexOf('WIN')!==-1;
        	var isChrome = window.chrome;
   		 	if(isChrome && isWindows){
   		 		
   		 	}else{
   		 		showContextMenu(this, e);
   		 		return false;
   		 	}
        	
        }
    });
	
    group.on('mouseenter', function(e) {
    	cArray.positionX = this.getX() + 40;
    	cArray.positionY = this.getY() + 50;
    });
    
    group.on('dragmove', function(e) {
    	
    	console.log("configureGroupListeners dragmove");
    	
    	if(!cArray.circleMousedown){
	    	//Always have the element dragged selected....
	    	this.getChildren()[2].selected = true;
	    	this.getChildren()[0].setFill("#FFDB99");
	        this.getChildren()[1].setFill("#FFDB99");
	        
	        //Init positions
	        if(!cArray.savePositions){
	        	cArray.savePositions = getPositionGivenIcons(getSelectedIcons(),this);
	        }
	        
	        cArray.dragDropGroup = true;
	        dragAndDropGroup(cArray, this, e);
	        cArray.circleMousedown = false;
	        
    	}
    	
        //Remove annoying stuff for moving objects and prevent their apparition    	
    	cArray.rectSelect.destroy();
        jQuery(".tooltipCanvas").remove();
        curToolTip = null;
    	
    	
    });

    group.on('dragend', function(e) {
    	
    	console.log("configureGroupListeners dragend");
    	
    	if(!cArray.circleMousedown){
    	
	        group.setDragBoundFunc(function(pos) {
	            return rulesDragAndDropObj(cArray, pos, 80, 80);
	        });
	        
	        cArray.commandHistory.push_command(new CommandMove(cArray.savePositions, getPositionGivenIcons(getSelectedIcons(),this)));
	        jQuery(".tooltipCanvas").remove();
	        curToolTip = null;
	        cArray.savePositions = null;
	        cArray.dragDropGroup = false;
	        
	        updateVoronoi(cArray.name, group.getId());
        
	        cArray.circleMousedown = false;
    	}else{
    		cArray.circleMousedown = false;
    	}
        
    });

}

function showContextMenu(group, e){
	//console.log("showContextMenu");
	
	//alert(group.externalLink);
	
    canvasName = selectedCanvas;
    
    var cArray = getArrayPos(canvasName);
    
    rightClickGroup = group;
    //Build the context menu in temp variable and then display it.
    var temp = [];
    for ( var i =0; i<  contextMenuCanvasAction.length ;i++){
        var key = Object.keys(contextMenuCanvasAction[i])[0];
        var item = contextMenuCanvasAction[i];
        
        if(cArray.workflowType == 'W' || (key.indexOf(menu_dataoutput) != 0 && key.indexOf(menu_clean) != 0 && key.indexOf(menu_oozieLog) != 0)){
            if(group.elementType.indexOf('>')==0){
                    temp[temp.length] = item;
            }else{
                if( key.indexOf(menu_editSa)!=0 && key.indexOf(menu_refreshSa)!=0 && key.indexOf(menu_expand)!=0){
                    temp[temp.length] = item;
                }
            }
        }
    }
    
    if(group.externalLink != null){
    	temp[temp.length] = {"External Link": function(menuItem,menu){window.open(group.externalLink,'_blank');}};
    }
    	
	jQuery("table").find(".context-menu:contains('"+menu_rename+"')").each(function(index) {
		jQuery(this).closest("table").next(".context-menu-shadow").remove();
		jQuery(this).closest("table").remove();
	});
	
    cmenuCanvas = jQuery.contextMenu.create(temp);
    
    if(group.elementType.indexOf('>')==0){
        if(group.privilege != null){
            if(!jQuery("body").find(".context-menu-item:contains('"+menu_editSa+"')").hasClass("context-menu-item-disabled")){
                jQuery("body").find(".context-menu-item:contains('"+menu_editSa+"')").addClass("context-menu-item-disabled");
            }
        }else{
            if(jQuery("body").find(".context-menu-item:contains('"+menu_editSa+"')").hasClass("context-menu-item-disabled")){
                jQuery("body").find(".context-menu-item:contains('"+menu_editSa+"')").removeClass("context-menu-item-disabled")
            }
        }
    }
    cmenuCanvas.show(group,e);
    e.preventDefault();
    //e.stopPropagation();
    //e.cancelBubble = true;
}

function createGroup(cArray, circle0, circle1, polygon, srcImageText, typeText, helpId, groupId, arc1,arc2,arc3) {
	//console.log("createGroup");

    var countObj = cArray.countObj;

    var group1 = new Kinetic.Group({
        draggable : true,
        id : groupId,
        name : 'group1',
        dragBoundFunc : function(pos) {
            return rulesDragAndDropObj(cArray, pos, 80, 80);
        }
    });
    
    group1.on('click',function() {
    	
    	//console.log("createGroup click");
    	
    	//Display Help
    	if (this.elementType) {
    		var auxId = this.elementType;
            if(auxId.indexOf('>') === 0){
            	helpId = auxId.substring(1).replace(">","_");
            }else{
            	helpId = auxId;
            }
    	}
        jQuery("#help_"+helpId).click();
        
        //Open Canvas if needed
        if(Date.now() - timestampLastElementClicked < 500 && this.getId() == lastElementClicked){
            openCanvasModalJS(this);
        }else{
        	timestampLastElementClicked = Date.now();
            lastElementClicked = this.getId();
        }
    });
    
//    jQuery("#"+groupId).contextMenu(contextMenuCanvas);

    var circ0 = circle0.clone();
    var circ = circle1.clone();
    var poly = polygon.clone();
    circ.setId("circle" + countObj + "-1");
    circ.setName("circle" + countObj);
    circ.setPosition(40, 50);
    circ0.setPosition(40, 50);
    poly.setPosition(40, 50);
    group1.add(circ);
    group1.add(circ0);
    group1.add(poly);
    group1.add(srcImageText.clone());
    group1.add(typeText.clone());
    
    if(getWorkflowType(cArray.name) == "W"){
    	group1.add(arc1);
    	group1.add(arc2);
    	group1.add(arc3);
    }

    return group1;
}

function configureGroup(cArray, group, mousePosX, mousePosY, polygon, selectedObj) {
	//console.log("configureGroup");

    document.body.style.cursor = 'default';

    //deselectAll(canvasName);
    //polygon.setStroke("red");
    //polygon.selected = true;
    
    if(selectedObj){
        group.getChildren()[0].setFill("#FFDB99");
        group.getChildren()[1].setFill("#FFDB99");
        group.getChildren()[2].selected = true;
    }

    group.setPosition(mousePosX, mousePosY);
    group.hasChangedId = false;

    jQuery("#countObj").val(cArray.countObj);

    configureGroupListeners(cArray, group);

}

function setPageNb(groupId, pageNb){
	//console.log("setPageNb");
	
	var cArray = getArrayPos(selectedCanvas);
	
	console.log(groupId, pageNb);
	
    var polygonLayer = cArray.polygonLayer;
    var group = getElement(polygonLayer, groupId);
    group.pageNb = pageNb;
}

function openCanvasModalJS(group, selectedTab){
	//console.log("openCanvasModalJS");
	//console.log(group.getId(), group.pageNb);

	var cArray = getArrayPos(selectedCanvas);
	
    group.getChildren()[0].setFill("white");
    group.getChildren()[1].setFill("white");
    
    group.getChildren()[2].selected = false;
    cArray.down = false;

    cArray.polygonLayer.draw();
    
    var objImg = group.getChildren()[2].clone();
    var imagePath = objImg.toDataURL({
        width : 80,
        height : 80
    });

    
    if (!group.hasChangedId) {
    	console.log("changeID");
    	openChangeIdModal(group.getId(), imagePath,true);
    	group.hasChangedId = true;
    } else {
    	console.log("open", group.pageNb);
    	openModal(group.getId(), imagePath, selectedTab, group.pageNb);
    	changeHelpAnchor(group.pageNb);
    }
}

function cleanElementJS(group){
	//console.log("cleanElementJS");
	
	if(group){
		
		if(!confirm('Are you sure you want to clean the selected object?')){
			return false;
		}else{
			cleanElement(group.getId());
		}
		
	}
}

function refreshSubWorkflowJS(group){
	//console.log("refreshSubWorkflowJS");
	
	if(group){
		refreshSubWorkflow(group.getId());
	}
}

function openChangeIdModalJS(group){
	//console.log("openChangeIdModalJS");

	var cArray = getArrayPos(selectedCanvas);
	
    // group.getChildren()[2].setStroke('white');
    group.getChildren()[0].setFill("white");
    group.getChildren()[1].setFill("white");
    
    group.getChildren()[2].selected = false;
    cArray.down = false;

    cArray.polygonLayer.draw();
    
    var objImg = group.getChildren()[2].clone();
    var imagePath = objImg.toDataURL({
        width : 80,
        height : 80
    });

    if (group.hasChangedId){
        openChangeIdModal(group.getId(), imagePath,false);
    }
}


function createPolygon(imgTab, posInitX, poxInitY, numSides, canvasName) {
	console.log("createPolygon");
	
	/*console.log("imgTab " + imgTab);
	console.log("posInitX " + posInitX);
	console.log("poxInitY " + poxInitY);
	console.log("numSides " + numSides);
	console.log("canvasName " + canvasName);*/
	
    imgHeight = imgTab.height;
    imgWidth = imgTab.width;
    
    var rotateDeg = 0;
    if (numSides%2 == 0 ){
        rotateDeg = 360/(2*numSides);
    }

    var height = 50/imgHeight;
    var width = 50/imgWidth;
    
    var offsetX = imgWidth/2;
    var offsetY = imgHeight/2;
    
    //FIXME - error on footer in the first time open
    //if((isNaN(offsetX) && isNaN(offsetY)) || (offsetX == 0 && offsetY == 0)){ - this hack the erro on AWS
    if(isNaN(offsetX) && isNaN(offsetY)){
        offsetX = 25;
        offsetY = 25;
    }
    
    //console.log("offsetX " + offsetX);
    //console.log("offsetY " + offsetY);
    
    var polygonTab = new Kinetic.RegularPolygon({
        x : 40,
        y : 50,
        radius : 35,
        sides : numSides,
        //stroke : 'black',
        //strokeWidth : 4,
        fillPatternImage : imgTab,
        fillPatternOffset : [ offsetX, offsetY ],
//      fillPatternX : -18,
//      fillPatternY : 0,
        fillPatternRepeat : 'no-repeat',
        fillPatternRotationDeg : -rotateDeg,
        fillPatternScale : [height, width],
        draggable : false
    });
    polygonTab.rotateDeg(rotateDeg);
    
    var polygonTabImage;
    try{
        polygonTabImage = polygonTab.toDataURL({
            width : 75,
            height : 75
        });
    }catch(exception){
        //alert(exception);
    }

    polygonTab.setAbsolutePosition(posInitX, poxInitY);
    polygonTab.selected = false;

    var polygon = polygonTab.clone({
        name : 'polygon1',
        draggable : false
    });

    polygon.on('click', function(e) {
        polygonOnClick(this, e, cArray);
    });

    var cArray = getArrayPos(canvasName);
    
    polygon.on('mousedown', function(e) {
        toggleSelectOnClick(cArray, this, e);
    });
    
    var stage = cArray.stage;
    
    polygon.on('mouseenter', function(e) {
    	curElementHovered = this;
    });
    
    polygon.on('mouseout', function(e) {
    	curElementHovered = null;
    });

    return [ polygon, polygonTab, polygonTabImage ];
}

function tooltipShortCut(e){
	console.log("Enter tooltipShortCut");
	if(e.keyCode > 48 && e.keyCode < 58){
		console.log("Get button...");
		jQuery(".tooltipCanvas").children("button")[0].click();
		console.log("Check item inner...");
		setTimeout(function(){
			jQuery.each(jQuery("table:visible").find(".context-menu").find(".context-menu-item"), function(index, value) {
				console.log("search for "+index+"..."+jQuery(this).find(".context-menu-item-inner").text());
				if(index == e.keyCode - 49){
					value.click();
				}
			});
		},100);
	}
}

function showHelp(e) {
	console.log("showHelp");
	var cArray = getArrayPos(selectedCanvas);
	var polygonLayer = cArray.polygonLayer;
    var ans = null;
    if(!cArray.dragDropGroup && !cArray.moving){
    	if(curElementHovered != null){
    		ans = curElementHovered;
    	}else{
    		var nbSelected = 0;
    		try{
    			jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
    				if(value.selected){
    					ans  = value;
    					++nbSelected;
    				}
    			});
    		}catch(e){}
    		console.log(nbSelected);
    		if(nbSelected > 1 || nbSelected ==  0){
    			ans = null;
    		}
    	}
    }
	//Not if objects are dragged
    if(ans != null){
    	console.log("Get the help to display: ");
    	jQuery(".tooltipCanvas").remove();
    	var scrollLeft = jQuery("#flowchart-"+selectedCanvas).scrollLeft();
    	var scrollTop = jQuery("#flowchart-"+selectedCanvas).scrollTop();
    	var top = ans.getParent().getPosition().y-scrollTop+160;
    	var left = ans.getParent().getPosition().x-scrollLeft+80;
    	var optionButton = '<button style="float:left" onclick="buttonFuction(\''+ans.getParent().getId()+'\',\''+top+'\',\''+left+'\' );" >Options</button>';
    	curToolTip = ans.getParent().getId();
    	var help = jQuery('<div class="tooltipCanvas" style="background-color:white;" >'+optionButton+'&nbsp;&nbsp;'+ans.getParent().tooltipObj+'</div>');
    	help.css("top",top+"px" );
    	help.css("left",left+"px" );


    	if(e.ctrlKey){
    		jQuery("body").append(help);
    		help.fadeIn("slow");

    		var previewPosition = help.position().top + help.height();
    		var windowHeight = jQuery(window).height();
    		if (previewPosition > windowHeight) {
    			help.css("overflow", "auto");
    			help.css("height", windowHeight-help.position().top-20);
    		}

    	}

    	help.mouseleave(function() {
    		jQuery(this).remove();
    		curToolTip = null;
    	});

    	help.click(function() {
    		jQuery(this).remove();
    		curToolTip = null;
    	});
        tooltipShortCut(e);
    }
}

function buttonFuction(groupId, top, left){
	//console.log("buttonFuction");
	
	var evt = document.createEvent('MouseEvents');
	evt.initMouseEvent('click', true, true, window, 1, left, top, left, top, false, false, false, false, 2, null);
	setTimeout(function(){showContextMenu(findGroup(groupId),evt)},100);
	//findGroup(groupId).fire('click', evt);
	
	return false;
}

function findGroup(groupId){
	//console.log("findGroup");
	
	var cArray = getArrayPos(selectedCanvas);
	
    var polygonLayer = cArray.polygonLayer;
    var ans;
    jQuery.each(polygonLayer.get('.group1'),
            function(index, value) {
                if(value.getId() == groupId){
                    ans = value;
                    return;
                }
            });
    return ans;
}

function polygonOnClick(obj,e, cArray){
	console.log("polygonOnClick");
	
	var arrow = cArray.arrow;

	if (!e.ctrlKey) {
		if (cArray.down) {
			
			//console.log("polygonOnClick arrow");
			
			cArray.down = false;
			
			if(cArray.oldIdSelected != obj.getParent().getId()){
				
				//console.log("polygonOnClick oldId");
				
				deleteArrowOutsideStandard(cArray);
				
				var output = arrow.output.getChildren()[4].getText();
				var input = obj.getParent().getChildren()[4].getText();
				var arrowClone = addLink(cArray.name, output, input);
				
				setTimeout(function(){ updateSelectedOutputStatus(input); }, 1000);
				
				//console.log("polygonOnClick A");
				
				cArray.commandHistory.push_command(new CommandAddArrow(cArray.name, output, input, arrowClone.getName()));
				
				//console.log("polygonOnClick  " + arrow.output.getId() + "  " + obj.getParent().getId() + "  " + arrowClone.getName());
				
				cloneVoronoi(getAllCanvasesStatus());
				addLinkModalBt(arrow.output.getId(), obj.getParent().getId(), arrowClone.getName());
				
				if(cArray.arrowToMove != null){
	            	cArray.commandHistory.removeLastAction();
	            	moveArrowObj("", cArray.arrowToMove.getName(), selectedCanvas, output, input, arrowClone.getName());
	            }
				
			}else{
				console.log("polygonOnClick diferent id");
			}

		}else{
			//console.log("polygonOnClick down false");
		}
	}
	
}

function updateLabelObj(groupId, newGroupId,drawCanvas) {
	//console.log("updateLabelObj");
    
	var cArray = getArrayPos(selectedCanvas);
	
    drawCanvas = typeof drawCanvas !== 'undefined' ? drawCanvas : true;
    
    var polygonLayer = cArray.polygonLayer;
    
    //alert(groupId);
    //alert(newGroupId);
    
    var group = getElement(polygonLayer, groupId);
    var px = group.getChildren()[2].getX() - (newGroupId.length*2);
    var py = group.getChildren()[2].getY() + 30;
    
    var oldIdLabel = groupId+"_label";
    var newIdLabel = groupId+"_label";
    var end = false;
    //alert("Label to remove: "+oldIdLabel);
    for ( var i = 0; i < group.getChildren().length && !end; i++) {
        //alert(group.getChildren()[i].getId());
        if (group.getChildren()[i].getId() == oldIdLabel) {
            group.getChildren()[i].destroy();
            end = true;
        }
    }
    
    var textLabelObj = new Kinetic.Text({
        id : newIdLabel,
        text : newGroupId,
        fontSize : 10,
        fill : 'black',
        x : px,
        y : py
    });

    group.add(textLabelObj);
    
    if(drawCanvas){
        polygonLayer.draw();
    }
}

function getLabelOutputType(color){
	//console.log("getLabelOutputType");
	
    var text = "Output Type: ";
    
    if (color == "#800080"){ //purple
        return text+"Temporary";
    }
    else if (color == "#f08080"){  //lightcoral
        return text+"Recorded";
    }
    else if (color == "#4682b4"){ //steelblue
        return text+"Buffered";
    }
    else {
        return text+"Undefined"; //silver
    }
}

function getColorOutputType(status){
	//console.log("getColorOutputType");
	
    if (status == "TEMPORARY"){
        return "#800080"; //purple
    }
    else if (status == "RECORDED"){
        return "#f08080"; //lightcoral
    }
    else if (status == "BUFFERED"){
        return "#4682b4"; //steelblue
    }
    else {
        return "#c0c0c0"; //silver
    }
}

function getLabelOutputExistence(color){
	//console.log("getLabelOutputExistence");
    
    var text = "Output Dataset: ";
    
    if (color == "#008B8B"){ //DarkCyan
        return text+"At least one dataset exists";
    }else if (color == "#d2691e"){ //chocolate
        return  text+"No Dataset exist";
    }else {
        return text+"Undefined"; //silver
    }
}

function getColorOutputExistence(fileExists){
	//console.log("getColorOutputExistence");
    
    if (fileExists == "true"){
        return "#008B8B"; //DarkCyan
    }else if (fileExists == "false"){
        return "#d2691e" //chocolate
    }else {
        return "#c0c0c0"; //silver
    }
}

function getLabelRunning(color){
	//console.log("getLabelRunning");

    var text = "Running Status: ";

    if (color == "#008000"){ //green
        return text+"OK"; 
    }
    if (color == "#FFA500"){ //Orange
        return text+"Killed";
    }
    else if (color == "#ff0000"){
        return text+"Error"; //red
    }
    else {
        return text+"Undefined"; //silver
    }
}

function getColorRunning(status){
	//console.log("getColorRunning");
	
	if (status == "OK"){
		return "#008000"; //green
	}
	if (status == "KILLED"){
		return "#FFA500"; //orange
	}
	else if (status == "ERROR"){
		return "#ff0000"; //red
	}
	else {
		return "#c0c0c0"; //silver
	}
}

function updateActionOutputStatus(groupId, outputType, fileExists, runningStatus, tooltip, noError, drawCanvas, externalLink) {
	console.log("updateActionOutputStatus");
	
	var cArray = getArrayPos(selectedCanvas);
	
    drawCanvas = typeof drawCanvas !== 'undefined' ? drawCanvas : true;
    
    var layer = cArray.layer;
    var polygonLayer = cArray.polygonLayer;
    
    var group = getElement(polygonLayer, groupId);
    
    if(getSelectedWorkflowType() == 'W'){
        group.getChildren()[5].setStroke(getColorOutputType(outputType));
        group.getChildren()[6].setStroke(getColorRunning(runningStatus));
        group.getChildren()[7].setStroke(getColorOutputExistence(fileExists));
    }
    group.tooltipObj = tooltip;
    
    group.externalLink = externalLink;
    
    console.log("updateActionOutputStatus noError.toUpperCase() " + noError.toUpperCase());
    if( noError.toUpperCase() === "FALSE" ){
       //Add error icon
       var errorImg = new Image();
       errorImg.src = '../image/icons/li_msg_error.gif';
        
        var errorK = new Kinetic.Image({
          id: 'error_img',
          x: 64,
          y: 61,
          image: errorImg,
          width: 13,
          height: 13
        });
        
        group.add(errorK);
    }else{
       jQuery.each(group.getChildren(), function(index, value) {
            if(value.getId() === 'error_img'){
               group.getChildren()[index].destroy();
            }
       });
    }
    if(drawCanvas){
        layer.draw();
        polygonLayer.draw();
    }

}

function updateActionOutputStatusUntilItDoesntFail(groupId, outputType, fileExists, runningStatus, tooltip, noError, drawCanvas, externalLink, cnt){
    //console.log("updateActionOutputStatusUntilItDoesntFail");
    setTimeout(function(){
        try{
           updateActionOutputStatus(groupId, outputType, fileExists, runningStatus, tooltip, noError, drawCanvas, externalLink);
        }catch(e){
           if(cnt < 5*60){
        	   updateActionOutputStatusUntilItDoesntFail(groupId, outputType, fileExists, runningStatus, tooltip, noError, drawCanvas, externalLink,++cnt);
           }
        }
    },200);
}

function updateActionRunningStatus(groupId, status, fileExists,drawCanvas) {
	//console.log("updateActionRunningStatus");

	var cArray = getArrayPos(selectedCanvas);
	
    drawCanvas = typeof drawCanvas !== 'undefined' ? drawCanvas : true;
    
    var polygonLayer = cArray.polygonLayer;
    
    var group = getElement(polygonLayer, groupId);
    
    group.getChildren()[6].setStroke(getColorRunning(status));
    group.getChildren()[7].setStroke(getColorOutputExistence(fileExists));
    
    if(drawCanvas){
       polygonLayer.draw();
    }
}

function updateArrowType(idOutput, idInput, color, type, tooltip,drawCanvas) {
	//console.log("updateArrowType");
	
	var cArray = getArrayPos(selectedCanvas);
    
    drawCanvas = typeof drawCanvas !== 'undefined' ? drawCanvas : true;
    
    var layer = cArray.layer;

    jQuery.each(layer.getChildren(),
        function(index, value) {
            if (value !== undefined && value.isArrow == true) {
                //alert("Current link: "+value.idOutput+" "+value.idInput);
                if (value.idOutput == idOutput && value.idInput == idInput){
                    //alert("Update the arrow");
                    value.setStroke(color);
                    value.originalColor = color;
                    value.tooltipArrow = tooltip;
                    return true;
                }
            }
        }
    );
    
    var coloursArray = cArray.outputTypeColours;
    var existLegend = false;
    for (var i=0; i < coloursArray.length; ++i){
        if (coloursArray[i][0] == type){
            existLegend = true;
            break;
        }
    }
    
    if (!existLegend){
        coloursArray[coloursArray.length] = [type, color];
        
        cArray.legend.destroy();
        var width = type.length * 8;
        if (width > cArray.legendWidth){
        	cArray.legendWidth = width;
        }
        
        createLegend(cArray);
    }
    
    if(drawCanvas){
        layer.draw();
    }

}

function updateArrowLabel(idOutput, idInput, label, drawCanvas) {
	//console.log("updateArrowLabel");
	
	var cArray = getArrayPos(selectedCanvas);
	
    drawCanvas = typeof drawCanvas !== 'undefined' ? drawCanvas : true;
    var layer = cArray.layer;
    
    var posx;
    var posy;
    var arrow;

    jQuery.each(layer.getChildren(),
        function(index, value) {
            if (value !== undefined && value.isArrow == true) {
                if (value.idOutput == idOutput && value.idInput == idInput){
                
                    var x1 = value.getPoints()[0].x
                    var y1 = value.getPoints()[0].y
                    
                    var x2 = value.getPoints()[1].x
                    var y2 = value.getPoints()[1].y
                    
                    var angle = Math.atan2(y2 - y1, x2 - x1);
                    
                    posx = (x1 + x2 + (Math.cos(angle) * 42))/2  - Math.abs((Math.cos(angle) * label.length*2.7));
                    posy = (y1 + y2 + (Math.sin(angle) * 42))/2;
                    
                    arrow = value;
                    //value.add(textLabelObj);
                    return false;
                }
            }
        }
    );
    
    if (arrow.label){
        arrow.label.destroy();
    }
    
    var textLabelObj = new Kinetic.Text({
        text : label,
        fontSize : 11,
        fontStyle : 'bold',
        fill : 'black',
        x : posx,
        y : posy
    });
    arrow.label = textLabelObj;
    
    layer.add(textLabelObj)
    
    if(drawCanvas){
        layer.draw();
    }

}

function updateAllArrowColours(canvasName, data){
	//console.log("updateAllArrowColours");
	
	var cArray = getArrayPos(canvasName);
	
    //alert("Update All arrow colours");
    var layer = cArray.layer;
    for (var i = 0; i < data.length; i++) {
        //alert(data[i][0]+" "+ data[i][1]+" "+ data[i][2]+" "+ data[i][3]+" "+ data[i][4]+" "+data[i][5]);
        updateArrowType(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4],false);
        updateArrowLabel(data[i][0], data[i][1], data[i][5],false);
    }
    layer.draw();
    
}

function saveAll(){
	//console.log("saveAll");
	
    isSaveAll = true;
    indexSaving = 0;
    contSaving = 0;
    selectedCanvas = nameTabs[0];
    setWorkflow(nameTabs[0]);
    if (isSaved(nameTabs[0])){
        save(getPathFile(nameTabs[0]));
        indexSaving++;
    }
    else{
        openModalSaveWorkflow();
    }
}
    
function onHideModalSaveWorkflow(saved){
	//console.log("onHideModalSaveWorkflow");
	
    //<![CDATA[
    if (!saved){
        indexSaving++;
    }
    contSaving++;
    if (isSaveAll == true && contSaving < numTabs){
        selectedCanvas = nameTabs[indexSaving];
        setWorkflow(nameTabs[indexSaving]);
        if (isSaved(nameTabs[indexSaving])){
            save(getPathFile(nameTabs[indexSaving]));
            indexSaving++;
        }
        else{
            openModalSaveWorkflow();
        }
    }
    else{
        isSaveAll = false;
    }
    //]]>
}

function removeLink(name) {
	//console.log("removeLink");
	
	var cArray = getArrayPos(selectedCanvas);
	
    var layer = cArray.layer;
    
    for ( var i = 0; i < layer.getChildren().length; i++) {
        var arrow = layer.getChildren()[i];
        if (arrow.getName() == name) {
            arrow.destroy();
            if (arrow.label != null){
                arrow.label.destroy();
            }
            layer.draw();
            return;
        }
    }
}

function ucFirstAllWords( str ){
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ ){
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}


function getPolygonTextPosition(list){
	
	var cArray = getArrayPos(selectedCanvas);
	
	var i = 0;
	var ans;
	var x = cArray.stage.getWidth()-30;
	var y = cArray.stage.getHeight()-30;
	
	for (;list[i];) {
		
		//console.log(list[i][0]);
		
		if(list[i][0] < x && list[i][1] < y){
			if(ans == undefined){
				ans = list[i];
			}else if(ans[1] > list[i][1]){
				ans = list[i];
			}else if(ans[1] == list[i][1] && ans[0] > list[i][0]){
				ans = list[i];
			}
		}
		
		i++;
	}
	
	return ans;
}

function createPolygonVoronoi(canvasName, idElement, list, voranoiPolygonTitle) {
	console.log("createPolygonVoronoi");
	
	var cArray = getArrayPos(canvasName);
	
	var polygonLayer = cArray.polygonLayer;
	var voronoiLayer = cArray.voronoiLayer;
	var voronoiButtonLayer = cArray.voronoiButtonLayer;
	
	voronoiLayer.removeChildren();
	voronoiButtonLayer.removeChildren();
	
	var arryNames = [];
	var arryColours = [];
	
	var pname;
	var i = 0;
	var j = 0;
	for (;list[i];) {
		
		console.log("list " + list[i]);
		
		var colour = coloursList[j%7];
		console.log("colour list idx " + j);
		
		var group = getGroupInsideVoronoiPolygon(list[i]);
		
		if(group != undefined){
			
			if(group.voronoiTitle != undefined){
				voranoiPolygonTitle = group.voronoiTitle;
				pname = group.getId();
				console.log("pname1A " + pname + " - " + voranoiPolygonTitle);
			}else{
				pname = group.getId();
				voranoiPolygonTitle = "title";
				console.log("pname1B " + pname);
			}
		}else{
			pname = idElement;
			voranoiPolygonTitle = "title";
			console.log("pname2 " + pname);
		}
		
		//check if contains
		var index = arryNames.indexOf(voranoiPolygonTitle);
		if(index != -1){
			colour = arryColours[index]
		}else{
			j++;
		}
		
		console.log("pname " + pname + " colour " + colour + " voranoiPolygonTitle " + voranoiPolygonTitle);
		
		poly = new Kinetic.Polygon({
			name : pname,
			points: list[i],
			fill: colour,
			opacity: 0.2
		});
		poly.voronoiTitle = voranoiPolygonTitle;
		
		var point = getPolygonTextPosition(list[i]);
		
		var polygonButtonText = new Kinetic.Text({
			name : pname,
	        text : voranoiPolygonTitle,
	        fontSize : 14,
	        fill : 'black',
	        fontStyle : 'bold',
	        x : point[0] + 5,
	        y : point[1] + 20
	    });
		
		/*
		var polygonButton = new Kinetic.Rect({
			x : point[0] + 5,
			y : point[1] + 20,
			width : 30,
			height : 15,
			fill : 'gray',
            opacity: 0.3
        })
        ;*/
		
		var groupBt = new Kinetic.Group({
	        id : 'bt',
	        name : pname
	    });
		
		groupBt.on('mouseover', function(e) {
			document.body.style.cursor = 'pointer';
		});
		groupBt.on('mouseout', function() {
	        document.body.style.cursor = 'default';
	    });
		groupBt.on('dblclick', function() {
			console.log(this.getChildren()[0].getText());
			console.log(canvasName);
			openVoronoiModal(this.getChildren()[0].getText(), canvasName);
	    });
		
		//groupBt.add(polygonButton);
		groupBt.add(polygonButtonText);
	
		voronoiButtonLayer.add(groupBt);
		voronoiLayer.add(poly);
		
		arryNames.push(voranoiPolygonTitle);
		arryColours.push(colour);
		
		i++;
	}
	
	voronoiButtonLayer = removeVoronoiButtonDuplicate(voronoiButtonLayer);
	//voronoiLayer = removeVoronoiDuplicateColour(voronoiLayer);
	
	voronoiLayer.draw();
	voronoiButtonLayer.draw();
}

function updateVoronoi(canvasName, idElement){
	console.log("updateVoronoi");
	
	var cArray = getArrayPos(canvasName);
	
	var polygonLayer = cArray.polygonLayer;
	//var voronoiButtonLayer = cArray.voronoiButtonLayer;
	
	cArray.pointsList = [];
	
	jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        if(value !== undefined && value.getParent().getId() !== undefined){
        	cArray.pointsList.push([ value.getParent().getX()+40,value.getParent().getY()+50]);
        }
    });
	
	var voranoiPolygonTitle = "title";
	
	/*jQuery.each(voronoiButtonLayer.getChildren(), function(index, value) {
        if (value.getChildren()[0].getName() == idElement) {
        	voranoiPolygonTitle = value.getChildren()[0].getText();
        }
    });*/
    
	startVoronoi(canvasName, idElement, voranoiPolygonTitle);
}

/**
 * Get the list of the element ids inside a coordinator.
 * @param coordinatorTitle
 */
function getIdsFromVoronoi(coordinatorTitle){
	
	var cArray = getArrayPos(selectedCanvas);
	
	var ans = "";
	var polygonLayer = cArray.polygonLayer;
	jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        if(value !== undefined && value.getParent().getId() !== undefined && coordinatorTitle == value.voronoiTitle){
        	ans += ","+value.getParent().getChildren()[4].getText();
        }
    });
	return ans.substring(1);
}

function getGroupInsideVoronoiPolygon(polygon){
	
	var cArray = getArrayPos(selectedCanvas);
	
	var polygonLayer = cArray.polygonLayer;
	var g;
	jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        if(value !== undefined){
        	if(inside([value.getParent().getX()+40,value.getParent().getY()+50] ,polygon)){
        		//console.log("value " + value.getParent());
        		g = value.getParent();
        		return false;
        	}else{
        		console.log("inside false ");
        		//console.log(value.getParent().getX()+40 + "  " +value.getParent().getY()+50);
        	}
        }
    });
	
	/*if(g == undefined){
		console.log("value " + polygon);
	}*/
	
	return g;
}

function startVoronoi(canvasName, idElement, voranoiPolygonTitle){
	//console.log("START Voronoi");
	
	var cArray = getArrayPos(canvasName);
	
	if(cArray.isSchedule == true){
		console.log("START Voronoi true");
	    var x = cArray.stage.getWidth();
	    var y = cArray.stage.getHeight();
	    var voronoi = v.voronoi().extent([[0, 0], [x, y]]);
	    cArray.voronoi = voronoi(cArray.pointsList);
	    createPolygonVoronoi(canvasName, idElement, cArray.voronoi.polygons(), voranoiPolygonTitle);
	}else{
		console.log("START Voronoi false");
		if(cArray.defaultVoronoi == false){
			createDefaultVoronoi();
		}
	}
    
    console.log("END Voronoi");
}

function retrieveVoranoiPolygonTitleJS(canvasName, idElement, groupId) {
	//console.log("retrieveVoranoiPolygonTitleJS");
	retrieveVoranoiPolygonTitle(canvasName, idElement, groupId);
}

function updateVoranoiPolygonTitle(canvasName, idElement, groupId, name) {
	console.log("updateVoranoiPolygonTitle");
	
	var cArray = getArrayPos(canvasName);
	
	jQuery.each(cArray.polygonLayer.getChildren(), function(index, value) {
        if (value.getId() == idElement || value.getId() == groupId) {
        	value.voronoiTitle = name;
        }
    });
	
	//if(cArray.isSchedule == true){
		var voronoiButtonLayer = cArray.voronoiButtonLayer;
		
		console.log("cArray " + voronoiButtonLayer.getChildren() + ":");
		
		jQuery.each(voronoiButtonLayer.getChildren(), function(index, value) {
	        if (value.getChildren()[0].getName() == idElement || value.getChildren()[0].getName() == groupId) {
	        	value.getChildren()[0].setText(name);
	        }
	    });
		
		voronoiButtonLayer.draw();
	//}
}

function updateVoranoiAllPolygonTitle(listNames) {
	console.log("updateVoranoiAllPolygonTitle");
	
	var cArray = getArrayPos(selectedCanvas);
	
	if(cArray.isSchedule == true){
		
		var listNamesArrays = JSON.parse(listNames);
		
		for (var i = 0; i < listNamesArrays.length; i++) {
			 
			console.log("update1 " + listNamesArrays[i][0]);
			console.log("update2 " + listNamesArrays[i][1]);
			
			jQuery.each(cArray.voronoiButtonLayer.getChildren(), function(index, value){
				
				console.log("update3 " + value.getChildren()[0].getName());
				
		        if (value.getChildren()[0].getName() == listNamesArrays[i][0]) {
		        	value.getChildren()[0].setText(listNamesArrays[i][1]);
		        	console.log("update text " + listNamesArrays[i][1]);
		        	value.getChildren()[0].show();
					value.on('mouseover', function(e) {
						document.body.style.cursor = 'pointer';
					});
		        	
		        	
		        }
		    });
			
			jQuery.each(cArray.voronoiLayer.getChildren(), function(idx, v) {
        		
        		console.log("update4 " + v.getName());
        		
        		if (v.getName() == listNamesArrays[i][0]) {
        			v.voronoiTitle = listNamesArrays[i][1];
        		}
        		
        	});
	
		}
		
		cArray.voronoiLayer = removeVoronoiDuplicateColour(cArray.voronoiLayer);
		cArray.voronoiButtonLayer = removeVoronoiButtonDuplicate(cArray.voronoiButtonLayer);
		
		cArray.voronoiButtonLayer.draw();
		cArray.voronoiLayer.draw();
		
		for ( var i = 0; i < listNamesArrays.length; i++) {
			jQuery.each(cArray.polygonLayer.getChildren(), function(index, value) {
				
				console.log("updatePoly " + value.getId() );
				
		        if (value.getId() == listNamesArrays[i][0]) {
		        	value.voronoiTitle = listNamesArrays[i][1];
		        	console.log("update group text");
		        }
		    });
		}

	}else{
		console.log("updateVoranoiAllPolygonTitle false ");
		
		cArray.voronoiLayer.removeChildren();
		cArray.voronoiButtonLayer.removeChildren();
		createDefaultVoronoi();
		
		var listNamesArrays = JSON.parse(listNames);
		console.log("update default1 " + listNamesArrays[0][0]);
		console.log("update default2 " + listNamesArrays[0][1]);
		console.log(cArray.voronoiButtonLayer.getChildren()[0].getChildren()[0].getName());
		if (cArray.voronoiButtonLayer.getChildren()[0].getChildren()[0].getName() == listNamesArrays[0][0]) {
			cArray.voronoiButtonLayer.getChildren()[0].getChildren()[0].setText(listNamesArrays[0][1]);
			cArray.voronoiButtonLayer.draw();
		}
		
	}
	
}

function removeVoronoiButtonDuplicate(voronoiButtonLayer){
	console.log("removeVoronoiButtonDuplicate");
	
	var newTitle = [];
	jQuery.each(voronoiButtonLayer.getChildren(), function(index, value){
		if(newTitle.indexOf(value.getChildren()[0].getText()) != -1){
			console.log("newTitle " + newTitle);
			value.getChildren()[0].hide();
			value.on('mouseover', function(e) {
				document.body.style.cursor = 'default';
			});
		}else{
			newTitle.push(value.getChildren()[0].getText());
		}
	});
	return voronoiButtonLayer;
}

function removeVoronoiDuplicateColour(voronoiLayer){
	var newTitle = [];
	var colour = [];
	var i = 0;
	jQuery.each(voronoiLayer.getChildren(), function(index, value){
		console.log("removeVoronoiDuplicateColour " + value.voronoiTitle);
		if(newTitle.indexOf(value.voronoiTitle) != -1){
			console.log("removeVoronoiDuplicateColour yes ");
			console.log("idx " + newTitle.indexOf(value.voronoiTitle));
			console.log("colour " + colour[newTitle.indexOf(value.voronoiTitle)]);
			value.setFill(colour[newTitle.indexOf(value.voronoiTitle)]);
		}else{
			console.log("removeVoronoiDuplicateColour no ");
			console.log("colour " + coloursList[i%7]);
			value.setFill(coloursList[i%7]);
			i++;
			newTitle.push(value.voronoiTitle);
			colour.push(value.getFill());
		}
	});
	return voronoiLayer;
}

function undoRedoVoronoi(){
	reBuildListVoronoi();
	undoRedoVoronoiJS();
}

function reBuildListVoronoi(){
	
	var cArray = getArrayPos(selectedCanvas);
	
	var polygonLayer = cArray.polygonLayer;
	cArray.pointsList = [];
	jQuery.each(polygonLayer.get('.polygon1'), function(index, value) {
        if(value !== undefined && value.getParent().getId() !== undefined){
        	cArray.pointsList.push([ value.getParent().getX()+40,value.getParent().getY()+50]);
        }
    });
	startVoronoi(selectedCanvas, "", "");
}

function createDefaultVoronoi(){
	console.log("createDefaultVoronoi");
	
	var cArray = getArrayPos(selectedCanvas);
	
	var voronoiButtonLayer = cArray.voronoiButtonLayer;
	var polygonLayer = cArray.polygonLayer;
	voronoiButtonLayer.removeChildren();
	
	if(polygonLayer.getChildren().length > 0){
	
		var polygonButtonText = new Kinetic.Text({
			name : polygonLayer.getChildren()[0].getId(),
	        text : 'schedule',
	        fontSize : 14,
	        fill : 'black',
	        fontStyle : 'bold',
	        x : 15,
	        y : 30
	    });
		
		var groupBt = new Kinetic.Group({
	        id : 'bt',
	        name : 'default'
	    });
		
		groupBt.on('mouseover', function(e) {
			document.body.style.cursor = 'pointer';
		});
		groupBt.on('mouseout', function() {
	        document.body.style.cursor = 'default';
	    });
		groupBt.on('dblclick', function() {
			openVoronoiModal("", selectedCanvas);
	    });
		
		groupBt.add(polygonButtonText);
	
		voronoiButtonLayer.add(groupBt);
		
		cArray.defaultVoronoi = true;
	
	}else{
		cArray.defaultVoronoi = false;
	}
	
	voronoiButtonLayer.draw();
}

function checkIfSchedule(value){
	console.log("isSchedule " + value);
	
	var cArray = getArrayPos(selectedCanvas);
	
	cArray.isSchedule = parseBool(value);
	reRenderMenuMergeSplit();
	undoRedoVoronoi();
}

function checkIfScheduleArc(value){
	console.log("checkIfScheduleArc " + value);
	
	var cArray = getArrayPos(selectedCanvas);
	
	cArray.isSchedule = parseBool(value);
	reRenderMenuMergeSplit();
	reBuildListVoronoi();
	undoRedoVoronoiJSArc();
}

function setIfISchedule(canvasName, value){
	console.log("setIfISchedule " + value);
	
	var cArray = getArrayPos(canvasName);
	
	cArray.isSchedule = parseBool(value);
    reRenderMenuMergeSplit();
}

function isIfISchedule(canvasName){
	var cArray = getArrayPos(canvasName);
    return cArray.isSchedule;
}

function parseBool(val){
	if(typeof val === 'string'){
		if (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes' || val === 1 || val.toLowerCase() === 's')
			return true;
		else if (val.toLowerCase() === 'false' || val.toLowerCase() === 'no' || val === 0 || val.toLowerCase() === 'n')
			return false;
	}else{
		return val;
	}
}

function inside(point, vs) {
	//console.log("inside");
	//console.log(point);
	//console.log(vs);
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};


function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function undo(){
	var cArray = getArrayPos(getSelectedByName());
	cArray.commandHistory.undo();
}

function redo(){
	var cArray = getArrayPos(getSelectedByName());
	cArray.commandHistory.redo();
}

function getCanvasId(canvasName){
    return "flowchart-"+removeDot(canvasName);
}

function getCanvasNameFromId(canvasId){
    return canvasId.substring(10);
}

function setSelectedByName(selected){
    selectedCanvas = selected;
    var cArray = getArrayPos(selectedCanvas);
    try{
    	cArray.commandHistory.update_buttonname();
    }catch(e){}
}

function getSelectedByName(){
	var cArray = getArrayPos(selectedCanvas);
	var name = typeof cArray !== 'undefined' ? cArray.realName : selectedCanvas;
    return name;
}

function setSelectedById(selected){
    selectedCanvas = selected.substring(10);
    var cArray = getArrayPos(selectedCanvas);
    try{
    	cArray.commandHistory.update_buttonname();
    }catch(e){}
}

function getSelectedById(){
    return "flowchart-"+removeDot(selectedCanvas);
}

function setRunning(canvasName, value){
	var cArray = getArrayPos(canvasName);
	cArray.running = value;
}

function isRunning(canvasName){
	var cArray = getArrayPos(canvasName);
    return cArray.running;
}

function setSaved(canvasName, value){
	var cArray = getArrayPos(canvasName);
	cArray.saved = value;
    if(value){
    	cArray.commandHistory.addSaveHistoric();
    }
}

function isSaved(canvasName){
	var cArray = getArrayPos(canvasName);
    return cArray.saved;
}

function setPathFile(canvasName, value){
	var cArray = getArrayPos(canvasName);
	cArray.pathFile = value;
}

function getPathFile(canvasName){
	var cArray = getArrayPos(canvasName);
    return cArray.pathFile;
}

function getWorkflowType(canvasName){
	var cArray = getArrayPos(canvasName);
    return cArray.workflowType;
}

function getSelectedWorkflowType(){
    return getWorkflowType(selectedCanvas);
}

function getScheduleNoPastDate(canvasName){
	var cArray = getArrayPos(canvasName);
    return cArray.scheduleNoPastDate;
}

function setScheduleNoPastDate(canvasName, value){
	var cArray = getArrayPos(canvasName);
	cArray.scheduleNoPastDate = value;
}

function getArrayPos(canvasName){
	//console.log("getArrayPos " + canvasName);
	
	if(canvasName.includes(".")){
		name = canvasName.replace(/\./g, "");
		
		//console.log(name);
		//console.log(canvasArray);
		//console.log(canvasArray[name]);
		
		return canvasArray[name];
	}else{
		//console.log("canvasName return ");
		return canvasArray[canvasName];
	}
}

function removeDot(canvasName){
	return canvasName.replace(/\./g, "");
}

function getNameHtml(){
	return removeDot(selectedCanvas);
}

function getArrayPosSelectedCanvas(){
	return getArrayPos(selectedCanvas);
}