import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button, Alert, BackHandler, Dimensions, LogBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog from 'react-native-dialog';
import { ToggleButton, Appbar, Checkbox, FAB, RadioButton, } from 'react-native-paper';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import { StackRouter, NavigationEvents } from 'react-navigation';

const STORAGE_KEY = "save_state";

const USER_PASSWORD_KEY = "save_password";
const USER_EMAIL_KEY = "save_useremail";

const GROUP_NAME_KEY = "save_group";
export default class ListOfGroups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            changeState: "findGroup",
            nameOfGroup: "",
            serverData: [],
            message: "",
            isShowAlert: false,
            userpassword: "",
            useremail: "",
            isAskAlert: false,
            isDeletingAcc: false,
            employee: null
    
        }

        this.handleNameText = this.handleNameText.bind(this);
        this.handleNameTextMake = this.handleNameTextMake(this);
        // this.navigateToSubject = this.navigateToSubject.bind(this);
        
    }
    
    
    LogOut = async () => {
        
        await AsyncStorage.removeItem(STORAGE_KEY);
        // console.log("LogOut");
        await AsyncStorage.setItem(STORAGE_KEY, "login");
        this.props.updateData("login");
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            return true;
        });

        var userpassword = await AsyncStorage.getItem(USER_PASSWORD_KEY);
        var useremail = await AsyncStorage.getItem(USER_EMAIL_KEY);

        this.setState({
            userpassword: userpassword,
            useremail: useremail,
        });

        this.employeeFunc();
    }

    employeeFunc = async () => {
        const { userpassword } = this.state;
        const { useremail } = this.state;

        try {
            await fetch('http://elroy.beget.tech/homework/makerOrViewer/jsonMakerOrViewer.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'useremail': useremail,
                    'userpassword': userpassword
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then((responseJson) => {
                    this.setState({
                        employee: responseJson
                    });
            }).catch(err => {});
        } catch (error) {
            // console.log(error);
        }
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
            default: 
                return (
                    <TouchableOpacity style={styles.logOut} onPress={this.LogOut}>
                        <Text style={{fontSize: 17, color: "white"}}>
                            Выйти
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
            default: 
                return (
                    <Text style={styles.changeText}>Найти группу</Text>
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
            default:
                return (
                    <TouchableOpacity style={styles.buttonChangeState} onPress={this.changeToMake}>
                        <Text style={{color: '#FFFAF0'}}>
                            Нет группы? Создать
                        </Text>
                    </TouchableOpacity>
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
            default: 
                return (
                    <View style={styles.viewButton}>
                        <TouchableOpacity style={styles.findMakeButton} onPress={this.findGroup}>
                            <Text style={{fontSize: 24, color: '#000080'}}>
                                Найти
                            </Text>
                        </TouchableOpacity>  
                    </View>
                );
        }
    }


    findGroup = async () => {
        const { nameOfGroup } = this.state;
        // console.log(nameOfGroup + " nameOfGroup");
        if(nameOfGroup != "") {
            try {
                await fetch('http://elroy.beget.tech/homework/findGroups/jsonFindGroups.php', {
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
                }).catch(err => {})
            }
            catch (error) {
                // console.log(error);
            }
        } else {
            this.setState({serverData: []});
        }
    }

    
    makeGroup = async () => {
        const { nameOfGroup, userpassword, useremail, employee } = this.state;

        if(employee == null && nameOfGroup != "") {
            try {
                await fetch('http://elroy.beget.tech/homework/makeGroup/jsonMakeGroup.php', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'nameOfGroup': nameOfGroup,
                        'userpassword': userpassword,
                        'email': useremail,
                    })
                })
                .then(function (response) {
                    return response.json();
                })
                .then(async (responseJson) => {
                    if(responseJson == null) {
                        // console.log('response: ', responseJson);
                    }
                    else {
                        this.showAlert(responseJson);
                        await AsyncStorage.setItem(GROUP_NAME_KEY, nameOfGroup);
    
                        await AsyncStorage.removeItem(STORAGE_KEY);
                        await AsyncStorage.setItem(STORAGE_KEY, "subjects");
        
                        // console.log('response: ', responseJson);
                    }
                }).catch(error => console.error(error));
            } catch (error) {
                // console.log(error);
            }
        } else if(employee == "viewer" && nameOfGroup != "") {
            // console.log(employee);
            this.showAlert("Вы уже находитесь в другой группу");
        }
        else if(employee == "maker" && nameOfGroup != "") {
            this.showAlert("У вас уже существует группа");
        } else {
            this.showAlert("Заполните все пропуски");
        }
    }

    

    handleNameText(value) {
        if(value != "") {
            this.setState({
                nameOfGroup: value,
            });
        } else {
            this.setState({
                nameOfGroup: ""
            });
        }
    }

    handleNameTextMake(value) {
        if(value != "") {
            this.setState({
                nameOfGroup: value,
            });
        } else {
            this.setState({
                nameOfGroup: ""
            });
        }
    }


    saveName = async (name) =>  {
        const { updateDataLists } = this.props;
        const { useremail, userpassword } = this.state;
        
        try {
            await fetch('http://elroy.beget.tech/homework/findGroups/jsonSaveFindGroup.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'nameOfGroup': name,
                    'userpassword': userpassword,
                    'useremail': useremail
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(async (responseJson) => {
                if(responseJson == null) {
                    // console.log(responseJson);
                } else {
                    await AsyncStorage.setItem(GROUP_NAME_KEY, name);
                    updateDataLists("subjects");
                }
            }).catch(err => {});
        } catch(eror) {
            // console.log(error);
        } 
        // updateDataLists("subjects");
        
    }

    showAlert = (message) => {
        this.setState({isShowAlert: true, message: message});
        // console.log(message); 
    }

    showAskAlert = (message) => {
        this.setState({isAskAlert: true, message: message});
        // console.log(message);
    }

    hideAlert = () => {
        this.setState({isShowAlert: false, isAskAlert: false});
    }

    deleteAccount = async () => {
        const { updateData } = this.props;
        const { userpassword, useremail} = this.state;

        try {
            await fetch('http://elroy.beget.tech/homework/deleteAccount/jsonDeleteAccount.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers:  {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'password': userpassword, 
                    'email': useremail
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(async (responseJson) => {
                // console.log(responseJson);
                if(!responseJson) {
                    // console.log(responseJson);
                } else {
                    await AsyncStorage.removeItem(STORAGE_KEY);
                    await AsyncStorage.setItem(STORAGE_KEY, "login");
                    updateData("login");
                }
            }).catch(err => {});
        } catch (error) {
            // console.log(error);
        }
    }
    


    render() {
        const { message } = this.state;
        // console.log(message);
        console.disableYellowBox = true;
        // LogBox.ignoreLogs(['Warning: ...']);
        return (
            <View style={styles.container}>
                <Dialog.Container contentStyle={{borderRadius: 10}} visible={this.state.isShowAlert}>
                    <Dialog.Title style={{fontSize: 23, textAlign: 'center', marginBottom: 5, color: '#1aa800'}}>{this.state.message}</Dialog.Title>
                    {/* <View style={{flexDirection: 'row-reverse'}}> */}
                    <Dialog.Button style={styles.dialogButtonSubmit} label="Окей" onPress={() => this.hideAlert()}/>
                    {/* </View> */}
                </Dialog.Container>
                <Dialog.Container contentStyle={{borderRadius: 10}} visible={this.state.isAskAlert}>
                    <Dialog.Title style={{fontSize: 23, textAlign: 'center', marginBottom: 5, color: '#1aa800'}}>{this.state.message}</Dialog.Title>
                    {/* <View style={{flexDirection: 'row-reverse'}}> */}
                    <Dialog.Button style={styles.dialogButtonSubmit1} label="Отменить" onPress={() => this.hideAlert()}/>

                    <Dialog.Button style={styles.dialogButtonSubmit} label="Да" onPress={() => this.deleteAccount()}/>
                    {/* </View> */}
                </Dialog.Container>
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
                {(this.state.changeState == "findGroup") ? (<FlatList 
                    data={this.state.serverData}
                    renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.flatListButton} onPress={() => this.saveName(item.name)} >
                            <Text style={{fontSize: 24, color: "black"}}>{item.name}</Text>
                            
                        </TouchableOpacity>
                    )
                }}/>): (<View></View>)}
                <FAB 
                    style={styles.fab}
                    icon={require('../images/trashButton.png')}
                    color="white"
                    onPress={() => this.showAskAlert("Вы действительно хотите удалить аккаунт?")}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#6199ff",
        flex: 1,
        alignItems: 'center',
    },
    dialogButtonSubmit: {
        backgroundColor: "#1aa800",
        color: "white",
        marginRight: 10,
        width: 70,
        fontSize: 16,
    },
    dialogButtonSubmit1: {
        color: "#1aa800",
        marginRight: 10,
        width: 110,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 15,
        right: 0,
        bottom: 0,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: "#16FFEC"
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
        // marginBottom: 5,
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