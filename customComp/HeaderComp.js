import React from 'react';
import { StyleSheet,Text, View } from 'react-native';


export default function Header({ timedateObj,show_date}){

    return(<View style={styles.header}>
            <Text style={{ fontSize: 30, color: 'white' }}>{timedateObj.time}</Text>
            {show_date&&(<Text style={{ paddingTop: 10, color: 'white' }}>{timedateObj.day}</Text>)}
        </View>)
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'black',
        alignItems: 'center',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    date_and_time: {
        color: 'white'
    }
});