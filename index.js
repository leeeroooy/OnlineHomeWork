/**
 * @format
 */

import { AppRegistry } from "react-native";
import 'react-native-gesture-handler';
import Route from "./pages/Route";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => Route);
AppRegistry.registerComponent("main", () => Route);
