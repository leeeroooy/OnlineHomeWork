import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Icon, ThemeConsumer } from 'react-native-elements';
import { FAB, ToggleButton, Appbar, RadioButton, Checkbox } from 'react-native-paper';

import Dialog from 'react-native-dialog';


const STORAGE_KEY = "save_state";
const USER_PASSWORD_KEY = "save_password";
const USER_EMAIL_KEY = "save_useremail";
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      newPassword: "",
      username: "",
      isShowAlert: false,
      message: "",
      changeState: "login",
      isChangeIcon: true,
      isChangeIconNew: true,

    };
    this.handleEmailText = this.handleEmailText.bind(this)
    this.handlePasswordText = this.handlePasswordText.bind(this);
    this.handleUsernameText = this.handleUsernameText.bind(this);
    this.handleNewPasswordText = this.handleNewPasswordText.bind(this);
    this.showAlert = this.showAlert.bind(this);
    // this.userRegistration = this.userRegistration.bind(this);
    // this.getStorageData = this.getStorageData.bind(this);
  }
  



  handleEmailText(email) {
    this.setState({
      email: email
    });
  }

  handlePasswordText(password) {
    this.setState({
      password: password
    });
  }

  handleNewPasswordText(password) {
    this.setState({
      newPassword: password
    });
  }

  handleUsernameText(username) {
    this.setState({
      username: username
    });
  }

  changeToRegister = () => {
    this.setState({changeState: "register"});
  }

  changeToForgotPassword = () => {
    this.setState({changeState: "forgotPass"});
  }
   
  changeToLogin = () => {
    this.setState({changeState: "login"});
  }

  registerButtonState = () =>  {
    switch(this.state.changeState)
    {
      case "login":
        return (
          <View style={{alignSelf: 'flex-end'}}>
            <TouchableOpacity style={styles.registerButtonContainer} onPress={this.changeToRegister}>
              <Text style={{fontSize: 17, color: "white"}}> 
                Создать
              </Text>
            </TouchableOpacity>
          </View>
        );
      case "register": 
        return (
          <View style={{height: 25}}/>
        );
      case "forgotPass": 
        return (
          <View style={{height: 25}} />
        );
      default:
        return (
          <View style={{alignSelf: 'flex-end'}}>
            <TouchableOpacity style={styles.registerButtonContainer} onPress={this.changeToRegister}>
              <Text style={{fontSize: 17, color: "white"}}> 
                Создать
              </Text>
            </TouchableOpacity>
          </View>
        );   
    }
  }

  registerText = () => {
    switch(this.state.changeState)
    {
      case "login":
        return (
          <Text style={styles.welcome}>Логин</Text>
        )
      case "register":
        return (
          <Text style={styles.welcome}>Регистрация</Text>
        );
      case "forgotPass":
        return (
          <Text style={styles.welcomeF}>Смена пароля</Text>
        )
      default: 
        return (
          <Text style={styles.welcome}>Логин</Text>
        )
    }
  }

  changeButtonRegPass = () => {
    switch(this.state.changeState)
    {
      case "login":
        return (
          <View style={{alignSelf: 'flex-end'}}>
            <TouchableOpacity style={styles.forgotPasswordButton} onPress={this.changeToForgotPassword}>
              <Text style={{fontSize: 13, color: "mediumpurple"}}>
                Забыли пароль?
              </Text>
            </TouchableOpacity>
          </View>
        )
      case  "forgotPass":
        return (
          <View style={{alignSelf: 'flex-end'}}>
            <TouchableOpacity style={styles.forgotPasswordButton1} onPress={this.changeToLogin}>
             <Text style={{fontSize: 13, color: "mediumpurple"}}>
                Вернуться
             </Text>
            </TouchableOpacity>
          </View>
        )
      case "register":
        return (
          <View style={{alignSelf: 'flex-end'}}>
            <TouchableOpacity style={styles.returnForgotPasswordButton} onPress={this.changeToLogin}>
              <Text style={{fontSize: 13, color: "mediumpurple"}}>
                Есть аккаунт? Войти
              </Text>
            </TouchableOpacity>
          </View>
        )
    }
  }

  emailRegister = () => {
    switch(this.state.changeState)
    {
      case "login":
        return <View/>
      case "forgotPass": 
        return <View/>
      case "register":
        return (
          <TextInput 
              style={styles.userInput}
              defaultValue={this.state.value}
              onChangeText={this.handleUsernameText}
              placeholder="Имя пользователя"
              placeholderTextColor="gray"/>
        )
    }
  }

  changeButtonRegPassLog = () => {
    switch(this.state.changeState)
    {
      case "login":
        return (
          <View style={{alignSelf: 'center'}}>
            <TouchableOpacity style={styles.loginButton} onPress={this.userLogin}>
              <Text style={{fontSize: 20, color: 'white'}}>
                Войти
              </Text>
            </TouchableOpacity>
          </View>
        )
      case "register":
        return (
          <View style={{alignSelf: 'center'}}>
            <TouchableOpacity style={styles.loginButton} onPress={this.userRegistration}>
              <Text style={{fontSize: 20, color: 'white'}}>
                Зарегистрироваться
              </Text>
            </TouchableOpacity>
          </View>
        )
      case "forgotPass": 
        return (
          <View style={{alignSelf: 'center'}}>
            <TouchableOpacity style={styles.loginButton} onPress={this.userChangePassword}>
              <Text style={{fontSize: 20, color: 'white'}}>
                Поменять пароль
              </Text>
            </TouchableOpacity>
          </View>
        )
      default:
        return (
          <View style={{alignSelf: 'center'}}>
            <TouchableOpacity style={styles.loginButton} onPress={this.userLogin}>
              <Text style={{fontSize: 20, color: 'white'}}>
                Войти
              </Text>
            </TouchableOpacity>
          </View>
        )
    }
  }


  userLogin = async () => {
    const { updateData } = this.props;
    const { email } = this.state;
    const { password } = this.state; 


    if(email != "" && password != "") {
      try {
        await fetch('http://elroy.beget.tech/homework/login/jsonLogin.php', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'email': email,
            'password': password
          })
        }) 
        .then(function (response) {
            return response.json();
          })
          .then(async (responseJson) =>  {

            // console.log(responseJson + "ResponseJson");
            if(responseJson == "Вы успешно вошли!") {
  
              await AsyncStorage.setItem(STORAGE_KEY, "home");
              await AsyncStorage.setItem(USER_PASSWORD_KEY, password);
              await AsyncStorage.setItem(USER_EMAIL_KEY, email);
              
              // console.log('response: ', responseJson + ' login');
  
              updateData("home");
  
            } else {
              this.showAlert(responseJson);

            }
          }).catch(error => console.error(error + " BAN"));
      } catch (err) {
        console.error(err);
      }
    } else {
      this.showAlert("Пожалуйста заполните все пункты");
    }

  };

  userRegistration = async () => {

    const { username } = this.state;
    const { email } = this.state;
    const { password } = this.state; 


    if(username != "" && email != "" && password != "") {
      try {
        await fetch('http://elroy.beget.tech/homework/registration/jsonRegistration.php', {
          // mode: 'cors',
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // credentials: 'include',
          // redirect: 'follow',
          body: JSON.stringify({
            'username': username,
            'email': email,
            'password': password
          })
        })
        .then(function (response) {
            return response.json();
          })
          .then((responseJson) =>  {
            if(responseJson == null) {
              // console.log(responseJson);
            } else {
              this.showAlert(responseJson);
            }
            // console.log('response:', responseJson + ' register');
          }).catch(error => {});
  
      }
      catch (err) {
        console.error(err);
      }
    } else {
      this.showAlert("Пожалуйста, заполните все пункты");
    }
  }
 
  userChangePassword = async () => {
    const { email, password, newPassword } = this.state;

    if(email != "" && password != "" && newPassword != "") {
      if(password == newPassword)
      {
        try {
          await fetch('http://elroy.beget.tech/homework/changePassword/jsonChangePassword.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'email': email,
              'password': password,
            }),
          })
          .then(function (response) {
            return response.json();
          })
          .then((responseJson) => {
            this.showAlert(responseJson);
            // console.log(responseJson);
          }).catch(err => {});
        } catch (error) {
          // console.log(error);
        }
      }
      else 
      {
        this.showAlert("Пароли не совпадают");
      }
    } else {
      this.showAlert("Пожалуйста заполните все пункты");
    }
  }

  showAlert(message) {
    this.setState({isShowAlert: true, message: message});
 
  }

  hideAlert = () => {
    this.setState({isShowAlert: false});
  }

  renderItem = () => (
    <View style={{width: 230, height: 110, /* backgroundColor: 'black' */ }}>
      <Text style={{fontSize: 23, color: 'black', marginTop: 20, textAlign: 'center'}}>{this.state.message}</Text>
      <View style={{position: 'absolute', alignSelf: 'center', bottom: 0}}>
        <TouchableOpacity style={{ width: 65, height: 30, backgroundColor: '#ff033e', borderRadius: 4}} onPress={this.hideAlert}>
          <Text style={{fontSize: 20, textAlign: 'center', color: 'white'}}>Окей</Text>
        </TouchableOpacity>
      </View>
    </View> 
  )

  render() {
    // console.log(this.state.message);
    console.disableYellowBox = true;
    const { message } = this.state;
    return (
      <View style={styles.container}>
        <Dialog.Container visible={this.state.isShowAlert} contentStyle={{borderRadius: 5}}>
          <Dialog.Title style={{fontSize: 25, textAlign: 'center', color: '#1aa800', marginBottom: 5}}>{message}</Dialog.Title>
          <Dialog.Button style={styles.dialogOkButton} label="Окей" onPress={() => this.hideAlert()}/>
        </Dialog.Container>
        <View style={((this.state.changeState == "login") ? styles.loginContainer: 
              (this.state.changeState == "register" ? styles.registerContainer: 
                styles.forgotContainer))}>
            {this.registerButtonState()}
          {this.registerText()}
          <View style={(this.state.changeState == "forgotPass") ? styles.userContainerForgot: styles.userContainer}>
            <TextInput
                style={styles.userInput}
                placeholder="Email"
                defaultValue={this.state.value}
                onChangeText={this.handleEmailText}
                placeholderTextColor="grey"/>
            {this.emailRegister()}
            {(this.state.changeState == "forgotPass") ? 
                (<View>
                    <View style={styles.passwordContainer}>
                      <TextInput 
                        style={styles.userInputPass}
                        placeholder="Новый пароль"
                        secureTextEntry={this.state.isChangeIcon ? true: false}
                        defaultValue={this.state.value}
                        onChangeText={this.handlePasswordText}
                        placeholderTextColor="grey"/>
                      <TouchableOpacity onPress={() => {this.state.isChangeIcon ? this.setState({isChangeIcon: false}): this.setState({isChangeIcon: true})}} >
                        <Image 
                          source={this.state.isChangeIcon ? require("../images/show-512.png"): require("../images/hide-512.png")}
                          style={{
                            width: 30,
                            tintColor: '#2e56ff',
                            height: 30, 
                            marginTop: 10,
                            marginLeft: 5}}
                        />
                       </TouchableOpacity>
                    </View>
                    <View style={styles.passwordContainer}>
                      <TextInput 
                        style={styles.userInputPass}
                        placeholder="Новый пароль"
                        secureTextEntry={this.state.isChangeIconNew ? true: false}
                        defaultValue={this.state.value}
                        onChangeText={this.handleNewPasswordText}
                        placeholderTextColor="grey"/>
                      <TouchableOpacity onPress={() => {this.state.isChangeIconNew ? this.setState({isChangeIconNew: false}): this.setState({isChangeIconNew: true})}} >
                        <Image 
                          source={this.state.isChangeIconNew ? require("../images/show-512.png"): require("../images/hide-512.png")}
                          style={{
                            width: 30,
                            tintColor: '#2e56ff',
                            height: 30, 
                            marginTop: 10,
                            marginLeft: 5}}
                        />
                       </TouchableOpacity>
                    </View>    
                  </View>):      
                (<View style={styles.passwordContainer}>
                  <TextInput 
                    style={styles.userInputPass}
                    placeholder="Пароль"
                    secureTextEntry={this.state.isChangeIcon ? true: false}
                    defaultValue={this.state.value}
                    onChangeText={this.handlePasswordText}
                    placeholderTextColor="grey"/>
                  <TouchableOpacity onPress={() => {this.state.isChangeIcon ? this.setState({isChangeIcon: false}): this.setState({isChangeIcon: true})}} >
                    <Image 
                      source={this.state.isChangeIcon ? require("../images/show-512.png"): require("../images/hide-512.png")}
                      style={{
                        width: 30,
                        tintColor: '#2e56ff',
                        height: 30, 
                        marginTop: 10,
                        marginLeft: 5}}
                    />
                    </TouchableOpacity>
                  </View>)
            }
          </View>
          {this.changeButtonRegPass()}
          {this.changeButtonRegPassLog()}
        </View>
      </View>
    );
    
  
    
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6495ED",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogOkButton: {
    // backgroundColor: "#1aa800",
    color: "#1aa800",
    marginRight: 10
  },
  dialogButtonSubmit: {
    backgroundColor: "#1aa800",
    color: "white",
    marginRight: 10,
    width: 70,
    fontSize: 16,
    // fontSize: 17,
    // height: 40
  },
  passwordContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',

  },
  forgotContainer: {
    backgroundColor: "white",
    width: 280,
    height: 370,
    borderRadius: 20
  },
  welcomeF: {
    fontSize: 37,
    color: "deepskyblue",
    textAlign: 'center',
    padding: 10,
  },
  loginContainer: {
    backgroundColor: "white",
    width: 280,
    height: 350,
    borderRadius: 20
  },
  registerContainer: {
    backgroundColor: "white",
    width: 280,
    height: 390,
    borderRadius: 20
  },
  welcome: {
    fontSize: 40,
    color: "deepskyblue",
    textAlign: 'center',
    padding: 10,
  },
  registerButtonContainer: {
    alignItems: 'center',
    alignSelf: 'auto',
    backgroundColor: "dodgerblue",
    width: 90,
    justifyContent: "center",
    height: 35,
    margin: 10,
    borderRadius: 5
  },
  userInput: {
    width: 250,
    height: 50,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
    padding: 10,
    marginBottom: 15,
  },
  userInputPass: {
    width: 225,
    marginLeft: 10,
    height: 50,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
    padding: 10,
    marginBottom: 15,
  },
  userContainerForgot: {
    width: 280,
    height: 190,
    alignItems: 'center',
    // backgroundColor: "black"
  },
  userContainer: {
    width: 280,
    height: 130,
    padding: 10,
    alignItems: 'center',
    // backgroundColor: "black",
  },
  forgotPasswordButton: {
    marginRight: 15,
    marginTop: 5,
  },
  forgotPasswordButton1: {
    marginRight: 15,
    // marginTop: 5,
  },
  returnForgotPasswordButton: {
    marginRight: 15,
    marginTop: 70
  },
  loginButton: {
    backgroundColor: "dodgerblue",
    marginTop: 15,
    width: 250,
    height: 40,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 20
  }
});
