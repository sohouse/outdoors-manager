-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "author" TEXT,
    "create_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "leader_id" TEXT,
    "type" INTEGER DEFAULT 0,
    "desc" TEXT,
    "status" INTEGER DEFAULT 0,
    "start_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);
