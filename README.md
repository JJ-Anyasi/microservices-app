 Cloud-Native Microservices Demo with GitOps








A production-style microservices application demonstrating modern DevOps practices using Docker, Kubernetes, Helm, GitHub Actions, and Argo CD (GitOps).

This project simulates a real-world cloud-native workflow where code changes automatically move from commit → container build → registry → Kubernetes deployment — without manual intervention.

  Overview

This system consists of three independent microservices:

Frontend – User interface

Backend – Business logic

User Service – User data management

The project demonstrates:

Containerized services with Docker

Kubernetes deployments using Helm charts

GitOps-based continuous deployment with Argo CD

Automated CI pipeline using GitHub Actions

Kubernetes DNS for inter-service communication

Self-healing and auto-sync behavior via Argo CD

All services are deployed into the microservices namespace inside a local Kind cluster.

🏗 Architecture
Service Flow

Frontend → Backend → User Service

Each service runs as:

Kubernetes Deployment

Kubernetes Service (ClusterIP)

Argo CD continuously watches the Git repository and ensures the cluster state matches the declared configuration.


flowchart LR
    A[Frontend Pod] -->|HTTP| B[Backend Service]
    B -->|HTTP| C[User Service]

    subgraph Kubernetes Cluster (Kind)
        A
        B
        C
    end

    D[Docker Hub] -->|Image Pull| Kubernetes
    E[GitHub Actions] -->|Build & Push| D
    F[Git Repo] -->|Watched by| G[Argo CD]
    G -->|Sync| Kubernetes


Technologies Used

Language: Node.js + Express

Containerization: Docker

Orchestration: Kubernetes (Kind)

Packaging: Helm v3

GitOps CD: Argo CD

CI: GitHub Actions

Container Registry: Docker Hub

Project Structure
microservices-gitops/
├── argocd/                # Argo CD application manifests
├── charts/
│   ├── backend/
│   ├── frontend/
│   └── user-service/
└── README.md

microservices-app/
├── backend/
├── frontend/
├── user-service/
└── .github/workflows/     # CI pipeline

Local Setup
Prerequisites

Docker

Kind

kubectl

Helm

Argo CD CLI (optional)

1️⃣ Create Kubernetes Cluster
kind create cluster --name dev-project
kubectl create namespace microservices

2️⃣ Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml


Access UI:

kubectl port-forward svc/argocd-server -n argocd 8080:443

3️⃣ Deploy Applications

Apply your Argo CD application manifests:

kubectl apply -f argocd/


Argo CD will:

Sync Helm charts

Deploy services

Auto-heal drift

Prune unused resources

  CI/CD Pipeline

GitHub Actions automatically:

Builds Docker images for:

backend

frontend

user-service

Tags images as latest

Pushes images to Docker Hub

Triggers Argo CD to sync updates

Workflow location:

.github/workflows/build-push.yaml


Challenges & Learnings

Correct Helm templating and values management

Understanding Kubernetes service DNS

Debugging Argo CD sync and namespace issues

Avoiding hard-coded URLs via environment variables

Using force sync and prune strategies correctly

Future Improvements

Add Ingress controller for clean URLs

Add Prometheus + Grafana monitoring

Add automated integration testing

Multi-environment deployments (dev/staging/prod)

Implement secret management (Sealed Secrets / External Secrets)

 Author

Joshua Anyasi
DevOps Engineer

> This project was developed as a DevOps capstone demonstration of container orchestration, CI/CD automation, and GitOps deployment patterns.

## Why This Project Matters

This project demonstrates practical experience with real-world DevOps tooling, including:

- Declarative infrastructure
- Continuous delivery automation
- Container lifecycle management
- Production-style deployment patterns
