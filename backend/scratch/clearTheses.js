const { prisma } = require('../src/lib/prisma');

async function clearThesesOnly() {
  console.log('Clearing comments, notifications, submissions, and theses...');
  await prisma.comment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.thesis.updateMany({ data: { currentSubmissionId: null } });
  await prisma.submission.deleteMany();
  await prisma.thesis.deleteMany();
  console.log('Cleared all thesis records successfully. Users and departments remain intact.');
}

clearThesesOnly()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
