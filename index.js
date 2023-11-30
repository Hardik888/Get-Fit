/**
 * @format
 */
import 'core-js/full/symbol/async-iterator';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
