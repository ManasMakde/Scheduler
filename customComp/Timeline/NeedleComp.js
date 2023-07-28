import React from 'react';
import {  View, StyleSheet } from 'react-native';
import { timelineTimeWidth,NeedleWidth } from '../../Common';

const Needle=React.memo(({NeedleObj})=>{
    
    return (
        <View style={[styles.timeline_needle, { left: (NeedleObj['hrs'] + NeedleObj['mins'] / 60) / 24 * (timelineTimeWidth * 24) + timelineTimeWidth / 2 - NeedleWidth }]}></View>
    )
})

const styles = StyleSheet.create({
    timeline_needle: {
        width: NeedleWidth,
        height: '75%',
        backgroundColor: 'orange',
        borderWidth: 1,
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
    },
});

module.exports=Needle;