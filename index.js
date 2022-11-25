import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Entrypoint from './app/Entrypoint';

AppRegistry.registerComponent(appName, () => Entrypoint);
