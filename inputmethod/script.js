var dictionary = new Array();
var input;
var textarea;
var divCompletionList;
var divInputCompletion;
var divBackgroun;
var textareaStyle;


function getDictionary(text){
    Array.prototype.forEach.call(JSON.parse(text), function(val, index, arr){
	    dictionary.push({
		"in": val.in,
		"out": val.out.replace(/\{U\+([a-fA-F0-9]{4}\})/g,function(){
		    return String.fromCharCode(parseInt(arguments[1], 16));
		}),
		"prev": val.prev
	    });
	});
}

window.addEventListener("load", function(){
    
    
    input = document.getElementById("input");
    textarea = document.getElementById("textareaInput");
    divCompletionList = document.getElementById("divCompletionList");
    divInputCompletion = document.getElementById("divInputCompletion");
    divBackground = document.getElementById("divBackground");
    textareaStyle = getComputedStyle(textarea, "");

    changeFontFamily();
    changeFontSize();
    drawTetute();
    
    var addTextOnTextarea = function(text){
	var caret = textarea.selectionStart;
	var len = textarea.value.length;
	var vallen = text.length;
	
	textarea.value = textarea.value.substr(0, caret) + text + textarea.value.substr(caret, len);
	input.value = "";
	divInputCompletion.style.visibility = "hidden";
	
	textarea.focus();
	textarea.selectionStart = caret + vallen;
	textarea.selectionEnd = caret + vallen;
    };

    var fileOpenDictionary = document.getElementById("fileOpenDictionary");

    fileOpenDictionary.addEventListener("change", function(evt){
	if(!(fileOpenDictionary.value)) return;
	var file = evt.target.files;
	if(!file) return;
	
	var reader = new FileReader();
	reader.readAsText(file[0]);
	reader.onload = function(){
	    getDictionary(reader.result);
	}
    });
    
    input.addEventListener("keyup", function(evt){

	switch(evt.which){
	case 27: //esc
	    input.value = "";
	    divInputCompletion.style.visibility = "hidden";
	    textarea.focus();
	    return;
	case 13: //enter
	    addTextOnTextarea.call({}, input.value);
	    return;
	}
	

	if(input.value == ""){
	    divInputCompletion.style.visibility = "hidden";
	    textarea.focus();
	    return;
	}
	
	var list = search(input.value);

	// 直前の文字を置くことで文字の変形を可視化する目的
	var prevChar = textarea.value[textarea.selectionStart-1];
	
	if(!prevChar){
	    prevChar = "";
	}else if(prevChar == "\n"){
	    prevChar = "";
	}

	divCompletionList.innerHTML = "";
	list.forEach(function(val, index, arr){
	    var button = document.createElement("a");
	    button.setAttribute("class", "button");
	    button.setAttribute("tabIndex", 0);

	    var span =	document.createElement("span");
	    span.innerHTML = val.in + " " + (val.prev ? prevChar : "") + val.out + "  ";
	    
	    button.appendChild(span);
	    button.addEventListener("click", function(){
		addTextOnTextarea.call({}, val.out);
	    });

	    button.addEventListener("keypress", function(evt){
		if(evt.which == 13){
		    addTextOnTextarea.call({}, val.out);
		}
	    });
	    
	    divCompletionList.appendChild(button);
	});
    });

    textarea.addEventListener("focus", function(e){
	divInputCompletion.style.visibility = "hidden";
	input.value = "";
    });
    
    divCompletionList.addEventListener("keyup", function(evt){
	switch(evt.which){
	case 27: //esc
	    input.value = "";
	    divInputCompletion.style.visibility = "hidden";
	    textarea.focus();
	    break;
	case 8: //backspace
	    input.focus();
	default:
	}
    });


    textarea.addEventListener("keydown", function(evt){
	if(evt.ctrlKey || evt.altKey){
	    return;
	}
	if(
	    (evt.which >= 48 && evt.which <= 90) ||
		(evt.which >= 160 && evt.which <= 226)
	){
	    var scroll = textarea.scrollTop;
	    var stylelist = [
		"border-bottom-width",
		"border-left-width",
		"border-right-width",
		"border-top-width",
		"border-style",
		
		"font-family",
		"font-size",
		"font-style",
		"font-variant",
		"font-weight",
		"font-size-adjust",
		"font-stretch",
		"line-height",
		
		"letter-spacing",
		"word-spacing",
		
		"padding-bottom",
		"padding-left",
		"padding-right",
		"padding-top",

		"text-align",
		"text-decoration",
		"text-indent",
		"text-transform",
		
		"width",
		"height"
	    ];

	    stylelist.forEach(function(value, index, arr){
		divBackground.style[value] = textareaStyle[value];
	    });

	    var text = textarea.value.substr(0, textarea.selectionStart);
	    var span = document.createElement("span");
	    span.innerHTML = " ";

	    divBackground.innerHTML = text.replace(/\n/g, "<br>");
	    divBackground.appendChild(span);
	    

	    var posSpan = span.getBoundingClientRect();


	    divInputCompletion.style.top = (posSpan.top - scroll) + "px";
	    divInputCompletion.style.left = posSpan.left + "px";
	    divCompletionList.innerHTML = "";
	    divInputCompletion.style.visibility = "visible";
	    
	    input.focus();
	}
    });

});

function search(str){
    if(dictionary.length == 0) return [];

    if(str == "") return [];

    var result = [];
    var begin1=0, end1=dictionary.length-1;

    //strから始まる最初の候補を探索
    while(end1 - begin1 > 0){
	var mid = Math.round((begin1 + end1) / 2);

	if(dictionary[mid].in.lastIndexOf(str,0) === 0){
	    end1 = mid;
	    if(dictionary[begin1].in.lastIndexOf(str,0)===0){
		break;
	    }else{
		begin1 += 1;
	    }
	}else{
	    if(dictionary[mid].in < str){
		begin1 = mid + 1;
	    }else{
		end1 = mid - 1;
	    }
	}

	i++;
	if(i>30)break; //念の為の無限ループ回避
    }
    
    if(dictionary[begin1].in.lastIndexOf(str,0) !== 0){ //検索候補が存在しない
	return result;
    }

    var begin2=0, end2=dictionary.length-1;
    var i=0;

    //strから始まる最後の候補を探索
    while(end2 - begin2 > 0){
	var mid = Math.round((begin2 + end2) / 2);
	
	if(dictionary[mid].in.lastIndexOf(str,0) === 0){
	    begin2 = mid;
	    if(dictionary[end2].in.lastIndexOf(str,0)===0){
		break;
	    }else{
		end2 -= 1;
	    }
	}else{
	    if(dictionary[mid].in < str){
		begin2 = mid + 1;
	    }else{
		end2 = mid - 1;
	    }
	}

	i++;
	if(i>30)break; //念の為の無限ループ回避	
    }
    
    return dictionary.slice(begin1, end2+1);
}

function changeFontFamily(){
    textarea.style["font-family"] = document.getElementById("inputFontName").value;
    divCompletionList.style["font-family"] = document.getElementById("inputFontName").value;
}

function changeFontSize(){
    textarea.style["font-size"] = document.getElementById("inputFontSize").value;
    divCompletionList.style["font-size"] = document.getElementById("inputFontSize").value;
    input.style["font-size"] = document.getElementById("inputFontSize").value;
}

function drawTetute(){
    var div = document.getElementById("divTetute");
    div.innerHTML = "";

    if(!document.getElementById("checkboxVisibility").checked) return;
    
    var text = document.getElementById("textareaInput").value.split("\n");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var width = document.body.clientWidth;
    var height = document.body.clientHeight - document.getElementById("divTetute").getBoundingClientRect().top;

    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS(null, "width", width);
    svg.setAttributeNS(null, "height", height);
    svg.setAttributeNS(null, "viewbox", "0 0 " + width + " " + height);
    
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("font-family", "Tetute");
    g.setAttribute("font-size", 30);
    g.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
    g.setAttribute("transform", "rotate(45, " + width/2 + ", " + height/2 + ")");
    g.setAttribute("fill", "rgb(0,140,0)");

    var size = 30;
    var x = width/ 2, y = height / 2;
    var dirx = [0,-1,0,1];
    var diry = [1,0,-1,0];

    text.forEach(function(value, index, arr){

	var obj = document.createElementNS("http://www.w3.org/2000/svg", "text");
	
	obj.setAttribute("x", x);
	obj.setAttribute("y", y + size);
	obj.setAttribute("transform",
			 "translate(" + (x+size/2) + "," + (y+size/2) + ")" + 
			 "rotate(" + (90 * (index)) + ")" +
			 "translate(" + (-(x+size/2)) + "," + (-(y+size/2)) + ")"
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
    div.appendChild(svg);
}


function downloadSVG(){
    var div = document.getElementById("divTetute");
    var text = [];

    
    text[0] = div.childNodes[0].outerHTML;
    
    var blob = new Blob(text, {type: "text/plain"});
    var link = document.getElementById("download");
    
    link.href = URL.createObjectURL(blob);
}
