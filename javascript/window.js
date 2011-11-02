function stageSize() {
	 var viewportwidth;
	 var viewportheight;

	 if (typeof window.innerWidth != 'undefined') {
	      viewportwidth = window.innerWidth,
	      viewportheight = window.innerHeight
	 } else if (typeof document.documentElement != 'undefined'
	     && typeof document.documentElement.clientWidth !=
	     'undefined' && document.documentElement.clientWidth != 0)	 
	{
	       viewportwidth = document.documentElement.clientWidth,
	       viewportheight = document.documentElement.clientHeight
	 }	else {
	       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
	       viewportheight = document.getElementsByTagName('body')[0].clientHeight
	 }
	
	resolution = new Array(2);
	resolution[0] = viewportwidth;
	resolution[1] = viewportheight;
	
	// array - [0] width [1] height
	return resolution;
}

function stageCenter() {
	initialposX = stageSize()[0] / 2 - initialSize/2;
	initialposY = stageSize()[1] / 2 - initialSize/2;
	center = [2];
	center[0] = initialposX;
	center[1] = initialposY;
	return center;
}


