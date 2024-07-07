import { db } from "../db/db.ts";
import { registrations, InsertRegistration, SelectRegistration } from "../db/schema.ts";

export class RegistrationModel {
  createRegistration = async (data: InsertRegistration): Promise<SelectRegistration> => {
    const [newRegistration] = await db.insert(registrations).values(data).returning();
    return newRegistration;
  }
}
