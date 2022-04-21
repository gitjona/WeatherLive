import { StyleSheet, Image } from 'react-native';
import { NavigationContainer } from'@react-navigation/native';
import { createBottomTabNavigator } from'@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './components/HomeScreen';
import FavouritesScreen from './components/FavouritesScreen';

export default function App() {
  const Tab = createBottomTabNavigator();
  
  const color = "#00defe";
  const buttonColor = "#0fbbff";

  return (
    
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Weather')
              iconName='partly-sunny-outline'

            else if (route.name === 'Favourites')
              iconName='list-outline'

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: buttonColor,
          tabBarActiveBackgroundColor: color,
          tabBarStyle:{height: 40, borderTopColor: "#000", borderTopWidth: 3},
          headerTitle: () => (
            <Image
              style={{width:250, height:40}}
              source={require('./assets/logo.png')}
            />
          ),
          headerStyle:{backgroundColor: color, height: 80, borderBottomColor: "#000", borderBottomWidth: 3},
          headerTitleAlign: "center"
        })}
      >
        <Tab.Screen name="Weather" component={HomeScreen} initialParams={""}/>
        <Tab.Screen name="Favourites" component={FavouritesScreen} initialParams={""}/>
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
