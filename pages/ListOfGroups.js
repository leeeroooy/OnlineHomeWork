import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button, Alert, BackHandler, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import { FlatList } from 'react-native-gesture-handler';
// import { List, ListItem } from "react-native-elements";
import { TextInput, FlatList } from 'react-native-gesture-handler';

const STORAGE_KEY = "save_state";

const USER_NAME_KEY = "save_username";
const USER_EMAIL_KEY = "save_useremail";

const GROUP_NAME_KEY = "save_group";
export default class ListOfGroups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            changeState: "findGroup",
            nameOfGroup: "",
            serverData: [],
    
        }

        this.handleNameText = this.handleNameText.bind(this);
        // this.navigateToSubject = this.navigateToSubject.bind(this);
        
    }
    
    LogOut = async () => {
        
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log("LogOut");
        await AsyncStorage.setItem(STORAGE_KEY, "login");
        this.props.updateData("login");
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            return true;
        });
        
    }

    changeToMake = () => {
        this.setState({changeState: "makeGroup"});
    }

    changeNameFunc = () => {
        this.setState({changeName: true});
    }

    changeToFind = () => {
        this.setState({changeState: "findGroup"});
    }

    logOutButtonState = () => {
        switch(this.state.changeState) {
            case "findGroup":
                return (
                    <TouchableOpacity style={styles.logOut} onPress={this.LogOut}>
                        <Text style={{fontSize: 17, color: "white"}}>
                            Выйти
                        </Text>
                    </TouchableOpacity>
                );
            case "makeGroup":
                return (
                    <TouchableOpacity style={styles.logOut} onPress={this.changeToFind}>
                        <Text style={{fontSize: 17, color: "white"}}>
                            Вернуться
                        </Text>
                    </TouchableOpacity>
                );
        }
    }

    changeTextPage = () => {
        switch(this.state.changeState) {
            case "findGroup":
                return (
                    <Text style={styles.changeText}>Найти группу</Text>
                );
            case "makeGroup":
                return (
                    <Text style={styles.changeText}>Создать группу</Text>
                );
        }
    }


    buttonChangeState = () => {
        switch(this.state.changeState) {
            case "findGroup":
                return (
                    <TouchableOpacity style={styles.buttonChangeState} onPress={this.changeToMake}>
                        <Text style={{color: '#FFFAF0'}}>
                            Нет группы? Создать
                        </Text>
                    </TouchableOpacity>
                );
            case "makeGroup":
                return (
                    <View style={{marginTop: 18}}></View>
                );
        }
    }

    findMakeButton = () => {
        switch(this.state.changeState) {
            case "findGroup":
                return (
                    <View style={styles.viewButton}>
                        <TouchableOpacity style={styles.findMakeButton} onPress={this.findGroup}>
                            <Text style={{fontSize: 24, color: '#000080'}}>
                                Найти
                            </Text>
                        </TouchableOpacity>  
                    </View>
                );
            case "makeGroup":
                return (
                    <View style={styles.viewButton}>
                        <TouchableOpacity style={styles.findMakeButton} onPress={this.makeGroup}>
                            <Text style={{fontSize: 24, color: '#000080'}}>
                                Создать
                            </Text>
                        </TouchableOpacity>  
                    </View>
                )
        }
    }


    findGroup = async () => {
        const { nameOfGroup } = this.state;

        try {
            await fetch('http://192.168.0.111:80/homework/findGroups/jsonFindGroups.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'nameOfGroup': nameOfGroup,
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(async (responseJson) => {
                this.setState({
                    serverData: responseJson
                });
                
                await AsyncStorage.removeItem(STORAGE_KEY);
                await AsyncStorage.setItem(STORAGE_KEY, "subjects");

                // console.log(responseJson);
            }).catch(err => console.log(err))
        }
        catch (error) {
            console.log(error);
        }
    }

    
    makeGroup = async () => {
        const { nameOfGroup } = this.state;

        var username = await AsyncStorage.getItem(USER_NAME_KEY);
        var useremail = await AsyncStorage.getItem(USER_EMAIL_KEY);

        try {
            await fetch('http://192.168.0.111:80/homework/makeGroup/jsonMakeGroup.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'nameOfGroup': nameOfGroup,
                    'username': username,
                    'email': useremail 
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(async function (responseJson) {
                if(responseJson == null) {
                    console.log('response: ', responseJson);
                }
                else {
                    Alert.alert('', responseJson);
                    await AsyncStorage.setItem(GROUP_NAME_KEY, nameOfGroup);

                    await AsyncStorage.removeItem(STORAGE_KEY);
                    await AsyncStorage.setItem(STORAGE_KEY, "subjects");
    
                    console.log('response: ', responseJson);

                    
                }
            }).catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    }

    

    handleNameText(value) {
        this.setState({
            nameOfGroup: value,
        });
    }


    saveName = async (name) =>  {
        const { updateDataLists } = this.props;
        
        var username = await AsyncStorage.getItem(USER_NAME_KEY);
        var useremail = await AsyncStorage.getItem(USER_EMAIL_KEY);


        try {
            await fetch('http://192.168.0.111:80/homework/findGroups/jsonSaveFindGroup.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'nameOfGroup': name,
                    'username': username,
                    'useremail': useremail
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then((responseJson) => {
                if(responseJson == null) {
                    console.log(responseJson);
                } else {
                    Alert.alert('', responseJson);
                }
            }).catch(err => console.log(err));
        } catch(eror) {
            console.log(error);
        } 
        await AsyncStorage.setItem(GROUP_NAME_KEY, name);
        updateDataLists("subjects");
        
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperThings}>
                    {this.logOutButtonState()}
                    {this.changeTextPage()}
                </View>
                <View style={styles.userContainer}>
                    <TextInput
                        style={styles.userInput}
                        placeholder="Название группы"
                        defaultValue={this.state.value}
                        onChangeText={this.handleNameText}
                        placeholderTextColor="grey" />
                </View>
                {this.buttonChangeState()}
                {this.findMakeButton()}
                {/* <List> */}
                    <FlatList 
                       data={this.state.serverData}
                       renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.flatListButton} onPress={() => this.saveName(item.name)} >
                                <Text style={{fontSize: 24, color: "black"}}>{item.name}</Text>
                                
                            </TouchableOpacity>
                        )
                    }}
                    />
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#6495ED",
        flex: 1,
        alignItems: 'center',
    },
    flatListButton: {
        backgroundColor: "white",
        paddingLeft: 15,
        justifyContent: 'center',
        width: Dimensions.get('window').width - 10,
        height: 50,
        borderRadius: 10,
        marginTop: 10
    },
    logOut: {
        alignItems: 'center',
        // alignSelf: 'auto',
        backgroundColor: "dodgerblue",
        width: 90,
        justifyContent: "center",
        height: 35,
        margin: 10,
        borderRadius: 5
    },
    upperThings: {
        height: 60,
        alignItems: 'center',
        backgroundColor: "white",
        width: Dimensions.get('window').width,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    }, 
    changeText: {
        marginBottom: 5,
        fontSize: 34,
        // fontFamily: '',
        color: "#4169E1",
        marginLeft: 20
    },
    userContainer: {
        marginTop: 20,
        width: Dimensions.get('window').width, 
        height: 70,
        padding: 10,
        // backgroundColor: "white",
        alignItems: 'center'
    },
    userInput: {
        width: Dimensions.get('window').width - 15,
        height: 55, 
        borderRadius: 10,
        fontSize: 19,
        backgroundColor: "white",
        padding: 10,
    },
    viewButton: {
        // backgroundColor: "green",
        width: Dimensions.get('window').width,
        alignItems: 'center',
        marginTop: 10,
        height: 70,
    },
    findMakeButton: {
        alignItems: 'center',
        backgroundColor: "white",
        width: Dimensions.get('window').width - 20,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center'

    },
    buttonChangeState: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 5


    }
});