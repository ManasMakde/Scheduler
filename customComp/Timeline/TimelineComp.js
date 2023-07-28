import React, { useRef, useState,useEffect} from 'react';
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet,TouchableOpacity, TouchableHighlight,Keyboard } from 'react-native';
import Needle from './NeedleComp';
import Timebar from './TimebarComp';
import {CurrentTask} from './CurrentTaskComp'
import { ColorPicker, ScrollSelector,TickBtn,TrashBtn,CloseBtn, ScreenHeight, ScreenWidth, timelineBarWidth, timelinetaskWrapperHeight, timelineTimeHeight, Styles, NeedleWidth, setItem, getItem, colorWheel } from '../../Common';

const timelineTimeWidth = ScreenWidth / 2;

const Hr_DATA = [{ key: 0, title: '' }];
((val = 13) => {
  for (let i = 1; i < val; i++)
    Hr_DATA.push({ key: i, title: i });
  Hr_DATA.push({ key: val + 1, title: '' });
})();

const Min_DATA = [{ key: 0, title: '' }];
((val = 60) => {
  for (let i = 0; i < val; i++)
    Min_DATA.push({ key: i + 1, title: (i < 10 ? '0' : '') + i });
  Min_DATA.push({ key: val + 1, title: '' });
})();

const Am_pm_DATA=[{ key: 0, title: '' }, { key: 1, title: 'am' }, { key: 2, title: 'pm' }, { key: 3, title: '' }];


const SelectedTaskComp=React.memo(React.forwardRef(({SelectedTaskVis,setSelectedTaskVis,taskList,setTaskList},SelectedTaskRef)=>{

  function delTask() {
    let temp = [...taskList];
    temp[SelectedTaskRef.current[0]].splice(SelectedTaskRef.current[1], 1);
    if (temp[SelectedTaskRef.current[0]].length == 0)
      temp.splice(SelectedTaskRef.current[0], 1);

    setTaskList(temp);
    setItem('tasks', JSON.stringify(temp));
  }

  function resave(){
    let temp = [...taskList];

    if (EditEventHead.current == taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['heading'] && 
        EditEventBody.current==taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['body']&&
        ColorRef.current==taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['newcolor']
    )
    return;

    temp[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['heading']=EditEventHead.current ;
    temp[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['body']=EditEventBody.current;
    temp[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['newcolor']=ColorRef.current;

    setTaskList(temp);
    setItem('tasks', JSON.stringify(temp));
  }

  const EditEventHead = useRef();
  const EditEventBody = useRef();
  const ColorRef = useRef();

  useEffect(()=>{
    try{
    EditEventHead.current=taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['heading'];
    EditEventBody.current=taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['body'];
    ColorRef.current=taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['newcolor'];
    }catch{}
  });

  return (<>{SelectedTaskVis && (<View style={Styles.popup}>
    <View style={{ height: '90%', backgroundColor: '#525252', width: '90%', alignSelf: 'center' }}>

      <ColorPicker initalColor={taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['newcolor']} ref={ColorRef}>
        <TrashBtn onPress={() => { delTask(); setSelectedTaskVis(false); Keyboard.dismiss(); }} />
        <Text style={{ color: 'white', textAlignVertical:'center' }} pointerEvents="none">{`${taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['from']['dis']} - ${taskList[SelectedTaskRef.current[0]][SelectedTaskRef.current[1]]['to']['dis']}`}</Text>
        <TickBtn onPress={() => { resave(); setSelectedTaskVis(false); Keyboard.dismiss(); }} />
      </ColorPicker>

      <TextInput style={styles.selected_input_heading}
        underlineColorAndroid="transparent"
        placeholder="Heading"
        placeholderTextColor="grey"
        onChangeText={(val) => { EditEventHead.current = val }}
        defaultValue={EditEventHead.current}
      />

      <TextInput style={[styles.selected_input, { flex: 1 }]}
        underlineColorAndroid="transparent"
        placeholder="Add Event"
        placeholderTextColor="grey"
        numberOfLines={10}
        multiline={true}
        onChangeText={(val) => { EditEventBody.current = val }}
        defaultValue={EditEventBody.current}
      />

    </View>
  </View>)}</>);

}));

const NewTaskComp=React.memo(({NewtaskVis,setNewtaskVis,taskList,setTaskList})=>{

  //console.log('Rendered NewTaskComp');

  const NewtaskHead = useRef('');
  const NewtaskBody = useRef('');

  const FromHrRef = useRef(2);
  const FromMinRef = useRef(30);
  const FromAmPmRef = useRef(1);

  const ToHrRef = useRef(4);
  const ToMinRef = useRef(15);
  const ToAmPmRef = useRef(1);

  const [NewColor, setNewcolor] = useState(() => colorWheel[0]);

  function calCenterWidth(taskobj) {
    let left = (taskobj['from']['hr'] + taskobj['from']['min'] / 60);
    let right = (taskobj['to']['hr'] + taskobj['to']['min'] / 60);

    return { 'center': (left + right) / 2, 'width': Math.abs(left - right) }
  }

  async function createNewTask() {

   // console.log('NewTask Data:',FromHrRef.current+1,FromMinRef.current,FromAmPmRef.current,ToHrRef.current+1,ToMinRef.current,ToAmPmRef.current);

    let temp_FromHr = FromHrRef.current + 1;
    let temp_ToHr = ToHrRef.current + 1;

    let temp_FromAmPm = (FromAmPmRef.current == 0 ? 'am' : 'pm');
    let temp_ToAmPm = (ToAmPmRef.current == 0 ? 'am' : 'pm');

    let tempFrom = {
      'hr': temp_FromHr + (temp_FromAmPm == 'pm' ? (temp_FromHr != 12 ? 12 : 0) : (temp_FromHr == 12 ? -12 : 0)),
      'min': FromMinRef.current,
      'ampm': temp_FromAmPm
    };
    let tempTo = {
      'hr': temp_ToHr + (temp_ToAmPm == 'pm' ? (temp_ToHr != 12 ? 12 : 0) : (temp_ToHr == 12 ? -12 : 0)),
      'min': ToMinRef.current,
      'ampm': temp_ToAmPm
    };

    let taskobj = { 'heading': NewtaskHead.current, 'body': NewtaskBody.current, 'newcolor': NewColor }
    if (tempFrom['hr'] * 60 + tempFrom['min'] < tempTo['hr'] * 60 + tempTo['min']) {
      taskobj['from'] = tempFrom;
      taskobj['to'] = tempTo;

    }
    else {
      taskobj['to'] = tempFrom;
      taskobj['from'] = tempTo;
    }

    taskobj['from']['24hr'] = `${(taskobj['from']['hr'] < 10 ? '0' : '')}${(taskobj['from']['hr'])}:${(taskobj['from']['min'] < 10 ? '0' : '')}${(taskobj['from']['min'])}:00`;
    taskobj['to']['24hr'] = `${(taskobj['to']['hr'] < 10 ? '0' : '')}${(taskobj['to']['hr'])}:${(taskobj['to']['min'] < 10 ? '0' : '')}${(taskobj['to']['min'])}:00`;

    taskobj['from']['posLeft'] = (taskobj['from']['hr'] + taskobj['from']['min'] / 60) * styles.timeline_time.width;
    taskobj['to']['posRight'] = (24 - taskobj['to']['hr'] - taskobj['to']['min'] / 60) * styles.timeline_time.width;
    taskobj['to']['posleft'] = (taskobj['to']['hr'] + taskobj['to']['min'] / 60) * styles.timeline_time.width;


    taskobj['from']['dis'] = `${taskobj['from']['hr'] == 12 ? taskobj['from']['hr'] : (taskobj['from']['hr'] == 0 ? 12 : taskobj['from']['hr'] % 12)}:${(taskobj['from']['min'] < 10 ? '0' : '')}${taskobj['from']['min']} ${taskobj['from']['ampm']}`;
    taskobj['to']['dis'] = `${taskobj['to']['hr'] == 12 ? taskobj['to']['hr'] : (taskobj['to']['hr'] == 0 ? 12 : taskobj['to']['hr'] % 12)}:${(taskobj['to']['min'] < 10 ? '0' : '')}${taskobj['to']['min']} ${taskobj['to']['ampm']}`;

    let index = 0;
    let tempCW1 = calCenterWidth(taskobj);

    for (let i = 0; index < taskList.length && i == 0; index += (i == 0 ? 1 : 0))
      for (let j = 0; j <= taskList[index].length; j++) {

        if (j == taskList[index].length) { i++; break; }

        let tempCW2 = calCenterWidth(taskList[index][j]);

        if (Math.abs(tempCW1['center'] - tempCW2['center']) < tempCW1['width'] / 2 + tempCW2['width'] / 2)//does it overlap?
          break;

      }
    let temp = [...taskList];
    if (temp[index] == undefined)
      temp[index] = [];
    temp[index].push(taskobj);

    setTaskList(temp);
    await setItem('tasks', JSON.stringify(temp));

  }

  function changeColor() {
    let ind = colorWheel.indexOf(NewColor);
    setNewcolor(ind == colorWheel.length - 1 ? colorWheel[0] : colorWheel[ind + 1]);
  }
  
  return (<>{NewtaskVis && (<View style={Styles.popup}>
    <View style={styles.newtask_wrapper}>

      <Pressable style={{ width: '100%', marginBottom: '4%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: NewColor }} onPress={() => { changeColor() }}>

        <TickBtn CustomStyle={{alignSelf: 'flex-end'}} onPress={async () => { await createNewTask(); setNewtaskVis(false); }} />

        <CloseBtn onPress={() => { setNewtaskVis(false); }} />

      </Pressable>

      <TextInput style={styles.newtask_input_heading}
        underlineColorAndroid="transparent"
        placeholder="Heading"
        placeholderTextColor="grey"
        autoFocus={true}
        onChangeText={(val) => { NewtaskHead.current = val }}
      />

      <TextInput style={styles.newtask_input}
        underlineColorAndroid="transparent"
        placeholder="Add Task"
        placeholderTextColor="grey"
        numberOfLines={10}
        multiline={true}
        onChangeText={(val) => { NewtaskBody.current = val }}
      />

      <View style={{ flexDirection: 'row', marginBottom: '5%' }}>
        <Text style={{ flex: 1, textAlign: 'center', color: 'gray' }}>From</Text>
        <Text style={{ flex: 1, textAlign: 'center', color: 'gray' }}>To</Text>

      </View>

      <View style={[styles.newtask_select_time_superwrapper, { marginBottom: '5%' }]}>

        <View style={styles.Scroll_wrapper}>
          <ScrollSelector Data={Hr_DATA} initialScrollIndex={FromHrRef.current} ref={{ CustomRef:FromHrRef }} TxtStyle={{ fontSize: 15 }} BarStyle={{ borderWidth: 3.5 }} CustomStyle={styles.Scroll_item} />
          <Text style={styles.Scroll_gap}>:</Text>
          <ScrollSelector Data={Min_DATA} initialScrollIndex={FromMinRef.current} ref={{ CustomRef: FromMinRef }} TxtStyle={{ fontSize: 15 }} BarStyle={{ borderWidth: 3.5 }} CustomStyle={styles.Scroll_item} />
          <View style={{ width: '5%' }}></View>
          <ScrollSelector Data={Am_pm_DATA} initialScrollIndex={FromAmPmRef.current} ref={{ CustomRef: FromAmPmRef}} TxtStyle={{ fontSize: 15 }} BarStyle={{ borderWidth: 3.5 }} CustomStyle={styles.Scroll_item} />
        </View>

        <View style={styles.Scroll_wrapper}>
          <ScrollSelector Data={Hr_DATA} initialScrollIndex={ToHrRef.current} ref={{CustomRef:ToHrRef}} TxtStyle={{ fontSize: 15 }} BarStyle={{ borderWidth: 3.5 }} CustomStyle={styles.Scroll_item} />
          <Text style={styles.Scroll_gap}>:</Text>
          <ScrollSelector Data={Min_DATA} initialScrollIndex={ToMinRef.current} ref={{CustomRef:ToMinRef}} TxtStyle={{ fontSize: 15 }} BarStyle={{ borderWidth: 3.5 }} CustomStyle={styles.Scroll_item} />
          <View style={{ width: '5%' }}></View>
          <ScrollSelector Data={Am_pm_DATA} initialScrollIndex={ToAmPmRef.current} ref={{CustomRef:ToAmPmRef}} TxtStyle={{ fontSize: 15 }} BarStyle={{ borderWidth: 3.5 }} CustomStyle={styles.Scroll_item} />

        </View>

      </View>

    </View>
  </View>)}</>)
});

const MainComp = React.memo(React.forwardRef(({ NeedleObj, setNewtaskVis, setSelectedTaskVis,taskList,setTaskList},{timelineScrollRef,SelectedTaskRef})=>{
  //console.log('Rendered MainComp');
  

  const taskScrollRef = useRef();

  useEffect(() => {

    needle_pos(false);
    getTasks().then((Text) => { setTaskList(Text); });

  }, []);

  function needle_pos(toAnimate = true) {
    timelineScrollRef.current.scrollTo({ x: ((NeedleObj['hrs'] + NeedleObj['mins'] / 60) / 24 * (styles.timeline_time.width * 24) + styles.timeline_time.width / 2 - NeedleWidth / 2), animated: toAnimate, });
    taskScrollRef.current.scrollTo({ y: 0, animated: toAnimate });
  }

  async function getTasks() {
    let value;
    try {
      value = JSON.parse(await getItem('tasks'));
      if (value == null)
        throw 'value null';
    }
    catch (e) {
      value = [];
      await setItem('tasks', JSON.stringify(value));

    }
    return value;
  }

  return (<Pressable>
    <TouchableHighlight onPress={() => needle_pos()} onLongPress={() => { setNewtaskVis(true); }} delayLongPress={150} style={{ flexDirection: 'row', flexWrap: 'wrap' }} underlayColor="#1c1c1c" pointerEvents="none">
      <>
        <View>
          <Text style={styles.timeline_time}>12:00 am</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>


            <View style={{height:timelineTimeHeight}}>
              <View style={[Styles.timeline_bar_top,{borderRightWidth: timelineBarWidth}]}></View>
              <View style={[Styles.timeline_bar_bottom,{borderBottomWidth:0}]}></View>
            </View>

            <View style={{height:timelineTimeHeight}}>
              <View style={Styles.timeline_bar_top}></View>
              <View style={Styles.timeline_bar_bottom}></View>
            </View>

          </View>
        </View>

        <Timebar/>

        <View>
          <Text style={styles.timeline_time}>12:00 am</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>


            <View style={{height:timelineTimeHeight}}>
              <View style={[Styles.timeline_bar_top,{borderRightWidth: timelineBarWidth}]}></View>
              <View style={Styles.timeline_bar_bottom}></View>
            </View>

            <View style={{height:timelineTimeHeight}}>
              <View style={Styles.timeline_bar_top}></View>
              <View style={[Styles.timeline_bar_bottom,{borderBottomWidth:0,borderRightWidth:0}]}></View>
            </View>

          </View>
        </View>
      </>
    </TouchableHighlight>

    <Pressable>
      <View style={styles.timeline_task_wrapper}>
        <Text style={styles.yesterday}>Yesterday</Text>
        <Text style={styles.tomorrow}>Tomorrow</Text>


        <ScrollView ref={taskScrollRef} style={styles.tasklist_wrapper}>
          <Pressable>
            {
              taskList.map((element, index) => {
                return (
                  <View key={index} style={styles.taskrow}>
                    {
                      element.map((el, ind) => {
                        return (
                          <TouchableOpacity onPress={() => { SelectedTaskRef.current[0] =index;SelectedTaskRef.current[1]= ind;setSelectedTaskVis(true); }} key={ind} activeOpacity={0.7} style={[styles.task_item, {backgroundColor:el['newcolor'], left: taskList[index][ind]['from']['posLeft'] + timelineBarWidth/2, right: taskList[index][ind]['to']['posRight'] + timelineBarWidth/2 }]}>
                            <Text numberOfLines={1} style={{color:'white'}}>{(el['heading'] == '' ? 'Untitled' : el['heading'])}</Text>
                          </TouchableOpacity>
                        )

                      })
                    }
                  </View>
                )
              })
            }
          </Pressable>
        </ScrollView>


      </View>
    </Pressable>

  </Pressable>);

}));

const Timeline=React.memo(({NeedleObj})=>{
  
  const [NewtaskVis, setNewtaskVis] = useState(() => false);
  const [SelectedTaskVis, setSelectedTaskVis] = useState(() => false);

  const [taskList, setTaskList] = useState(() => []);
  const SelectedTaskRef = useRef([]);

  const timelineScrollRef = useRef();

  return(<>

    <SelectedTaskComp SelectedTaskVis={SelectedTaskVis} setSelectedTaskVis={setSelectedTaskVis} setTaskList={setTaskList} taskList={taskList} ref={SelectedTaskRef}/>
    <NewTaskComp NewtaskVis={NewtaskVis} setNewtaskVis={setNewtaskVis} taskList={taskList} setTaskList={setTaskList} />

    <View style={styles.timeline_wrapper}>
      <ScrollView ref={timelineScrollRef} horizontal={true} showsHorizontalScrollIndicator={false} style={styles.timeline_scroll}>

        <Needle NeedleObj={NeedleObj} />

        <MainComp ref={{timelineScrollRef,SelectedTaskRef}} NeedleObj={NeedleObj} setNewtaskVis={setNewtaskVis} setSelectedTaskVis={setSelectedTaskVis} taskList={taskList} setTaskList={setTaskList}/>

      </ScrollView>
    </View>

    <CurrentTask TList={taskList} NewtaskVis={NewtaskVis} />

  </>);

},(prevProp,newProp)=>{
  if (prevProp['NeedleObj']['mins'] == newProp['NeedleObj']['mins'])
  return true;

  return false;
});

const styles = StyleSheet.create({

  newtask_wrapper: {
    height:'90%',
    width:'90%',
    backgroundColor: '#525252',
    alignSelf:'center',
    overflow:'hidden'
  },
  newtask_input_heading: {
    minHeight: ScreenHeight * 0.055,
    backgroundColor: '#2b2b2b',
    width: '100%',
    alignSelf: 'center',
    marginBottom: '4%',
    paddingHorizontal: '4%',
    color:'white'

  },
  newtask_input: {
    backgroundColor: '#2b2b2b',
    textAlignVertical: 'top',
    paddingHorizontal: '4%',
    marginBottom:'5%',
    width: '100%',
    height: '46%',
    alignSelf: 'center',
    color: 'white'
  },
  newtask_select_time_superwrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'

  },
  Scroll_wrapper:{
    width:'50%',
    flexDirection:'row',
    justifyContent:'center'
  },
  Scroll_item: { 
    height: ScreenHeight * 0.045,
    width: '25%'
  },
  Scroll_gap: { 
    marginHorizontal: '2%',
    fontSize: 25,
    color: 'white',
    textAlignVertical:'center',
    lineHeight:25
  },

  newtask_select_time: {
    backgroundColor: '#2b2b2b',
    alignItems: 'center',
    marginTop: '20%',
    marginBottom: '20%',
  },
  newtask_select_time_txt:{
    fontWeight: 'bold',
    color:'white',
    fontSize: 20,
    lineHeight: 30,
  },

  selected_input_heading: {
    minHeight: ScreenHeight * 0.055,
    backgroundColor: '#2b2b2b',
    width: '100%',
    alignSelf: 'center',
    marginBottom: '4%',
    paddingHorizontal: '4%',
    color: 'white'

  },
  selected_input: {
    backgroundColor: '#2b2b2b',
    textAlignVertical: 'top',
    paddingHorizontal: '4%',
    marginBottom: '5%',
    width: '100%',
    height: '46%',
    alignSelf: 'center',
    color: 'white'
  },

  timeline_wrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor:'black'
  },
  timeline_scroll: {
        width: '100%',
  },
  timeline_time: {
    width: timelineTimeWidth,
    textAlign: 'center',
    paddingVertical: ScreenHeight * 0.01,
    color:'white'
  },
  timeline_task_wrapper: {
    backgroundColor: 'yellow',
    height: timelinetaskWrapperHeight,
    width: '100%',
    flexDirection: 'row',
  },

  yesterday: {
    width: timelineTimeWidth / 2 - timelineBarWidth/2,
    height: timelinetaskWrapperHeight,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#f06900',
    color:'white'
  },
  tomorrow: {
    width: timelineTimeWidth / 2 - timelineBarWidth / 2,
    height: timelinetaskWrapperHeight,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#f06900',
    position: 'absolute',
    right: 0,
    color: 'white'
  },

  tasklist_wrapper: {
    right: timelineTimeWidth / 2 - timelineBarWidth,
    left: timelineTimeWidth / 2 - timelineBarWidth,
    position: 'absolute',
    height: timelinetaskWrapperHeight,
    backgroundColor: '#5c5c5c',
    zIndex:-1
  },
  taskrow: {
    height: timelinetaskWrapperHeight / 2.6,
    width: '100%',
    backgroundColor: '#404040',
    borderWidth: 1
  },
  task_item: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    position: 'absolute',
    backgroundColor: 'orange',
    flex: 1,
    height: '100%',
    justifyContent:'center',
    paddingLeft:'2%',
    overflow:'hidden'
  }
});

module.exports=Timeline;