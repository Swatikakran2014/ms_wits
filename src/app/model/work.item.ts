export class WorkItems{
    id?:string;
    title?:string;
    child?:WorkItems[] = [];
    parent?:string = '';
    visited?:boolean = false;
    assigned?:boolean = false;
}