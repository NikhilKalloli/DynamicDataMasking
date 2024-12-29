# Dymanic Data masking

Setup 
Have docker installed and running on your system.
Run the postgress image using the following command
```
docker run --name local-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=test_db -p 5432:5432 -d postgres
```