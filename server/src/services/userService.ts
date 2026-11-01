import { prisma } from '../config';

/**
 * Ensures a valid User row exists in the database.
 * If userId is provided, checks if that user exists; if not, checks by pseudonym,
 * or creates a user row so foreign key constraints on Post, Comment, Reaction, and Bookmark never fail.
 */
export async function ensureUser(userId?: string | null, pseudonym?: string | null, avatarSeed?: string | null) {
  // 1. If valid userId provided, check if it exists in DB
  if (userId) {
    const existingById = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (existingById) {
      return existingById;
    }
  }

  // 2. If pseudonym provided, check if user with that pseudonym exists
  const effectivePseudonym = pseudonym?.trim() || `User_${Math.floor(1000 + Math.random() * 9000)}`;
  const existingByPseudo = await prisma.user.findUnique({
    where: { pseudonym: effectivePseudonym },
  });
  if (existingByPseudo) {
    return existingByPseudo;
  }

  // 3. Create a fresh user record with the provided userId (or generated uuid) and pseudonym
  try {
    return await prisma.user.create({
      data: {
        ...(userId ? { id: userId } : {}),
        pseudonym: effectivePseudonym,
        avatarSeed: avatarSeed || 'violet',
      },
    });
  } catch (err) {
    // In case of any concurrent collision on pseudonym, append a random salt
    const saltedPseudonym = `${effectivePseudonym}_${Math.floor(10 + Math.random() * 89)}`;
    return await prisma.user.create({
      data: {
        pseudonym: saltedPseudonym,
        avatarSeed: avatarSeed || 'violet',
      },
    });
  }
}
