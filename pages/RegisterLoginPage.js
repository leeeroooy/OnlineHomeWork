import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';


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
      changeState: "login",

    };
    this.handleEmailText = this.handleEmailText.bind(this)
    this.handlePasswordText = this.handlePasswordText.bind(this);
    this.handleUsernameText = this.handleUsernameText.bind(this);
    this.handleNewPasswordText = this.handleNewPasswordText.bind(this);
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

    

    try {
      await fetch('http://192.168.0.111:80/homework/login/jsonLogin.php', {
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
        .then(async function (responseJson) {

          await AsyncStorage.setItem(STORAGE_KEY, "home");
          await AsyncStorage.setItem(USER_PASSWORD_KEY, password);
          await AsyncStorage.setItem(USER_EMAIL_KEY, email);

          if(responseJson == "Вы успешно вошли!") {
            Alert.alert('', responseJson);

            console.log('response: ', responseJson + ' login');
            updateData("home");
          } else if(responseJson != "Нужно зарегистрироваться!") {
            Alert.alert('', responseJson);

          } else  {
            Alert.alert('', responseJson);
          }

        }).catch(error => console.error(error));
    } catch (err) {
      console.error(err);
    }

  };

  userRegistration = async () => {

    const { username } = this.state;
    const { email } = this.state;
    const { password } = this.state; 


    try {
      await fetch('http://192.168.0.111:80/homework/registration/jsonRegistraion.php', {
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
        .then(function (responseJson) {
          Alert.alert(responseJson);
          console.log('response:', responseJson + ' register');
        }).catch(error => console.error(error));

    }
    catch (err) {
      console.error(err);
    }
  }
 
  userChangePassword = async () => {
    const { email, password, newPassword } = this.state;

    if(password == newPassword)
    {
      try {
        await fetch('http://192.168.0.111:80/homework/changePassword/jsonChangePassword.php', {
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
          Alert.alert('', responseJson);
          console.log(responseJson);
        })
      } catch (error) {
        console.log(error);
      }
    }
    else 
    {
      Alert.alert('', "Пароли не совпадают");
    }
  }

  render() {
    // const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
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
                  <TextInput 
                    style={styles.userInput}
                    placeholder="Новый пароль"
                    defaultValue={this.state.value}
                    onChangeText={this.handlePasswordText}
                    placeholderTextColor="grey"/>
                  <TextInput 
                    style={styles.userInput}
                    placeholder="Новый пароль"
                    defaultValue={this.state.value}
                    onChangeText={this.handleNewPasswordText}
                    placeholderTextColor="grey"/>
                  </View>):

                  
                (<TextInput
                  style={styles.userInput}
                  placeholder="Пароль"
                  defaultValue={this.state.value}
                  onChangeText={this.handlePasswordText}
                  placeholderTextColor="grey"/>)
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
