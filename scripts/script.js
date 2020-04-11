// Basic NativeUI Picker example v85
// by Luke Hurd :: @lukehurd

// WHAT HAS CHANGED FROM PREVIOUS VERSIONS//

// In order to load Textures, Materials, and Objects, we must 
// now use something in Javascript called "Promises". The basic
// concept is Spark AR now wants to make sure these assets are 
// available to the script to manipulate before executing any code.

// When loading assets, find() has been changed to findFirst() and findAll()

// Load the modules
const Scene = require('Scene');
const Materials = require('Materials');
const NativeUI = require('NativeUI');
const Textures = require('Textures');
export const Diagnostics = require('Diagnostics');

// First, we create a Promise and load all the assets we need for our scene
// The following example shows how to load Textures, Materials, and an Object.

Promise.all([
    // Loading Textures for the buttons
    Textures.findFirst('1_1'),        //0
    Textures.findFirst('1_2'),        //1
    Textures.findFirst('1_3'),        //2
    Textures.findFirst('1_back'),     //3 back button for 1st set of buttons

    Textures.findFirst('2_1'),        //4
    Textures.findFirst('2_2'),        //5
    Textures.findFirst('2_3'),        //6
    Textures.findFirst('2_back'),     //7 back button for 2nd set of buttons
    
    Textures.findFirst('3_1'),        //8
    Textures.findFirst('3_2'),        //9
    Textures.findFirst('3_3'),        //10
    Textures.findFirst('3_back'),     //11 back button for 3rd set of buttons

    Textures.findFirst('main_null'),     //12 null button for main buttons

    //Loading Materials
    Materials.findFirst('mat_1_1'),   //13
    Materials.findFirst('mat_1_2'),   //14
    Materials.findFirst('mat_1_3'),   //15
  
    Materials.findFirst('mat_2_1'),   //16
    Materials.findFirst('mat_2_2'),   //17
    Materials.findFirst('mat_2_3'),   //18

    Materials.findFirst('mat_3_1'),   //19
    Materials.findFirst('mat_3_2'),   //20
    Materials.findFirst('mat_3_3'),   //21

    //load planes
    Scene.root.findFirst('plane0'),  //22
    Scene.root.findFirst('plane1'),  //23
    Scene.root.findFirst('plane2'),  //24

]).then(function(results){

    let plane = []
    plane.push('none');
    plane.push(results[22]);
    plane.push(results[23]);
    plane.push(results[24]);

    //First we set the configuration for the default set of UI buttons, which is the one you first see when filter launch
    const configuration_main = {

      selectedIndex: 0, //Make default selected buttons to be 0, which will be the null button

      items: [
        {image_texture: results[12]}, //null button
        {image_texture: results[0]},  //number 1 from 1st set of buttons
        {image_texture: results[5]},  //number 2 from 2nd set of buttons
        {image_texture: results[10]}   //number 3 from 3rd set of buttons
      ]
    };

    //Now add different configurations for each set of buttons 

    let config = []  //Declare empty array

    config.push("None"); //First button will be the null button, so we just add a random text which we won't use

    //1st set of buttons
    config.push({

        selectedIndex: 2, //select default to be 2, because 0 is the back button
  
        items: [
          {image_texture: results[3]}, //back button
          {image_texture: results[0]}, //number 1
          {image_texture: results[1]}, //number 2
          {image_texture: results[2]}, //number 3
        ], 

        mats: [
          {material: results[13]},  //material for 1st set button 1
          {material: results[14]},  //material for 1st set button 2
          {material: results[15]}   //material for 1st set button 3
        ]
      })

    //2nd set of buttons  
    config.push({

        selectedIndex: 1, //select default to be 1, because 0 is the back button
  
        items: [
          {image_texture: results[7]}, //back button
          {image_texture: results[4]}, //number 1
          {image_texture: results[5]}, //number 2
          {image_texture: results[6]}, //number 3
        ], 

        mats: [
          {material: results[16]},  //material for 2nd set button 1
          {material: results[17]},  //material for 2nd set button 2
          {material: results[18]}   //material for 2nd set button 3
        ]
      })

      //3rd set of buttons
      config.push({

        selectedIndex: 1, //select default to be 1, because 0 is the back button
  
        items: [
          {image_texture: results[11]}, //back button
          {image_texture: results[8]},  //number 1
          {image_texture: results[9]},  //number 2
          {image_texture: results[10]}, //number 3
        ], 

        mats: [
          {material: results[19]},   //material for 3rd set button 1
          {material: results[20]},   //material for 3rd set button 2
          {material: results[21]}    //material for 3rd set button 3
        ]
      })


    // Create the NativeUI Picker
    const picker = NativeUI.picker;

    // Load the default configuration at launch
    picker.configure(configuration_main);

    // Show the NativeUI Picker
    picker.visible = true;

    
    //set a counter as 0 so we know which level of buttons the users are at.
    //when count = 0, it means users are at the default UI buttons
    //When count = 1 , it means users are at 1st set of button so on & so forth
    let count = 0;  

    //This function determine which level of buttons users are at
    function setconfig(val){
      if (count == 0){  //if count = 0, we will call function to load to respective chosen set of buttons
        subconfig(val); //call function to load different set of buttons
        count = val;    //set count to button chosen so we know which level user went to
      }
      else{
        count = maincontrol(val); //if count is not 0, user is not in first default level, so we go into main control function
      }
   }

    //Function to load to different set of buttons
    function subconfig(val){
        picker.configure(config[val]);
    }

    //This is the main function to write what how you want the UI buttons to change things in your filter
    function maincontrol(val){
      //if val == 0, it means back button is selected, hence change configuration back to default configuration
        if (val==0){
            picker.configure(configuration_main);
            return 0; //return 0 to count so we know users has gone back to default level
        }
        //if back button not selected, the following will happen
        else{
            //Assign material to the 3 planes according to which level of buttons users are at using count to determine
            plane[1].material = config[count].mats[0].material;
            plane[2].material = config[count].mats[1].material;
            plane[3].material = config[count].mats[2].material;

            //toggle visibility according to button selected
            for(let i=1 ; i<plane.length ; i++){
              if(i == val){
                plane[i].hidden = false;
              }
              else{
                plane[i].hidden = true;
              }
            }

            //return count
            return count;
          };
        };

    // Finally, we monitor which button is chosen by the users here
    picker.selectedIndex.monitor().subscribe(function(val) {
        //calls the 1st function we created just now
        setconfig(val.newValue);
        });

});
