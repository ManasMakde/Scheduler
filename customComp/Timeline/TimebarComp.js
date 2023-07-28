import React from 'react';
import { Text, View,StyleSheet } from 'react-native';
import { ScreenHeight, timelineTimeWidth, timelineTimeHeight, timelineBarWidth, Styles } from '../../Common';

const update_t = 3.6e6;

const Timebar=React.memo(()=>{

    //console.log('rendered Timebar');

    return (<>{
        [...Array(23)].map((el, index) => {
            let d = new Date(update_t * (index + 1));
            let hr = d.getUTCHours();
            let min = d.getUTCMinutes();
            return (
                <View key={index}>
                    <Text style={styles.timeline_time}>{((hr == 0 ? 12 : hr > 12 ? hr % 12 : hr) + ':' + (min == 0 ? '00' : min) + " " + (hr < 12 ? 'am' : 'pm'))}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                        <View style={{ height: timelineTimeHeight }}>
                            <View style={[Styles.timeline_bar_top, { borderRightWidth: timelineBarWidth }]}></View>
                            <View style={Styles.timeline_bar_bottom}></View>
                        </View>

                        <View style={{ height: timelineTimeHeight }}>
                            <View style={Styles.timeline_bar_top}></View>
                            <View style={Styles.timeline_bar_bottom}></View>
                        </View>

                    </View>
                </View>
            )
        })
    }</>)
})

const styles = StyleSheet.create({

    timeline_time: {
        width: timelineTimeWidth,
        textAlign: 'center',
        paddingVertical: ScreenHeight * 0.01,
        color:'white',
        shadowOpacity: 0
    },
});

module.exports=Timebar;