import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const runs = await prisma.payrollRun.findMany();
    console.log("PRISMA FETCH:", runs.length);
}
main();
