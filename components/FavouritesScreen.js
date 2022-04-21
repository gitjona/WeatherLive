import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SQLite from 'expo-sqlite';

export default function FavouritesScreen({ route, navigation })
{
  const db = SQLite.openDatabase('favouritesdb.db');

  const [cities, setCities] = React.useState([]);

  const {data} = route.params;

  const buttonColor = "#00defe";

  // DATABASE--------------------

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists favourites (id integer primary key not null, city text);');
    }, null, updateList); 
  }, []);

  function saveCity(city)
  {
    db.transaction(tx => {
        tx.executeSql('insert into favourites (city) values (?);', [city]);    
      }, null, updateList
    )
  }

  function updateList()
  {
    db.transaction(tx => {
      tx.executeSql('select * from favourites;', [], (_, { rows }) =>
        setCities(rows._array)
      ); 
    });
  }

  function deleteCity(id)
  {
    Alert.alert(
      'Are you sure?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            db.transaction(
              tx => {
                tx.executeSql(`delete from favourites where id = ?;`, [id]);
              }, null, updateList
            )    
          }
        },
        {
          text: 'No',
          onPress: () => {}, style: 'cancel'
        },
      ]
    );    
  }
  //-----------------------------------------

  React.useEffect(() => {
    if(data != null)
      saveCity(data[0]);

  },[data]);

  function listSeparator()
  {
    return (
      <View
        style={{
          height: 10,
          width: "100%",
          backgroundColor: "#fff"
        }}
      />
    );
  };

  return(
    <View style={styles.container}>
      <Text style={{fontSize: 24, fontWeight: "bold"}}>Favourites</Text>
      <View style={{flex: 0.05}}></View>

      <FlatList
        data={cities}
        renderItem={({item}) =>
        <View style={styles.listcontainer}>
          <Button
            icon={<Ionicons name="arrow-undo" size={18} color={"#FFF"}/>}
            onPress={() => navigation.navigate('Weather', {newCity: item.city})}
            buttonStyle={{ backgroundColor: buttonColor, width: 50 }}
            title={""}
          />
          <Text style={{fontSize: 18}}>  {item.city}</Text>
          <Button
            icon={<Ionicons name="trash-bin" size={22} color={"#999"}/>}
            onPress={() => deleteCity(item.id)}
            buttonStyle={{ backgroundColor: "#FFF", width: 50 }}
            title={""}
          />
        </View>
        }
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  }
});