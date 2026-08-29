# Phase 26 – DevOps, CI/CD Pipeline & Cloud Infrastructure Specification
**Krishi Bazaar – Farmer to Customer Produce Booking Platform**

---

## 1. Executive Summary & Objectives

The primary objective of Phase 26 is to deliver an enterprise-grade, highly available, automated, and secure cloud infrastructure and deployment pipeline for the **Krishi Bazaar Platform**. The system is architected to guarantee seamless scalability during seasonal harvest demand spikes, zero-downtime rolling updates, robust disaster recovery, and automated security scanning.

### Core Strategic Infrastructure Goals
- **High Availability (HA)**: 99.99% uptime target backed by multi-region database replication and multi-zone Kubernetes orchestration.
- **Zero-Downtime Releases**: Automated rolling deployments and canary releases with automated rollback fallback.
- **Infrastructure as Code (IaC)**: 100% declarative cloud provisioning using HashiCorp Terraform and Azure Bicep.
- **DevSecOps Integration**: Automated static security scanning (SAST), container image scanning (Trivy), and dependency audit embedded in every Git push.
- **Disaster Recovery (DR)**: Target RPO (Recovery Point Objective) < 15 minutes and RTO (Recovery Time Objective) < 1 hour.

---

## 2. Multi-Cloud & Enterprise Architecture

Krishi Bazaar is designed for cloud agnosticism with primary deployment optimized on **Microsoft Azure** (AKS) and full secondary reference architectures for **Amazon Web Services (AWS EKS)** and **Google Cloud Platform (GCP GKE)**.

```
                    ┌──────────────────────────────────────────────┐
                    │               Cloudflare CDN                 │
                    │        Global Edge / WAF / DDoS Guard        │
                    └──────────────────────┬───────────────────────┘
                                           │
                                  ┌────────┴────────┐
                                  │ HTTPS / TLS 1.3 │
                                  └────────┬────────┘
                                           │
                    ┌──────────────────────▼───────────────────────┐
                    │       Ingress NGINX Controller (AKS)        │
                    │         TLS Termination & SSL Certs          │
                    └──────────────┬────────────────┬──────────────┘
                                   │                │
            ┌──────────────────────┴──────┐  ┌──────┴──────────────────────┐
            │  Frontend Web Service Pods  │  │   Backend API Service Pods  │
            │  React 18 + Nginx (3 Replicas)│  │ Node.js Express (HPA: 3-15) │
            └─────────────────────────────┘  └──────────────┬──────────────┘
                                                            │
                            ┌───────────────────────────────┼───────────────────────────────┐
                            │                               │                               │
             ┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
             │ Azure CosmosDB / MongoDB    │ │ Azure Cache for Redis        │ │ Azure Key Vault / Cloud DB   │
             │ Replica Set (Multi-Region)  │ │ Session & Rate Limit Cluster │ │ Encrypted Secrets Manager    │
             └─────────────────────────────┘ └──────────────────────────────┘ └──────────────────────────────┘
```

### Cloud Component Topology Comparison

| Component | Microsoft Azure (Primary) | Amazon Web Services (AWS) | Google Cloud Platform (GCP) |
|---|---|---|---|
| **Container Kubernetes** | Azure Kubernetes Service (AKS) | Elastic Kubernetes Service (EKS) | Google Kubernetes Engine (GKE) |
| **Container Registry** | Azure Container Registry (ACR) | Elastic Container Registry (ECR) | Artifact Registry (GAR) |
| **Database** | Azure Cosmos DB (MongoDB API) | Managed MongoDB Atlas on AWS | Cloud DocumentDB / Atlas |
| **Caching Layer** | Azure Cache for Redis | Amazon ElastiCache for Redis | Memorystore for Redis |
| **Secrets Store** | Azure Key Vault | AWS Secrets Manager / KMS | GCP Secret Manager |
| **Object Storage** | Azure Blob Storage | Amazon S3 | Google Cloud Storage (GCS) |
| **CDN / Security** | Azure Front Door / Cloudflare | AWS CloudFront + WAF | Cloud CDN + Cloud Armor |

---

## 3. Environment Strategy Matrix

The platform maintains 5 strictly isolated deployment environments. Code and configuration propagate monotonically through strict automated gates.

```
Local Development ──> Development (DEV) ──> QA / Automated Test ──> Staging (STG) ──> Production (PROD)
```

| Environment | Purpose | Infrastructure | Database Instance | Access Control |
|---|---|---|---|---|
| **Local Dev** | Feature engineering & rapid iteration | Docker Compose (`docker-compose.yml`) | Local Mongo 7.0 + Redis Container | Local Engineer |
| **Development** | Integration testing of merged PRs | AKS Dev Cluster (Single Node Pool) | Dev MongoDB Cluster | Engineering Team |
| **QA** | Automated End-to-End & Load Testing | AKS QA Cluster (Auto-scaling 2 Nodes) | Isolated QA DB (Seeded Data) | QA Engineers & CI/CD |
| **Staging** | Production mirror & pre-release validation | AKS Staging Cluster (2 Nodes) | Staging DB (Anonymized Prod Data) | Lead Engineers / Release Managers |
| **Production** | Live platform servicing customers & farmers | AKS Production Cluster (3-15 Nodes HPA) | Multi-Region MongoDB Atlas Cluster | Strictly Restricted / CI/CD Only |

---

## 4. Containerization Architecture

All platform components are packaged into immutable, minimal, security-hardened OCI-compliant Docker containers.

### Multi-Stage Build Highlights
1. **Node.js Express Backend (`server/Dockerfile`)**:
   - Multi-stage build leveraging `node:20-alpine`.
   - Security hardening: Enforces unprivileged execution via system `expressjs` user (UID 1001).
   - Execution optimization: Prunes `devDependencies`, runs clean production `npm ci`.
   - Built-in container healthcheck validating `/api/v1/health`.

2. **React/Vite Frontend (`client/Dockerfile`)**:
   - Multi-stage build leveraging `nginx:1.25-alpine`.
   - Security headers: CSP, HSTS, X-Frame-Options, X-XSS-Protection.
   - Performance tuning: Gzip compression, Brotli pre-compressed static asset delivery, immutable cache headers for hash assets (`Cache-Control: public, max-age=31536000`).

---

## 5. Kubernetes Orchestration & Auto-Scaling

The application is deployed to Kubernetes utilizing declarative manifests located in [infra/k8s/deployment.yaml](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/k8s/deployment.yaml).

### Key Kubernetes Architecture Controls
- **Horizontal Pod Autoscaler (HPA)**: Dynamically scales backend pods between **3 and 15 replicas** based on 70% CPU and 80% Memory utilization thresholds.
- **Rolling Update Strategy**: Configured with `maxSurge: 1` and `maxUnavailable: 0` ensuring zero downtime during production updates.
- **Pod Disruption Budget (PDB)**: Enforces `minAvailable: 2` pods at all times, preventing service degradation during node drain or cloud maintenance.
- **Self-Healing Probes**: Configured with Liveness (`/api/v1/health` every 10s) and Readiness probes to automatically replace deadlocked or unresponsive instances.

---

## 6. Enterprise CI/CD Pipeline Workflow

Automated pipeline defined in [.github/workflows/ci-cd.yml](file:///c:/Users/acer/Desktop/farmer%20to%20customer/.github/workflows/ci-cd.yml).

```
[Developer Push]
       │
       ▼
[GitHub Actions CI] ───► [Security Scan (Trivy SAST)]
       │
       ▼
[Automated Test Suite] ───► [Backend & DB Integration Verification]
       │
       ▼
[Build Docker Images] ───► [Push to Container Registry (GHCR/ACR)]
       │
       ▼
[Deploy to Staging] ───► [Automated Smoke Tests & Verification]
       │
       ▼
[Approval Gate] ───► [Kubernetes Production Deployment]
       │
       ├─────── Success ───► [Health Check Verified (200 OK)]
       └─────── Failure ───► [Automated Rollback (kubectl rollout undo)]
```

---

## 7. Git Branching & Code Review Strategy

Krishi Bazaar enforces GitFlow with strict protected branch rules.

### Branch Conventions
- `main`: Production-ready code. Direct pushes are **blocked**. Requires 2 approved pull requests and passing CI builds.
- `develop`: Integration branch for upcoming release features.
- `feature/*`: Feature development branch created from `develop`.
- `release/*`: Release candidate branch for QA testing.
- `hotfix/*`: Emergency fixes branched directly from `main`.

---

## 8. Infrastructure as Code (IaC) with Terraform

All cloud infrastructure resources are declaratively managed using Terraform in [infra/terraform/main.tf](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/terraform/main.tf).

### Managed Provisioned Resources
- **Azure Resource Group**: Encapsulating all cloud assets per environment.
- **Virtual Network (VNet) & Subnets**: Dedicated isolated subnet for AKS node pools (`10.0.1.0/22`).
- **AKS Cluster**: Managed Kubernetes with System-Assigned Managed Identity.
- **Azure Container Registry (ACR)**: Private OCI image registry linked with `AcrPull` RBAC role.
- **Azure Key Vault**: Centralized secrets storage with soft-delete retention and purge protection.

---

## 9. Secrets Management Policy

- **Zero Secrets in Code**: Hardcoding API keys, DB passwords, or JWT secrets in source repositories is strictly prohibited and guarded by pre-commit hooks and GitGuardian scanning.
- **Runtime Secret Injection**: Secrets are fetched from Azure Key Vault / HashiCorp Vault at runtime and injected into Kubernetes containers as environment variables via `Secret` resources.

---

## 10. Monitoring, Observability & Logging Architecture

The platform implements full-stack observability utilizing **Prometheus**, **Grafana**, and centralized JSON logging.

### Monitoring Metrics Tracked
1. **API Golden Signals**: Latency (p95, p99), Traffic (RPS), Errors (5xx rate), Saturation (CPU/RAM).
2. **Database Health**: Active connection pool count, slow query execution count (> 100ms), lock waits.
3. **Cache Performance**: Redis hit ratio (target > 85%), memory usage, evicted keys.

### Alerting Thresholds (`alerts.yml`)
- **API Instance Down**: Alert triggered if API target is unreachable for > 1 minute (Severity: Critical).
- **High 5xx Error Rate**: Alert triggered if 5xx status codes exceed 5% of total traffic over 2 minutes (Severity: Critical).

---

## 11. Rollback & Disaster Recovery (DR) Strategy

### Automated Rollback Playbook
If a newly deployed Kubernetes release fails health check probes or incurs an elevated error rate within 5 minutes of release:
1. Automated CI/CD execution of `kubectl rollout undo deployment/backend-deployment -n krishi-bazaar-prod`.
2. Traffic immediately redirects to previous stable container revision.
3. Slack/Alertmanager notification dispatched to SRE on-call team.

### Backup Schedule Matrix
- **MongoDB Database**: Hourly differential snapshots, daily full backups retained for 30 days with geo-redundant storage.
- **Cloudinary / Blob Storage**: Multi-region bucket replication enabled for all uploaded farmer accreditation documents and produce photos.

---

## 12. DevSecOps & Security Hardening

- **Static Application Security Testing (SAST)**: Integrated Trivy & SonarQube analysis scanning for OWASP Top 10 vulnerabilities.
- **Container Vulnerability Scanning**: Base container images audited for OS vulnerabilities before deployment.
- **TLS/SSL Encryption**: End-to-end TLS 1.3 transit encryption managed by cert-manager with Let's Encrypt certificates.

---

## 13. Phase 26 Acceptance Criteria Verification

| Requirement | Implementation Status | Verified Artifact |
|---|---|---|
| **Multi-Environment Deployment** | ✅ Complete | Matrix defined in Section 3 & Terraform configs |
| **Containerization (Docker)** | ✅ Complete | [server/Dockerfile](file:///c:/Users/acer/Desktop/farmer%20to%20customer/server/Dockerfile) & [client/Dockerfile](file:///c:/Users/acer/Desktop/farmer%20to%20customer/client/Dockerfile) |
| **Kubernetes Orchestration** | ✅ Complete | [infra/k8s/deployment.yaml](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/k8s/deployment.yaml) (HPA, Ingress, PDB) |
| **CI/CD Pipeline Automation** | ✅ Complete | [.github/workflows/ci-cd.yml](file:///c:/Users/acer/Desktop/farmer%20to%20customer/.github/workflows/ci-cd.yml) |
| **Infrastructure as Code (IaC)** | ✅ Complete | [infra/terraform/main.tf](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/terraform/main.tf) |
| **Secrets Management** | ✅ Complete | Azure Key Vault & Kubernetes Secret objects |
| **Monitoring & Alerting** | ✅ Complete | [infra/monitoring/prometheus.yml](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/monitoring/prometheus.yml) & [alerts.yml](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/monitoring/alerts.yml) |
| **Rollback Safeguards** | ✅ Complete | Automated `kubectl rollout undo` pipeline steps |

---

✅ **Phase 26 Complete**
*Next: Phase 27 – Quality Assurance (QA), Testing Strategy & Release Management*
