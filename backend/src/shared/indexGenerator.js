const crypto = require('crypto');
const { prisma } = require('../lib/prisma');

/**
 * Generates a cryptographically secure 8-digit unique index number (e.g. "10894210").
 * Checks PostgreSQL to guarantee 100% uniqueness without collisions.
 */
async function generateUniqueIndexNumber() {
  let isUnique = false;
  let indexNumber = '';

  while (!isUnique) {
    // Generate a random 8-digit number between 10000000 and 99999999
    indexNumber = String(crypto.randomInt(10000000, 100000000));

    // Verify it doesn't already exist in the database
    const existing = await prisma.user.findUnique({ where: { indexNumber } });
    if (!existing) {
      isUnique = true;
    }
  }

  return indexNumber;
}

module.exports = { generateUniqueIndexNumber };
