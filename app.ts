import { emailUSer, MONGO_SERVER, MONGODB_NAME } from "./enviroment/variables";

import XLSX from "xlsx";
import { TypeDate } from "./interfaces/dates";
import {
  createUserWithCalendars,
  getCalendarsFromDb,
  getCalendarsZohoNoInFatabase,
} from "./helpers/helpers";
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
  mongoose
    .connect(`mongodb+srv://${MONGO_SERVER}/${MONGODB_NAME}`)
    .then(async () => {
      console.log("connected to the db");
      const calendarsZoho = getTipoCitasFromXlsx(ruta);
      if (calendarsZoho.length < 1) {
        console.log("no data was found");
      }
      const calendarUser = await getCalendarsFromDb(emailUSer);
      if (!calendarUser) {
        console.log("No existe el usuario con ese Email en la Base de datos");
        //create the user with all the caledars
        const newUserCalendar = await createUserWithCalendars(
          emailUSer,
          calendarsZoho
        );
        //console.log(newUserCalendar);
        console.log(
          `El usaurio ${emailUSer} ha sido creado con sus respectivos calendarios`
        );
        return;
      }
      let { calendarsInfo } = calendarUser;

      if (!calendarsInfo) {
        calendarsInfo = [];
      }
      //console.log("Calendarios actuales del usuario");

      //console.log(calendarsInfo);

      //console.log("Calendarios de Zoho");
      //console.log(calendarsZoho);

      getCalendarsZohoNoInFatabase(calendarsZoho, calendarsInfo);
    });
} catch (err) {
  console.log("No se pudo conectar a a base de datos");
}
