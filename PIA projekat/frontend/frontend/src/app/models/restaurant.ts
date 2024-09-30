import { Dish } from "./dish";
import { Layout } from "./layout";
import { Table } from "./table";
import { WorkingHour } from "./workingHour";

export class Restaurant{
    name: string = "";
    type: string = "";
    address: string = "";
    description: string = "";
    contactPerson: string = "";
    picture: string = "";
    workingHours: WorkingHour[] = [];
    layout: Layout = new Layout();
    menu: Dish[] = [];
    waiters: string[] = []; //username-ovi konobara
}