import React, { useState,useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './customComp/HeaderComp';
import Todo from './customComp/TodoComp';
import Timeline from './customComp/Timeline/TimelineComp';
import Notes from './customComp/NotesComp';
import Calendar from "./customComp/Calendar/CalendarComp";
import { ScreenHeight, NavBtn, months_arr, days_arr} from './Common'

function time_and_date() { // function used to update time through out the app every 500ms
  let now = new Date();
  let hrs = now.getHours();
  let mins = now.getMinutes();
  let secs = now.getSeconds();
  let ampm = hrs >= 12 ? 'PM' : 'AM';

  hrs = hrs % 12;
  hrs = hrs ? hrs : 12; // the hour '0' should be '12'

  mins = mins < 10 ? '0' + mins : mins;
  return {
    secs,
    'NeedleObj':{
      'mins': now.getMinutes(),
      'hrs': now.getHours()
    },
    'CalendarObj':{
      'year': now.getFullYear(),
      'month': now.getMonth(),
      'date': now.getDate()
    },
    'HeaderObj':{
      'time': `${hrs}:${mins}:${secs < 10 ? '0' + secs : secs} ${ampm}`,
      'day': `${days_arr[now.getDay()]}, ${now.getDate()} ${months_arr[now.getMonth()]} ${now.getFullYear()}`
    }
  }
}

export default function App() {

  const [VisObj, setVisObj] = useState(() => {
    return ({
      'CurrentVis':1,
      'Todo': 1,
      'Calendar': 0,
      'Notes': 0,
    });
  });
  const [Timer, setTimer] = useState(()=>time_and_date());

  useEffect(() => {
    let secTimer = setInterval(() => {
      setTimer(time_and_date());
    }, 500)
    return () => { clearInterval(secTimer) };
  }, []);

  function toggleVis(){ // toggles visio of the tempObj

    let tempObj={...VisObj};
    let keys = Object.keys(tempObj);

    let activeind = (tempObj['CurrentVis'] + 1 == keys.length ? 1 : tempObj['CurrentVis']+1 )

    tempObj[keys[activeind]]=1;
    tempObj[keys[tempObj['CurrentVis']]]=0;
    tempObj['CurrentVis']=activeind;

    setVisObj(tempObj);

  }

  return (<View style={styles.body}>

    <View style={[styles.page,{zIndex:VisObj['Todo']+VisObj['Calendar']}]}>

      <Header timedateObj={Timer['HeaderObj']} show_date={VisObj['Calendar']==1?false:true}/>

      <View style={{flex:1,position:'relative'}}>

        <View style={{height:'100%',width:'100%',zIndex:VisObj['Todo'],position:'absolute',backgroundColor:'black'}}>

          <Todo/>
          <Timeline NeedleObj={Timer['NeedleObj']}/>
          <NavBtn icon="Todo" onPress={()=>{toggleVis()}}/>

        </View>

        <View style={{height:'100%',width:'100%',zIndex:VisObj['Calender'],position:'absolute',backgroundColor:'black'}}>
          <Calendar CalendarObj={Timer}/>
          <NavBtn icon="Calendar" onPress={()=>{toggleVis()}}/>
        </View>

      </View>

    </View>

    <View style={[styles.page,{zIndex:VisObj['Notes']}]}>

      <Notes />
      <NavBtn icon="Notes" onPress={() => { toggleVis() }} />

    </View>

  </View>);
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'gray',
    flex:1
  },
  page:{
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  fixed_btn: { 
    borderRadius: 10,
    height: ScreenHeight * 0.06,
    width: ScreenHeight * 0.06,
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    right: ScreenHeight * 0.02,
    bottom: ScreenHeight * 0.02,
    elevation:4
  }
});
