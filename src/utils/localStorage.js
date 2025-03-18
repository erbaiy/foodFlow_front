
export const saveState = (key,state) => {
    try{
        localStorage.setItem(key,JSON.stringify(state));
    }
    catch(error){
        console.error("error saving state into local storage",error);
    }
}

export const loadState = (key) => {
    try{
    const state =localStorage.getItem(key);
    if(!state) return undefined;
    return JSON.parse(state);
    }
    catch(error){
        console.error("error loading state from localstorage",error);
    }
}

export const deleteState = (key) =>{
    try{
        localStorage.removeItem(key);
        
    }
    catch(error){
        console.error("error deleting state from local storage",error);
    }
}