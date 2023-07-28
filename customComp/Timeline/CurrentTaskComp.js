import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { ScreenWidth } from '../../Common';

const CurrentTask = React.memo(({ TList})=>{
    //console.log('Rendered CurrentTask')
    const [CurrentTaskList, setCurrentTaskList] = useState(() => []);
    getCurrentTasks();

    function getCurrentTasks() {
        let tempList = []
        let now = new Date();

        let hrs = now.getHours();
        let mins = now.getMinutes();
        let secs = now.getSeconds();

        let needleTime = `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

        for (i = 0; i < TList.length; i++)
            for (j = 0; j < TList[i].length; j++)
                if (TList[i][j]['from']['24hr'] < needleTime && needleTime < TList[i][j]['to']['24hr'])
                   { tempList.push([i, j]);break;}

        if (String(CurrentTaskList) != String(tempList))
            setCurrentTaskList(tempList);
    }

    const RenderContent=()=>{
        if(CurrentTaskList.length!=0){
         return(<>{
            CurrentTaskList.map((el, index) => {
                return (
                    <View key={index} style={styles.current_task_item_wrapper}>
                        <View style={[styles.current_task_item, { backgroundColor: TList[el[0]][el[1]]['newcolor']}]}>
                            <ScrollView style={styles.current_task_heading} contentContainerStyle={styles.current_task_content}>
                                <Pressable>
                                    <Text style={styles.current_task_heading_txt}>{(TList[el[0]][el[1]]['heading']==''?'Untitled':TList[el[0]][el[1]]['heading'])}</Text>
                                </Pressable>
                            </ScrollView>

                            <ScrollView style={styles.current_task_body} contentContainerStyle={styles.current_task_content}>
                                <Pressable>
                                    <Text style={styles.current_task_body_txt}>{TList[el[0]][el[1]]['body']==''?'( empty )':TList[el[0]][el[1]]['body']}</Text>
                                </Pressable>
                            </ScrollView>
                        </View>
                    </View>
                )
            })
         }</>);}
        else {
            return (<View style={{ justifyContent: 'center'}}>
            <Text style={{textAlign:'center',color:'white'}}>( No Current Task )</Text>
        </View>);}
    }
    
    useEffect(() => {

        getCurrentTasks();
        let secTimer = setInterval(() => {
            getCurrentTasks();
        }, 30000);
        return () => { clearInterval(secTimer) };
    }, []);

    return (
        <View style={styles.current_task_wrapper}>
            <ScrollView horizontal={true} persistentScrollbar={true} disableIntervalMomentum={true} snapToInterval={ScreenWidth} decelerationRate="fast" style={{ backgroundColor: '#262626' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <RenderContent />
            </ScrollView>
        </View>)
});

const styles = StyleSheet.create({

    current_task_wrapper: {
        flex: 1,
        justifyContent:'center'
    },
    current_task_item_wrapper: {
        height: '100%',
        width: ScreenWidth,
        justifyContent: 'center'
    },
    current_task_item: {
        width: ScreenWidth * 0.9,
        height: '85%',
        backgroundColor: 'orange',
        alignSelf: 'center'
    },
    current_task_heading: {
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontSize: 20,
        marginBottom: '6%',
        color: 'white', 
        paddingHorizontal: '3%',
        flexGrow: 1,
        maxHeight: '20%',
    },
    current_task_heading_txt: { 
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        color:'white'
    },
    current_task_content: {
        justifyContent: 'center',
        flexGrow: 1
    },
    current_task_body:{ 
        paddingHorizontal: '5%',
        marginBottom: '5%',
        paddingTop: '3%'
    },
    current_task_body_txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color:'white'
    }

});

module.exports={CurrentTask};