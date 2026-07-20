const { PrismaClient } = require('@prisma/client');

// Single PrismaClient instance shared across the app (avoids connection leaks).
const prisma = new PrismaClient();

module.exports = { prisma };
