import { prisma } from "../src/config/prisma";

console.log("Prisma keys:", Object.keys(prisma));
console.log("Is resena defined?", (prisma as any).resena !== undefined);
console.log("Is resena a function or object?", typeof (prisma as any).resena);
