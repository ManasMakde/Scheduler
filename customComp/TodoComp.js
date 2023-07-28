import React, { useState,useEffect, useRef } from 'react';
import { StyleSheet, Text, Pressable, ScrollView, View, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { ReverseBtn, TickBtn,setItem,getItem,Styles} from '../Common';

async function getTodo() {
    let value;
    try {
        value = await getItem('TodoData');
        if (value == null)
            throw 'value null';
    }
    catch (e) {
        value = '';
        await setItem('TodoData', value);
    }
    return value;
}

const EditComp=React.memo(React.forwardRef(({TodoState, setTodoState, editTodoVis, seteditTodoVis},tempTodo)=>{

    const todoRef = useRef();

    return (<>{editTodoVis && (<View style={Styles.popup}>
        <View style={styles.edit_todo_wrapper}>

            <ReverseBtn onPress={() => { tempTodo.current=TodoState;todoRef.current.setNativeProps({ text: TodoState }); }} />

            <TickBtn CustomStyle={{ alignSelf: 'flex-end' }} onPress={async () => { seteditTodoVis(false); Keyboard.dismiss(); setTodoState(tempTodo.current); await setItem('TodoData', tempTodo.current); }} />

            <TextInput style={styles.edit_todo_input}
                underlineColorAndroid="transparent"
                placeholder="Add To Do"
                placeholderTextColor="grey"
                numberOfLines={15}
                multiline={true}
                ref={todoRef}
                autoFocus={true}
                defaultValue={TodoState}
                onChangeText={(val) => { tempTodo.current = val; }}
            />

        </View>
    </View>)}</>);
}));

const Todo=React.memo(()=>{

    const [TodoState,setTodoState] = useState(() => '');
    const tempTodo = useRef('');
    const [editTodoVis, seteditTodoVis] = useState(() => false);
    
    useEffect(() => {
        getTodo().then((Text) => { setTodoState(Text); tempTodo.current=Text });
    },[])

    return (<>
        <EditComp TodoState={TodoState} setTodoState={setTodoState} editTodoVis={editTodoVis} seteditTodoVis={seteditTodoVis} ref={tempTodo}/>

        <TouchableOpacity style={styles.todo_wrapper} activeOpacity={0.7} onLongPress={() => { seteditTodoVis(true); } }>
            <Text style={styles.todo_heading}>Todo</Text>
            <ScrollView persistentScrollbar={true} style={{ paddingHorizontal: '5%' }}>
                <TouchableOpacity onLongPress={() => { seteditTodoVis(true); }} >
                    <Text style={{ color: 'white' }}>{String(TodoState)}</Text>
                </TouchableOpacity>
            </ScrollView>
        </TouchableOpacity>
        </>);
});

const styles = StyleSheet.create({

    edit_todo_wrapper: {
        width: '90%',
        height: '80%',
        alignSelf: 'center',
        backgroundColor: '#525252'
    },
    edit_todo_input: {
        backgroundColor: '#363636',
        color: 'white',
        textAlignVertical: 'top',
        paddingHorizontal: '4%',
        paddingTop:'4%',
        alignSelf: 'stretch',
        flex:1
    },

    todo_wrapper: {
        flex:1,
        backgroundColor: '#363636',
        paddingBottom: '5%',
        paddingTop:'2%'
    },
    todo_heading: {
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontSize: 20,
        marginBottom: '3%',
        color: 'white'
    },

});

module.exports=Todo;