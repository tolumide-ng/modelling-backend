# modelling-backend

## Details

The application is currently deployed on [heroku](https://modelling-backend.herokuapp.com/)

### Endpoints

| #   | Description                 | Endpoint               | Request Body               |
| --- | --------------------------- | ---------------------- | -------------------------- |
| 1   | Upload file to be converted | `/upload`              | convertFile (use formData) |
| 2   | Select conversion target    | `/convert/:target/:id` |                            |
| 3   | Stream Conversion status    | `/stream/:id` (SSE)    |                            |
| 4   | Download the converted file | `/download/:id`        |                            |

### Brief Description

At application currently stores the uploaded file on an `s3 bucket` and streams the conversion using server sent events. Since the conversion is only a mock at the moment, when the user requests that the uploaded file be `converted`, a simple text is written to a file of the target type required by the user and saved on `s3` with the details of `s3 location` saved on the db. Request to download the converted file sends the `s3 location` to the frontend.

### Deployment Model

-   GCP
-   Use GCP cloud SQL for the local database
-   Store files and images on GCP's cloud storage bucket
-   Deploy the application image on GCP's AppEngine (I have provided a dockerfile and docker-compose for this application, the image is currently available on dockerhub at `@tolumide/modelling`)
-   Use GCP's `Cloud Key Management` for storing secrets

## Local Deployment with Docker

-   Clone the repo
-   `cd` into the application
-   Build the docker image `docker build . -t <tolumide/modelling>`
-   Run the application with `docker compose up`
