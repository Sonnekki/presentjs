/* A simple presentation framework written in JavaScript
    Copyright (C) 2013  Rob Del Vecchio (rob.delvecchio@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var Node = function (id, type, text, cssClass, animated) {
this.id = id;
this.type = type;
this.text = text;
this.cssClass = cssClass;
this.animated = animated;
this.draw = function (pdiv) {
	if (typeof pdiv == "undefined") {
		throw "Draw target node is null!";
	}
	var e = document.createElement(this.type);
	e.id = this.id;
	if (this.text.length != 0) {
		if (this.type == "div") {
			e.innerHTML = this.text;
		}
		else {
			e.appendChild(document.createTextNode(this.text));
		}
	}
	
	pdiv.appendChild(e);
	//$("#" + this.id).addClass(this.cssClass);
	document.getElementById(this.id).className += " " + this.cssClass;
	if (animated) {
		//$("#" + this.id).hide();
		document.getElementById(this.id).style.display = "none";
	}
  };
this.clear = function (pdiv) {
	pdiv.removeChild(this.id);
  };
}

var Slide = function (slideName) {
this.name = slideName;
this.animatePrev = -1;
this.animateNext = -1;
this.count = 0;
this.nodes = [];
this.animateNodes = [];
this.ulName = "";
this.addNode = function (type, text, cssClassOrAnimated, animated) { 
	var cssClass = "";
	if (typeof type === "undefined") {
		throw "No element Type defined for slide " + name;
	}
	if (typeof text === "undefined") {
		throw "No text supplied for slide " + name + " node " + type;
	}
	if (typeof cssClassOrAnimated == "string") {
		// Process as CSS Class
		cssClass = cssClassOrAnimated;
	}
	else if (typeof cssClassOrAnimated == "boolean" ) {
		// Process as Boolean
		animated = cssClassOrAnimated;
	}
	else {
		cssClass = "";
		animated = false;
	}
	if (typeof animated != "boolean") {
		animated = false;
	}
	
	var newNode = new Node(this.name + this.inc(), type, text, cssClass, animated)
	this.nodes.push(newNode);
	
	if (animated) {
		this.animateNodes.push(newNode);
		this.animateNext = 0;
	}
	
	if (type == "ul") {
		this.ulName = newNode.id;
	}
};
this.clear = function (pdiv) { 
	for (var i=0; i<this.nodes.length; i++) {
		var child = document.getElementById(this.nodes[i].id);
		if (child) {
			pdiv.removeChild(child);
		}
	}
  };
this.inc = function () { this.count = this.count + 1; return this.count; };
this.draw = function (pdiv) { 
	for (var i=0; i<this.nodes.length; i++) {
		if (this.ulName.length > 0 && this.nodes[i].type == "li") {
			this.nodes[i].draw(document.getElementById(this.ulName));
		}
		else {
			this.nodes[i].draw(pdiv);
		}
	}
  };
this.animateBack = function () {
	if (this.animateNodes.length <= 0) {
		return false;
	}
	if (this.animatePrev == -1) {
		return false;
	}
	
	//$('#'+this.animateNodes[this.animatePrev].id).slideUp(500);
	this.getElementById(this.animateNodes[this.animatePrev].id).style.display = "none";
	
	if (this.animatePrev >= 0) {
		this.animateNext = this.animateNext - 1;
		this.animatePrev = this.animatePrev - 1;
	}
	
	return true;
  };
this.animateForw = function () {
	if (this.animateNodes.length <= 0) {
		return false;
	}
	if (this.animateNext == this.animateNodes.length) {
		this.animatePrev = -1;
		this.animateNext = 0;
		return false;
	}
	
	//$('#'+this.animateNodes[this.animateNext].id).slideDown(500);
	var displayType = "";
	switch(this.animateNodes[this.animateNext].type) {
	case "li":
		displayType = "list-item";
		break;
	default:
		displayType = "block";
	}
	
	document.getElementById(this.animateNodes[this.animateNext].id).style.display = displayType;
	
	if (this.animateNext < this.animateNodes.length) {
		this.animateNext = this.animateNext + 1;
		this.animatePrev = this.animatePrev + 1;
	}
	
	return true;
  };
}

var Presentation = function(presentationDiv) {
	this.pdiv = presentationDiv;
	this.slides = [];
	this.currentSlide = 0;
	this.prevSlide = function () {
		var moreToAnimate = this.slides[this.currentSlide].animateBack();
		if (!moreToAnimate && this.currentSlide - 1 >= 0) {
			this.slides[this.currentSlide].clear(this.pdiv);
			this.currentSlide = this.currentSlide - 1;
			this.slides[this.currentSlide].draw(this.pdiv);
		}
	};
	this.nextSlide = function () {
		var moreToAnimate = this.slides[this.currentSlide].animateForw();
		if (!moreToAnimate && this.currentSlide + 1 < this.slides.length) {
			this.slides[this.currentSlide].clear(this.pdiv);
			this.currentSlide = this.currentSlide + 1;
			this.slides[this.currentSlide].draw(this.pdiv);
		}
	};
	
	this.start = function () {
		if (this.currentSlide == 0) {
			this.slides[this.currentSlide].draw(this.pdiv);
		}
	};

	if (document.addEventListener) {
		window.addEventListener('keydown',function (e) {
			if (e.which == 81) {
				// q
				pres.prevSlide();
			}
			else if (e.which == 32) {
				// space bar
				pres.nextSlide();
			}
		});
	}
	else if (document.attachEvent) {
		window.attachEvent('onkeydown',function (e) {
			if (e.which == 81) {
				// q
				pres.prevSlide();
			}
			else if (e.which == 32) {
				// space bar
				pres.nextSlide();
			}
		});
	}
	
}