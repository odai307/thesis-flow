require('dotenv').config();
const { prisma } = require('../src/lib/prisma');
const { randomUUID } = require('node:crypto');
const bcrypt = require('bcryptjs');
const { generateUniqueIndexNumber } = require('../src/shared/indexGenerator');

// Circular FK handling (department.coordinatorId -> user.id, user.departmentId -> department.id)
async function createDepartmentWithCoordinator(
  name,
  coordFirstName,
  coordLastName,
  coordEmail,
  passwordHash
) {
  const deptId = randomUUID();
  const coordId = randomUUID();
  const indexNumber = await generateUniqueIndexNumber();

  const [department, coordinator] = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET session_replication_role = replica');
    const department = await tx.department.create({
      data: { id: deptId, name, coordinatorId: coordId },
    });
    const coordinator = await tx.user.create({
      data: {
        id: coordId,
        indexNumber,
        firstName: coordFirstName,
        lastName: coordLastName,
        email: coordEmail,
        passwordHash,
        role: 'coordinator',
        departmentId: deptId,
      },
    });
    await tx.$executeRawUnsafe('SET session_replication_role = DEFAULT');
    return [department, coordinator];
  });
  return { department, coordinator };
}

async function createSupervisor(firstName, lastName, email, departmentId, passwordHash) {
  const indexNumber = await generateUniqueIndexNumber();
  return prisma.user.create({
    data: {
      indexNumber,
      firstName,
      lastName,
      email,
      passwordHash,
      role: 'supervisor',
      departmentId,
    },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Seeding departments, coordinators, and supervisors...');

  // 1. Maths Department
  const maths = await createDepartmentWithCoordinator(
    'Maths',
    'Math',
    'Coordinator',
    'mathcoordinator@gmail.com',
    passwordHash
  );
  await createSupervisor('Math', 'Supervisor 1', 'mathsupervisor1@gmail.com', maths.department.id, passwordHash);
  await createSupervisor('Math', 'Supervisor 2', 'mathsupervisor2@gmail.com', maths.department.id, passwordHash);
  await createSupervisor('Math', 'Supervisor 3', 'mathsupervisor3@gmail.com', maths.department.id, passwordHash);

  // 2. Comp Sci Department
  const compSci = await createDepartmentWithCoordinator(
    'Comp Sci',
    'CompSci',
    'Coordinator',
    'compscicoordinator@gmail.com',
    passwordHash
  );
  await createSupervisor('CompSci', 'Supervisor 1', 'compscisupervisor1@gmail.com', compSci.department.id, passwordHash);
  await createSupervisor('CompSci', 'Supervisor 2', 'compscisupervisor2@gmail.com', compSci.department.id, passwordHash);
  await createSupervisor('CompSci', 'Supervisor 3', 'compscisupervisor3@gmail.com', compSci.department.id, passwordHash);

  // 3. Engineering Department
  const engineering = await createDepartmentWithCoordinator(
    'Engineering',
    'Engineering',
    'Coordinator',
    'engineeringcoordinator@gmail.com',
    passwordHash
  );
  await createSupervisor('Engineering', 'Supervisor 1', 'engineeringsupervisor1@gmail.com', engineering.department.id, passwordHash);
  await createSupervisor('Engineering', 'Supervisor 2', 'engineeringsupervisor2@gmail.com', engineering.department.id, passwordHash);
  await createSupervisor('Engineering', 'Supervisor 3', 'engineeringsupervisor3@gmail.com', engineering.department.id, passwordHash);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
