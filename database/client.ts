import { PrismaClient } from "@prisma/client"

// 添加类型检查
const client = new PrismaClient();

export {client}