import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Dimensions, Image, Alert, SafeAreaView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FAB } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import base64 from 'react-native-base64';
import RNFetchBlob from 'rn-fetch-blob';

const GROUP_NAME_KEY = "save_group";

const USER_PASSWORD_KEY = "save_password";
const USER_EMAIL_KEY = "save_useremail";

export default class Tasks extends React.Component {


    static navigationOptions = {
        headerShown: false
    };

    constructor(props) {
        super(props);
        this.state = {
            task: "",
            screenHeight: 0,
            taskGet: "",
            showButton: false,
            nameOfGroup: "",
            useremail: "",
            // photo: null,
            // uri: null,
            userpassword: "",
            open: false,
            isEmptyTask: false

        };
        this.handleNameText = this.handleNameText.bind(this);
        
    }

    LogOut = () => {
        this.props.navigation.pop();
    }

    async componentDidMount() {
        var name = await AsyncStorage.getItem(GROUP_NAME_KEY);
        var useremail = await AsyncStorage.getItem(USER_EMAIL_KEY);
        var userpassword = await AsyncStorage.getItem(USER_PASSWORD_KEY);

        this.setState({
            nameOfGroup: name,
            useremail: useremail,
            userpassword: userpassword,
            isEmptyTask: this.props.navigation.state.params.isEmptyTask,
            // uri: this.props.navigation.state.params.uri
        });

    }


    
    handleNameText(value) {
        this.setState({
            task: value,
            showButton: true
        });
    }

    sendInput = async () => {
        const { nameOfGroup, task, photo } = this.state;
        console.log(task + " task in sendInput()");


        const { subject } = this.props.navigation.state.params;
        try {
            await fetch('http://192.168.0.111:80/homework/writeTasks/jsonWriteTasks.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'nameOfGroup': nameOfGroup,
                    'nameOfSubject': subject,
                    'task': task,
                    // 'photo': photo == null ? null: this.createFormData(photo, {userId: "123"})
                })
            })
            .then((function (response) {
                return response.json();
            }))
            .then((responseJson) => {
                console.log(responseJson);
                Alert.alert('', responseJson);
            }).catch(err => console.log(err));
        } catch (error) {
            console.log(error);
        }

        
    }

    // uploadImage = async (photo) => {
    //     try {
    //         await fetch('')
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    
    // handleChoosePhoto = () => {
    //     const options = {
    //         noData: true,
    //     }
    //     ImagePicker.launchImageLibrary(options, response => {
    //         if(response.uri) {
    //             this.setState({photo: response});
    //         }
    //     });
    // }

    // createFormData = (photo, body) => {
    //     const data = new FormData();

    //     data.append("photo", {
    //         uri: photo.uri,
    //         type: photo.type,
    //         fileName: photo.fileName,
    //     });

    //     Object.keys(body).forEach(key => {
    //         data.append(key, body[key]);
    //     });

    //     return data;
    // }

    showButton = () => {
        switch(this.state.showButton) {
            case true: 
                return (
                    <View style={styles.okContainer}>
                        <TouchableOpacity style={styles.okButton} onPress={this.sendInput}>
                            <Text style={{fontSize: 28, color: 'dodgerblue', }}>Oк</Text>
                        </TouchableOpacity>
                    </View>
                );
            case false: 
                return null;
        }
    }

    showTask = () => {
        const { tasks } = this.props.navigation.state.params;
        // const { photo } = this.state;

        console.log(this.state.isEmptyTask + " inShowTask");

        // console.log(tasks[1] + " tasks[1] in showTasks");

        switch(this.state.isEmptyTask) {
            case true: 
                return (
                    <View style={{flex: 1, alignItems: 'center'}}> 
                        <Text style={{justifyContent: 'center', alignSelf: 'center', fontSize: 24}}>Домашнее задание ещё не выложено</Text>
                    </View>
                );
            case false: 
                return (
                    <SafeAreaView style={{flex: 1}}>
                        <ScrollView style={{flex: 1}}
                            onContentSizeChange={(width, height) => {
                                this.setState({screenHeight: height + 100});
                            }}>
                            <Text style={styles.userText}>{tasks}</Text>
                            {/* <Image
                                source={{uri: 'https://res.cloudinary.com/dl7yniwum/image/upload/v1598720431/download_in3u7q.jpg'}}
                                style={{width: Dimensions.get('window').width - 20,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    overflow: 'hidden',
                                    borderWidth: 20,
                                    height: 500}}
                                /> */}
                        
                            
                        </ScrollView>
                    </SafeAreaView>
                );
        }
    }

    writeOrShowTask = () => {
        const { tasks } = this.props.navigation.state.params;
        // const { photo } = this.state;

        switch(this.state.isEmptyTask) {
            case true: 
                return (
                    <SafeAreaView style={{flex: 1}}>
                        <ScrollView style={{flex: 1}}
                            onContentSizeChange={(width, height) => {
                                this.setState({screenHeight: height + 100});
                            }}>
                            <TextInput 
                                    underlineColorAndroid="transparent"
                                    placeholder="Задание"
                                    // defaultValue={this.state.value}
                                    onChangeText={this.handleNameText}
                                    multiline={true}
                                    placeholderTextColor="#D1D1D1"
                                    style={styles.userText}
                                />
                            {/* {photo && (
                                <Image
                                    source={{isStatic: true, uri: photo.uri}}
                                    style={{width: Dimensions.get('window').width - 20,
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        overflow: 'hidden',
                                        borderWidth: 20,
                                        height: 500}}
                                />
                            )} */}
                            
                        </ScrollView>
                        {/* <FAB.Group 
                                open={this.state.open}
                                color='white'
                                icon={this.state.open ? require('../images/download.png'): require('../images/menu.png')}
                                actions={[
                                    // { icon: require('../images/download2.png'), color: 'purple',  label: 'Изменить текст', onPress: () => console.log('Текст изменен')},
                                    { icon: require('../images/14-512.jpg'), color: 'purple', label: 'Добавить фото', onPress: () => this.handleChoosePhoto()}

                                ]}
                                onPress={() => {
                                    if(this.state.open) {

                                    }
                                }}
                                onStateChange={({open}) => this.setState({open})}
                            />     */}
                    </SafeAreaView>
                );
            case false: 
                return (
                    <SafeAreaView style={{flex: 1}}>
                        <ScrollView styles={{flex: 1}}>
                            <Text style={styles.userText}>{Array.isArray(tasks) ? tasks[0]: tasks}</Text>
                               {/* {tasks[1] &&  (
                               <Image
                                    source={{isStatic: true, uri: tasks[1]}}
                                    style={{width: Dimensions.get('window').width - 20,
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        overflow: 'hidden',
                                        borderWidth: 20,
                                        height: 500}}
                                />)} */}
                        </ScrollView>
                            <FAB.Group 
                                open={this.state.open}
                                color='white'
                                icon={this.state.open ? require('../images/download.png'): require('../images/menu.png')}
                                actions={[
                                    { icon: require('../images/download2.png'), color: 'purple',  label: 'Изменить текст', onPress: () => this.setState({isEmptyTask: true})},
                                    // { icon: require('../images/14-512.jpg'), color: 'purple', label: 'Добавить фото', onPress: () => console.log('Добавить фото')}

                                ]}
                                onPress={() => {
                                    if(this.state.open) {

                                    }
                                }}
                                onStateChange={({open}) => this.setState({open})}
                            />
                    </SafeAreaView>
                )
        }
    }


    makeOrViewer = () => {
        switch(this.props.navigation.state.params.isMaker) {
            case true:
                return (
                    <View style={{flex: 1}}>
                        {this.writeOrShowTask()}
                        {this.showButton()}
                    </View>
                );
            case false:
                return (
                    <View style={{flex: 1}}>
                        {this.showTask()}
                    </View>
                )

        }
    }

    render() {
        return (
            <View style={styles.taskPage}>
                <View style={styles.upperThings}>
                    <TouchableOpacity style={styles.logOut} onPress={this.LogOut}>
                        <Text style={{fontSize: 17, color: "white"}}>
                            Назад
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.changeText}>{this.props.navigation.state.params.subject}</Text>
                </View>
                {this.makeOrViewer()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    taskPage: {
        flex: 1,
        backgroundColor: '#6495ED'
    },
    userText: {
        marginLeft: 10, 
        fontSize: 23,
        marginTop: 10,
        color: 'white'
    },
    okContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: Dimensions.get('window').width,
    },
    okButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10,
        height: 50,
        
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
})