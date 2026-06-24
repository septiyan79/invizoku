-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "ThemeType" AS ENUM ('standard', 'exclusive');

-- CreateEnum
CREATE TYPE "Package" AS ENUM ('trial', 'basic', 'pro', 'studio');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'active', 'expired');

-- CreateEnum
CREATE TYPE "AssistStatus" AS ENUM ('idle', 'waiting_admin', 'in_progress', 'waiting_review', 'done');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('pending', 'hadir', 'tidak');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('open', 'in_progress', 'waiting_review', 'closed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_wa" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "notif_rsvp" BOOLEAN NOT NULL DEFAULT false,
    "notif_ucapan" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "event_categories" TEXT[],
    "style_tag" TEXT NOT NULL,
    "type" "ThemeType" NOT NULL DEFAULT 'standard',
    "component_key" TEXT NOT NULL,
    "preview_url" TEXT,
    "og_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "theme_id" UUID NOT NULL,
    "package" "Package" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "payment_id" TEXT,
    "slug" TEXT NOT NULL,
    "assist_status" "AssistStatus" NOT NULL DEFAULT 'idle',
    "revision_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upgraded_from" "Package",
    "upgraded_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "content" JSONB NOT NULL,
    "published_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "rsvp_status" "RsvpStatus" NOT NULL DEFAULT 'pending',
    "rsvp_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "guest_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assist_tickets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "notes" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'open',
    "revision_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assist_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "themes_component_key_key" ON "themes"("component_key");

-- CreateIndex
CREATE UNIQUE INDEX "orders_slug_key" ON "orders"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_order_id_key" ON "invitations"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "guests_token_key" ON "guests"("token");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assist_tickets" ADD CONSTRAINT "assist_tickets_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
