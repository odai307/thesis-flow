require('dotenv').config();
const { prisma } = require('../src/lib/prisma');
const { randomUUID } = require('node:crypto');
const bcrypt = require('bcryptjs');

// The department and its coordinator form a circular FK
// (department.coordinatorId -> user.id, user.departmentId -> department.id).
// Postgres FKs are NOT DEFERRABLE by default, so `SET CONSTRAINTS ALL DEFERRED`
// is a no-op. Instead we temporarily disable FK enforcement for the session,
// insert both rows with known IDs, then re-enable it.
async function createDepartmentWithCoordinator(
  name,
  coordFirstName,
  coordLastName,
  coordEmail,
  passwordHash,
) {
  const deptId = randomUUID();
  const coordId = randomUUID();
  const [department, coordinator] = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET session_replication_role = replica');
    const department = await tx.department.create({
      data: { id: deptId, name, coordinatorId: coordId },
    });
    const coordinator = await tx.user.create({
      data: {
        id: coordId,
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

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // One department, with exactly one coordinator.
  const cs = await createDepartmentWithCoordinator(
    'Computer Science',
    'Diana',
    'Mensah',
    'diana.mensah@thesisflow.dev',
    passwordHash,
  );

  // One supervisor in the same department.
  const supervisor = await prisma.user.create({
    data: {
      firstName: 'Kwame',
      lastName: 'Osei',
      email: 'kwame.osei@thesisflow.dev',
      passwordHash,
      role: 'supervisor',
      departmentId: cs.department.id,
    },
  });

  // One student in the same department.
  const student = await prisma.user.create({
    data: {
      firstName: 'Ama',
      lastName: 'Boateng',
      email: 'ama.boateng@thesisflow.dev',
      passwordHash,
      role: 'student',
      departmentId: cs.department.id,
    },
  });

  // One thesis: student -> supervisor, in the coordinator's department.
  const thesis = await prisma.thesis.create({
    data: {
      title: 'A Sample Thesis on ThesisFlow',
      studentId: student.id,
      supervisorId: supervisor.id,
      departmentId: cs.department.id,
      status: 'submitted',
    },
  });

  const submission = await prisma.submission.create({
    data: {
      thesisId: thesis.id,
      versionNumber: 1,
      fileUrl: 'uploads/sample-v1.pdf',
      fileType: 'pdf',
      status: 'pending_review',
    },
  });

  await prisma.thesis.update({
    where: { id: thesis.id },
    data: { currentSubmissionId: submission.id },
  });

  console.log('Seed complete:', {
    department: cs.department.name,
    coordinator: cs.coordinator.email,
    supervisor: supervisor.email,
    student: student.email,
    thesis: thesis.id,
    submission: submission.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
