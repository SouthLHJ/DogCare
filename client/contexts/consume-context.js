import { createContext, useEffect, useReducer, useState } from "react";
import { ActivityIndicator } from "react-native";



export const ConsumeContext = createContext({
    data : [],
    dispatch : consumeReducer,
})

export const SearchContext  = createContext({
    search  : [],
    searchdispatch :searchReducer
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
const searchReducer = (state={}, action) => {
    switch (action.type) {
        case "search": 
            return action.payload;
        case "nothing":
            return null;

    }
    return null;
}



// Provider 함수
export function ConsumeContextProvider({ children }) {
    const [data, dispatch] = useReducer(consumeReducer,null);
    const [search, searchdispatch ] = useReducer(searchReducer,null);
    const [done,setDone] = useState(false);
    
    useEffect(()=>{
        
    },[])

    // if(!done){
    //     return (<ActivityIndicator size={60}/>)
    // }

    return (
        <ConsumeContext.Provider value={{data, dispatch}}>
            <SearchContext.Provider value={{search, searchdispatch}}>
                {children}
            </SearchContext.Provider>
        </ConsumeContext.Provider>
    )


}