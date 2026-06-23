/*
  Warnings:

  - The values [Clothing,Baby_Cloths] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('MensClothes', 'WomensClothes', 'KidsClothes', 'Shoes');
ALTER TABLE "public"."product" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "product" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
ALTER TABLE "product" ALTER COLUMN "category" SET DEFAULT 'MensClothes';
COMMIT;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "category" SET DEFAULT 'MensClothes';
