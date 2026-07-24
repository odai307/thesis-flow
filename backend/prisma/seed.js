require('dotenv').config();
const { prisma } = require('../src/lib/prisma');
const bcrypt = require('bcryptjs');
const { generateUniqueIndexNumber } = require('../src/shared/indexGenerator');

async function createDepartmentWithCoordinator(
  name,
  coordFirstName,
  coordLastName,
  coordEmail,
  passwordHash
) {
  const indexNumber = await generateUniqueIndexNumber();

  // 1. Create coordinator user first
  const coordinator = await prisma.user.create({
    data: {
      indexNumber,
      firstName: coordFirstName,
      lastName: coordLastName,
      email: coordEmail,
      passwordHash,
      role: 'coordinator',
    },
  });

  // 2. Create department connecting coordinator.id
  const department = await prisma.department.create({
    data: {
      name,
      coordinatorId: coordinator.id,
    },
  });

  // 3. Link coordinator's departmentId back to department.id
  await prisma.user.update({
    where: { id: coordinator.id },
    data: { departmentId: department.id },
  });

  return { department, coordinator };
}

async function main() {
  console.log('Seeding cloud PostgreSQL database (Neon.tech)...');

  // Clean existing records in dependency order
  await prisma.comment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.thesis.updateMany({ data: { currentSubmissionId: null } });
  await prisma.submission.deleteMany();
  await prisma.thesis.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Computer Science Department
  const { department: compSci } = await createDepartmentWithCoordinator(
    'Comp Sci',
    'CompSci',
    'Coordinator',
    'compscicoordinator@gmail.com',
    passwordHash
  );

  // 2. Mathematics Department
  const { department: maths } = await createDepartmentWithCoordinator(
    'Maths',
    'Math',
    'Coordinator',
    'mathcoordinator@gmail.com',
    passwordHash
  );

  // 3. Engineering Department
  const { department: eng } = await createDepartmentWithCoordinator(
    'Engineering',
    'Engineering',
    'Coordinator',
    'engineeringcoordinator@gmail.com',
    passwordHash
  );

  // Seed 3 Supervisors per Department
  const supervisorConfigs = [
    { dept: compSci, prefix: 'CompSciSupervisor', emailPrefix: 'compscisupervisor' },
    { dept: maths, prefix: 'MathSupervisor', emailPrefix: 'mathsupervisor' },
    { dept: eng, prefix: 'EngineeringSupervisor', emailPrefix: 'engineeringsupervisor' },
  ];

  for (const config of supervisorConfigs) {
    for (let i = 1; i <= 3; i++) {
      const indexNumber = await generateUniqueIndexNumber();
      await prisma.user.create({
        data: {
          indexNumber,
          firstName: config.prefix,
          lastName: String(i),
          email: `${config.emailPrefix}${i}@gmail.com`,
          passwordHash,
          role: 'supervisor',
          departmentId: config.dept.id,
        },
      });
    }
  }

  console.log('✅ Seeding complete! Cloud database is populated with 3 departments, 3 coordinators, and 9 supervisors.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
