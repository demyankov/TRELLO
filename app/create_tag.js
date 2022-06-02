export function createTag (tagName, className, text){
    let tag = document.createElement(tagName)
    className ? tag.classList.add(className):null
    text ? tag.innerText = text:null
    return tag
}

export function createInput (className, type, text){
    let tag = document.createElement('input')
    className ? tag.classList.add(className):null
    type ? tag.setAttribute ('type', type):tag.setAttribute ('type', 'text')
    text ? tag.setAttribute ('placeholder', text):null 
    return tag
}

// export function createTextArea (className, type, text){
//     let tag = document.createElement('textarea')
//     className ? tag.classList.add(className):null
//     type ? tag.setAttribute ('type', type):tag.setAttribute ('type', 'text')
//     text ? tag.setAttribute ('placeholder', text):null 
//     return tag
// }

export function createButton (className, type, text){
    let tag = document.createElement('button')
    className ? tag.classList.add(className):null
    type ? tag.setAttribute ('type', type):tag.setAttribute ('type', 'button')
    text ? tag.innerText =text:null    
    return tag
}


export function appendTag () {
    for (let i =1; i<arguments.length;i++) {
        arguments[0].append(arguments[i])  
    };      
}