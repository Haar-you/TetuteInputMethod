window.addEventListener("load", function(){
    var all = document.querySelectorAll("body *");
    
    Array.prototype.forEach.call(all, function(elem){

	if(elem.getAttribute("data-anchor") != undefined){
	    setAnchor(elem);
	}
    });
});

function setAnchor(obj){
    var names = obj.innerHTML.split(" ");
    var prefix = obj.getAttribute("data-anchor-prefix");
    obj.innerHTML = "";

    var ancs = [];
    names.forEach(function(name){
	ancs.push(
	    `<a href="#${prefix}${name}">${name}</a>`
	);
    });
    obj.innerHTML = ancs.join(" ");
}
