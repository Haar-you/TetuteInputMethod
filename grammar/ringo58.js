window.addEventListener("load", function(){
    //ringo58文にidと番号割り当て
    var ringo58 = document.getElementsByClassName("ringo58");


    Array.prototype.forEach.call(ringo58, function(elem, index){
	var number = document.createElement("div");
	number.innerHTML = `${index+1}`;
	
	elem.id = `ringo58-${index+1}`;
	elem.insertBefore(number, elem.firstChild);
    });
});
