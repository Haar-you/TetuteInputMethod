function makeTetuteGloss(url, classname, target, showSource){

    var build = function(json){
	var divs = document.createDocumentFragment();
	

	json["data"].forEach(function(val, index){
	    
	    var tetuteLines = val["tetute"].split("\n");
	    
	    var table = document.createElement("table");
	    var count = 0;

	    tetuteLines.forEach(function(elem){

		var words = elem.split(" ");

		var tdsTetute = words.map(x => `<td>${x}</td>`).join("");
		var trTetute = document.createElement("tr");
		trTetute.className = "tetute";
		trTetute.innerHTML = tdsTetute;

		var tdsGloss = val["gloss"].slice(count, count+words.length).map(x => `<td>${x}</td>`).join("");
		var trGloss = document.createElement("tr");
		trGloss.className = "gloss";
		trGloss.innerHTML = tdsGloss;
		
		table.appendChild(trTetute);
		table.appendChild(trGloss);

		count += words.length;
	    });

	    var divEntry = document.createElement("div");
	    divEntry.className = classname;

	    var divTranslation = document.createElement("div");
	    divTranslation.className = "translation";
	    divTranslation.innerHTML = val["translation"] || "";

	    var divTetuteGloss = document.createElement("div");
	    divTetuteGloss.appendChild(table);

	    var divContents = document.createElement("div");
	    divContents.className = "contents";
	    divContents.innerHTML = val["contents"] || "";

	    var divSource = document.createElement("div");
	    divSource.className = "source";
	    var sources = (val["source"] || []).map((x,i) => `<a href="${x}">${i+1}</a>`);
	    divSource.innerHTML = `→ ${sources}`;
	    
	    divEntry.appendChild(divTranslation);
	    divEntry.appendChild(divTetuteGloss);
	    divEntry.appendChild(divContents);
	    if(showSource) divEntry.appendChild(divSource);

	    divs.appendChild(divEntry);
	});
	target.appendChild(divs);
    };

    var request = new XMLHttpRequest();

    request.onload = function(){
	build(this.response);
    };

    request.open("GET", url, true);
    request.responseType = "json";
    request.send(null);
}
