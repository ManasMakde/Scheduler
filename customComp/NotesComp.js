import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Pressable, Text, ScrollView, TouchableHighlight,TextInput, TouchableOpacity } from 'react-native';
import {setItem,getItem,ScreenHeight,Styles,TrashBtn,CloseBtn,TickBtn} from './../Common';

const Notes=React.memo(()=>{
    //console.log('rendered Notes');
    const [notesData, setNotesData] = useState(() => []);
    const [newNoteVis, setNewNoteVis] = useState(() => false);
    const [editNoteVis, setEditNoteVis] = useState(() => false);
    const SelectedInd = useState(() => 0);

    const newHeading = useState(() => '');
    const newBody = useState(() => '');
    

    async function getNotesData() {
        let value;
        try {
            value = JSON.parse(await getItem('NotesData'));
            if (value == null)
                throw 'value null';
        }
        catch (e) {
            value = [];
            await setItem('NotesData', JSON.stringify(value));
        }
        return value;
    }

    async function add_note(mod=false){
        if(mod==true){
           // console.log('Added Note Data  newHeading:', newHeading[0], 'newBody:', newBody[0])
            let tempList=[...notesData];
            tempList[SelectedInd[0]]['heading'] = newHeading[0];
            tempList[SelectedInd[0]]['body'] = newBody[0];
            setNotesData(tempList);
            await setItem('NotesData', JSON.stringify(tempList));
            return;
        }

        let tempList=[...notesData,{'heading':newHeading[0],'body':newBody[0]}];
        setNotesData(tempList);
        await setItem('NotesData', JSON.stringify(tempList));
    }

    async function del_note(){
        let tempList = [...notesData];
        tempList.splice(SelectedInd[0],1);
        await setItem('NotesData', JSON.stringify(tempList));
        setNotesData(tempList);

    }

    useEffect(() => {
        getNotesData().then(setNotesData);
    }, []);

    return(<>
        {newNoteVis && (<View style={Styles.popup}>
            <View style={styles.new_note_wrapper}>

                <TickBtn CustomStyle={{ position: 'absolute' }} onPress={ async() => { await add_note();setNewNoteVis(false)}}/>

                <CloseBtn onPress={async () => {setNewNoteVis(false)}}/>


                <TextInput style={styles.input_heading}
                    underlineColorAndroid="transparent"
                    placeholder="Heading"
                    placeholderTextColor="grey"
                    autoFocus={true}
                    onChangeText={(text)=>newHeading[0]=text}
                />

              
                <TextInput style={styles.input_body}
                    underlineColorAndroid="transparent"
                    placeholder="Add Note"
                    placeholderTextColor="grey"
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={(text) => newBody[0] = text}
                />


            </View>
        </View>)}

        {editNoteVis && (<View style={Styles.popup}>
            <View style={styles.new_note_wrapper}>

                <TrashBtn CustomStyle={{ position: 'absolute' }} onPress={async () => { del_note(); setEditNoteVis(false) }}/>

                <CloseBtn  onPress={async () => { add_note(true);setEditNoteVis(false) }} CustomStyle={{ alignSelf: 'flex-end' }}/>


                <TextInput style={styles.input_heading}
                    underlineColorAndroid="transparent"
                    placeholder="Add Title"
                    placeholderTextColor="grey"
                    autoFocus={true}
                    defaultValue ={String(notesData[SelectedInd[0]]['heading'])}
                    onChangeText={(text) => { newHeading[0] = text; /*console.log('TextInput txt:',newHeading[0]);*/}}
                />

                <TextInput style={styles.input_body}
                    underlineColorAndroid="transparent"
                    placeholder="Add Body"
                    placeholderTextColor="grey"
                    numberOfLines={100}
                    multiline={true}
                    defaultValue={String(notesData[SelectedInd[0]]['body'])}
                    onChangeText={(text) => { newBody[0] = text;/*console.log('TextInput txt:',newBody[0]);*/ }}

                />

            </View>
        </View>)}

        <ScrollView style={{ backgroundColor:'#525252'}}>
            <Pressable style={{flexDirection:'row',flexWrap:'wrap',paddingTop:'5%'}}>
                {
                    notesData.map((el,index)=>{
                        return (<TouchableOpacity activeOpacity={0.7} key={index} onPress={async () => { SelectedInd[1](index); newHeading[1](el['heading']); newBody[1](el['body']); setEditNoteVis(true); }} style={styles.note_item} contentContainerStyle={styles.note_item_heading_content}>
                            <Text numberOfLines={2} style={styles.note_item_heading_txt}>{el['heading']==''?'Untitled':el['heading']}</Text>
                            <Text numberOfLines={10} style={styles.note_item_body_txt}>{el['body']==''?'( empty )':el['body']}</Text>
                        </TouchableOpacity>)
                    })
                }
                <View style={[styles.note_item,{backgroundColor:'rgba(0,0,0,0.8)',justifyContent:'center'}]}>

                    <TouchableHighlight onPress={() => { setNewNoteVis(true);}} style={[Styles.close_btn, { alignSelf: 'center', height: '50%', width: '50%', alignSelf: 'center', height: '90%', width: '90%', borderColor: '#787878', borderWidth: 3,borderRadius:5 }]}>
                            <>
                            <Text style={[Styles.close_btn_bar, { width: '30%', height: '4%', backgroundColor:'white'}]}></Text>
                            <Text style={[Styles.close_btn_bar, { width: '30%', height: '4%', backgroundColor:'white', transform: [{ rotate: '90deg' }] }]}></Text>
                            </>
                    </TouchableHighlight>
                </View>

            </Pressable>
        </ScrollView>
    </>);
});

const styles = StyleSheet.create({
    note_item:{
        height: ScreenHeight * 0.3, 
        width: '42.5%', 
        marginBottom: '5%', 
        marginLeft: '5%',
        borderRadius:5
    },
    note_item_heading_content: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    note_item_heading_txt: { 
        backgroundColor: 'black',
        color:'white',
        height: '20%',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: '5%',
        paddingHorizontal: '10%',   
    },
    note_item_body_txt: {
        backgroundColor: '#d19900',
        color:'black',
        flex: 1,
        paddingVertical: '5%',
        paddingHorizontal: '8%' 
    },

    new_note_wrapper: {
        marginTop: '10%',
        width: '90%',
        height: '85%',
        alignSelf: 'center',
        backgroundColor: '#525252'
    },
    input_heading: {
        height: ScreenHeight * 0.055,
        backgroundColor: '#2b2b2b',
        width: '100%',
        alignSelf: 'center',
        marginBottom: '4%',
        paddingHorizontal:'4%',
        color:'white'
    },
    input_body: {
        width: '100%',
        flex:1,
        paddingBottom: '5%',
        backgroundColor: '#2b2b2b',
        textAlignVertical: 'top',
        paddingHorizontal: '4%',
        color:'white'
    },

});

module.exports=Notes;