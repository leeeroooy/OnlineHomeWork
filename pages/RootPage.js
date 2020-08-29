import React from 'react';
import ListOfGroups from './ListOfGroups';
import RegisterLoginPage from './RegisterLoginPage';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import ListsPage from './ListsPage';


const STORAGE_KEY = "save_state";
export default class RootPage extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    constructor(props) {
        super(props);
        this.state = {
            dataOfAsync: "",
        };
        
    }



    UNSAFE_componentWillMount() {
        // console.log("UNSAFE_componentWillMount in RootPage");
        // await AsyncStorage.removeItem(STORAGE_KEY);
        AsyncStorage.getItem(STORAGE_KEY).then((asyncData) => {
            this.setState({
                dataOfAsync: asyncData
            });
        });
    }

    updateData = (value) => {
        // console.log("UPDATE " + value);
        this.setState({
            dataOfAsync: value
        });

    }


    
    
    render() {
        // console.log(this.state.dataOfAsync + " render");
        if(this.state.dataOfAsync == "login" || this.state.dataOfAsync == null) {
            return (<RegisterLoginPage updateData={this.updateData}/>);
        }
        else if(this.state.dataOfAsync == "home" || this.state.dataOfAsync == "subjects") {
            return (<ListsPage updateData={this.updateData} navigation={this.props.navigation}/>);
        }
        else {
            return <View />;
        }
    }
}