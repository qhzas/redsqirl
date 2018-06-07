 //<![CDATA[

(function (jQuery) {
	var methods = {
		init: function (options){
			if (options == undefined) options = {};
			
			//Merge defaults and options
			options = jQuery.extend({}, jQuery.fn.plusTabs.defaults, options);
			return this.each(function (){
				
				var o = options,
				$plusTabs = jQuery(this);
				
				// add class plusTabs for tabs styling
				(o.className != '') && $plusTabs.addClass(o.className);
				
				function showActiveTab(){
					
					var allTabsLength = "";
					if (o.showCount == true){
						allTabsLength = " (" + $plusTabs.tabs("length") + ")";
					}
					
					//add "see more" tab
					if ($plusTabs.find("li.seeMore").length == 0){
						$uiTabsNav.append("<li class='ui-state-default ui-corner-top seeMore'>" + o.expandIcon + o.seeMoreText + allTabsLength + "</li>");
					} else {
						$plusTabs.find("li.seeMore").show();
					}
					
					$plusTabs.find("li.seeMore").hide();
					
				}
				
				var $uiTabsNav = $plusTabs.find('.ui-tabs-nav');
				
				reloadAllTabs($plusTabs);
				
				showActiveTab();
				
			});
		}
	};
	    		    
	jQuery.fn.plusTabs = function (method){
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method == 'object' || !method){
			return methods.init.apply(this, arguments);
		} else {
			jQuery.error('Method ' + method + ' does not exist on jQuery.plusTabs');
		}
	};
	
	// Default settings
	jQuery.fn.plusTabs.defaults = {
		className: "plusTabs",
		seeMore: true,
		seeMoreText: "More",
		showCount: false,
		expandIcon: "&#9660; ",
		dropWidth: "66%",
		sizeTweak: 0
	};
	    		    
})(jQuery);

	    
	function deleteAllTabs(){
		jQuery("#tabs1").find(".allTabs").remove();
		jQuery("#tabs2").find(".allTabs").remove();
		jQuery("#tabFlowchart").find(".allTabs").remove();
		jQuery("#tabs1").tabs("refresh");
		jQuery("#tabs2").tabs("refresh");
		jQuery("#tabFlowchart").tabs("refresh");
	}
	
	function reloadAllTabs($plusTabs){
		
		if($plusTabs.attr("id") == 'tabs1'){
			
			var allTabsNavTab1 = jQuery('<div class="allTabs" />').appendTo($plusTabs);
			
			jQuery("#tabs2 ul:first a").clone().click(function (event) {
				
				//stop hash to behavior
				event.preventDefault();
				
				//copy div allTabs
				var allTabsDestination = $plusTabs.find(".allTabs");
				var allTabsSource = jQuery("#tabs2").find(".allTabs");
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
					event.preventDefault();
					$plusTabs.find('.allTabs').slideUp('fast');
				}).appendTo(allTabsSource);
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
				
				//copy tab
				var divId = jQuery(this).attr("href");
				//jQuery(divId).show();
				
				var tabs = jQuery("#tabs1").tabs();
				var ul = jQuery("#tabs1").tabs().find("ul:first");
				
				var li = jQuery("#tabs2 ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");
				
				li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
				li.find("a:first").removeAttr('id tabindex role class');
				
				ul.append(li);
				jQuery(jQuery(divId).remove()).appendTo(tabs);
				tabs.tabs("refresh");
				jQuery("#tabs2").tabs("refresh");
				
				var ulTab = jQuery("#tabs2").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
				jQuery("#tabs2").tabs("option", "active", index);
				
				tabs.tabs("option", "active", jQuery(this).index());
				
				//hide "see more tabs"
				$plusTabs.find('.allTabs').slideUp('fast');
				
				tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
				
				reloadAllTabs(jQuery("#tabs1"));
				reloadAllTabs(jQuery("#tabs2"));
				
				resizing();
				
				divTabsEmpty();
				
			}).appendTo(allTabsNavTab1);
	    		  
  			jQuery("#tabFlowchart ul:first li:not(.locked) a").clone().click(function (event) {
  				
  				//stop hash to behavior
  				event.preventDefault();
  				
  				//copy div allTabs
  				var allTabsDestination = $plusTabs.find(".allTabs");
  				var allTabsSource = jQuery("#tabFlowchart").find(".allTabs");
  				
  				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
  					event.preventDefault();
  					$plusTabs.find('.allTabs').slideUp('fast');
			    }).appendTo(allTabsSource);
	  	        
  				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
  				
  				//copy tab
  				var divId = jQuery(this).attr("href");
  				//jQuery(divId).show();
  				
  				var tabs = jQuery("#tabs1").tabs();
  				var ul = jQuery("#tabs1").tabs().find("ul:first");

		        var li = jQuery("#tabFlowchart ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");

		        li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
		        li.find("a:first").removeAttr('id tabindex role class');

		        ul.append(li);
		        jQuery(jQuery(divId).remove()).appendTo(tabs);
		        tabs.tabs("refresh");
		        jQuery("#tabFlowchart").tabs("refresh");
		              
		        var ulTab = jQuery("#tabFlowchart").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
		        jQuery("#tabFlowchart").tabs("option", "active", index);
		        
		        tabs.tabs("option", "active", jQuery(this).index());
		    		  
		    	//hide "see more tabs"
		    	$plusTabs.find('.allTabs').slideUp('fast');

		    	tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
		    		  
		    	reloadAllTabs(jQuery("#tabs1"));
		    	reloadAllTabs(jQuery("#tabFlowchart"));

		    	resizing();
		    	
		    	divTabsEmpty();
		    	
  			}).appendTo(allTabsNavTab1);
  				
  			jQuery("#tabs1 ul:first li:not(:visible) a").clone().click(function (event) {
		    		  
  				//stop hash to behavior
				event.preventDefault();
				
				//copy div allTabs
				var allTabsDestination = $plusTabs.find(".allTabs");
				var allTabsSource = jQuery("#tabs1").find(".allTabs");
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
					event.preventDefault();
					$plusTabs.find('.allTabs').slideUp('fast');
				}).appendTo(allTabsSource);
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
				
				//copy tab
				var divId = jQuery(this).attr("href");
				
				var tabs = jQuery("#tabs1").tabs();
				var ul = jQuery("#tabs1").tabs().find("ul:first");
				
				var li = jQuery("#tabs1 ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");
				
				li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
				li.find("a:first").removeAttr('id tabindex role class');
				
				ul.append(li);
				jQuery(jQuery(divId).remove()).appendTo(tabs);
				tabs.tabs("refresh");
				jQuery("#tabs1").tabs("refresh");
				
				var ulTab = jQuery("#tabs1").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
				jQuery("#tabs1").tabs("option", "active", index);
				
				tabs.tabs("option", "active", jQuery(this).index());
				
				//hide "see more tabs"
				$plusTabs.find('.allTabs').slideUp('fast');
				
				tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
				
				reloadAllTabs(jQuery("#tabs1"));
				
				resizing();
				
				divTabsEmpty();
			    
  			}).appendTo(allTabsNavTab1);
	  			
	  	}

  		if($plusTabs.attr("id") == 'tabs2'){
  			
  			
  			var allTabsNavTab2 = jQuery('<div class="allTabs" />').appendTo($plusTabs);
  			
  			jQuery("#tabs1 ul:first a").clone().click(function (event) {
  				
  				//stop hash to behavior
  				event.preventDefault();
  				
  				//copy div allTabs
  				var allTabsDestination = $plusTabs.find(".allTabs");
  				var allTabsSource = jQuery("#tabs1").find(".allTabs");
  				
  				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
  					event.preventDefault();
  					$plusTabs.find('.allTabs').slideUp('fast');
			    }).appendTo(allTabsSource);
	  	              	
	  	        allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
	  	            	
		  	    //copy tab
		  	    var divId = jQuery(this).attr("href");
		  	    //jQuery(divId).show();
		  	          
		  	    var tabs = jQuery("#tabs2").tabs();
		        var ul = jQuery("#tabs2").tabs().find("ul:first");

		        var li = jQuery("#tabs1 ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");

		        li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
		        li.find("a:first").removeAttr('id tabindex role class');
		              
		        ul.append(li);
		        jQuery(jQuery(divId).remove()).appendTo(tabs);
		        tabs.tabs( "refresh" );
		        jQuery("#tabs1").tabs("refresh");
		              
		        var ulTab = jQuery("#tabs1").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
		        jQuery("#tabs1").tabs("option", "active", index);
		        tabs.tabs("option", "active", jQuery(this).index());
		    		  
		    	//hide "see more tabs"
		    	$plusTabs.find('.allTabs').slideUp('fast');

		    	tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
		    		  
		    	reloadAllTabs(jQuery("#tabs2"));
		    	reloadAllTabs(jQuery("#tabs1"));

		    	resizing();
		    	
		    	divTabsEmpty();
		    	
		    }).appendTo(allTabsNavTab2);

  			jQuery("#tabFlowchart ul:first li:not(.locked) a").clone().click(function (event) {
		    		  
  				//stop hash to behavior
		    	event.preventDefault();

		    	//copy div allTabs
		    	var allTabsDestination = $plusTabs.find(".allTabs");
		    	var allTabsSource = jQuery("#tabFlowchart").find(".allTabs");

		    	allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
		    		event.preventDefault();
		    		$plusTabs.find('.allTabs').slideUp('fast');
		    	}).appendTo(allTabsSource);
	  	              	
	  	        allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
	  	            	
		  	    //copy tab
		  	    var divId = jQuery(this).attr("href");
		  	    //jQuery(divId).show();
		  	          
		  	    var tabs = jQuery("#tabs2").tabs();
		        var ul = jQuery("#tabs2").tabs().find("ul:first");

		        var li = jQuery("#tabFlowchart ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");

		        li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
		        li.find("a:first").removeAttr('id tabindex role class');
		        
		        ul.append(li);
		        jQuery(jQuery(divId).remove()).appendTo(tabs);
		        tabs.tabs( "refresh" );
		        jQuery("#tabFlowchart").tabs("refresh");
		              
		        var ulTab = jQuery("#tabs2").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
		        jQuery("#tabFlowchart").tabs("option", "active", index);
		        tabs.tabs("option", "active", jQuery(this).index());
		    		  
		    	//hide "see more tabs"
		    	$plusTabs.find('.allTabs').slideUp('fast');

		    	tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
		    		  
		    	reloadAllTabs(jQuery("#tabs2"));
		    	reloadAllTabs(jQuery("#tabFlowchart"));

		    	resizing();
		    	
		    	divTabsEmpty();
		    	
		    }).appendTo(allTabsNavTab2);
  				
  			jQuery("#tabs2 ul:first li:not(:visible) a").clone().click(function (event) {
  				
  				//stop hash to behavior
				event.preventDefault();
				
				//copy div allTabs
				var allTabsDestination = $plusTabs.find(".allTabs");
				var allTabsSource = jQuery("#tabs2").find(".allTabs");
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
					event.preventDefault();
					$plusTabs.find('.allTabs').slideUp('fast');
				}).appendTo(allTabsSource);
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
				
				//copy tab
				var divId = jQuery(this).attr("href");
				
				var tabs = jQuery("#tabs2").tabs();
				var ul = jQuery("#tabs2").tabs().find("ul:first");
				
				var li = jQuery("#tabs2 ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");
				
				li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
				li.find("a:first").removeAttr('id tabindex role class');
				
				ul.append(li);
				jQuery(jQuery(divId).remove()).appendTo(tabs);
				tabs.tabs("refresh");
				jQuery("#tabs2").tabs("refresh");
				
				var ulTab = jQuery("#tabs2").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
				jQuery("#tabs2").tabs("option", "active", index);
				
				tabs.tabs("option", "active", jQuery(this).index());
				
				//hide "see more tabs"
				$plusTabs.find('.allTabs').slideUp('fast');
				
				tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
				
				reloadAllTabs(jQuery("#tabs2"));
				
				resizing();
				
				divTabsEmpty();
		    	
		    }).appendTo(allTabsNavTab2);
	  			
	  	}

  		if($plusTabs.attr("id") == 'tabFlowchart'){
  			
  			var allTabsNavCanvas = jQuery('<div class="allTabs" />').appendTo($plusTabs);
  				
  			jQuery("#tabs1 ul:first a").clone().click(function (event) {
  				
  				//stop hash to behavior
		    	event.preventDefault();

		    	//copy div allTabs
		    	var allTabsDestination = $plusTabs.find(".allTabs");
		    	var allTabsSource = jQuery("#tabs1").find(".allTabs");

		    	allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
		    		event.preventDefault();
			    	$plusTabs.find('.allTabs').slideUp('fast');
			    }).appendTo(allTabsSource);
	  	              	
	  	        allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
	  	            	
		  	    //copy tab
		  	    var divId = jQuery(this).attr("href");
		  	    //jQuery(divId).show();
		  	          
		  	    var tabs = jQuery("#tabFlowchart").tabs();
		        var ul = jQuery("#tabFlowchart").tabs().find("ul:first");

		        var li = jQuery("#tabs1 ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");

		        li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
		        li.find("a:first").removeAttr('id tabindex role class');

		        ul.append(li);
		        jQuery(jQuery(divId).remove()).appendTo(tabs);
		        tabs.tabs( "refresh" );
		        jQuery("#tabs1").tabs( "refresh" );
		              
		        var ulTab = jQuery("#tabs1").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
		        jQuery("#tabs1").tabs("option", "active", index);
		        tabs.tabs("option", "active", jQuery(this).index());
		    		  
		    	//hide "see more tabs"
		    	$plusTabs.find('.allTabs').slideUp('fast');

		    	tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
		    		  
		    	reloadAllTabs(jQuery("#tabs1"));
		    	reloadAllTabs(jQuery("#tabFlowchart"));

		    	resizing();
		    	
		    	divTabsEmpty();
		    	
		    }).appendTo(allTabsNavCanvas);

  			jQuery("#tabs2 ul:first a").clone().click(function (event) {
  				
  				//stop hash to behavior
		    	event.preventDefault();

		    	//copy div allTabs
		    	var allTabsDestination = $plusTabs.find(".allTabs");
		    	var allTabsSource = jQuery("#tabs2").find(".allTabs");

		    	allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
		    		event.preventDefault();
		    		$plusTabs.find('.allTabs').slideUp('fast');
			    }).appendTo(allTabsSource);
	  	              	
	  	        allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
	  	            	
		  	    //copy tab
		  	    var divId = jQuery(this).attr("href");
		  	    //jQuery(divId).show();
		  	          
		  	    var tabs = jQuery("#tabFlowchart").tabs();
		        var ul = jQuery("#tabFlowchart").tabs().find("ul:first");

		        var li = jQuery("#tabs2 ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");

		        li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
		        li.find("a:first").removeAttr('id tabindex role class');

		        ul.append(li);
		        jQuery(jQuery(divId).remove()).appendTo(tabs);
		        tabs.tabs( "refresh" );
		        jQuery("#tabs2").tabs("refresh");
		              
		        var ulTab = jQuery("#tabs2").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
		        jQuery("#tabs2").tabs("option", "active", index);
		        tabs.tabs("option", "active", jQuery(this).index());
		    		  
		    	//hide "see more tabs"
		    	$plusTabs.find('.allTabs').slideUp('fast');

		    	tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
		    		  
		    	reloadAllTabs(jQuery("#tabs2"));
		    	reloadAllTabs(jQuery("#tabFlowchart"));

		    	resizing();
		    	
		    	divTabsEmpty();
		    	
  			}).appendTo(allTabsNavCanvas);
  				
  			jQuery("#tabFlowchart ul:first li:not(.locked):not(:visible) a").clone().click(function (event) {
  				
  				//stop hash to behavior
				event.preventDefault();
				
				//copy div allTabs
				var allTabsDestination = $plusTabs.find(".allTabs");
				var allTabsSource = jQuery("#tabFlowchart").find(".allTabs");
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").clone().click(function (event) {
					event.preventDefault();
					$plusTabs.find('.allTabs').slideUp('fast');
				}).appendTo(allTabsSource);
				
				allTabsDestination.find("a[id$=" + jQuery(this).attr("id") + "]").remove();
				
				//copy tab
				var divId = jQuery(this).attr("href");
				
				var tabs = jQuery("#tabFlowchart").tabs();
				var ul = jQuery("#tabFlowchart").tabs().find("ul:first");
				
				var li = jQuery("#tabFlowchart ul:first").find("li[aria-labelledby$="+ jQuery(this).attr("id") +"]");
				
				li.removeAttr(jQuery.makeArray(li.get(0)).map(function(item){ return item.name;}).join(' ')).remove();
				li.find("a:first").removeAttr('id tabindex role class');
				
				ul.append(li);
				jQuery(jQuery(divId).remove()).appendTo(tabs);
				tabs.tabs("refresh");
				jQuery("#tabFlowchart").tabs("refresh");
				
				var ulTab = jQuery("#tabFlowchart").children("ul");
				var index = 0;
				jQuery.each(ulTab.children("li:not(.seeMore)"), function(idx, obj){
                	if(jQuery(obj).css("display") !== "none"){
    					return false;
    				}
                	index = index+1;
                });
				jQuery("#tabFlowchart").tabs("option", "active", index);
				
				tabs.tabs("option", "active", jQuery(this).index());
				
				//hide "see more tabs"
				$plusTabs.find('.allTabs').slideUp('fast');
				
				tabs.find("a[href$=" + divId + "]").parent("li").css("display","block");
				
				reloadAllTabs(jQuery("#tabFlowchart"));
				
				resizing();
				
				divTabsEmpty();
		    	
		    }).appendTo(allTabsNavCanvas);
	  			
	  	}

	}
	
	function divTabsEmpty(){
		
		//alert(jQuery("#tabs1 ul:first li:not(:hidden) a").length);
		if(jQuery("#tabs1 ul:first li:not(:hidden) a").length == 0){
    		var divs = jQuery("#tabs1").children("div");
            jQuery.each(divs, function(index, obj){
            	jQuery(obj).hide();
            });
    	}
		//alert(jQuery("#tabs2 ul:first li:not(:hidden) a").length);
    	if(jQuery("#tabs2 ul:first li:not(:hidden) a").length == 0){
    		var divs = jQuery("#tabs2").children("div");
            jQuery.each(divs, function(index, obj){
            	jQuery(obj).hide();
            });
    	}
    	
	}
	    
	//]]>