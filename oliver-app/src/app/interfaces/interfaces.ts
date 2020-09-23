export interface Quest {
    id?:string;
    uid?:string;
    difficulty:string;
    category:string;
    question:string;
    answer:string;
    ansOptionsA:string;
    ansOptionsB:string;
    ansOptionsC:string;
    ansOptionsD:string;

}

export interface Difficulty{
    difficulty:string;
}

export interface Category{
    categoria:string;
}


export interface User {
    uid?:string,
    email: string;
    name?:string;
    password?: string;
    picture?:any;
}



//Ejemplos
export interface Aeroline {
    name: string;
    location: string;
    details: string;
    airplanes: number;
}

export interface Post {
    title: string;
    details: string;
}


