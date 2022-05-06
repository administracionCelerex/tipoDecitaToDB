import { emailUSer } from "./enviroment/variables";

import XLSX from "xlsx";
import { TypeDate } from "./interfaces/dates";

const ruta = "./data/tipocitas.xls";

const getTipoCitasFromXlsx = (fileRoot: string) => {
  try {
    const workbook = XLSX.readFile(fileRoot);
    const workbookSheet = workbook.SheetNames;
    //console.log(workbookSheet);
    const sheet = workbookSheet[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    const typeDatesArray = dataExcel as TypeDate[];
    return typeDatesArray;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const calendarsZoho = getTipoCitasFromXlsx(ruta);
