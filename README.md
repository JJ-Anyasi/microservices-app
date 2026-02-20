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

Key features:
- Containerized with Docker → pushed to Docker Hub
- Packaged with Helm for templating & deployment
- Deployed to Kubernetes (local Kind cluster) in namespace `microservices`
- Managed declaratively via GitOps with Argo CD (auto-sync, self-heal, prune)
- Inter-service communication via Kubernetes DNS (e.g. `http://backend:80`)
- CI/CD pipeline with GitHub Actions (auto-build & push images on push to main)

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
Technologies

Languages/Frameworks: Node.js + Express
Containerization: Docker
Orchestration: Kubernetes (Kind for local development)
Packaging: Helm v3
GitOps & CD: Argo CD
CI: GitHub Actions
Registry: Docker Hub (anyasi/*:latest)

Project Structure
textmicroservices-gitops/              # GitOps repo (Argo CD manifests + Helm charts)
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
Local Setup
Prerequisites

Docker Desktop / Docker
Kind
kubectl
Helm
Argo CD CLI (optional)

Step-by-step

Create clusterBashkind create cluster --name dev-project
Create namespaceBashkubectl create namespace microservices
Install Argo CDBashkubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yamlWait for pods:Bashkubectl -n argocd get pods --watch
Access Argo CD UIBashkubectl port-forward svc/argocd-server -n argocd 8080:443Get password:Bashkubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echoLogin: https://localhost:8080 (admin + password)
Apply ApplicationsBashkubectl apply -f argocd/
Monitor deploymentBashkubectl get applications -n argocd -w
kubectl get pods -n microservices -w
Access frontendBashkubectl port-forward svc/frontend 8080:80 -n microservices→ http://localhost:8080
Access user-serviceBashkubectl port-forward svc/user-service 8081:80 -n microservices→ http://localhost:8081/health, /users, /users/1

CI/CD Pipeline
GitHub Actions workflow (.github/workflows/build-push.yaml):

Triggers on push/PR to main
Builds Docker images for backend, frontend, user-service
Pushes :latest tags to Docker Hub (anyasi/*)
Uses GitHub Actions cache for fast builds

Argo CD watches :latest tags → auto-deploys updates.
Screenshots & Demo
(Add your screenshots here)

Pods running in microservices namespace
Services in microservices namespace
Argo CD UI showing all 3 apps Synced + Healthy
Frontend page displaying backend message
Successful GitHub Actions run

(Optional) 1-minute demo video (Loom / screen recording)
Challenges & Learnings

Debugging Helm helper mismatches after copying charts
Correctly configuring Kubernetes DNS for inter-service calls
Troubleshooting Argo CD sync issues (namespace missing, cache, release name conflicts)
Using environment variables in Helm to avoid hard-coded URLs
Importance of --force --prune for forcing updates

Future Improvements

Add Ingress for clean URLs (no port-forward)
Implement end-to-end tests in CI
Add Prometheus + Grafana monitoring via Argo CD
Multi-environment support (dev/staging/prod) with ApplicationSets
Secret management (Sealed Secrets / External Secrets)

Thank you for reviewing my DevOps final project!