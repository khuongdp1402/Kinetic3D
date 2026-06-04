---
wave: 1
depends_on: []
files_modified:
  - docker-compose.yml
  - .env.example
autonomous: true
---

# Plan 1: Infrastructure Setup

## Goal
Setup the local Docker Compose infrastructure including PostgreSQL, MinIO, Meilisearch, and Umami Analytics on a single bridge network with persistent storage.

## Requirements
- INFRA-01: Setup Docker Compose for PostgreSQL, MinIO, Meilisearch, and Umami Analytics
- INFRA-02: Configure persistent storage volumes and standard .env file

## Tasks

<task>
  <action>
    Create `.env.example` in the repository root with default environment variables for the infrastructure:
    ```
    # PostgreSQL
    POSTGRES_USER=kinetic3d
    POSTGRES_PASSWORD=kinetic3d_pass
    POSTGRES_DB=kinetic3d_db

    # MinIO
    MINIO_ROOT_USER=minioadmin
    MINIO_ROOT_PASSWORD=minioadmin

    # Meilisearch
    MEILI_MASTER_KEY=kinetic3d_master_key_12345

    # Umami
    DATABASE_URL=postgresql://kinetic3d:kinetic3d_pass@postgres:5432/umami
    ```
  </action>
  <read_first>
    - .env.example (to be created)
  </read_first>
  <acceptance_criteria>
    - `grep -q "POSTGRES_USER=" .env.example` exits 0
    - `grep -q "MINIO_ROOT_USER=" .env.example` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Create `docker-compose.yml` in the repository root defining an all-in-one network `kinetic3d_network`.
    Add the `postgres` service using `postgres:16-alpine`.
    Configure volumes `postgres_data` mapping to `/var/lib/postgresql/data`.
    Add an initialization script via volume mapping to `/docker-entrypoint-initdb.d/init.sql` that creates the `umami` database, so Umami has its own DB.
    Expose port `5432:5432`.
  </action>
  <read_first>
    - docker-compose.yml (to be created)
  </read_first>
  <acceptance_criteria>
    - `grep -q "postgres:16-alpine" docker-compose.yml` exits 0
    - `grep -q "kinetic3d_network" docker-compose.yml` exits 0
    - `grep -q "/docker-entrypoint-initdb.d" docker-compose.yml` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Create `infrastructure/postgres/init.sql` with the following content:
    ```sql
    CREATE DATABASE umami;
    ```
  </action>
  <read_first>
    - infrastructure/postgres/init.sql (to be created)
  </read_first>
  <acceptance_criteria>
    - `cat infrastructure/postgres/init.sql | grep "CREATE DATABASE umami;"` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Update `docker-compose.yml` to add the `minio` service using `minio/minio`.
    Command: `server /data --console-address ":9001"`.
    Map volumes `minio_data` to `/data`.
    Expose ports `9000:9000` and `9001:9001`.
    Add `minio-init` service using `minio/mc`.
    Command: `/bin/sh -c "sleep 5; /usr/bin/mc alias set myminio http://minio:9000 minioadmin minioadmin; /usr/bin/mc mb myminio/products; /usr/bin/mc anonymous set public myminio/products; exit 0;"`
    Ensure `minio-init` depends on `minio`.
  </action>
  <read_first>
    - docker-compose.yml
  </read_first>
  <acceptance_criteria>
    - `grep -q "minio/minio" docker-compose.yml` exits 0
    - `grep -q "minio/mc" docker-compose.yml` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Update `docker-compose.yml` to add the `meilisearch` service using `getmeili/meilisearch:v1.6`.
    Map volumes `meili_data` to `/meili_data`.
    Expose port `7700:7700`.
  </action>
  <read_first>
    - docker-compose.yml
  </read_first>
  <acceptance_criteria>
    - `grep -q "getmeili/meilisearch" docker-compose.yml` exits 0
    - `grep -q "7700:7700" docker-compose.yml` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Update `docker-compose.yml` to add the `umami` service using `ghcr.io/umami-software/umami:postgresql-latest`.
    Depend on `postgres`.
    Expose port `3000:3000`.
  </action>
  <read_first>
    - docker-compose.yml
  </read_first>
  <acceptance_criteria>
    - `grep -q "umami-software/umami" docker-compose.yml` exits 0
    - `grep -q "3000:3000" docker-compose.yml` exits 0
  </acceptance_criteria>
</task>

## Verification
- `docker-compose config` executes successfully and validates the YAML file.
- `cat .env.example | grep POSTGRES_USER` returns the expected variable.

## Must Haves
- The `docker-compose.yml` file must contain `postgres`, `minio`, `minio-init`, `meilisearch`, and `umami` services all connected to `kinetic3d_network`.
