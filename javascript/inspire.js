// Declare all arrays
var elements = [];
var service = "http://localhost:8080/store";

// Perform Search on body elements

$(document).ready(function(){

    var allImgs = $('body').find('img');

    $(".tag").css("background", "red");
    $(".tag").css("color", "white");

    if (allImgs.length > 0) {
    	$.each(allImgs, function(index, value) {
    		elements[index] = new Element(index,value);
    	});
    }
    
});


function Element(index,value) {
    
    // remove image link if it has one
    if($(value).parent().is("a")){
        var cnt = $(value);
        $($(value).parent()).replaceWith(cnt);
    };    
    
    // add inspure button
    $(value).css("border","2px solid red");
    $(value).wrap('<div id="inspire'+index+'" />');
    $("#inspire"+index).append('<div id="tag'+index+'" class="tag">I N S P I R E</div>');
    
    // add click action
    $('#tag'+index).click(function() {
        
        img_url = value['src']

        
        // TODO : since it's javascript injection there's a cross domain issue preventing response
        $.get(service, { url: img_url });
           
    });
    
}
