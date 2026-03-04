# Cloud-Native Microservices with GitOps 

A complete 3-service microservices application built with **Node.js + Express**, containerized with **Docker**, packaged with **Helm charts**, and deployed to **Kubernetes** using a full **GitOps workflow** with **Argo CD**.

---

## Overview

This project demonstrates a modern DevOps workflow for cloud-native microservices. It implements a **frontend → backend → user-service** architecture with declarative deployments and continuous delivery.

### Services

* **Frontend**  
  Simple UI calling the backend for messages.

* **Backend**  
  Provides `/api/message` endpoint with business logic.

* **User Service**  
  Provides `/users` and `/users/:id` endpoints with mock user data.

### Key Features

* Dockerized services with images pushed to Docker Hub (`anyasi/*:latest`)  
* Helm charts for reusable Kubernetes manifests  
* Local **Kind** cluster deployment in namespace `microservices`  
* Declarative **GitOps** with **Argo CD** (auto-sync, self-healing)  
* Inter-service communication via Kubernetes DNS  
* CI/CD pipeline with **GitHub Actions** for automated builds & deployment  

---

## Architecture

```mermaid
graph TD
    A[Frontend<br/>Node.js + Express] -->|GET /api/message| B[Backend<br/>Node.js + Express]
    B -->|GET /users| C[User Service<br/>Node.js + Express]

    subgraph Kubernetes_Cluster_Kind
        D[Argo CD] -->|Syncs Git Repo| E[Helm Charts]
        E --> F[Deployments & Services<br/>Namespace: microservices]
    end

    G[GitHub Repository] --> H[GitHub Actions CI/CD]
    H --> I[Docker Hub Images]
    D --> F
Project Structure
microservices-gitop/
├── argocd/                 # Argo CD application manifests
├── charts/
│   ├── backend/
│   ├── frontend/
│   └── user-service/
└── screenshot/             # Project screenshots

microservices-app/
├── backend/
├── frontend/
├── user-service/
└── .github/workflows/      # CI pipeline (build-push.yaml)
Local Setup
Prerequisites

Docker

Kind

kubectl

Helm

Argo CD CLI (optional)

Steps

Create Kubernetes cluster

kind create cluster --name dev-project

Create namespaces

kubectl create namespace microservices
kubectl create namespace argocd

Install Argo CD

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd get pods --watch

Access Argo CD UI

kubectl port-forward svc/argocd-server -n argocd 8080:443
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

Login at https://localhost:8080

Username: admin
Password: <retrieved password>

Deploy applications

kubectl apply -f argocd/
kubectl get applications -n argocd -w
kubectl get pods -n microservices -w

Access services

Frontend: http://localhost:8080

User Service: http://localhost:8081/users

CI/CD Pipeline

GitHub Actions workflow: .github/workflows/build-push.yaml

Triggers on push/PR to main

Builds Docker images for all services

Pushes latest tags to Docker Hub

Argo CD auto-syncs updated images to Kubernetes

Screenshots & Workflow Demo

We’ll walk through the project visually from deployment to frontend:

1️⃣ Argo CD Dashboard – GitOps Sync

Shows all applications Synced + Healthy.

2️⃣ Kubernetes Pods

All microservices running in the microservices namespace.

3️⃣ Frontend UI

Frontend displaying backend message.

4️⃣ CI/CD Pipeline

Successful GitHub Actions build and Docker push.

5️⃣ User Service – GET /users

Returns mock user data.

Challenges & Learnings

Resolving Helm template helper mismatches

Configuring Kubernetes DNS for inter-service calls

Debugging Argo CD sync issues & namespace conflicts

Using environment variables in Helm instead of hard-coded URLs

Leveraging --force --prune for consistent deployments

Future Improvements

Add an Ingress controller for external access without port-forward

Implement end-to-end testing in CI

Add Prometheus & Grafana monitoring

Support multi-environment deployment with ApplicationSets

Introduce secure secret management

Conclusion

This project demonstrates a full GitOps workflow for cloud-native microservices on Kubernetes, combining containerization, CI/CD automation, and declarative infrastructure.
With screenshots, it clearly shows a working, production-like pipeline from code to deployment.ss