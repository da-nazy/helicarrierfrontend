export type user={
    id:number,
     name:string,
     category:string,
      image: string,
      date:string
}

export type InitialStateTypes={
    userSearch:user[]|[],
    user:user[]|[],
}

export type myFilter={
    selected:boolean,
    name:string,
}