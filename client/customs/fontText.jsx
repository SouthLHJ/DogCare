import { Text } from 'react-native';
import { colors } from './globalStyle';

function FontText({style,children,bold,title}) {
    let text;
    if(!title)   {
        if(bold =="extra"){
            text = (<Text style={[{fontSize : 12, color: colors.black},style,{fontFamily : "GothicA1-ExtraBold"}]}>{children}</Text>);
        }else if (bold == "semi"){
            text = (<Text style={[{fontSize : 12, color: colors.black},style,{fontFamily : "GothicA1-SemiBold"}]}>{children}</Text>);
        }else if(bold){
            text = (<Text style={[{fontSize : 12, color: colors.black},style,{fontFamily : "GothicA1-Bold"}]}>{children}</Text>);
        }else{
            text = (<Text style={[{fontSize : 12, color: colors.black},style,{fontFamily : "GothicA1-Regular"}]}>{children}</Text>);
        } 
    }else{
        if(title, bold){
            text = (<Text style={[{fontSize : 12, color: colors.black},style,{fontFamily : "Hyemin-Bold"}]}>{children}</Text>);
            // text = (<Text style={[{fontSize : 12, color: colors.black},style,{fontFamily : "BlackHanSans-Regular"}]}>{children}</Text>);
        } else if (title) {
            text = (<Text style={[{fontSize : 12, color: colors.black},style,{fontFamily : "Hyemin-Regular"}]}>{children}</Text>);
        }
    }


    return ( 
        <>
            {text}
        </>
    );
}

export default FontText;