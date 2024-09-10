const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUser(userId) {
  try {
    // Check if the user exists before trying to delete
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    console.log('User deleted successfully:', deletedUser);
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage
deleteUser('some-user-id')
  .then(() => console.log('Deletion completed'))
  .catch((err) => console.error('Error:', err));
