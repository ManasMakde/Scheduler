import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWidth, Options_DATA } from '../../Common';

const RenderEvents=React.forwardRef(({setEditEventVis,Selected},JailKeeper)=>{

    function showEdit(rep,index) {
        //console.log('showing edit with rep & index:',rep,index)
        JailKeeper.current['CurrentIndex']={ rep,index };
        setEditEventVis(true);
    }

    let CurrentEventList = [];
    let EventsData = {...JailKeeper.current['data']};
    try{
        if (EventsData[Selected.year][Selected.month][Selected.date] != undefined)
            CurrentEventList.push(...EventsData[Selected.year][Selected.month][Selected.date]);
    }
    catch {}

    try{
        if (EventsData['Every Month'][Selected.date] != undefined)
            CurrentEventList.push(...EventsData['Every Month'][Selected.date]);
    }
    catch{}

    try{
        if (EventsData['Every Year'][Selected.month][Selected.date] != undefined)
            CurrentEventList.push(...EventsData['Every Year'][Selected.month][Selected.date]);
    }
    catch{}

    let rep_count = 0;
    let current_rep ='';
    if (CurrentEventList.length!=0){
        return(<>{
        CurrentEventList.map((el, index) => {
            if(el['rep']!=current_rep){
                rep_count=index;
                current_rep=el['rep'];
            }
            //console.log('index:', index, el['rep'], index - rep_count);
            let ind= index - rep_count;
            return (
                <TouchableOpacity activeOpacity={0.7} onLongPress={() => { showEdit(el['rep'],ind) }} key={index} style={styles.current_event_item_wrapper}>
                    <View style={[styles.current_event_item, { backgroundColor: el['backgroundColor']}]}>
                        <ScrollView style={styles.current_event_heading} contentContainerStyle={styles.current_event_content}>
                            <Pressable onLongPress={() => { showEdit(el['rep'],index-rep_count) }}>
                                <Text style={styles.current_event_heading_txt}>{(el['heading']==''?'Untitled':el['heading'])}</Text>
                            </Pressable>
                        </ScrollView>

                        <Text style={{ textAlign: 'center',marginBottom:'3%',color:'#c7c7c7' }}>Repeat: {Options_DATA[el['rep'] + 1].title}</Text>

                        <ScrollView style={styles.current_event_body} persistentScrollbar={true} contentContainerStyle={styles.current_event_content}>
                            <Pressable onLongPress={() => { showEdit(el['rep'],index-rep_count) }}>
                                <Text style={styles.current_event_body_txt}>{(el['body']==''?'( empty )':el['body'])}</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            )
        })
        }</>);}
    else 
        return (<View style={{ justifyContent: 'center'}}>
            <Text style={{textAlign:'center',color:'white'}}>( No Events )</Text>
        </View>);
    
});

const CurrentEventComp = React.forwardRef(({ Selected, setEditEventVis, NewEventVis,EditEventVis},{JailKeeper,scrollRef})=>{

    const StoreScroll=useRef({'NewEventVis':NewEventVis,'EditEventVis':EditEventVis});
    // console.log('rendered CurrentEvent Comp', StoreScroll.current['NewEventVis'],NewEventVis);

    useEffect(()=>{
        if (StoreScroll.current['NewEventVis'] == true && NewEventVis == false)
            scrollRef.current.scrollToEnd({ animated: false });
        else if (EditEventVis == false && NewEventVis == false)
            scrollRef.current.scrollTo({x:0, animated: false });

        StoreScroll.current['NewEventVis'] = NewEventVis;

    })


    return(<>
        <View style={{backgroundColor:'#2b2b2b',flex:1}}>
            <ScrollView ref={scrollRef} horizontal={true} persistentScrollbar={true} disableIntervalMomentum={true} snapToInterval={ScreenWidth} decelerationRate="fast" style={{ backgroundColor: '#262626' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <RenderEvents Selected={Selected} setEditEventVis={setEditEventVis} ref={JailKeeper}/>
            </ScrollView>
        </View>
    </>)

});

const styles = StyleSheet.create({

    current_event_item_wrapper: {
        height: '100%',
        width: ScreenWidth,
        justifyContent: 'center'
    },
    current_event_item: {
        width: ScreenWidth * 0.9,
        height: '85%',
        backgroundColor: 'orange',
        alignSelf: 'center'
    },
    current_event_heading: {
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontSize: 20,
        color: 'white',
        paddingHorizontal: '3%',
        flexGrow: 1,
        height:'30%',
        maxHeight: '30%',
    },
    current_event_heading_txt: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        color: 'white'
    },
    current_event_content: {
        justifyContent: 'center',
        flexGrow: 1,
    },
    current_event_body: {
        paddingHorizontal: '5%',
        marginBottom: '5%'

    },
    current_event_body_txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white'
    }
});
module.exports=CurrentEventComp;