import React from 'react';
import ListOfGroups from './ListOfGroups';
import ListOfSubjects from './ListOfSubjects';
import RegisterLoginPage from './RegisterLoginPage';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

const STORAGE_KEY = "save_state";
export default class ListsPage extends React.Component {

    constructor(props) {
        super(props);
        // props = {
        //     storeD: "",
        // };
        this.state = {
            storageData: "",
        };

    }

    UNSAFE_componentWillMount() {
        // await AsyncStorage.removeItem(STORAGE_KEY);
        AsyncStorage.getItem(STORAGE_KEY).then((asyncData) => {
            this.setState({
                storageData: asyncData
            });
        });
        // console.log("UNSAFE_componentWillMount in ListPage " + this.state.storageData);

    }

    updateDataLists = (value) => {
        this.setState({
            storageData: value
        });
    }
   

    render() {
        // console.log(this.state.storageData +  " render 2");
        if(this.state.storageData  == "subjects") {
            return (<ListOfSubjects updateDataLists={this.updateDataLists}/>);

        }
        else if(this.state.storageData == "home") {
            return (<ListOfGroups updateData={this.props.updateData} 
                updateDataLists={this.updateDataLists} />);
        }
        else {
            return <View />;
        }
    }
}