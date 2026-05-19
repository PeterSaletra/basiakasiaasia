# Azure App Service deployment

This folder contains a minimal Terraform setup for hosting the Vite frontend in Azure App Service.

## Deploy

1. Build the frontend first:

```bash
cd ../frontend
npm run build
```

2. Apply Terraform from this folder:

```bash
terraform init
terraform apply
```

Terraform zips `../frontend/dist` and deploys it to a Linux App Service.