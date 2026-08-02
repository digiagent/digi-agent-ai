-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "circleTxId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_circleTxId_key" ON "Transaction"("circleTxId");
