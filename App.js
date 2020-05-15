import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
// import qs from 'quer/ystring';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      changeState: "logins"
    };
    this.handleEmailText = this.handleEmailText.bind(this)
    this.handlePasswordText = this.handlePasswordText.bind(this);
    this.handleUsernameText = this.handleUsernameText.bind(this);
    this.userRegistration = this.userRegistration.bind(this);

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

  handleUsernameText(username) {
    this.setState({
      username: username
    });
  }

  changeToRegister = () => {
    this.setState({changeState: "register"});
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
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={{fontSize: 13, color: "mediumpurple"}}>
                Забыли пароль?
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
      case "register":
        return (
          <TextInput 
              style={styles.userInput}
              defaultValue={this.state.value}
              onChangeText={this.handleEmailText}
              placeholder="Email"
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
            <TouchableOpacity style={styles.loginButton}>
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
      default:
        return (
          <View style={{alignSelf: 'center'}}>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={{fontSize: 20, color: 'white'}}>
                Войти
              </Text>
            </TouchableOpacity>
          </View>
        )
    }
  }

  async userLogin() {
    let data = {
      'email': this.state.email,
      'password': this.state.password
    };

    let dataJson = JSON.stringify(data);
    console.log(dataJson);

    try {
      await fetch('http://192.168.0.101:80/homework/login/jsonLogin.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: dataJson
      }) 
      .then(function (response) {
          return response.json();
        })
        .then(function (responseJson) {
          console.log('response: ', responseJson);
        }).catch(error => console.error(error + "json"));
    } catch (err) {
      console.error(err);
    }

    
  }

  async userRegistration() {

    let data = {
      'username': this.state.username,
      'email': this.state.email,
      'password': this.state.password
    };
    let dataJson = JSON.stringify(data);
    console.log(dataJson);

    try {
      await fetch('http://192.168.0.101:80/homework/registration/jsonRegistraion.php', {
        // mode: 'cors',
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // credentials: 'include',
        // redirect: 'follow',
        body: dataJson
      })
      .then(function (response) {
          return response.json();
        })
        .then(function (responseJson) {
          Alert.alert(responseJson);
          console.log('response:', responseJson);
        }).catch(error => console.error(error + " json"));

    }
    catch (err) {
      console.error(err);
    }
}
      
  
  
  render() {
    return (
      <View style={styles.container}>
        <View style={(this.state.changeState == "login") ? styles.loginContainer: styles.registerContainer}>
            {this.registerButtonState()}
          {this.registerText()}
          <View style={styles.userContainer}>
            <TextInput
                style={styles.userInput}
                placeholder="Имя пользователя"
                defaultValue={this.state.value}
                onChangeText={this.handleUsernameText}
                placeholderTextColor="grey"/>
            {this.emailRegister()}
            <TextInput
              style={styles.userInput}
              placeholder="Пароль"
              defaultValue={this.state.value}
              onChangeText={this.handlePasswordText}
              placeholderTextColor="grey"/>

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
  userContainer: {
    width: 280,
    height: 130,
    padding: 10,
    alignItems: 'center',
    // backgroundColor: "grey",
  },
  forgotPasswordButton: {
    marginRight: 15,
    marginTop: 5,
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