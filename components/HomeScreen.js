import React from 'react';
import { StyleSheet, Text, Image, View, Alert, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';

export default function HomeScreen({ route, navigation })
{
  const [city, setCity]             = React.useState("");
  const [text, setText]             = React.useState();
  
  const [temp, setTemp]             = React.useState();
  const [main, setMain]             = React.useState();
  const [icon, setIcon]             = React.useState();
  const [feelsTemp, setFeelsTemp]   = React.useState();
  const [windSpeed, setWindSpeed]   = React.useState();

  const [data, setData]             = React.useState([]);

  const [lat, setLat]               = React.useState();
  const [lon, setLon]               = React.useState();

  const [location, setLocation]     = React.useState(null);

  const apiKey = "deb029c8ee1a0536a45f9c8cee5a631e";

  const color = "#00defe";
  const buttonColor = "#fff";

  const {newCity} = route.params;


  React.useEffect(() => {    
    setCity(newCity);
  },[newCity]);


  // Säätietojen haku ----
  function fetchData()
  {
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey)
    .then(response => response.json())
    .then(data => {
      setMain(data.weather[0].main);
      setTemp(data.main.temp);
      setIcon(data.weather[0].icon);
      setFeelsTemp(data.main.feels_like);
      setWindSpeed(data.wind.speed);
      setText(city);
    })
    .catch(err => {
      setText("City not valid");
      setMain("");
      setTemp("");
      setIcon("");
      setFeelsTemp("");
      setWindSpeed("");
      setCity("");
    })

    Keyboard.dismiss();
  }


  // Sijainnilla hakeminen ----
  function getLocation()
  {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted')
      {
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      setLat(location.coords.latitude);
      setLon(location.coords.longitude);

    })();

    fetch("http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon="+ lon +"&limit=5&appid=" + apiKey)
    .then(response => response.json())
    .then(data => {
      setCity(data[0].name)
      setText(city);
    })
    .catch(err => {
      setText("City not valid");
      setCity("");
    })

    fetchData();
  }

  // Suosikin tallennus ----
  function saveFavourites()
  {
    if(text == null)
      setData(["", ...data]);
    else
      setData([text, ...data]);
    
    navigation.navigate('Favourites', {data: [text, ...data]});
    setCity("");
  }
  
  // Käyttöliittymä ----
  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      enabled={true}
    >
      <Input
        placeholder='City' style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: "#000", borderWidth: 1 }}
        onChangeText={(city) => setCity(city)}
        value={city}
      />

    {/* BUTTON LOCATIONS */}
      <Header
        barStyle="dark-content"
        backgroundColor={color}
        centerComponent={
        <Button
          icon={<Ionicons name="partly-sunny" size={20} color={"#FFF"}/>}
          onPress={fetchData}
          buttonStyle={{ backgroundColor: color, borderBottomColor: buttonColor, borderBottomWidth: 2, width: 150 }}
          title={<Ionicons name="search" size={20} color={"#FFF"}/>}
        />}
        rightComponent={
        <Button
          icon={<Ionicons name="heart-outline" size={20} color={"#FFF"}/> }
          onPress={saveFavourites}
          buttonStyle={{ backgroundColor: color, borderBottomColor: buttonColor, borderBottomWidth: 2 }}
          title={<Ionicons name="list" size={20} color={"#FFF"}/>}
        />}
        leftComponent={
        <Button
          icon={<Ionicons name="earth" size={20} color={"#FFF"}/>}
          onPress={getLocation}
          buttonStyle={{ backgroundColor: color, borderBottomColor: buttonColor, borderBottomWidth: 2 }}
          title={<Ionicons name="location-sharp" size={20} color={"#FFF"}/>}
        />}
      />
      <View style={{flex: 0.1}}></View>
      

    {/* WEATHER DATA */}
      <Text style={{fontSize: 24, color: "#000", fontWeight: "bold"}}> {text} </Text>
      <Image
        style={{width:80, height:80}}
        source={{uri: "https://openweathermap.org/img/wn/" + icon + "@2x.png"}}
      />
      <Text style={{fontSize: 18, color: "#999"}}> {main} </Text>
      <Text style={{fontSize: 24, fontWeight: "bold" }}> {temp} °C </Text>
      <View style={{flex: 0.2}}></View>
      <Text style={{fontSize: 16, color: color  }}><Ionicons size={15} name='thermometer'/> Feels like: {feelsTemp} °C </Text>
      <Text style={{fontSize: 16, color: color }}><Ionicons size={15} name='leaf'/> Wind speed: {windSpeed} M/S </Text>
      
      <View style={{flex: 1}}></View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});