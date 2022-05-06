import { emailUSer, MONGO_SERVER, MONGODB_NAME } from "./enviroment/variables";

import XLSX from "xlsx";
import { TypeDate } from "./interfaces/dates";
import { getCalendarsFromDb } from "./helpers/helpers";
const mongoose = require("mongoose");

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

try {
  mongoose.connect(`mongodb+srv://${MONGO_SERVER}/${MONGODB_NAME}`).then(() => {
    console.log("connected to the db");
    const calendarsZoho = getTipoCitasFromXlsx(ruta);
    if (calendarsZoho.length < 1) {
      console.log("no data was found");
    }
  });
} catch (err) {
  console.log("No se pudo conectar a a base de datos");
}
