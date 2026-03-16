-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'PHARMA', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('REVIEW', 'APPROVED', 'ADJUSTMENT', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ico" TEXT NOT NULL DEFAULT '💊',
    "bg" TEXT NOT NULL DEFAULT 'rgba(45,134,83,.12)',
    "color" TEXT NOT NULL DEFAULT '#1f6340',

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'mg',
    "ico" TEXT DEFAULT '💊',
    "desc" TEXT,
    "cpg" DOUBLE PRECISION NOT NULL,
    "doses" DOUBLE PRECISION[],
    "factor" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "partnerId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "wa" TEXT NOT NULL,
    "rt" TEXT NOT NULL,
    "pharmacistEmail" TEXT NOT NULL,
    "specs" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formulaName" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "caps" INTEGER NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'REVIEW',
    "capCost" DOUBLE PRECISION NOT NULL,
    "capsTotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "obs" TEXT,
    "pharmacistNote" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "ico" TEXT,
    "dosePerCap" DOUBLE PRECISION NOT NULL,
    "cpg" DOUBLE PRECISION NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "rawCost" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'VitaLab',
    "factor" DOUBLE PRECISION NOT NULL DEFAULT 3.5,
    "capCost" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "forms" TEXT[] DEFAULT ARRAY['Cápsula Gelatinosa', 'Cápsula HPMC (Vegana)', 'Comprimido', 'Sachê', 'Solução Oral']::TEXT[],
    "wa" TEXT NOT NULL DEFAULT '5577999990000',

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_pharmacistEmail_fkey" FOREIGN KEY ("pharmacistEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientEmail_fkey" FOREIGN KEY ("clientEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
