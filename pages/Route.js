import React, { Component } from 'react';
import RegisterLoginPage from './RegisterLoginPage';
import { createAppContainer } from 'react-navigation';
import ListOfGroups from './ListOfGroups';
import RootPage from './RootPage';
import { createStackNavigator } from 'react-navigation-stack';
import Tasks from './Tasks';
import ListOfPage from './ListsPage';
import ListOfSubjects from './ListOfSubjects';



const Stack = createStackNavigator(
    {
        Root: {
            screen: RootPage,
        },
        ListOfPage: {
            screen: ListOfPage
        },
        Tasks: {
            screen: Tasks
        }
        
        
    }, 
   
);

const AppContainer = createAppContainer(Stack);

export default class Route extends React.Component {
    render() {
        return <AppContainer/>;
    }
}


