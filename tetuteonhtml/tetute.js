window.addEventListener("load", function(){
    var elems =  document.querySelectorAll("body *");

    Array.prototype.forEach.call(elems, function(v){
	if(v.getAttribute("data-tetute") != null){
	    var rot = v.getAttribute("data-tetute-rot");
	    drawTetuteSVG(v, rot);
	}
    });
});

function drawTetuteSVG(elem, rot){
    var text = [];
    
    Array.prototype.forEach.call(elem.children, function(item){
	if(item.getAttribute("data-tetute-line") != null){
	    text.push(item.innerHTML);
	}
    });
    
    elem.innerHTML = "";
    
    var fontsize = document.defaultView.getComputedStyle(elem, '').fontSize;

    var size = parseInt(fontsize.match(/^[0-9]+/)[0]);
    var diagonal = calcDiagonal(text.length, size);
    var sqSize = diagonal*size*Math.sqrt(2);;
    
    var width = sqSize;
    var height = sqSize;

    var rotation = 0;
    if(rot != null){
	var m = rot.match(/^([rl])([0-9\.\-]+)/);
	if(m != null){
	    rotation = parseInt(m[2]) * {"r": 1, "l": -1}[m[1]];
	}
    }

    
    elem.style.width = `${sqSize}px`;
    elem.style.height = `${sqSize}px`;
    
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS(null, "width", width);
    svg.setAttributeNS(null, "height", height);
    svg.setAttributeNS(null, "viewbox", `0 0 ${width} ${height}`);
    
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
    g.setAttribute("transform", `translate(${(diagonal%2==0?size/Math.sqrt(2):0)},0)rotate(${45+rotation},${width/2},${height/2})`);

    var x = width/2-size/2, y = height/2-size/2;
    var dirx = [0,-1,0,1];
    var diry = [1,0,-1,0];

    text.forEach(function(value, index, arr){
	var obj = document.createElementNS("http://www.w3.org/2000/svg", "text");	
	obj.setAttribute("x", x);
	obj.setAttribute("y", y+size);
	obj.setAttribute("transform",
			 `rotate(${90 * (index)}, ${x+size/2}, ${y+size/2})`
			);
	obj.innerHTML = value;
	
	if(index != 0){
	    x += dirx[(index + 3) % 4] * size * (Math.ceil(index / 2) - 1);
	    y += diry[(index + 3) % 4] * size * (Math.ceil(index / 2) - 1);
	}

	x += dirx[index % 4] * size;
	y += diry[index % 4] * size;

	g.appendChild(obj);
    });
    
    svg.appendChild(g);
    elem.appendChild(svg);
}

function calcDiagonal(linenum, fontsize){
    var i = (linenum==2 ? 2 : Math.ceil(linenum / 2));
    return i;
}





function drawTetute(elem){
    var text = elem.innerHTML.split(/\n/);
    
    elem.innerHTML = "";

    
    var fontsize = document.defaultView.getComputedStyle(elem, '').fontSize;

    
    var size = parseInt(fontsize.match(/^[0-9]+/)[0]);
    var sqSize = calcSquareSize(text.length, size);
    
    var width = sqSize;
    var height = sqSize;

    elem.style.width = `${sqSize}px`;
    elem.style.height = `${sqSize}px`;

    var x = width/2-size/2, y = height/2-size/2;
    var dirx = [0,-1,0,1];
    var diry = [1,0,-1,0];

    text.forEach(function(value, index, arr){

	var obj = document.createElement("span");	
	//obj.setAttribute("x", x);
	//obj.setAttribute("y", y+size);
	//obj.setAttribute("transform",
//			 `rotate(${90 * (index)}, ${x+size/2}, ${y+size/2})`
	//			);

	obj.setAttribute("style",
			 `
position: absolute;
left: ${x-size/2}px;
top: ${y+size/2}px;
transform-origin: ${size/2}px ${size/2}px;
transform: rotate(${90 * (index)}deg);
`);
//	translate(,)
	obj.innerHTML = value;

	var point = document.createElement("div");

	point.setAttribute("style", `
position: absolute;
width: 10px;
height: 10px;
left: ${x-size/2}px;
top: ${y+size/2}px;
background-color: red;
padding; 0px;
margin: 0px;
height: ${size}px;
`);
	
	if(index != 0){
	    x += dirx[(index + 3) % 4] * size * (Math.ceil(index / 2) - 1);
	    y += diry[(index + 3) % 4] * size * (Math.ceil(index / 2) - 1);
	}

	x += dirx[index % 4] * size;
	y += diry[index % 4] * size;

	elem.appendChild(obj);
	//elem.appendChild(point);
    });

    
    //elem.appendChild(svg);
}
