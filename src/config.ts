

export const config = {

    serverHost:"https://hightex.okta",

}


export const route =(route="/")=>{

    return `${config.serverHost}${route}`

}