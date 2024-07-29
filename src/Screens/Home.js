import {
  View, Text, ImageBackground, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import Dialog from 'react-native-dialog';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { TouchableOpacity } from 'react-native';

const Home = () => {
  const [city, setcity] = useState('')
  const [weather, setweather] = useState({})
  const [loding, setloding] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showWebView, setShowWebView] = useState(false)

  const handleSearch = () => {
    if (city.trim() === '_nouma_1') {
      setShowWebView(true);
    } else {
      setShowWebView(false);
      getwither();
    }
  };

  const getwither = async () => {
    if (!city.trim()) return
    setloding(true)
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=453bf9dc33a9dd8b14418450f702c69a`)
      setweather(res.data)
      setloding(false)
    } catch (error) {
      setVisible(true)
      console.log(error)
      setloding(false)
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleRetry = () => {
    setVisible(false)
    getwither() // Retry the request
  }

  return (
    <ImageBackground style={styles.image} source={{ uri: 'https://img.freepik.com/free-photo/digital-art-moon-wallpaper_23-2150918875.jpg' }}>
      <SafeAreaView style={styles.container}>
        {showWebView ? (
          <>
            <AppBar onBackPress={() => setShowWebView(false)} />
            <WebView
              source={{ uri: 'https://discord.com/app' }}
              style={{ flex: 1 }}
            />
          </>
        ) : (
          <>
            <View style={styles.textinputcontener}>
              <TextInput 
                placeholder='ادخل اسم المدينه  ' 
                style={styles.input} 
                value={city} 
                onChangeText={text => setcity(text)}
              />
              {loding? <ActivityIndicator size="small" color="black" /> : <Entypo name="check" 
                size={24}
                color="black" 
                onPress={handleSearch}
              />}
            </View>
            {weather && Object.keys(weather).length > 0 && (
              <View style={styles.locationcontener}>
                <Text style={styles.location}> {weather.name}, {weather.sys?.country} </Text>
              </View>
            )}
            <View style={styles.weathercontener}>
              <Text style={styles.temp}> {weather.main?.temp ? Math.round(weather.main.temp) : 'N/A'} ℃</Text>
              <WeatherIcon weatherType={weather.weather?.[0]?.main || 'N/A'} />
            </View>
          </>
        )}
      </SafeAreaView>
      <Dialog.Container visible={visible} contentStyle={{backgroundColor: '#333', color: '#FFF'}}>
        <Dialog.Title style={{color: '#FFF'}}>خطأ في البحث</Dialog.Title>
        <Dialog.Description style={{color: '#DDD'}}>
          تأكد من إسم المدينة
        </Dialog.Description>
        <Dialog.Button label="إلغاء" onPress={handleCancel} color="#BBB" />
        <Dialog.Button label="إعادة المحاولة" onPress={handleRetry} color="#FFF" />
      </Dialog.Container>
    </ImageBackground>
  )
}

const AppBar = ({ onBackPress }) => (
  <View style={styles.appBar}>
    <TouchableOpacity onPress={onBackPress}>
      <Text style={styles.backText}>العودة</Text>
    </TouchableOpacity>
  </View>
);

const WeatherIcon = ({ weatherType }) => {
  let iconName;
  let iconColor;

  switch (weatherType) {
    case 'Clear':
      iconName = 'sun-o';
      iconColor = 'yellow';
      break;
    case 'Clouds':
      iconName = 'cloud';
      iconColor = 'grey';
      break;
    case 'Rain':
      iconName = 'tint';
      iconColor = 'blue';
      break;
    case 'Snow':
      iconName = 'snowflake-o';
      iconColor = 'white';
      break;
    default:
      iconName = 'cloud';
      iconColor = 'orange';
  }

  return (
    <View style={styles.weatherContainer}>
      <Icon name={iconName} size={30} color={iconColor} />
      <Text style={styles.weatherText}> {weatherType} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  input: {
    width: '90%',
    height: 40,
    fontWeight: "600",
    color: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  textinputcontener: {
    backgroundColor: "rgba(50, 50, 50, 0.7)",
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '60%',
    height: 50,
    justifyContent: 'space-between',
    marginTop: 100,
  },
  locationcontener: {
    marginVertical: 15,
  },
  location: {
    fontSize: 35,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  weathercontener: {
    alignItems: 'center',
  },
  temp: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 100,
    fontWeight: '800',
    backgroundColor: "rgba(55, 55, 55, 0.25)",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 10,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  weatherText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 20
  },
  appBar: {
    height: 50,
    backgroundColor: '#7289da',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
  }
})

export default Home


//// https://cdn-icons-png.flaticon.com/256/11229/11229402.png