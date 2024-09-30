import { notTable } from "./notTable";
import { Table } from "./table";

  export class Layout{
    kitchen: notTable = new notTable();
    toilet: notTable = new notTable();
    tables: Table[] = [];
  }