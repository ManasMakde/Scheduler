import React, { useRef, useState  } from 'react';
import { Dimensions, Pressable, StyleSheet,Text, View,TouchableHighlight,ScrollView,FlatList,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const editArrowSize = 7;
const editArrowTailWidth = 4;

const NeedleWidth=4;

const timelineTimeHeight = ScreenWidth * 0.035;
const timelineTimeWidth = ScreenWidth / 2
const timelineBarWidth = 3.5;

const timelinetaskWrapperHeight = ScreenHeight * 0.12;

const days_arr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colorWheel = ['crimson', 'royalblue', 'seagreen', 'mediumorchid'];

const Options_DATA = [{ key: 0, title: '' }, { key: 1, title: 'Never' }, { key: 2, title: 'Every Month' }, { key: 3, title: 'Every Year' }]; Options_DATA.push({ key: Options_DATA.length, title: '' });

const Month_DATA = Array(14).fill('').map((el,index)=>{
    if(index==0)
        return({ key: 0, title: '' });
    else if (index==13)
        return({ key: 13, title: '' });
    else
        return({ key: index-1, title: String(months_arr[index - 1]).substring(0, 3) });
});

const setItem = async (key,data)=>{
    AsyncStorage.setItem(key, data);
}

const getItem = async (key) => AsyncStorage.getItem(key);

const daysInMonth=(month, year)=>{
    return new Date(year, month+1, 0).getDate();
}

const dayOnDate=(date, month, year)=>{
    return (new Date(year, month , date).getDay());
}

const NavBtn =React.memo(({onPress,icon})=>{
    return(<TouchableHighlight underlayColor="#333333" style={Styles.fixed_btn} onPress={onPress} ><>

            {icon == 'Todo' && (<Image source={require('./resources/Todo.png')} style={{height:'95%',width:'95%'}} />)}

            {icon == 'Calendar' && (<Image source={require('./resources/Calender.png')} style={{height:'80%',width:'80%'}} />)}

            {icon=='Notes'&&(<Image source={require('./resources/Notes.png')} style={{height:'80%',width:'80%'}} />)}

        </></TouchableHighlight>);
});

const CloseBtn = React.memo(({onPress,CustomStyle,BarStyle})=>{
    return (<TouchableHighlight underlayColor="#333333" onPress={onPress} style={[Styles.close_btn,CustomStyle ]}><>
        <Text style={[Styles.close_btn_bar, BarStyle, { transform: [{ rotate: '45deg' }] }]}></Text>
        <Text style={[Styles.close_btn_bar, BarStyle, { transform: [{ rotate: '-45deg' }] }]}></Text>
    </></TouchableHighlight>);
});

const TickBtn = React.memo(({onPress,CustomStyle})=>{
    return (<TouchableHighlight underlayColor="#333333" style={[Styles.tick_btn,CustomStyle]} onPress={onPress}>
        <View style={Styles.tick_btn_bar}></View>
    </TouchableHighlight>);
});

const TrashBtn = React.memo(({ onPress, CustomStyle }) => {
    return (<TouchableHighlight underlayColor="#333333" onPress={onPress} style={[Styles.trash_btn,CustomStyle]}><>

        <View style={Styles.trash_top}>
            <View style={Styles.trash_handle}></View>
            <View style={Styles.trash_lid}></View>
            <View></View>
        </View>

        <View style={Styles.trash_bin}>
            <View style={Styles.trash_bin_bar}></View>
            <View style={Styles.trash_bin_bar}></View>
            <View style={Styles.trash_bin_bar}></View>
        </View>

    </></TouchableHighlight>);
});

const ReverseBtn = React.memo(({onPress,CustomStyle})=>{
    return (<TouchableHighlight underlayColor="#333333" onPress={onPress} style={[Styles.reverse_btn,CustomStyle]}><>
        <View style={Styles.reverse_wrapper}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <View style={Styles.reverse_arrowtop}></View>
                <View style={Styles.reverse_arrowbottom}></View>
            </View>
            <View style={Styles.reverse_arrowtail}></View>
        </View>
    </></TouchableHighlight>);
});

const UpBtn = React.memo(({onPress})=>{
    return(
        <TouchableHighlight style={Styles.newtask_select_time_btn} onPress={onPress} underlayColor="#363636">
            <View style={Styles.newtask_select_time_btn_upbar}></View>
        </TouchableHighlight>
    );
});

const DownBtn = React.memo(({onPress})=>{
    return(<TouchableHighlight style={Styles.newtask_select_time_btn} onPress={onPress} underlayColor="#363636">
            <View style={Styles.newtask_select_time_btn_downbar}></View>
        </TouchableHighlight>);
});

const RightBtn = React.memo(({ onPress,CustomStyle }) => {
    return (<TouchableHighlight style={[Styles.newtask_select_time_btn,CustomStyle]} onPress={onPress} underlayColor="#363636">
        <View style={Styles.newtask_select_time_btn_rightbar}></View>
    </TouchableHighlight>);
});

const LeftBtn = React.memo(({ onPress,CustomStyle }) => {
    return (
        <TouchableHighlight style={[Styles.newtask_select_time_btn,CustomStyle]} onPress={onPress} underlayColor="#363636">
            <View style={Styles.newtask_select_time_btn_leftbar}></View>
        </TouchableHighlight>
    );
});

const ColorPicker=React.memo(React.forwardRef((Props,ColorRef)=>{

    const [EditColor, setEditcolor] = useState(String(Props.initalColor));
    ColorRef.current=EditColor;

    function changeColor() {
        let ind = colorWheel.indexOf(EditColor);
        setEditcolor(ind == colorWheel.length - 1 ? colorWheel[0] : colorWheel[ind + 1]);
        ColorRef.current=EditColor;
    }

    return (<Pressable onPress={() => { changeColor(); }} style={{ width: '100%', marginBottom: '4%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: EditColor }} >
        {Props.children}
    </Pressable>)
}));

const _nullfunc=()=>{}
const ScrollSelector = React.memo(React.forwardRef(({Data=[],CustomStyle={height:50},TxtStyle,BarStyle,initialScrollIndex=0,setDefault=true, onMomentumScrollEnd=_nullfunc,toAnimate=false },{ScrollRef,CustomRef})=>{

    try{
        if(setDefault==true)
            CustomRef.current=initialScrollIndex;
    }catch{}//because sometimes CustomRef may not be defined but onMomentumScrollEnd might be

    function setIndex(val) {
        let temp_val=(val==0?0:~~(val/CustomStyle.height)+1);

        if (temp_val==Data.length-2)
         temp_val--;

        return temp_val;
    }

    const ItemComp = React.useCallback((el, index) => {
        return (<View key={index}
            style={{
                height: CustomStyle.height,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Text style={[{ fontWeight: 'bold', color: 'white' },TxtStyle]}>{el.title}</Text>
        </View>)
    });

    return (<View style={[CustomStyle, { height: CustomStyle.height * 3 }]}>
        <ScrollView 
        ref={ScrollRef}
        contentOffset={{y:CustomStyle.height*initialScrollIndex}}
        snapToOffsets={Data.map((x, i) => (i * CustomStyle.height))}
        onMomentumScrollEnd={(e) => { try{CustomRef.current=setIndex(e.nativeEvent.contentOffset.y); /*console.log('ScrollSelector index:',CustomRef.current)*/}catch(err){/*console.log(err)*/} onMomentumScrollEnd(e) }}
        showsVerticalScrollIndicator={false}
        
        >
            { Data.map(ItemComp) }
        </ScrollView>
        <View style={{ height: CustomStyle.height, width: '100%', position: 'absolute', top: 0, backgroundColor: 'rgba(82, 82, 82,0.9)' }} pointerEvents="none"></View>
        <View style={{ height: CustomStyle.height, width: '100%', position: 'absolute', top: CustomStyle.height*2, backgroundColor: 'rgba(82, 82, 82,0.9)' }} pointerEvents="none"></View>
        <View style={[{ height: CustomStyle.height, width: '100%', borderWidth: 3, position: 'absolute', top: CustomStyle.height, borderColor: 'black', borderLeftWidth: 0, borderRightWidth: 0 }, BarStyle]} pointerEvents="none"></View>

    </View>);
}));

const FlawedFlatSelector= React.forwardRef(({ Data, CustomStyle = { height: 50 }, TxtStyle, BarStyle, initialScrollIndex = 0, onMomentumScrollEnd }, ref) => {

    const Scrollval = useState(() => initialScrollIndex);

    return (<View style={[CustomStyle, { height: CustomStyle.height * 3 }]}>
        <FlatList
            data={Data}
            ref={ref}
            viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
            renderItem={({ item }) => (
                <View
                    style={{
                        height: CustomStyle.height,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text style={[{ fontWeight: 'bold', color: 'white' }, TxtStyle]}>{item.title}</Text>
                </View>
            )}
            onViewableItemsChanged={({ viewableItems, _ }) => {
                try {
                    Scrollval[0] = viewableItems[1]['index'] - 1;
                }
                catch {
                    Scrollval[0] = Data.length - 3;
                }
            }}
            onMomentumScrollEnd={() => { onMomentumScrollEnd(Scrollval[0]) }}
            keyExtractor={(_, index) => index.toString()}
            getItemLayout={(_, index) => {
                return { length: CustomStyle.height, offset: CustomStyle.height * index, index };
            }}
            initialScrollIndex={initialScrollIndex}
            showsVerticalScrollIndicator={false}
            initialNumToRender={3}
            windowSize={9}
            snapToOffsets={Data.map((x, i) => (i * CustomStyle.height))}
        />
        <View style={{ height: CustomStyle.height, width: '100%', position: 'absolute', top: 0, backgroundColor: 'rgba(82, 82, 82,0.9)' }} pointerEvents="none"></View>
        <View style={{ height: CustomStyle.height, width: '100%', position: 'absolute', top: CustomStyle.height * 2, backgroundColor: 'rgba(82, 82, 82,0.9)' }} pointerEvents="none"></View>

        <View style={[{ height: CustomStyle.height, width: '100%', borderWidth: 3, position: 'absolute', top: CustomStyle.height, borderColor: 'black', borderLeftWidth: 0, borderRightWidth: 0 }, BarStyle]} pointerEvents="none"></View>
    
    </View>);
});


const Styles = StyleSheet.create({
    reverse_btn: {
        width: '10.5%',
        position: 'absolute',
        alignItems: 'center',
        height: ScreenHeight * 0.04,
    },
    reverse_wrapper: {
        flexDirection: 'row',
        top: editArrowSize/1.5,
        left:-editArrowSize/2

    },
    reverse_arrowtop: {
        borderRightWidth: editArrowSize,
        borderTopWidth: editArrowSize,
        borderTopColor: 'transparent',
        borderStyle: 'solid',
        borderColor: 'black',
    },
    reverse_arrowbottom: {
        borderRightWidth: editArrowSize,
        borderBottomWidth: editArrowSize,
        borderBottomColor: 'transparent',
        borderStyle: 'solid',
        borderColor: 'black',
    },
    reverse_arrowtail: {
        height: editArrowSize * 2.5,
        width: editArrowSize * 2,
        borderWidth: editArrowTailWidth,
        borderStyle: 'solid',
        borderColor: 'black',
        marginTop: editArrowSize/1.5,
        borderLeftWidth: 0,
    },

    close_btn: {
        height: ScreenHeight * 0.05,
        width: '10.5%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',

    },
    close_btn_bar: {
        height: '11%',
        width: '60%',
        backgroundColor: 'black',
        position: 'absolute'
    },

    tick_btn: {
        height: ScreenHeight * 0.05,
        width: '11%',
        alignItems: 'center',

        
    },
    tick_btn_bar: {
        borderWidth: 5,
        height: '30%',
        borderTopWidth: 0,
        borderRightWidth: 0,
        width: '60%',
        marginTop: '25%',
        transform: [{
            rotate: '-45deg'
        }]
    },

    trash_btn: {
        height: ScreenHeight * 0.05,
        width: '10.5%',
        justifyContent: 'center'
    },
    trash_top: {
        width: '65%',
        alignSelf: 'center'
    },
    trash_handle: {
        width: '50%',
        height: ScreenHeight * 0.005,
        backgroundColor: 'black',
        alignSelf: 'center'
    },
    trash_lid: {
        width: '100%',
        height: ScreenHeight * 0.005,
        backgroundColor: 'black'
    },
    trash_bin: {
        borderWidth: ScreenHeight * 0.005,
        height: '50%',
        width: '45%',
        alignSelf: 'center',
        borderTopWidth: 0,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    trash_bin_bar: {
        backgroundColor: 'black',
        width: ScreenHeight * 0.0035,
    },

    popup: {
        zIndex: 2,
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        overflow: 'hidden',
        elevation: 5
    },

    timeline_bar_top: {
        flex: 1,
        borderColor: 'white'

    },
    timeline_bar_bottom: {
        borderRightWidth: timelineBarWidth,
        height: '50%',
        width: timelineTimeWidth / 2,
        borderBottomWidth: timelineBarWidth,
        borderColor: 'white'
    },

    fixed_btn: {
        flex:1,
        borderRadius: 10,
        height: ScreenHeight * 0.06,
        width: ScreenHeight * 0.06,
        backgroundColor: 'black',
        position: 'absolute',
        zIndex: 1,
        right: ScreenHeight * 0.02,
        bottom: ScreenHeight * 0.02,
        elevation: 4,
        justifyContent:'center',
        alignItems:'center'
    },

    newtask_select_time_btn: {
        height: 20,
        justifyContent:'center',
        borderRadius:5
    },
    newtask_select_time_btn_upbar: {
        borderWidth: 3,
        borderColor: 'white',
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        width: 13,
        height: 13,
        alignSelf: 'center',
        top: '30%',
        transform: [{
            rotate: '-45deg'
        }]
    },
    newtask_select_time_btn_downbar: {
        borderWidth: 3,
        borderColor: 'white',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        width: 13,
        height: 13,
        alignSelf: 'center',
        bottom: '20%',
        transform: [{
            rotate: '45deg'
        }]
    },
    newtask_select_time_btn_rightbar:{
        borderWidth: 3,
        borderColor: 'white',
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        width: 13,
        height: 13,
        alignSelf: 'center',
        top: '3%',
        right: '15%',
        transform: [{
            rotate: '45deg'
        }]
    },
    newtask_select_time_btn_leftbar: {
        borderWidth: 3,
        borderColor: 'white',
        borderBottomWidth: 0,
        borderRightWidth: 0,
        width: 13,
        height: 13,
        alignSelf: 'center',
        top: '3%',
        left:'10%',
        transform: [{
            rotate: '-45deg'
        }],
    },

    item: {
        justifyContent: 'center'
    },
    title: {
        color: 'white',
        textAlign: 'center'
    },
});


module.exports = { 
    setItem, getItem, daysInMonth,dayOnDate,
    NavBtn, CloseBtn, ReverseBtn, TrashBtn, TickBtn, UpBtn, DownBtn, RightBtn, LeftBtn, ColorPicker,
    ScrollSelector, FlawedFlatSelector,
    ScreenHeight, ScreenWidth,
    Styles, colorWheel, days_arr, months_arr,
    timelineTimeWidth, timelineTimeHeight, timelineBarWidth, timelinetaskWrapperHeight, NeedleWidth,
    Options_DATA,Month_DATA
};