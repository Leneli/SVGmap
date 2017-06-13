import "./index.scss";
import "normalize.css";

import coordinates from "../../components/polygons/world-polygons";
import createMap from "../../components/map/map";

createMap(coordinates());
