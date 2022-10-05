import { Text } from 'react-native';

function FontText({style,children,bold,title}) {
    let text;
    if(bold)   {
        if(bold =="extra"){
            text = (<Text style={[{fontSize : 12},style,{fontFamily : "GothicA1-ExtraBold"}]}>{children}</Text>);
        }else if (bold == "semi"){
            text = (<Text style={[{fontSize : 12},style,{fontFamily : "GothicA1-SemiBold"}]}>{children}</Text>);
        }else{
            text = (<Text style={[{fontSize : 12},style,{fontFamily : "GothicA1-Bold"}]}>{children}</Text>);
        }
    }else{
        if(title){
            text = (<Text style={[{fontSize : 12},style,{fontFamily : "BlackHanSans-Regular"}]}>{children}</Text>);
        }else{
            text = (<Text style={[{fontSize : 12},style,{fontFamily : "GothicA1-Regular"}]}>{children}</Text>);
        }
    }


    return ( 
        <>
            {text}
        </>
    );
}

export default FontText;