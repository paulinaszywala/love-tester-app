import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Modal, ScrollView} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate } from 'react-native-modern-datepicker';
import {  useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const today = new Date();
  const endDate = getFormatedDate(today.setDate(today.getDate()), 'YYYY/MM/DD');

  const [yourName, setYourName] = React.useState('');
  const [yourBirthdate, setYourBirthdate] = React.useState('Your Birthdate');
  const [yourLovesName, setYourLovesName] = React.useState('');
  const [yourLovesBirthdate, setYourLovesBirthdate] = React.useState(`Your Love's Birthdate`);
  const [openBirthdate, setOpenBirthdate] = useState(false);
  const [openLovesBirthdate, setOpenLovesBirthdate] = useState(false);
  const [dateBirthdate, setDateBirthdate] = useState(today);
  const [dateLovesBirthdate, setDateLovesBirthdate] = useState(today);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  function handleOnPressBirthdate() {
    setOpenBirthdate(!openBirthdate);
  }

  function handleYourNameChange(propText) {
    setYourName(propText);
  }

  function handleYourBirthdateChange(propDate) {
    setDateBirthdate(propDate);
    setYourBirthdate(propDate);
    setOpenBirthdate(false);
  }

  function handleOnPressLovesBirthdate() {
    setOpenLovesBirthdate(!openLovesBirthdate);
  }

  function handleYourLovesNameChange(propText) {
    setYourLovesName(propText);
  }

  function handleYourLovesBirthdateChange(propDate) {
    setDateLovesBirthdate(propDate);
    setYourLovesBirthdate(propDate);
    setOpenLovesBirthdate(false);
  }

  function getResultLevel(compatibilityPercentage) {
    if (compatibilityPercentage >= 0 && compatibilityPercentage <= 25) {
      return `Looks like the stars are playing hard to get. While opposites attract, this might be a bit too opposite. Don't worry, plenty of fish in the cosmic sea!`;
    } else if (compatibilityPercentage >= 26 && compatibilityPercentage <= 50) {
      return `Moderation is key, right? Your cosmic connection falls in the middle ground. There's potential for sparks, but a bit of stardust might be needed to ignite the flame.`;
    } else if (compatibilityPercentage >= 51 && compatibilityPercentage <= 75) {
      return `Now we're talking! Your cosmic compatibility is in the sweet spot. There's a good chance for a celestial connection. Keep the vibes alive and let the stars do their dance!`;
    } else if (compatibilityPercentage >= 76 && compatibilityPercentage <= 100) {
      return `Whoa, talk about a cosmic love story! Your compatibility is off the charts. The stars are aligning just for you two. Buckle up, it's gonna be a star-studded romance!`;
    }
  }
  

  function handleCalculate() {

    
    if (!yourName.trim() || yourBirthdate === 'Your Birthdate' || !yourLovesName.trim() || yourLovesBirthdate === `Your Love's Birthdate`) {
    alert('Please fill in all fields before calculating compatibility.');
    return;
  }

    const combinedStr1 = yourName + yourBirthdate;
    const combinedStr2 = yourLovesName + yourLovesBirthdate;

    const totalAscii1 = Array.from(combinedStr1).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const totalAscii2 = Array.from(combinedStr2).reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const totalAscii = totalAscii1 + totalAscii2;
    const compatibilityPercentage = totalAscii % 101;

    const message = getResultLevel(compatibilityPercentage);

    // Navigate to the "Result" screen and pass the compatibility result
    navigation.navigate('Result', { compatibilityPercentage, message, yourName, yourLovesName });
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>

        <Image style={styles.logo} source={require('./assets/love-tester-logo.png')} />

        <TextInput
          value={yourName}
          placeholder="Your Name"
          style={styles.inputName}
          onChangeText={handleYourNameChange}
        />

        <View style={styles.inputDateContainer}>
          <TouchableOpacity onPress={handleOnPressBirthdate}>
            <Text style={styles.inputDate}>{yourBirthdate}</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType='slide' transparent={true} visible={openBirthdate}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DatePicker
                mode='calendar'
                maximumDate='2099-12-31'
                selected={dateBirthdate}
                onDateChange={handleYourBirthdateChange}
              />
              <TouchableOpacity onPress={handleOnPressBirthdate}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TextInput
          value={yourLovesName}
          placeholder="Your Love's Name"
          style={styles.inputName}
          onChangeText={handleYourLovesNameChange}
        />

        <View style={styles.inputDateContainer}>
          <TouchableOpacity onPress={handleOnPressLovesBirthdate}>
            <Text style={styles.inputDate}>{yourLovesBirthdate}</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType='slide' transparent={true} visible={openLovesBirthdate}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DatePicker
                mode='calendar'
                maximumDate='2099-12-31'
                selected={dateLovesBirthdate}
                onDateChange={handleYourLovesBirthdateChange}
              />
              <TouchableOpacity onPress={handleOnPressLovesBirthdate}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => handleCalculate({ navigation })} style={styles.calculateButton}>
          <Text style={styles.calculateButtonText}>CALCULATE</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
  
}

function ResultScreen({ navigation, route }) {

  const { compatibilityPercentage, yourName, yourLovesName, message } = route.params;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  function handleTryAgain() {
    // Navigate back to the "Home" screen
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
       <Image style={styles.logo} source={require('./assets/love-tester-logo.png')} />
       
       <View style={styles.resultContainer}>
        <Text style={styles.resultText}>The compatibility between {yourName} & {yourLovesName} is...</Text>
        <Text style={styles.resultPercentage}>{compatibilityPercentage}%</Text>
        <Text style={styles.resultText}>{message}</Text>
        </View>

        <TouchableOpacity onPress={handleTryAgain} style={styles.tryAgainButton}>
          <Text style={styles.calculateButtonText}>TRY AGAIN</Text>
        </TouchableOpacity>

    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputName: {
    backgroundColor: '#fff',
    width: '70%',
    height: 48,
    borderRadius: 12,
    color: 'rgba(32, 29, 29, 0.75)',
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular'
  },
  inputDateContainer: {
    width: '70%',
    height: 48,
    marginBottom: 32,
  },
  inputDate: {
    backgroundColor: '#fff',
    width: '100%', // Set the width to 70%
    height: '100%',
    borderRadius: 12,
    color: 'rgba(32, 29, 29, 0.75)',
    paddingRight: 20,
    paddingLeft: 20,
    textAlignVertical: 'center', // Additional vertical alignment for Android
    fontFamily: 'Poppins_400Regular'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calculateButton: {
    backgroundColor: '#E45B3C',
    width: '50%',
    height: '8.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // This is for Android
  },
  calculateButtonText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Poppins_500Medium',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 16,
    marginTop: 16,
  },
  resultContainer:
  {
    backgroundColor: '#fff',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  resultText: {
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  resultPercentage: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 32,
    textAlign: 'center',
    color: '#E45B3C',
    marginBottom: 8,
    marginTop: 8,
  },
  tryAgainButton: {
    backgroundColor: '#201D1D',
    width: '50%',
    height: '8.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // This is for Android
  }
});
