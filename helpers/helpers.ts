const mongoose = require("mongoose");
import { MONGO_SERVER, MONGODB_NAME } from "../enviroment/variables";
import { TypeDate } from "../interfaces/dates";
import CalendarModels, { Calendar, CalendarInfo } from "../models/Calendars";

export const getCalendarsFromDb = async (email: string) => {
  const userCalendar = await CalendarModels.findOne({ email }).exec();

  return userCalendar;
};

export const tranformExcelDataToCalendarInfo = (
  calendarsFromEcxel: TypeDate[]
) => {
  const calendarsInfo: CalendarInfo[] = calendarsFromEcxel.map(
    (calendarFomEcxel) => {
      return {
        name: calendarFomEcxel.Nombre,
        calendarId: calendarFomEcxel.Calendar_ID,
        channelId: "",
        description: calendarFomEcxel["Tipo de Cita"],
        dueDate: "",
        isActive: true,
        watchedResourceId: "",
        syncToken: "",
      };
    }
  );

  return calendarsInfo;
};

export const createUserWithCalendars = async (
  email: string,
  calendarsFromEcxel: TypeDate[]
) => {
  const calendarsInfo = tranformExcelDataToCalendarInfo(calendarsFromEcxel);
  const userRecorCalendarData: Calendar = {
    email,
    token: "",
    isActiveAll: true,
    loginUserUsuario: "NOT_SET",
    calendarsInfo,
  };

  console.log(userRecorCalendarData);

  const newUserCalemndar = await CalendarModels.create(userRecorCalendarData);

  return newUserCalemndar;
};
