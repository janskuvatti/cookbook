import React, {useState, useCallback, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Linking, ToastAndroid } from 'react-native';
import {key} from './key'
import {Header, Button} from 'react-native-elements'
import Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import * as Permissions from'expo-permissions';
import{ Camera} from'expo-camera';
const url = `r.recipe.url`
const imgurl = `r.recipe.image`

const OpenURLButton = ({ url}) => {
  //When user opens recipe url url is copied to clippboard
  Clipboard.setString(url)
  const handlePress = useCallback(async () => {
//Check if link is correct -> Otherwise show error alert
    const supported = await Linking.canOpenURL(url);

    if (supported) {
  //Open url
      await Linking.openURL(url);
      //Open Toast when opening url
      ToastAndroid.showWithGravity(
        'Openining recipe url',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title="                   Show recipe                      " onPress={handlePress}           buttonStyle ={{backgroundColor: '#D5C1B9'}}  />;
};
export default function RecipeScreen({navigation, route}) {
   //set up state for search results
   const [recipes, setRecipe]= useState([])
   const [fileInfo, setFileInfo] = useState(null);

  //Creating useffect function call to fetch recipes
  useEffect (() => {
     
      fetchRecipes()
  }, [])
  //Get searchterm from HomeScreen component
  const {word}= route.params
  console.log(word)
 
  //Search function
  const fetchRecipes = async () => {
     const response = await fetch('https://api.edamam.com/search?q= ' + word + '&app_id=fc2b9956&app_key=' + key)
     const data = await response.json();
     console.log(data.hits);
     setRecipe(data.hits);

  }
const test = async (link) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    //store the cached file
          const file = await FileSystem.downloadAsync(
            link,
            FileSystem.documentDirectory + "filename.jpg"
          );
    
    //save the image in the galery using the link of the cached file
          const assetLink = await MediaLibrary.createAssetAsync(file.uri);
          console.log(file, assetLink);
        }
}

  //console.log(recipes)

     return(
      <ScrollView style={styles.main}>
                 <Header 
    containerStyle= {{height: 55, backgroundColor: '#D5C1B9', marginBottom: 10}}
  centerComponent={{ text: 'Recipes', style: { color: '#fff', fontWeight: 'bold', fontSize: 20 } }}
  rightComponent={{ icon: 'book', color: '#fff' }}
/>
{/*Map through recipes return them */}
{recipes.map((r, index) => (
         <View style={styles.desc} key={r.recipe.label}>
             <Text style={styles.head}>{r.recipe.label}</Text>
             <Image source={{ uri: r.recipe.image }} style={styles.recipe}
            />

             <Text style={styles.head}>Ingredients</Text>

    {r.recipe.ingredients.map(ingredient => (
        <Text>{ingredient.text}</Text>
        
    ))}
    {/*Button to open recipe url, giving right url as props */}
        <OpenURLButton url={r.recipe.url} />
        <Button onLongPress={() => test(r.recipe.image)} title='             Download recipe image        '  buttonStyle ={{backgroundColor: '#D5C1B9', marginTop: 10}}/>
    </View>
))}
      </ScrollView>
    )
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#ADB3BC', 
    height: '100%',
    
  },
  recipe:  {
  
    width: 100,
    height: 100,
    borderRadius: 100 / 2,

  },
  desc: {
    backgroundColor: '#fff',
     marginBottom: 20,
      alignItems: 'center'
    },
    head: {
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: '#914955'
    },
  });
  