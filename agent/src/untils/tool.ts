export const encodeWsData = (data: any) => {
    if(typeof(data) === 'string'){
        return encodeURIComponent(data)
    }
    if(typeof(data) === 'object'){
        return encodeURIComponent(JSON.stringify(data))
    }
}

export const decodeWsData = (data: string) => {
    if(data.indexOf('{')===0|| data.indexOf('[')===0){
        return JSON.parse(decodeURIComponent(data))
    }
    return decodeURIComponent(data)
}