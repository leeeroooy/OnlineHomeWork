import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, LogBox, Text, Dimensions, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog from 'react-native-dialog';
import { FlatList } from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';
import { FAB } from 'react-native-paper';

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
            useremail: "",
            isEmptyTask: false,
            item: "",
            message: "",
            tasks: "",
            open: false,
            inputTextDialog: "",
            isShowAlert: false
        };
        this.getTasks = this.getTasks.bind(this);
        // this.getFlatList = this.getFlatList.bind(this);
        // this.employeeFunc = this.employeeFunc.bind(this);
    }


    async componentDidMount() {
        // console.log("componentDidMount");


        var name = await AsyncStorage.getItem(GROUP_NAME_KEY);
        var userpassword = await AsyncStorage.getItem(USER_PASSWORD_KEY);
        var useremail = await AsyncStorage.getItem(USER_EMAIL_KEY);


        // console.log("setState");
        this.setState({
            nameOfGroup: name,
            useremail: useremail,
            userpassword: userpassword
        });

        // console.log(this.state.userpassword + ' ' + this.state.useremail + ' ' + this.state.nameOfGroup);

        // console.log(this.state.dataHandler.length + " subjects in DID");        
      
        // console.log("BEFORE TWO FUNCTIONS");
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
                // console.log(responseJson + "in employeeFunc");
                this.setState({
                    employee: responseJson,
                });
                // console.log(this.state.employee);
            }).catch(err => {});
        } catch (error) {
            // console.log(error);
        }
        // console.log("BETWEEN TWO FUNCTIONS");
        this.getFlatList();
        // console.log("AFTER TWO FUNCTIONS");

        if(this.state.employee == null) {
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.setItem(STORAGE_KEY, "home");
            this.setState({employee: ""});
        }
    }

    async getFlatList() {
        const { useremail, userpassword, nameOfGroup} = this.state;
        try {
            await fetch('http://elroy.beget.tech/homework/getSubjects/jsonGetSubjects.php', {
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
                // console.log(responseJson + " SUBJECTS");
                // console.log(this.state.employee);
                if((this.state.employee == "viewer") && (responseJson != null)) {
                    this.setState({
                        dataHandler: responseJson
                    });
                    // console.log(this.state.employee + " STATE");
                } else if((this.state.employee == "maker") && (responseJson != null)) {
                    this.setState({
                        dataHandler: responseJson
                    });
                    // console.log(responseJson + " STATE");

                }
                // console.log(this.state.dataHandler);
            }).catch(err => {});
        } catch (error) {
            // console.log(error);
        }
    }

    LogOut = async () => {
        
        await AsyncStorage.removeItem(STORAGE_KEY);
        // console.log("LogOut in ListOfSubjects");
        await AsyncStorage.setItem(STORAGE_KEY, "home");
        this.props.updateDataLists("home");
    }

    handInput = (input) => {
        const { dataHandler } = this.state;
        // console.log(dataHandler);
        this.setState({
            dataHandler: [...dataHandler, input],
            showButton: true
        });
    }


    sendInput = async () => {
        const { dataHandler } = this.state;
        const { nameOfGroup } = this.state;

        // console.log(dataHandler + " hello ");
        try {
            await fetch('http://elroy.beget.tech/homework/writeSubjects/jsonWriteSubjects.php', {
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
            .then((responseJson) => {
                this.showAlert(responseJson);
                this.setState({showButton: false});
                // console.log('reponse ' + responseJson);
            }).catch(err => {});
        } catch(error) {
            // console.log()
        }
    }

    showAlert = (message) => {
        this.setState({isShowAlert: true, message: message});
        // console.log(message); 
    }

    hideAlert = () => {
        this.setState({isShowAlert: false, isAskAlert: false});
    }

    showAskAlert = (message) => {
        this.setState({isAskAlert: true, message: message});
        // console.log(message);
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


    onSwipeOpen = (item) => {
        this.setState({
            item: item
        });
    }

    onSwipeClose = (item) => {
        if(item == this.state.item) {
            this.setState({item: ""});
        }
    }


    getTasks = async (subject) => {
        const { nameOfGroup, useremail, userpassword } = this.state;
        // console.log(nameOfGroup + " " + useremail + " " + userpassword + " " + subject );
        const { navigate } = this.props.navigation;
        
        
        try {
            await fetch('http://elroy.beget.tech/homework/getTasks/jsonGetTasks.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'nameOfGroup': nameOfGroup,
                    'useremail': useremail,
                    'userpassword': userpassword,
                    'nameOfSubject': subject,
                    
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then((responseJson) => {

                // console.log(responseJson);

                if(responseJson == null && this.state.employee == "maker") {
                    this.setState({isEmptyTask: true});
                    navigate('Tasks', {subject: subject, isMaker: true, isEmptyTask: this.state.isEmptyTask});

                } else if(responseJson != null && this.state.employee == "maker") {
                    this.setState({isEmptyTask: false, tasks: responseJson});
                    navigate('Tasks', {subject: subject, tasks: this.state.tasks, isMaker: true, isEmptyTask: this.state.isEmptyTask});

                } else if(responseJson == null && this.state.employee == "viewer") {
                    this.setState({isEmptyTask: true});
                    navigate('Tasks', {subject: subject, isMaker: false, isEmptyTask: this.state.isEmptyTask});

                } else if(responseJson != null && this.state.employee == "viewer") {
                    this.setState({isEmptyTask: false, tasks: responseJson});
                    navigate('Tasks', {subject: subject, tasks: this.state.tasks, isMaker: false, isEmptyTask: this.state.isEmptyTask});
                }

                // console.log(this.state.tasks[0] + " subjects");


            })
        } catch (error) {
            // console.log(error);
        }
    }


    deleteGroup = async () => {
        const { useremail, userpassword, nameOfGroup } = this.state;
        const { updateDataLists } = this.props;

        try {
            await fetch('http://elroy.beget.tech/homework/deleteGroup/jsonDeleteGroup.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': useremail,
                    'password': userpassword,
                    'nameOfGroup': nameOfGroup
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(async (responseJson) => {
                if(!responseJson) {
                    // console.log(responseJson);
                } else {
                    await AsyncStorage.removeItem(STORAGE_KEY);
                    await AsyncStorage.setItem(STORAGE_KEY, "home");
                    updateDataLists("home");
                }
            })
        } catch (error) {
            // console.log(error);
        }
    }

    makerOrViewer = () => {
        // console.log('employee ' + this.state.employee);
       
        const { message } = this.state;
        var swipeoutBtns = [
            {
              component: (
                <View style={styles.trashButton}>
                        <Image style={{width: 25, height: 25, alignSelf: 'center'}} source={require('../images/download.png')} />
                </View>
              ),
              backgroundColor: '#FF7171',
              onPress: async () => { 
                    const { nameOfGroup, userpassword, useremail, item } = this.state;   
                    // console.log(item + " Hello");

            
                    try {
                        await fetch('http://elroy.beget.tech/homework/deleteSubject/jsonDeleteSubject.php', {
                            method: 'POST',
                            credentials: 'same-origin',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'userpassword': userpassword,
                                'useremail': useremail,
                                'nameOfGroup': nameOfGroup,
                                'nameOfSubject': item
                            })
                        })
                        .then(function (response) {
                            return response.json();
                        })
                        .then((responseJson) => {
                            this.setState({
                                dataHandler: responseJson
                            });
                        }).catch(err => {});
                    } catch(error) {
                        // console.log(error);
                    }
               }

            },
        ];

    
        switch(this.state.employee) {
            case "maker":
                return (
                    <View style={{flex: 1}}>
                        <Dialog.Container contentStyle={{borderRadius: 10}} visible={this.state.isAskAlert}>
                            <Dialog.Title style={{fontSize: 23, textAlign: 'center', marginBottom: 5, color: '#1aa800'}}>{message}</Dialog.Title>
                            {/* <View style={{flexDirection: 'row-reverse'}}> */}
                            <Dialog.Button style={styles.dialogButtonCancel} label="Отменить" onPress={() => this.hideAlert()}/>

                            <Dialog.Button style={styles.dialogButtonSubmit} label="Да" onPress={() => this.deleteGroup()}/>
                            {/* </View> */}
                        </Dialog.Container>
                        <Dialog.Container contentStyle={{borderRadius: 10}} visible={this.state.isShowAlert}>
                            <Dialog.Title style={{fontSize: 23, textAlign: 'center', marginBottom: 5, color: '#1aa800'}}>{message}</Dialog.Title>
                            {/* <View style={{flexDirection: 'row-reverse'}}> */}
                            <Dialog.Button style={styles.dialogOkButton} label="Окей" onPress={() => this.hideAlert()}/>
                            {/* </View> */}
                        </Dialog.Container>
                        <Dialog.Container visible={this.state.isVisible} contentStyle={{borderRadius: 10}}>
                            <Dialog.Title style={{fontSize: 25, textAlign: 'center',  color: '#1aa800', marginBottom: 5}}>Введите имя предмета</Dialog.Title>
                            <Dialog.Input 
                                 placeholder="Название группы"
                                 defaultValue={this.state.value}
                                 maxLength={13}
                                 onChangeText={(inputText) => this.setState({inputTextDialog: inputText})}
                                 style={{
                                     height: 50,
                                    //  borderWidth: 2,
                                    //  borderColor: "green"
                                 }}
                                 placeholderTextColor="grey" />
                            <View style={{flexDirection: 'row-reverse',}}>
                                <Dialog.Button style={styles.dialogButtonSubmit} label="Отправить" onPress={() => {this.handInput(this.state.inputTextDialog), this.setState({isVisible: false})}}/>
                                <Dialog.Button style={styles.dialogButtonCancel} label="Отменить" onPress={() => this.setState({isVisible: false})}/>
                            </View>
                        </Dialog.Container>
                        <FlatList
                            data={this.state.dataHandler}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => {
                                // console.log(this.props.navigation);
                                return (
                                    // <View>
                                    <Swipeout right={swipeoutBtns} onOpen={() => this.onSwipeOpen(item)} close={this.state.item !== item} onClose={() => this.onSwipeClose(item)} style={{backgroundColor: '#6495ED', marginTop: 13}}>
                                        <TouchableOpacity style={styles.flatListButton} onPress={() => this.getTasks(item)}>
                                            <Text style={{fontSize: 24, color: "black"}}>{item}</Text>
                                        </TouchableOpacity>   
                                    </Swipeout>
                                    // </View>
                                )
                            }}/>
                        <FAB.Group
                                open={this.state.open}
                                icon={this.state.open ? require('../images/download.png'): require('../images/menu.png')}
                                actions={[
                                    { icon: require('../images/download.png'), color: 'red', label: 'Удалить группу', onPress: () => this.showAskAlert("Вы уверены что хотите удалить группу?")},
                                    { icon: require('../images/white.jpg'),  color: 'purple', label: 'Добавить предмет', onPress: () => this.setState({isVisible: true})},
                                ]}
                                color="white"
                                onPress={() => {
                                    if(this.state.open) {

                                    }
                                }}
                                onStateChange={({open}) => this.setState({open})}
                            />
                            
                       {this.showButton()}
                    </View>
                );
            case "viewer": 
                return (
                    <View style={{flex: 1}}>
                        <FlatList
                            data={this.state.dataHandler}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    
                                    <View style={{marginTop: 13}}>
                                        <TouchableOpacity style={styles.flatListButton} onPress={() => this.getTasks(item)}>
                                            <Text style={{fontSize: 24, color: "black"}}>{item}</Text>
                                        </TouchableOpacity>
                                    </View>
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
 
        console.disableYellowBox = true;
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
        backgroundColor: "#6199ff",
        flex: 1,
    },
    fab: {
        width: 80,  
        height: 80,                                      
        position: 'absolute',                                          
        bottom: 0,                                                    
        right: 0,  
    },
    dialogButtonCancel: {
        color: '#1aa800',
    },
    dialogButtonSubmit: {
        backgroundColor: "#1aa800",
        color: "white",
        marginRight: 10
    },
    dialogOkButton: {
        // backgroundColor: "#1aa800",
        color: "#1aa800",
        marginRight: 10
    },
    okButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10,
        height: 50,
    },
    trashButton: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignContent: 'center',
    },
    flatListButton: {
        backgroundColor: "white",
        paddingLeft: 15,
        justifyContent: 'center',
        width: Dimensions.get('window').width - 10,
        height: 50,
        borderRadius: 10,
        // marginTop: 13,
        marginLeft: 5
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