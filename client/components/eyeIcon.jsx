import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { colors } from '../customs/globalStyle';

function EyeIcon({isPublic, onSetPublic}) {
    const [eye, setEye] = useState(false);

    useEffect(() => {
        // console.log(isPublic)
        setEye(isPublic);
    }, [isPublic])


    return (
        <Pressable style={{padding: 4, paddingRight: 6}} onPress={() => {
            if(isPublic) {
                onSetPublic(false);
            } else {
                onSetPublic(true);
            };
        }} >
            {isPublic ? 
            <Ionicons name="md-eye-outline" size={24} color={colors.black} /> :
            <Ionicons name="md-eye-off-outline" size={24} color={colors.semi} />
            }
        </Pressable>
        );
}

export default EyeIcon;