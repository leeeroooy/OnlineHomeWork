import React, { Component } from 'react';
import RegisterLoginPage from './RegisterLoginPage';
import { createAppContainer } from 'react-navigation';
import ListOfGroups from './ListOfGroups';
import RootPage from './RootPage';
import { createStackNavigator } from 'react-navigation-stack';
import ListOfSubjects from './ListOfSubjects';


const Stack = createStackNavigator(
    {
        Root: {
            screen: RootPage,
        },
        Subjects: {
            screen: ListOfSubjects
        }
        
        
    }, 
   
);

const AppContainer = createAppContainer(Stack);

export default class Route extends React.Component {
    render() {
        return <AppContainer/>;
    }
}


