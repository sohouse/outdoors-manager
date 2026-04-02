import { PrismaClient } from "@prisma/client"

// 添加类型检查
const prismaClient = new PrismaClient();

export {prismaClient}