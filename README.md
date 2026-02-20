# Cloud-Native Microservices with GitOps

A complete 3-service microservices application built with Node.js/Express, containerized with Docker, packaged with Helm charts, and deployed declaratively to Kubernetes using GitOps with Argo CD.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Screenshots & Demo](#screenshots--demo)
- [Challenges & Learnings](#challenges--learnings)
- [Future Improvements](#future-improvements)

## Overview

This project demonstrates a modern DevOps workflow for cloud-native microservices:

- **Frontend**: Simple UI that calls the backend for data
- **Backend**: Provides a basic API endpoint (`/api/message`)
- **User Service**: Mock user data with endpoints (`/users`, `/users/:id`)

All services are:
- Containerized with Docker
- Packaged with Helm for templating & deployment
- Deployed to Kubernetes (local Kind cluster) in the `microservices` namespace
- Managed declaratively via GitOps with Argo CD (auto-sync, self-heal, prune)
- Built & published automatically via GitHub Actions CI

Inter-service communication uses Kubernetes DNS (e.g. `http://backend:80`).

## Architecture

```mermaid
graph TD
    A[Frontend<br>Node.js + Express<br>UI & calls backend] -->|HTTP GET /api/message| B[Backend<br>Node.js + Express<br>Business logic & API]
    B -->|HTTP GET /users or /users/:id| C[User Service<br>Node.js + Express<br>Mock user data & CRUD]

    subgraph "Kubernetes Cluster (Kind - local)"
        D[Argo CD<br>GitOps Controller] -->|Watches Git repo<br>Auto-syncs manifests| E[Helm Charts<br>backend / frontend / user-service]
        E -->|Renders & deploys| F[Deployments & Services<br>Namespace: microservices]
        F --> A
        F --> B
        F --> C
    end

    G[GitHub Repositories<br>Source code + GitOps manifests] -->|Push / PR| H[GitHub Actions<br>CI Pipeline<br>Build & push Docker images]
    H -->|Publishes :latest| I[Docker Hub<br>anyasi/backend-service<br>anyasi/frontend-service<br>anyasi/user-service]

    D -->|Pulls updated images| F

    style A fill:#e6f3ff,stroke:#0066cc,stroke-width:2px
    style B fill:#fff0e6,stroke:#cc6600,stroke-width:2px
    style C fill:#e6ffe6,stroke:#006600,stroke-width:2px
    style D fill:#fff9e6,stroke:#cc9900,stroke-width:2px
    style G fill:#f5f5f5,stroke:#666,stroke-width:1px
    style H fill:#f5f5f5,stroke:#666,stroke-width:1px
    style I fill:#f5f5f5,stroke:#666,stroke-width:1px

## Technologies

Languages/Frameworks: Node.js + Express
Containerization: Docker
Orchestration: Kubernetes (Kind for local development)
Packaging: Helm v3
GitOps & CD: Argo CD
CI: GitHub Actions
Registry: Docker Hub (anyasi/*:latest)

## Project Structure

microservices-gitops/              # GitOps repo (Argo CD manifests + Helm charts)
├── argocd/                        # Argo CD Application YAMLs
├── charts/
│   ├── backend/
│   ├── frontend/
│   └── user-service/
└── README.md

microservices-app/                 # Source code repo
├── backend/
├── frontend/
├── user-service/
└── .github/workflows/             # CI pipeline (build-push.yaml)

