-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('ADMIN', 'NORMAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "RoleUser" NOT NULL DEFAULT 'NORMAL';
