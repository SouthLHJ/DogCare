import { createContext, useEffect, useReducer, useState } from "react";
import { ActivityIndicator } from "react-native";



export const ConsumeContext = createContext({
    data : [],
    dispatch : consumeReducer,
})

// 
const consumeReducer = (state={}, action) => {
    switch (action.type) {
        case "update":
            return action.payload;
        case "nothing":
            return null;

    }
    return null;
}



// Provider 함수
export function ConsumeContextProvider({ children }) {
    const [data, dispatch] = useReducer(consumeReducer,null);
    const [done,setDone] = useState(false);
    
    useEffect(()=>{
        
    },[])

    // if(!done){
    //     return (<ActivityIndicator size={60}/>)
    // }

    return (
        <ConsumeContext.Provider value={{data, dispatch}}>
            {children}
        </ConsumeContext.Provider>
    )


}