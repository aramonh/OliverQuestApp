
export interface NPCNormalDialog {
    id?:string;
    numInteraction:number;
    npc:any;
    
    questSorprise:any;
    questSorpriseAnsGood?:string;
    questSorpriseAnsBad?:string;
    numPages:number;
    contenidoPages:string[];


    accionCausa?:any;
    accionConsecuencia?:any;
    
    boolPlus?:any;
    idOriginal?:string;


}


export interface NPCSabioDialogAnswer {
    id?:string;
    numInteraction?:number;
    sabio:string;
    tipo:string;

    numCorrectas?:number;
    numErroneas?:number;

    numPages:number;
    contenidoPages:string[]

    idPrev?:string;
    idProvCorrecta?:string;
    idProvErronea?:string;

    boolInteractionGoAndBack?:any;
    interactionGoAndBack?:string;


    
    accionCausa?:any;
    accionConsecuencia?:any;
    
    boolPlus?:any;
    idOriginal?:string;
}




export interface NPC{
    id?:string;
    name:string;
    town:string;
    actions?:any[];
}

export interface Sabio{
    id?:string;
    name:string;
    town:string;
    category:string;
}

export interface AccionCausaConsecuencia{
    id?:string;
    name:string;
    npcCausa:any;
    boolConvCausa?:any;
    npcConsecuencia?:any;
    boolConvConsecuencia?:any;
    description:string;
}


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
export interface Action{
    action:string;
}
export interface Town{
    town:string;
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


