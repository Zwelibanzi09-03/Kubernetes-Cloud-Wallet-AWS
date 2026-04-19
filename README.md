# Kubernetes-Cloud-Wallet-AWS

Deploying a containerized Node.js wallet application into Kubernetes using Docker Desktop, Docker, and kubectl. This project demonstrates a real hands-on cloud engineering workflow: building an app, packaging it into a container, deploying replicas, exposing services, and troubleshooting real deployment issues.

---

## Project Overview

This project was built to strengthen practical skills in:

- Docker containerization
- Kubernetes deployments
- Pods, ReplicaSets, and Services
- NodePort networking
- kubectl operations
- Troubleshooting image pull errors
- Cluster management
- Cloud-native deployment workflow

The wallet API was first tested locally, then containerized with Docker, and finally deployed into Kubernetes with multiple running pods.

---

## Tech Stack

- Node.js
- Express.js
- Docker
- Kubernetes
- Docker Desktop
- kubectl
- PowerShell
- Git
- GitHub

---

## Folder Structure

```text
Kubernetes-Cloud-Wallet-AWS/
│
├── app/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── k8s/
   ├── namespace.yaml
   ├── deployment.yaml
   ├── service.yaml
   ├── ingress.yaml
   ├── configmap.yaml
   └── secret.yaml
```

---

## Application Features

The wallet application includes:

- Homepage route
- Wallet balance route
- Deposit route
- Withdraw route
- JSON responses
- Kubernetes deployment with 2 replicas
- External access via NodePort

---

## Routes

### GET /

Returns:

```text
Kubernetes Cloud Wallet Running
```

### GET /wallet

Returns:

```json
{
  "name": "Cloud Wallet",
  "owner": "Ndandise Xalisa",
  "balance": 5000
}
```

### POST /deposit/:amount

Deposits funds into the wallet.

### POST /withdraw/:amount

Withdraws funds if balance is sufficient.

---

## Step 1 - Run Locally

Install packages:

```bash
cd app
npm install
```

Start server:

```bash
node server.js
```

Test:

```text
http://localhost:3000
http://localhost:3000/wallet
```

---

## Step 2 - Dockerize the App

Build image:

```bash
docker build -t cloud-wallet-app .
```

Check image:

```bash
docker images
```

Run container:

```bash
docker run -d -p 3000:3000 --name cloud-wallet-container cloud-wallet-app
```

Check running container:

```bash
docker ps
```

Test:

```text
http://localhost:3000
http://localhost:3000/wallet
```

---

## Step 3 - Enable Kubernetes

Docker Desktop Kubernetes cluster was enabled successfully.

Check cluster:

```bash
kubectl config use-context docker-desktop
kubectl get nodes
```

Output showed the node in `Ready` state.

---

## Step 4 - Deploy to Kubernetes

Apply manifests:

```bash
kubectl apply -f .\k8s
```

Check resources:

```bash
kubectl get all -n cloud-wallet
```

Check pods:

```bash
kubectl get pods -n cloud-wallet
```

Final result:

- 2 running Pods
- Deployment healthy
- Service active
- Namespace created

---

## Kubernetes Files Used

### namespace.yaml

Creates a dedicated namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cloud-wallet
```

### deployment.yaml

Creates the Deployment with 2 replicas and uses the locally built Docker image:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-wallet-app
  namespace: cloud-wallet

spec:
  replicas: 2

  selector:
    matchLabels:
      app: cloud-wallet

  template:
    metadata:
      labels:
        app: cloud-wallet

    spec:
      containers:
      - name: cloud-wallet-container
        image: cloud-wallet-app:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
```

### service.yaml

Configured as NodePort to expose the application:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: cloud-wallet-service
  namespace: cloud-wallet

spec:
  selector:
    app: cloud-wallet

  type: NodePort

  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
      nodePort: 30080
```

---

## Live Access

### NodePort Access

```text
http://localhost:30080
http://localhost:30080/wallet
```

### Port Forward Access

```bash
kubectl port-forward service/cloud-wallet-service 8080:80 -n cloud-wallet
```

Then browse:

```text
http://localhost:8080
http://localhost:8080/wallet
```

---

## Real Problems Solved

### 1. Docker Build Failure

**Problem:** Docker could not complete the image build properly at first.

**Solution:** Corrected the build command and allowed Docker to fully download the required image layers.

---

### 2. Kubernetes Failed To Start

**Problem:** The cluster failed to start on the first attempt.

**Solution:** Switched the Docker Desktop Kubernetes cluster type to `kubeadm`, which started successfully.

---

### 3. kubectl localhost:8080 Error

**Problem:** `kubectl` could not connect to the cluster and returned localhost:8080 errors.

**Solution:**

```bash
kubectl config use-context docker-desktop
```

This switched kubectl to the correct Kubernetes context.

---

### 4. ImagePullBackOff

**Problem:** Kubernetes tried pulling `cloud-wallet-app:latest` from a registry instead of using the local image.

**Solution:** Added this to the Deployment:

```yaml
imagePullPolicy: Never
```

This forced Kubernetes to use the local Docker image.

---

### 5. Namespace Not Found

**Problem:** The Deployment tried to create before the namespace was fully available.

**Solution:** Re-applied the manifests after the namespace existed.

---

### 6. Service Access Failed Initially

**Problem:** The first service exposure method did not open correctly in the browser.

**Solution:** Changed the Service to `NodePort`, then also tested access using `port-forward`.

---

## Skills Demonstrated

- Building a Node.js backend application
- Docker image creation
- Container lifecycle management
- Kubernetes Deployments
- ReplicaSets
- Pods
- Services
- NodePort networking
- kubectl administration
- Debugging real deployment issues
- Publishing projects to GitHub

---

## Commands Used

### App

```bash
npm install
node server.js
```

### Docker

```bash
docker build -t cloud-wallet-app .
docker run -d -p 3000:3000 --name cloud-wallet-container cloud-wallet-app
docker ps
docker images
```

### Kubernetes

```bash
kubectl config use-context docker-desktop
kubectl get nodes
kubectl apply -f .\k8s
kubectl get all -n cloud-wallet
kubectl get pods -n cloud-wallet
kubectl get svc -n cloud-wallet
kubectl port-forward service/cloud-wallet-service 8080:80 -n cloud-wallet
```

### Git

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main --force
```

---

## Recommended Screenshots

Include these in the repo:

- App on `localhost:3000`
- Wallet JSON locally
- `docker images`
- `docker ps`
- Docker Desktop Kubernetes running
- `kubectl get pods -n cloud-wallet`
- `kubectl get all -n cloud-wallet`
- App on `localhost:30080`
- Wallet JSON on `localhost:30080`
- App on `localhost:8080`

---

## Lessons Learned

This project taught the real difference between:

- running code locally
- running code in Docker
- running code in Kubernetes

It also strengthened understanding of:

- infrastructure troubleshooting
- service exposure
- image management
- deployment lifecycle
- cloud-native architecture basics

---

## Future Improvements

- Connect MySQL database
- Use Secrets properly
- Use ConfigMaps dynamically
- Add Ingress
- Add TLS
- Add CI/CD pipeline
- Deploy to AWS EKS
- Add monitoring with Prometheus and Grafana

---

## Conclusion

This was a strong real-world DevOps and Cloud Engineering project demonstrating the ability to build, containerize, deploy, expose, and troubleshoot a live application in Kubernetes.

It proves hands-on experience with Docker, Kubernetes, networking, deployments, and production-style debugging.

