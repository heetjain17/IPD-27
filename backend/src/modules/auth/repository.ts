import { db } from '../../db/client.js';
import { users, type NewUser, type User } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user!;
}

export async function getUserByAuthId(authId: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.authId, authId),
  });
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function getUserById(id: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}
