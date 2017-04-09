import Expo from 'expo';
import React from 'react';
import { ActivityIndicator, ListView, StyleSheet, Text, View } from 'react-native';

import { Constants } from 'expo';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyATgjF2vSNyKj8csUOOpS2B0fn5_COvE-g",
  authDomain: "vacations-29eb5.firebaseapp.com",
  databaseURL: "https://vacations-29eb5.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

class App extends React.Component {
  constructor(props) {
    super(props);

    // Row comparison function:
    const rowHasChanged = (r1, r2) => r1.id !== r2.id;

    // DataSource template object:
    const ds = new ListView.DataSource({rowHasChanged});

    this.state = {
      userVacationsRef: firebase.database().ref('user-vacations'),
      userVacations: ds,
      isLoading: true
    }

    this.state.userVacationsRef.on('value', snapshot => {
      const rawList = snapshot.val();

      let userVacations = [];

      for (let userKey in rawList) {
        if (rawList.hasOwnProperty(userKey)) {
          let userName;
          let dayRanges = [];
          let rawVacations = rawList[userKey];

          for (let vacationKey in rawVacations) {
            if (rawVacations.hasOwnProperty(vacationKey)) {
              if (!userName) {
                userName = rawList[userKey][vacationKey].employee
              }

              dayRanges.push(rawList[userKey][vacationKey].daysRange);
            }
          }

          userVacations.push({
            userName,
            dayRanges
          });
        }
      }

      this.setState({
        userVacations: ds.cloneWithRows(userVacations),
        isLoading: false
      });
    });
  }

  renderUser(user) {
    console.log(user.dayRanges);
    return (
      <View style={styles.userView}>
        <Text style={styles.userListItem}>
          {user.userName}:
        </Text>
        {user.dayRanges.sort().map(dayRange => {
          return (
            <Text style={styles.dayRange} key={dayRange}>
              {dayRange.replace('-', ' – ')}
            </Text>
          );
        })}
      </View>
    );
  }

  renderUsers() {
    return (
      <View style={styles.usersListContainer}>
        <Text style={styles.header}>График отпусков</Text>
        <ListView
          dataSource={this.state.userVacations}
          renderRow={this.renderUser}
        />
      </View>
    );
  }

  renderSpinner() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.isLoading ?
            this.renderSpinner() :
            this.renderUsers()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: Constants.statusBarHeight + 10
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  usersListContainer: {
    flex: 1
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  userView: {
    marginBottom: 16
  },
  userListItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  dayRange: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 12
  }
});

Expo.registerRootComponent(App);
