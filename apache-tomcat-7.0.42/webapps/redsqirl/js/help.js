
var historyHelp = new Array("btIndex");
var historyHelpIndex = 0;
var pinHelp = false;
jQuery(function() {
	jQuery("#divTabHelp").css("background-color", "#FFFFFF");
	showTabResult();
});



function loadExtraContent(id){
    if(id != "help_main" && id.substring(0,5) == "help_"){
      var obj = jQuery("#image_"+id);
      document.getElementById("imageHelp").innerHTML = "<img width='50px' src='"+jQuery(obj).attr("src")+"'/>";
      jQuery("#imageHelp").show();
      
      var actionName = id.substring(5,id.length);
      var packageName = jQuery("#vishelp_"+actionName).attr('name');
      if(packageName !== undefined){
    	  var aux = packageName.split("_");
          jQuery("#actionListtHelp").load("./helpListAction.xhtml?id="+aux[0]+"&url="+aux[1]+"&actionName="+actionName);
          jQuery("#actionListtHelp").show();
      }
    }else if(id != "help_main" && id.substring(0,8) == "vishelp_"){
	  var obj = jQuery("#image_"+id.substring(3));
	  document.getElementById("imageHelp").innerHTML = "<img width='50px' src='"+jQuery(obj).attr("src")+"'/>";
      jQuery("#imageHelp").show();
      
      var actionName = id.substring(8,id.length);
      var packageName = jQuery("#"+id).attr('name');
      if(packageName !== undefined){
    	  var aux = packageName.split("_");
          jQuery("#actionListtHelp").load("./helpListAction.xhtml?id="+aux[0]+"&url="+aux[1]+"&actionName="+actionName);
          jQuery("#actionListtHelp").show();
      }
	}else{
      document.getElementById("imageHelp").innerHTML = "";
      jQuery("#imageHelp").hide();
      
      if(id.substring(0,8) == "package_"){
    	  var packageName = id.substring(8,id.length);
    	  jQuery("#actionListtHelp").load("./helpListAction.xhtml?id="+packageName);
          jQuery("#actionListtHelp").show();
      }
    }
}

function clickOnStopLink(origLink, force){
    console.log("clickOnStopLink"); 
           
    if(!pinHelp || force){
		showTabResult();
		jQuery("#divTabHelp").scrollTop( 0 );
		var id = jQuery(origLink).attr('id');
		if( historyHelp[historyHelpIndex] != id ){
            jQuery("#nextHelp").attr("disabled", true);
            jQuery("#prevHelp").attr("disabled", false);
		    jQuery("#helpIndex").hide();
            jQuery("#helpPanel").show();
		    jQuery("#contentHelp").load(jQuery(origLink).attr("href"));
		    
		    loadExtraContent(id);
            jQuery("#btIndex").show();
            if(jQuery(origLink).attr("href").indexOf('#') == -1){
		    	jQuery("#divTabHelp").scrollTop( 0 );
            }else{
            	console.log(jQuery(jQuery(origLink,'href')).offset().top);
            	jQuery("#divTabHelp").animate({ scrollTop: jQuery(jQuery(origLink,'href')).offset().top}, 800);
		    }
		    
		    while( historyHelpIndex + 1 < historyHelp.length ){
				historyHelp.pop();
		    }
		    if(historyHelp.length > 100){
				historyHelp.shift();
		    }
		    
		    historyHelpIndex = historyHelp.length;
		    historyHelp[historyHelpIndex] = id;
		}
    }
}

jQuery(document).on("click", ".stopLink", function(e){
	clickOnStopLink(this,true);
});

jQuery(document).on("click", ".stopLinkInternal", function(e){
	clickOnStopLink(this,false);
});


jQuery(document).on("click", "#btIndex", function(e) {
    console.log("clickOnIndex");

	showTabResult();
	jQuery("#divTabHelp").scrollTop( 0 );
	
	var id = jQuery(this).attr('id');

	if(historyHelp[historyHelpIndex] != id || (id == "btIndex" && historyHelp[historyHelpIndex] == "btIndex") ){
	    jQuery("#nextHelp").attr("disabled", true);
	    jQuery("#prevHelp").attr("disabled", false);
		jQuery("#helpIndex").show();
	    jQuery("#helpPanel").hide();
	    jQuery("#btIndex").hide();
	    jQuery("#tabs-1").scrollTop( 0 );
	    while(historyHelpIndex + 1 < historyHelp.length){
		    historyHelp.pop();
		}
		if(historyHelp.length > 100){
			historyHelp.shift();
		}
	   	
	   	historyHelpIndex = historyHelp.length;
	   	historyHelp[historyHelpIndex] = id;
	}
});

jQuery(document).on("click", "#prevHelp", function(e) {
    console.log("clickOnPrevious");

	showTabResult();
	jQuery("#divTabHelp").scrollTop( 0 );
	
    //<![CDATA[
    if(historyHelpIndex > 0){
	var id = historyHelp[--historyHelpIndex];
	if(historyHelpIndex == 0){
        jQuery("#prevHelp").attr("disabled", true);
    }
    jQuery("#nextHelp").attr("disabled", false);
	if(id == "btIndex"){
	    jQuery("#helpIndex").show();
	    jQuery("#helpPanel").hide();
	    jQuery("#btIndex").hide();
	}else{
	    jQuery("#helpIndex").hide();
	    jQuery("#helpPanel").show();
        jQuery("#contentHelp").load(jQuery("#"+id).attr("href"));
        loadExtraContent(id);
        jQuery("#tabs-1").scrollTop( 0 );
	    jQuery("#btIndex").show();
	}
    }
    //]]>
});

jQuery(document).on("click", "#nextHelp", function(e) {
    console.log("clickOnNext");

	showTabResult();
	jQuery("#divTabHelp").scrollTop( 0 );
	
    //<![CDATA[
    if(historyHelpIndex  < historyHelp.length - 1){
	var id = historyHelp[++historyHelpIndex];
    if(historyHelpIndex == historyHelp.length - 1){
        jQuery("#nextHelp").attr("disabled", true);
    }
    jQuery("#prevHelp").attr("disabled", false);
	if(id == "btIndex"){
	    jQuery("#helpIndex").show();
	    jQuery("#helpPanel").hide();
	    jQuery("#btIndex").hide();
	}else{
	    jQuery("#helpIndex").hide();
	    
        jQuery("#helpPanel").show();
        jQuery("#contentHelp").load(jQuery("#"+id).attr("href"));
        loadExtraContent(id);

        jQuery("#tabs-1").scrollTop( 0 );
	    jQuery("#btIndex").show();
	}
    }
    //]]>
});

function showTabResult(){
	jQuery("#resultTableDiv").hide();
}

function showDivHelp(){
	jQuery("#helpIndex").hide();
	jQuery("#helpPanel").hide();
	jQuery("#resultTableDiv").show();
	jQuery("#btIndex").show();
}

