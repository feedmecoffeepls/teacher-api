import { db } from "../db/db";
import { registrations, InsertRegistration, SelectRegistration } from "../db/schema";

export class RegistrationModel {
  createRegistration = async (data: InsertRegistration): Promise<SelectRegistration> => {
    const [newRegistration] = await db.insert(registrations).values(data).returning();
    return newRegistration;
  }
}
