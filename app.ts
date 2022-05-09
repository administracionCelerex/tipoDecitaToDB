import {
  emailUSer,
  MONGO_SERVER,
  MONGODB_NAME,
  STAGE
} from "./enviroment/variables";

import XLSX from "xlsx";
import { TypeDate } from "./interfaces/dates";
import {
  createUserWithCalendars,
  getCalendarsFromDb,
  getCalendarsZohoNoInFatabase,
  updateCalendarsOfUser,
} from "./helpers/helpers";
const mongoose = require("mongoose");

const ruta = `./data/${STAGE}/tipocitas.xls`;

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

      const calendarsNoinDB = getCalendarsZohoNoInFatabase(
        calendarsZoho,
        calendarsInfo
      );

      if (calendarsNoinDB.length < 1) {
        console.log(
          `Todos los Calendarios del usuario ${emailUSer} ya estan en la base de datos`
        );
        return;
      }

      const userUpdatedCalen = await updateCalendarsOfUser(
        emailUSer,
        calendarsNoinDB
      );

      if (!userUpdatedCalen) {
        console.log(
          `Al usuario ${emailUSer} NO  se le actualizo nada revisar si fue un error`
        );

        return;
      }

      console.log(
        `${emailUSer} Actualizado correctamente agregado ${calendarsNoinDB.length} nuevos`
      );
    });
} catch (err) {
  console.log("No se pudo conectar a a base de datos");
}
