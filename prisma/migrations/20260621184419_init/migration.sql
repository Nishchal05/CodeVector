-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Clothing', 'Shoes', 'Baby_Cloths');

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'Clothing',
    "pricing" DOUBLE PRECISION NOT NULL,
    "Updated_at" TIMESTAMP(3) NOT NULL,
    "Create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "product_id_key" ON "product"("id");
