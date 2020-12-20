import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import {Header, Input, Button, ListItem} from 'react-native-elements'
import {key} from './key'
import Clipboard from 'expo-clipboard';

import * as SQLite from 'expo-sqlite'
//Open database for keywords
const db = SQLite.openDatabase('db.keywords')
//Allowing permission to use clpbboard
Clipboard.getStringAsync();
export default function HomeScreen({navigation}) {
    //Setting up states - keyword and list that contains all keywords
    const [q, setQ] = useState('');
    const [history, setHistory] = useState([])
    //Creat database if that doesn't exist
    useEffect(() => {
        db.transaction(tx => {
          tx.executeSql('create table if not exists keywords (id integer primary key not null, q text);')
        })
        updateList();
      }, [])
      //Savig function - saves keywords to table and updates list
      const save = () => {
        
        db.transaction(tx => {
          tx.executeSql('insert into keywords (q) values (?);', [q])
        }, null, updateList
        )
        setQ('')
         }
         //Update function - is called when table is created, user adds data or removes something from db
         const updateList = () => {
            db.transaction(tx => {
              tx.executeSql('select * from keywords;', [], (_, {rows}) => 
              setHistory(rows._array)
              )
            })
             }
    //Removes item when remove button is pressed
             const removeItem = (id) => {
               db.transaction(tx => {
                 tx.executeSql(`delete from keywords where id = ?;`, [id]);
               }, null, updateList)
             }
            
    return(
      //Header  
      
        <View style={styles.main}>
          <Header 
    containerStyle= {{height: 55, backgroundColor: '#D5C1B9', marginBottom: 10}}
  centerComponent={{ text: 'CookbookApp', style: { color: '#fff', fontWeight: 'bold', fontSize: 20 } }}
  rightComponent={{ icon: 'book', color: '#fff' }}
/>

                <Image
        source={require('./recipe_img.jpg')}
        style={styles.img}
      />
            {/* */}
    
{/*Input elemets for keyword */}
<View style = {styles.search}>
<Input label= 'Search term'
                placeholder='banana'
            onChangeText={q => setQ(q)}
            value = {q}
labelStyle={{color: '#D5C1B9'}}
            />
{/*Save button */}

        <Button
        raised icon  ={{name  : 'save', color: '#fff'}}
         onPress={save}

          title="                      Save                             "
          buttonStyle ={{backgroundColor: '#D5C1B9'}}
/>
</View>
{/* Search history - Flatlist that contains list previous keywords - user can remove unnecessary keywprds from database */}
<Text style={styles.history}>Search History</Text>
 <FlatList
      keyExtractor={item => item.id.toString()}
        data = {history}
       
        renderItem={({item}) => 
    /* Saved keywords are returned as single listitems*/

     <ListItem bottomDivider  onPress={() => navigation.navigate("Recipes", {word: item.q})} onLongPress={() => removeItem(item.id)}>
         <ListItem.Content>
         <ListItem.Title style = {{color: '#914955'}}>{item.q}</ListItem.Title>
         <ListItem.Subtitle style={{color: '#212223'}}>Search recipes</ListItem.Subtitle>
      
         </ListItem.Content>
     </ListItem>
        }
       
        />
        </View>
      )
}

const styles = StyleSheet.create({
/*
COLORS!!!
#D5C1B9, #914955, #212223, #ADB3BC
*/
main: {
  backgroundColor: '#ADB3BC', 
  height: '100%',
  
},
search: {
  backgroundColor: '#fff',
  marginBottom: 10
},
history: {
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 10,
  color: '#914955'
},
img: {
  marginBottom: 10,
  height: 100,
  width: '100%'
}
 });
