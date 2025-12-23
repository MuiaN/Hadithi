import { PrismaClient, Role } from '@prisma/client';
import { users, userCredentials } from '../lib/mockData/users';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  for (const u of users) {
    // Skip guest user as it has no credentials and is a placeholder
    if (u.email === 'guest@example.com') {
      continue;
    }

    const password = userCredentials[u.email as keyof typeof userCredentials];
    if (!password) {
      console.warn(`No password found for ${u.email}, skipping user.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        password: hashedPassword,
        role: u.role as Role, // Cast string to the Role enum
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });