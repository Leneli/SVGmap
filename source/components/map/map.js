export default function(s) {
	document.addEventListener("DOMContentLoaded", function() {
		WorldMap.init();
	});

	var WorldMap = {
		init() {
			//отрисовка карты
			var height = window.innerHeight,
				width = height * 1.6,
				id = 'world-map';

			var map = new WorldMap.SVG({
				element: 'main-map',
				id: id,
				width: width,
				height: height
			});

			var worldmap = document.getElementById(id);
			console.log(worldmap);

			//zoom
			WorldMap.zoom(worldmap);

			//attributes for map
			WorldMap.addAttributes(worldmap);

			//event "click"
			worldmap.addEventListener("click", function(event) {
				event = event || window.event;

				var elem = event.target.parentNode;

				if(elem.tagName === "g") {
					WorldMap.countryclick(elem.id);
				} else {
					WorldMap.removeEl(document.getElementById("tooltip"));
				}
			});
		},

		SVG(options) {
			var svgNS = "http://www.w3.org/2000/svg";
			var svg = document.createElementNS(svgNS, "svg");

			var g_color = '#d2dde6';

			if (options['width'] === undefined) options['width'] = 320;
			if (options['height'] === undefined) options['height'] = 240;

			var kw = options['width'] / 10000;
			var kh = options['height'] / 10000;

			svg.setAttributeNS(null, 'id', options['id']);
			svg.setAttributeNS(null, 'width', options['width']);
			svg.setAttributeNS(null, 'height', options['height']);

			for (var k in s) {
				var g = document.createElementNS(svgNS, 'g');
				g.setAttributeNS(null, 'id', k);
				g.setAttributeNS(null, 'fill', g_color);
				g.className.baseVal = 'worldmap';

				for (var k1 in s[k]) {
					if (s[k][k1]) {
						var p = document.createElementNS(svgNS, 'path');

						var l = s[k][k1].length;
						if (l > 2) {
							var str = 'M' + parseInt(s[k][k1][0] * kw) + ' ' + parseInt(s[k][k1][1] * kh) + ' ';
							for (var i = 2; i < l - 1; i += 2) {
								str += 'L' + parseInt(s[k][k1][i] * kw) + ' ' + parseInt(s[k][k1][i + 1] * kh) + ' ';
							}
							str += 'z';
							p.setAttributeNS(null, 'd', str);
						}

						g.appendChild(p);
					}
				}

				svg.appendChild(g);
			}

			if (options['element'] !== undefined) {
				var parent = document.getElementById(options['element']);
				if (parent) parent.appendChild(svg);
			}
			
		},

		zoom(worldmap) {
			var zoom = document.getElementById("zoom"),
				scale = 1,
				translateX = 0,
				translateY = 0;

			zoom.addEventListener("click", function (e) {
				if (!e) e = window.event;
				var elm = e.target || e.srcElement;

				var scale_step = 0.1,
					scale_min = 0.1,
					scale_max = 2.5,
					translate_step = 10;

				if (elm.id === "pls") {
					scale += scale_step;
					if (scale >= scale_max) scale = scale_max;
				}

				if (elm.id === "min") {
					scale -= scale_step;
					if (scale <= scale_min) scale = scale_min;
				}

				if (elm.id === "top") { translateY -= translate_step; }
				if (elm.id === "bottom") { translateY += translate_step; }
				if (elm.id === "left") { translateX -= translate_step; }
				if (elm.id === "right") { translateX += translate_step; }

				worldmap.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", " + translateX + ", " + translateY + ")";
				WorldMap.removeEl(document.getElementById("tooltip"));
			});
		},

		addAttributes(worldmap) {
			var xhr_name = new XMLHttpRequest,
				xhr_time = new XMLHttpRequest,
				obj_name,
				obj_time;

			//названия стран
			xhr_name.open("GET", "../../../json/country_code.json", true);
			xhr_name.send();
			xhr_name.onreadystatechange = function () {
				if (xhr_name.readyState !== 4) return;
				if (xhr_name.status !== 200) {
					console.log(xhr_name.status + ': ' + xhr_name.statusText);
				} else {
					obj_name = JSON.parse(xhr_name.responseText);

					for (var k in worldmap.children) {
						var _id = worldmap.children[k].id,
							_name;

						if (obj_name[_id] !== undefined) {
							_name = obj_name[_id];
						} else {
							_name = "Undefined";
						}

						worldmap.children[k].setAttribute("data-name", _name);
					}
				}
			}

			//данные по странам
			xhr_time.open("GET", "../../../json/data.json", true);
			xhr_time.send();
			xhr_time.onreadystatechange = function () {
				if (xhr_time.readyState !== 4) return;
				if (xhr_time.status !== 200) {
					console.log(xhr_time.status + ': ' + xhr_time.statusText);
				} else {
					obj_time = JSON.parse(xhr_time.responseText);

					for (var k in worldmap.children) {
						var _id = worldmap.children[k].id,
							_time,
							max = 1051;

						for (var j in obj_time) {
							if (obj_time[j]["country"] === _id) {
								_time = obj_time[j]["count_dtime"];
								worldmap.children[k].setAttribute("data-dtime", _time);

								var X = _time - max;
								if (X >= 0) {
									X = 0;
								} else {
									X *= -1;
									X /= 5.5;
									X = Math.round(X);
								}

								worldmap.children[k].setAttribute("fill", "rgb(255, " + X + ", " + X + ")");
							}
						}
					}
				}
			}
		},

		countryclick(id) {

			var el = document.getElementById(id),
				tooltip,
				name,
				number,
				top,
				left;

			name = el.getAttribute("data-name") || "no data";
			number = el.getAttribute("data-dtime") || "no data";

			WorldMap.removeEl(document.getElementById("tooltip"));

			tooltip = document.createElement("div")
			tooltip.setAttribute("id", "tooltip");
			tooltip.setAttribute("class", "tooltip");
			tooltip.innerHTML = name + " : " + number;

			document.getElementById("main-map").appendChild(tooltip);

			top = (event.pageY - 70);
			left = event.pageX;
			if ((top + tooltip.offsetHeight) > window.innerHeight) { top -= tooltip.offsetHeight; }
			if ((left + tooltip.offsetWidth) > window.innerWidth) { left -= tooltip.offsetWidth; }
			tooltip.style.top = top + "px";
			tooltip.style.left = left + "px";
		},

		removeEl(el) {
			if (!Element.prototype.remove) {
				Element.prototype.remove = function remove() {
					if (this.parentNode) {
						this.parentNode.removeChild(this);
					}
				};
			}
			if (el) el.remove();
		}
	};
};