import "./index.scss";
import "normalize.css";

//import createMenu from "../../components/menu/menu";
//var menu = createMenu(["Главная", "Обо мне", "Портфолио", "Контакты"], "menu");
//document.body.appendChild(menu);


import coordinates from "../../components/polygons/world-polygons";
import createMap from "../../components/map/map";

createMap(coordinates());

console.log(coordinates());