import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View,Pressable, TextInput, Keyboard } from 'react-native';
import { Styles, ColorPicker, ScreenHeight, TrashBtn, TickBtn, Options_DATA, setItem } from '../../Common';

const EditEventComp=React.memo(React.forwardRef(({EditEventVis,setEditEventVis,Selected,setSelected,RenderCalItem},JailKeeper)=>{

    //console.log('Current Index & data:',CurrentIndex, temp_data);

    let CurrentIndex = { ...JailKeeper.current['CurrentIndex'] };
    let temp_data = {};
    let EventsData = { ...JailKeeper.current['data'] };

    try {
        console.log('Current Data & Index:',EventsData,Selected,CurrentIndex);
        if (CurrentIndex['rep'] == 0) {
            temp_data['heading'] = EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['heading'];
            temp_data['body'] = EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['body'];
            temp_data['backgroundColor'] = EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['backgroundColor'];

        }
        else if (CurrentIndex['rep'] == 1) {
            temp_data['heading'] = EventsData[Options_DATA[2].title][Selected.date][CurrentIndex['index']]['heading'];
            temp_data['body'] = EventsData[Options_DATA[2].title][Selected.date][CurrentIndex['index']]['body'];
            temp_data['backgroundColor'] = EventsData[Options_DATA[2].title][Selected.date][CurrentIndex['index']]['backgroundColor'];
        }
        else {
            temp_data['heading'] = EventsData[Options_DATA[3].title][Selected.month][Selected.date][CurrentIndex['index']]['heading'];
            temp_data['body'] = EventsData[Options_DATA[3].title][Selected.month][Selected.date][CurrentIndex['index']]['body'];
            temp_data['backgroundColor'] = EventsData[Options_DATA[3].title][Selected.month][Selected.date][CurrentIndex['index']]['backgroundColor'];
        }
    } catch (err) { console.log(err); return (<></>) }

    const ColorRef=useRef('');
    const EditEventHead = useRef(temp_data['heading']);
    const EditEventBody = useRef(temp_data['body']);

    EditEventHead.current = temp_data['heading'];
    EditEventBody.current = temp_data['body'];

    function reSaveEvent() {
        console.log('Current Index & head & body:', CurrentIndex, EditEventHead.current, EditEventBody.current, ColorRef.current);

        if (CurrentIndex['rep'] == 0) {
            if(
                EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['heading']==EditEventHead.current &&
                EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['body'] == EditEventBody.current &&
                EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['backgroundColor'] == ColorRef.current
            )
                return;
            EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['heading'] = (EditEventHead.current == undefined ? '' : EditEventHead.current);
            EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['body'] = (EditEventBody.current == undefined ? '' : EditEventBody.current);
            EventsData[Selected.year][Selected.month][Selected.date][CurrentIndex['index']]['backgroundColor'] = ColorRef.current;
        }
        else if (CurrentIndex['rep'] == 1) {
            if(
                EventsData['Every Month'][Selected.date][CurrentIndex['index']]['heading'] == EditEventHead.current&&
                EventsData['Every Month'][Selected.date][CurrentIndex['index']]['body'] == EditEventBody.current&&
                EventsData['Every Month'][Selected.date][CurrentIndex['index']]['backgroundColor'] == ColorRef.current
            )
                return;
            EventsData['Every Month'][Selected.date][CurrentIndex['index']]['heading'] = (EditEventHead.current == undefined ? '' : EditEventHead.current)
            EventsData['Every Month'][Selected.date][CurrentIndex['index']]['body'] = (EditEventBody.current == undefined ? '' : EditEventBody.current);
            EventsData['Every Month'][Selected.date][CurrentIndex['index']]['backgroundColor'] = ColorRef.current;
        }
        else {
            if(
                EventsData['Every Year'][Selected.month][Selected.date][CurrentIndex['index']]['heading'] == EditEventHead.current&&
                EventsData['Every Year'][Selected.month][Selected.date][CurrentIndex['index']]['body'] == EditEventBody.current&&
                EventsData['Every Year'][Selected.month][Selected.date][CurrentIndex['index']]['backgroundColor'] == ColorRef.current
            )
                return;
            EventsData['Every Year'][Selected.month][Selected.date][CurrentIndex['index']]['heading'] = (EditEventHead.current == undefined ? '' : EditEventHead.current);
            EventsData['Every Year'][Selected.month][Selected.date][CurrentIndex['index']]['body'] = (EditEventBody.current == undefined ? '' : EditEventBody.current);
            EventsData['Every Year'][Selected.month][Selected.date][CurrentIndex['index']]['backgroundColor'] = ColorRef.current;
        }

        console.log(JSON.stringify(EventsData));

        JailKeeper.current['data']= {...EventsData};

        setItem('EventsData', JSON.stringify(EventsData));

        RenderCalItem(Selected.date);
        setSelected(Selected=>({...Selected}));
    }

    function delEvent() {

        if (CurrentIndex['rep'] == 0)
            EventsData[Selected.year][Selected.month][Selected.date].splice(CurrentIndex['index'], 1);

        else if (CurrentIndex['rep'] == 1)
            EventsData['Every Month'][Selected.date].splice(CurrentIndex['index'], 1);

        else
            EventsData['Every Year'][Selected.month][Selected.date].splice(CurrentIndex['index'], 1);

        //console.log(JSON.stringify(EventsData));
        setItem('EventsData', JSON.stringify(EventsData));
        RenderCalItem(Selected.date);
        //console.log('Data deleted')
        JailKeeper.current['data']=EventsData;

        setSelected(Selected=>({...Selected}));

    }

    return (<>{EditEventVis && (<View style={Styles.popup}>
        <View style={{ height: '90%', backgroundColor: '#525252', width: '90%', alignSelf: 'center' }}>

            <ColorPicker initalColor={temp_data['backgroundColor']} ref={ColorRef}>
                <TrashBtn onPress={() => { setEditEventVis(false); delEvent(); Keyboard.dismiss(); }} />
                <TickBtn onPress={() => { setEditEventVis(false); reSaveEvent(); Keyboard.dismiss(); }} />
            </ColorPicker>

            <TextInput style={styles.newevent_input_heading}
                underlineColorAndroid="transparent"
                placeholder="Heading"
                placeholderTextColor="grey"
                onChangeText={(val) => { EditEventHead.current = val }}
                defaultValue={String(temp_data['heading'])}
            />

            <TextInput style={[styles.newevent_input, { flex: 1 }]}
                underlineColorAndroid="transparent"
                placeholder="Add Event"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                onChangeText={(val) => { EditEventBody.current = val }}
                defaultValue={String(temp_data['body'])}
            />

        </View>
    </View>)}</>);

}),(prevProp,newProp)=>{
    if(prevProp.EditEventVis==newProp.EditEventVis)
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
    }
});

module.exports=EditEventComp;
