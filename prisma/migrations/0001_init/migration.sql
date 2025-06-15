-- Initial schema for quinielApp using PostgreSQL
CREATE TABLE "Usuario" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "telefono" TEXT,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Torneo" (
  "id" SERIAL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate" TIMESTAMPTZ NOT NULL
);

CREATE TABLE "Grupo" (
  "id" SERIAL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "descripcion" TEXT,
  "code" TEXT NOT NULL UNIQUE,
  "torneoId" INTEGER NOT NULL REFERENCES "Torneo"("id"),
  "adminId" INTEGER NOT NULL REFERENCES "Usuario"("id")
);

CREATE TABLE "Participacion" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "Usuario"("id"),
  "grupoId" INTEGER NOT NULL REFERENCES "Grupo"("id"),
  "puntos" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "Equipo" (
  "id" SERIAL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "torneoId" INTEGER NOT NULL REFERENCES "Torneo"("id")
);

CREATE TABLE "Partido" (
  "id" SERIAL PRIMARY KEY,
  "torneoId" INTEGER NOT NULL REFERENCES "Torneo"("id"),
  "localId" INTEGER NOT NULL REFERENCES "Equipo"("id"),
  "visitanteId" INTEGER NOT NULL REFERENCES "Equipo"("id"),
  "fecha" TIMESTAMPTZ NOT NULL,
  "golesLocal" INTEGER,
  "golesVisitante" INTEGER
);

CREATE TABLE "Pronostico" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "Usuario"("id"),
  "partidoId" INTEGER NOT NULL REFERENCES "Partido"("id"),
  "grupoId" INTEGER NOT NULL REFERENCES "Grupo"("id"),
  "golesLocal" INTEGER NOT NULL,
  "golesVisitante" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "participacion_user_idx" ON "Participacion"("userId");
CREATE INDEX "participacion_grupo_idx" ON "Participacion"("grupoId");
CREATE INDEX "pronostico_user_idx" ON "Pronostico"("userId");
CREATE INDEX "pronostico_partido_idx" ON "Pronostico"("partidoId");
