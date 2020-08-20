import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Dimensions, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DialogInput from 'react-native-dialog-input';
import { FlatList } from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';

const STORAGE_KEY = "save_state";

const GROUP_NAME_KEY = "save_group";

const USER_PASSWORD_KEY = "save_password";
const USER_EMAIL_KEY = "save_useremail";
export default class ListOfSubjects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameOfGroup: "",
            isVisible: false,
            employee: "",
            dataHandler: [],
            showButton: false,
            userpassword: "",
            useremail: ""
        };
    }


    async componentDidMount() {
        var name = await AsyncStorage.getItem(GROUP_NAME_KEY);
        var userpassword = await AsyncStorage.getItem(USER_PASSWORD_KEY);
        var useremail = await AsyncStorage.getItem(USER_EMAIL_KEY);

        this.setState({
            nameOfGroup: name,
            useremail: useremail,
            userpassword: userpassword
        });

        console.log(this.state.userpassword + ' ' + this.state.useremail + ' ' + this.state.nameOfGroup);

        console.log(this.state.dataHandler.length + " subjects in DID");
        this.employeeFunc();        

        this.getFlatList();
        
        console.log("componentDidMount");
        
    }

   
    // async componentWillUnmount() {
    //     await AsyncStorage.removeItem(USER_EMAIL_KEY);
    //     await AsyncStorage.removeItem(USER_NAME_KEY);
    // }

    getFlatList = async () => {
        const { useremail, userpassword, nameOfGroup} = this.state;
        try {
            await fetch('http://192.168.0.111:80/homework/getSubjects/jsonGetSubjects.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'useremail': useremail,
                    'userpassword': userpassword,
                    'nameOfGroup': nameOfGroup
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then((responseJson) => {
                console.log(responseJson + " subjects");
                if(this.state.employee == "viewer") {
                    this.setState({
                        dataHandler: responseJson
                    });
                } else if((this.state.employee == "maker") && (responseJson.length > 0)) {
                    this.setState({
                        dataHandler: responseJson
                    });
                }
            }).catch(err => console.log(err));
        } catch (error) {
            console.log(error);
        }
    }

    employeeFunc = async () => {
        const { userpassword } = this.state;
        const { useremail } = this.state;
        try {
            await fetch('http://192.168.0.111:80/homework/makerOrViewer/jsonMakerOrViewer.php', {
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
            }).catch(err => console.log(err));
        } catch (error) {
            console.log(error);
        }
    }

    LogOut = async () => {
        
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log("LogOut in ListOfSubjects");
        await AsyncStorage.setItem(STORAGE_KEY, "home");
        this.props.updateDataLists("home");
    }

    handInput = (input) => {
        const { dataHandler } = this.state;
        console.log(dataHandler);
        this.setState({
            dataHandler: [...dataHandler, input],
            showButton: true
        });
    }


    sendInput = async () => {
        const { dataHandler } = this.state;
        const { nameOfGroup } = this.state;
        try {
            await fetch('http://192.168.0.111:80/homework/writeSubjects/jsonWriteSubjects.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'subjects': dataHandler,
                    'groupname': nameOfGroup,
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (responseJson) {
                Alert.alert('', responseJson);
                console.log('reponse ' + responseJson);
            }).catch(err => console.log(err));
        } catch(error) {
            console.log()
        }
    }

    showButton = () => {
        switch(this.state.showButton) {
            case true: 
                return (
                    <View>
                        <TouchableOpacity style={styles.okButton} onPress={this.sendInput}>
                            <Text style={{fontSize: 28, color: 'dodgerblue', }}>Oк</Text>
                        </TouchableOpacity>
                    </View>
                );
            case false: 
                return null;
        }
    }

    generateKey = (numberOfCharachter) => {
        return require('random-string')({length: numberOfCharachter});
    }

    deleteItemId = (id) => {
        const filtredData = this.state.dataHandler.filter(item => item.id !== id);
        this.setState({
            dataHandler: filtredData
        })
    }
    makerOrViewer = () => {
        console.log('employee ' + this.state.employee);

        var swipeoutBtns = [
            {
              text: 'Button'
            }
          ]

        switch(this.state.employee) {
            case "maker":
                return (
                    <View style={{flex: 1}}>
                        <DialogInput 
                            isDialogVisible={this.state.isVisible}
                            title={"Введите предмет"}
                            submitInput={(inputText) => this.handInput(inputText)}
                            closeDialog={() => this.setState({isVisible: false})}
                            hintInput={"Предмет"}
                        /> 
                        <FlatList
                            data={this.state.dataHandler}
                            keyExtractor={item => this.generateKey(24)}
                            renderItem={({ item }) => {
                                return (
                                    <Swipeout right={swipeoutBtns} style={{backgroundColor: '#6495ED'}}>
                                        <TouchableOpacity key={item} style={styles.flatListButton} >
                                            <Text style={{fontSize: 24, color: "black"}}>{item}</Text>
                                        </TouchableOpacity>   
                                    </Swipeout>
               
                                )
                            }}/>
                        <View style={{flex: 1}}>
                            <TouchableOpacity 
                                style={styles.floatingButton}
                                activeOpacity={0.7}
                                onPress={() => this.setState({isVisible: true})}>
                                    <Image
                                        style={styles.floatImage}
                                        source={require('../images/icons8-plus-40.png')}/>
                            </TouchableOpacity>
                        </View>
                       {this.showButton()}
                    </View>
                );
            case "viewer": 
                return (
                    <View style={{flex: 1}}>
                        <FlatList
                            data={this.state.dataHandler}
                            keyExtractor={item => this.generateKey(24)}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity key={item} style={styles.flatListButton} >
                                        <Text style={{fontSize: 24, color: "black"}}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            }}/>
                    </View>  
                );
            default:
                return (<View></View>);
            // case "viewer":

        }
    }


    render() {
        return (
            <View style={styles.listsContainer}>
                <View style={styles.upperThings}>
                    <TouchableOpacity style={styles.logOut} onPress={this.LogOut}>
                        <Text style={{fontSize: 17, color: "white"}}>
                            Назад
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.changeText}>{this.state.nameOfGroup}</Text>
                </View>
                {this.makerOrViewer()}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    listsContainer: {
        backgroundColor: "#6495ED",
        flex: 1,
    },
    okButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10,
        height: 50,
    },
    flatListButton: {
        backgroundColor: "white",
        paddingLeft: 15,
        justifyContent: 'center',
        width: Dimensions.get('window').width - 10,
        height: 50,
        borderRadius: 10,
        marginTop: 13,
        marginLeft: 5
    },
    floatImage: {
        resizeMode: 'contain',
        width: 60,
        height: 60,
    },
    floatingButton: {  
        position: 'absolute',
        width: 70,
        height: 70,
        // backgroundColor: 'black', 
        alignItems: 'center',
        justifyContent: 'center',
        right: 15,
        bottom: 10
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
    changeText: {
        marginBottom: 5,
        fontSize: 40,
        // fontFamily: '',
        color: "#4169E1",
        marginLeft: 20
    },
});