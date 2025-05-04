-- CreateTable
CREATE TABLE "Hook" (
    "id" SERIAL NOT NULL,
    "hook" TEXT,
    "isAuth" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hook_pkey" PRIMARY KEY ("id")
);
