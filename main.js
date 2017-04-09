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
      usersRef: firebase.database().ref('users'),
      users: ds,
      isLoading: true
    }

    this.state.usersRef.on('value', snapshot => {
      const rawList = snapshot.val();
      const result = [];

      for (let key in rawList) {
        if (rawList.hasOwnProperty(key)) {
          result.push({
            id: key,
            name: rawList[key].username
          });
        }
      }

      this.setState({
        users: ds.cloneWithRows(result),
        isLoading: false
      });
    });
  }

  renderUser(user) {
    return (
      <Text style={styles.userListItem}>
        {user.name}
      </Text>
    );
  }

  renderUsers() {
    return (
      <View style={styles.usersListContainer}>
        <Text style={styles.header}>Users:</Text>
        <ListView
          dataSource={this.state.users}
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
    fontSize: 20,
    marginBottom: 8
  },
  userListItem: {
    fontSize: 16,
    height: 24
  }
});

Expo.registerRootComponent(App);
