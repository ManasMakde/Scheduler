import React, {useEffect, useRef, useState} from 'react';
import CurrentEventComp from './CurrentEvent';
import EditEventComp from './EditEvent';
import { StyleSheet, View, Text, TouchableHighlight,Pressable,TextInput, Keyboard} from 'react-native';

import { Month_DATA,Options_DATA, days_arr, months_arr, RightBtn, LeftBtn, daysInMonth, dayOnDate, Styles, CloseBtn, ReverseBtn, ScrollSelector, TickBtn, colorWheel, ScreenHeight, FlawedFlatSelector,setItem, getItem} from '../../Common'

const BORDERWIDTH = 2;
const Year_DATA = [{ key: 0, title: '' }];

let CalObj = {};
const CalDays = days_arr.map((el, index) => {
    //console.log('Rendered CalDays');
    return (<View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>{el}</Text></View>);
});

function setBorderBack(JailKeeper,Selected) {
    JailKeeper.current['Cellstates'][Selected.date]['ref'].current.setNativeProps({ style: { borderWidth: 0 } });
    JailKeeper.current['Cellstates'][1]['ref'].current.setNativeProps({ style: { borderWidth: 2 } });
}

const SelYearComp=React.memo(React.forwardRef(({Selected,setSelected,YearVis,setYearVis},JailKeeper)=>{
    //console.log('Rendered SelYearCal');

    const MonthRef=useRef();
    const YearRef=useRef();

    const TempMonthRef = useRef(Selected.month);
    const TempYearRef = useRef(Selected.year-2000);

    function close() {
        //console.log('Closing with Year & month index:',TempYearRef.current,Selected.year-2000,TempYearRef.current != Selected.year-2000)

        if (TempMonthRef.current != Selected.month || TempYearRef.current != Selected.year-2000) {
            setBorderBack(JailKeeper,Selected);
            setSelected({ 'date': 1, 'month': TempMonthRef.current, 'year': TempYearRef.current + 2000});
            //setSelected(Obj => ({ ...Obj,'date':1, 'year': TempYearRef.current + 2000, 'month': TempMonthRef.current }));
        }
        setYearVis(false);
    }


    return(<>{YearVis && (<View style={Styles.popup}>
        <View style={{ backgroundColor:'#525252',width:'80%',height:'50%',alignSelf:'center'}}>

            <CloseBtn onPress={() => {close()}} CustomStyle={{ position: 'absolute', marginTop: '1%', height: '9%',right:'1%',borderRadius:5 }} BarStyle={{ width: '70%', height: '12%' }} />

            <View style={{ flexDirection: 'row', alignSelf: 'center', flex: 1, justifyContent: 'center' }}>

                <FlawedFlatSelector
                    ref={MonthRef}
                    Data={Month_DATA}
                    onMomentumScrollEnd={(val) => {TempMonthRef.current=val;}}
                    initialScrollIndex={Selected.month}
                    CustomStyle={{ height: 50, width: '25%', alignSelf: 'center' }}
                />

                <View style={{ width: '10%' }}></View>
                
                <FlawedFlatSelector
                    ref={YearRef}
                    Data={Year_DATA}
                    onMomentumScrollEnd={(val) => { TempYearRef.current = val }}
                    initialScrollIndex={Selected.year - 2000}
                    CustomStyle={{ height: 50, width: '25%', alignSelf: 'center' }}
                />

            </View>
            
            <ReverseBtn onPress={() => { 
                MonthRef.current.scrollToIndex({ animated: true, index: CalObj['month'] });
                YearRef.current.scrollToIndex({ animated: true, index: CalObj['year']-2000 });
                TempMonthRef.current = CalObj['month'];
                TempYearRef.current=CalObj['year']-2000;
                }} 
                CustomStyle={{position:'absolute',borderRadius:5, marginTop:'1%', marginLeft:'1%',}}
            />

        </View>
    </View>)}
    </>);

}),(prevProp,newProp)=>{

    if(newProp.YearVis==prevProp.YearVis)
     return true;
    return false;
});

const NewEventComp = React.memo(React.forwardRef(({NewEventVis,setNewEventVis,Selected,setSelected},JailKeeper)=>{
    //console.log('Rendered NewEventCal');

    const [NewColor, setNewcolor] = useState(() => colorWheel[0]);

    function changeColor() {
        let ind = colorWheel.indexOf(NewColor);
        setNewcolor(ind == colorWheel.length - 1 ? colorWheel[0] : colorWheel[ind + 1]);
    }
    const newEventHead = useRef('');
    const newEventBody = useRef('');
    const ScrollRef= useRef();
    const CustomRef=useRef(0);//for storing values

    //console.log('CustomRef:',CustomRef.current)

    useEffect(()=>{
        newEventHead.current = '';
        newEventBody.current = '';
        CustomRef.current=0;

    },[NewEventVis]);

    //console.log('New Event:', Selected, NewColor, newEventHead.current, newEventBody.current, RepeatRef.CustomRef.current);


    function saveEvent(){

        let tempData={...JailKeeper.current['data']};
        let commonObj={ 'backgroundColor': NewColor, 'heading': (newEventHead.current== undefined ? '' : newEventHead.current), 'body': (newEventBody.current == undefined ? '' : newEventBody.current),'rep':CustomRef.current};

        //console.log('Saving Events:',commonObj,tempData);
        if(CustomRef.current==0){
            if(tempData[Selected.year]==undefined)
                tempData[Selected.year]={};
            if(tempData[Selected.year][Selected.month]==undefined)
                tempData[Selected.year][Selected.month]={};
            if (tempData[Selected.year][Selected.month][Selected.date]==undefined)
                tempData[Selected.year][Selected.month][Selected.date]=[];

            tempData[Selected.year][Selected.month][Selected.date].push({...commonObj});
        }
        else if(CustomRef.current==1){
            if (tempData['Every Month'] == undefined)
                tempData['Every Month'] = {};
            
            if(tempData['Every Month'][Selected.date]==undefined)
                tempData['Every Month'][Selected.date]=[];

            tempData['Every Month'][Selected.date].push({...commonObj});
            
        }
        else{

            if(tempData['Every Year']==undefined)
                tempData['Every Year']={};
            if(tempData['Every Year'][Selected.month]==undefined)
                tempData['Every Year'][Selected.month]={};
            if (tempData['Every Year'][Selected.month][Selected.date]==undefined)
                tempData['Every Year'][Selected.month][Selected.date]=[];

            tempData['Every Year'][Selected.month][Selected.date].push({...commonObj});

        }
        //console.log('Storing TempData',JSON.stringify(tempData));

        JailKeeper.current['data']=tempData;
        setItem('EventsData', JSON.stringify(tempData));

        let borderRef=JailKeeper.current['Cellstates'][Selected.date]['ref'];
        JailKeeper.current['Cellstates'][Selected.date]['state'][1](<CalItem index={Selected.date} Selected={Selected} ref={{ borderRef, JailKeeper }}/>);
        setSelected(Obj=>({...Obj}));
    }

    return(<>{NewEventVis && (<View style={Styles.popup}>
        <View style={{height:'90%',backgroundColor:'#525252',width:'90%',alignSelf:'center'}}>

            <Pressable onPress={() => { changeColor() }} style={{ width: '100%', marginBottom: '4%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: NewColor }} >

                <TickBtn  onPress={() => {  setNewEventVis(false); saveEvent(); Keyboard.dismiss(); }} />
                <CloseBtn onPress={() => {setNewEventVis(false)}} />

            </Pressable>
            
            
            <TextInput style={styles.newevent_input_heading}
                underlineColorAndroid="transparent"
                placeholder="Heading"
                placeholderTextColor="grey"
                onChangeText={(val)=>{ newEventHead.current=val;}}
            />

            <TextInput style={styles.newevent_input}
                underlineColorAndroid="transparent"
                placeholder="Add Event"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                onChangeText={(val) => { newEventBody.current = val; }}
            />

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',overflow:'hidden' }}>

                <Text style={{fontSize:20, fontWeight:'bold',textAlignVertical:'center',color:'gray',marginRight:'5%'}}>Repeat : </Text>
                <ScrollSelector Data={Options_DATA} setDefault={false} ref={{ScrollRef,CustomRef}} />

            </View>
            

        </View>
    </View>)}</>)

}),(prevProp,newProp)=>{
    if(prevProp.NewEventVis==newProp.NewEventVis)
        return true;
    return false;
});

////// Main Calender //////////
const EventInds = React.forwardRef(({ Selected,index },JailKeeper) => {
    //console.log('Rendered EventInds');
    let tempList = [];
    try{
        if (JailKeeper.current['data'][Selected.year][Selected.month][index] != undefined)
            tempList.push(...JailKeeper.current['data'][Selected.year][Selected.month][index]);
    } catch {}

    try {
        if (JailKeeper.current['data']['Every Month'][index] != undefined)
            tempList.push(...JailKeeper.current['data']['Every Month'][index]);
    }catch{}
    
    try{
        if (JailKeeper.current['data']['Every Year'][Selected.month][index] != undefined)
            tempList.push(...JailKeeper.current['data']['Every Year'][Selected.month][index]);
    }catch{}

    tempList=tempList.slice(0, 3);
    return (<View style={{ flexDirection: 'row' }}>
        {
            tempList.map((el, index) => {
                return (<View key={index} style={[styles.event_indicator, { backgroundColor: el['backgroundColor'] }]}></View>)
            })
        }
    </View>)
});

const CalItem = React.forwardRef(({ useless = false, Selected, index, borderWidth=0 },{borderRef, JailKeeper}) => {
    //console.log('Rendered cal',index);
    if(useless==true)
     return(<></>)

    return (<>
        <View ref={borderRef} style={[styles.calendar_item_border,{borderWidth:borderWidth}]}></View>
        <Text style={styles.calendar_item_txt}>{index}</Text>
        <EventInds Selected={Selected} index={index} ref={JailKeeper} />
    </>)
});

const UsefulDay = React.forwardRef(({ useless = false, Selected, setSelected, index, setNewEventVis,backgroundColor='rgba(0,0,0, 0)'},JailKeeper)=>{
    //console.log('Rendered UsefulDay Selected date:',Selected.date);
    const CheckRef = useRef(0);

    let borderRef = useRef();
    JailKeeper.current['Cellstates'][index] = { 'ref': borderRef, 'state': useState(() => (<CalItem Selected={Selected} useless={useless} index={index} ref={{ borderRef, JailKeeper }} borderWidth={index == 1 ? BORDERWIDTH : 0} />)) };

    if(CheckRef.current==0)
    {
        CheckRef.current=1;
        let borderRef = JailKeeper.current['Cellstates'][index]['ref'];
        JailKeeper.current['Cellstates'][index]['state'][1](<CalItem Selected={Selected}  index={index} ref={{ borderRef, JailKeeper }} borderWidth={index == 1 ? BORDERWIDTH : 0} />);
    }
    else
     CheckRef.current=0;

    function changeBorder() {

        if (index == Selected.date)
            return;
        JailKeeper.current['Cellstates'][index]['ref'].current.setNativeProps({ style: { borderWidth: 2 } });
        JailKeeper.current['Cellstates'][Selected.date]['ref'].current.setNativeProps({ style: { borderWidth: 0 } });

        Selected.date=index;                        // I HAVE NO IDEA
        setSelected(Obj=>({...Obj,'date':index}));  // WHY THIS WORKS
    }

    if(useless==true)
    return(<View key={index} style={styles.calendar_item}></View>);
        
    return (<TouchableHighlight onPress={() => { changeBorder() }} onLongPress={() => { changeBorder(); setNewEventVis(true) }} key={index} style={[styles.calendar_item, { backgroundColor: backgroundColor }]}><>
        {JailKeeper.current['Cellstates'][index]['state'][0]}
    </></TouchableHighlight>);

});

const MainComp = React.memo(React.forwardRef(({ Loading, Selected, setSelected,setNewEventVis,setYearVis},JailKeeper)=>{

    //console.log('Rendered MainCal Selected & loading:',Selected,Loading);
    
    let empty_days = dayOnDate(1, Selected.month, Selected.year);
    let actual_days = daysInMonth(Selected.month, Selected.year);

    function setBorderBack() {
        JailKeeper.current['Cellstates'][Selected.date]['ref'].current.setNativeProps({ style: { borderWidth: 0 } });
        JailKeeper.current['Cellstates'][1]['ref'].current.setNativeProps({ style: { borderWidth: 2 } });
    }
    
    function changeMonth(val) {
        if ((Selected.month + val == -1 && Selected.year == 2000) || (Selected.month + val == 12 && Selected.year == CalObj['year'] + 49))
            return;

        let temp_month = Selected.month + val;
        let temp_year = Selected.year;

        if (temp_month == -1 || temp_month == 12) {
            temp_year += val;
            temp_month = (val == -1 ? 11 : 0)
        }
        setBorderBack(JailKeeper, Selected);
        setSelected({'date':1,'year':temp_year,'month':temp_month});

    }

    return(<View style={styles.calendar_wrapper}>

        <View style={{ width: '100%',justifyContent:'center', alignItems: 'center', height: '15%',flexDirection:'row'}}>

            <LeftBtn onPress={()=>{changeMonth(-1)}} CustomStyle={{position:'absolute',left:'10%',height:'65%',width:'10%'}} />

            <TouchableHighlight onPress={()=>{setYearVis(YearVis=>!YearVis);}} activeOpacity={0.9} underlayColor="#363636" style={{borderRadius:10,paddingHorizontal:'2%',paddingVertical:'3%'}}>
                <Text style={{fontWeight:'bold',fontSize:20,color:'white'}}>{`${months_arr[Selected.month]} ${Selected.year}`}</Text>
            </TouchableHighlight>

            <RightBtn onPress={()=>{changeMonth(+1)}} CustomStyle={{position:'absolute',right:'10%',height:'65%',width:'10%'}}/>

        </View>
        
        <View style={{ width: '100%', height: '15%', backgroundColor: '#363636', flexDirection: 'row' }}>
            {CalDays}
        </View>

        <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
            {
                [...Array(empty_days)].map((el, index) => {
                    //console.log('rendered unnecessary days');
                    return (<View key={index} style={styles.calendar_item}></View>);
                })
            }

            {
                [...Array(31)].map((el, index) => {
                    index++;
                    let temp_vals={useless:false,backgroundColor:null};

                    if (Selected.month == CalObj['month'] && Selected.year == CalObj['year'] && index == CalObj['date'])
                        temp_vals['backgroundColor']='orange';

                    else if (index > actual_days)
                        temp_vals['useless']=true;
                        
                    return (<UsefulDay useless={temp_vals['useless']} Selected={Selected} setNewEventVis={setNewEventVis} setSelected={setSelected} backgroundColor={temp_vals['backgroundColor']} key={index} index={index} ref={JailKeeper} />);
                

                })
            }

            {
                [...Array(11-empty_days)].map((el, index) => {
                    //console.log('rendered unnecessary end-days');

                    return (<View key={index} style={styles.calendar_item}></View>);
                })
            }
        </View>
            
    </View>);

}),(prevProp,newProp)=>{

    //console.log('COMPARING MAINCAL', prevProp.Loading ,newProp.Loading,prevProp.Loading == newProp.Loading)
    if (String(prevProp.Selected.month) == String(newProp.Selected.month) && String(prevProp.Selected.year) == String(newProp.Selected.year) && prevProp.Loading == newProp.Loading)
     return true;

    return false;
});
///////////////////////////////

const Calendar=React.memo(({CalendarObj})=>{
    CalObj={...CalendarObj['CalendarObj']}
    const [YearVis,setYearVis]= useState(false);
    const [NewEventVis,setNewEventVis] = useState(() => false);
    const [EditEventVis,setEditEventVis] = useState(() => false);
    const [Loading,setLoading]=useState(()=>true);

    const [Selected,setSelected] = useState(()=>({ date:1, month: CalendarObj['CalendarObj']['month'], year: CalendarObj['CalendarObj']['year'] }));

    const JailKeeper =useRef({
        'Data':{},
        'CurrentIndex':{},
        'Cellstates':[]
    });

    const scrollRef = useRef();

    const RenderCalItem = (val) => {
        let borderRef = JailKeeper.current['Cellstates'][val]['ref']
        JailKeeper.current['Cellstates'][val]['state'][1](<CalItem index={val} ref={{ borderRef, JailKeeper }} />);
    }

    async function getEventsData() {
        let value;
        try {
            value = JSON.parse(await getItem('EventsData'));
            if (value == null)
                throw 'value null';
        }
        catch (e) {
            value = {};
            await setItem('EventsData', JSON.stringify(value));
        }
        return value;
    }


    useEffect(()=>{

        ((val = CalObj['year'] - 1950) => {
            for (let i = 1; i <= val; i++)
                Year_DATA.push({ key: i, title: 1999 + i })
            Year_DATA.push({ key: val + 1, title: '' })
        })();

        getEventsData().then(val => { JailKeeper.current['data'] = val; /*console.log('Loaded Data!');*/ setLoading(false) });

    },[]);

    return(<View style={{flex:1}}>

        <SelYearComp Selected={Selected} setSelected={setSelected} setYearVis={setYearVis} YearVis={YearVis} ref={JailKeeper} />

        <NewEventComp Selected={Selected} setSelected={setSelected} NewEventVis={NewEventVis} setNewEventVis={setNewEventVis} ref={JailKeeper} />
        <EditEventComp EditEventVis={EditEventVis} RenderCalItem={RenderCalItem} Selected={Selected} setSelected={setSelected} setEditEventVis={setEditEventVis} ref={JailKeeper}/>

        <MainComp Loading={Loading} Selected={Selected} setSelected={setSelected} setYearVis={setYearVis} setNewEventVis={setNewEventVis} ref={JailKeeper}/>
        <CurrentEventComp setEditEventVis={setEditEventVis} Selected={Selected} EditEventVis={EditEventVis} NewEventVis={NewEventVis} ref={{JailKeeper,scrollRef}} />
    </View>);

},(prevProp,newProp)=>{
    if (prevProp['day']==newProp['day'])
     return true;

    return false;
});

const styles = StyleSheet.create({
    newevent_input_heading: {
        minHeight: ScreenHeight * 0.055,
        backgroundColor: '#2b2b2b',
        width: '100%',
        alignSelf: 'center',
        marginBottom: '4%',
        paddingHorizontal: '4%',
        color: 'white'

    },
    newevent_input: {
        backgroundColor: '#2b2b2b',
        textAlignVertical: 'top',
        paddingHorizontal: '4%',
        marginBottom: '5%',
        width: '100%',
        height: '46%',
        alignSelf: 'center',
        color: 'white'
    },

    calendar_wrapper:{
        backgroundColor:'#525252',
        width:'100%',
        height:'55%',
    },

    calendar_item: { 
        height: `${100 / 6}%`,
        width: `${100 / 7}%`,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#363636',
    },

    calendar_item_border:{
        width:'90%',
        height:'90%',
        position:'absolute',
        borderWidth:2

    },
    calendar_item_txt:{ 
        fontWeight: 'bold',
        color:'white'
    },
    event_indicator:{
        height:3,
        width:3,
        marginHorizontal:1
    },

});

module.exports=Calendar;