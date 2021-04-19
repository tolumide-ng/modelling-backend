# modelling-backend
1. You could choose to use a VPC and thus ensure the all services communicate within the VPC using private networks
 OR 
 2. Use a public network
### VPC Network creation

1. Create a Virtual Private Cloud network for the project

```
gcloud compute networks create modelling --project=modelling-310812 --subnet-mode=auto --mtu=1460 --bgp-routing-mode=regional
```

## Set Up Cloud SQL

1. Enable Cloud SQL and enable the following permissions for the project:
   a. cloud sql admin
   b. compute viewer

2. Setup SQL Instace using the command below (replace the variables with your choice):

```
gcloud sql instances create INSTANCE_NAME --database-version=POSTGRES_12
 --cpu=NUMBER_CPUS --memory=MEMORY_SIZE
 --region=REGION --gce-zone=GCE_ZONE --zone=ZONE
```

more information on this here: https://cloud.google.com/sql/docs/postgres/create-instance#gcloud

3.
