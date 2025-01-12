# Dymanic Data masking

## Setup 
Have docker installed and running on your system.
Run the postgress image using the following command
```
docker run --name local-postgres -e POSTGRES_USER=admin -e  
POSTGRES_PASSWORD=password123 -e POSTGRES_DB=test_db -p 5432:5432  -d postgres
```

## Basic Architecture of the API layer
![WhatsApp Image 2024-12-29 at 10 13 34 PM](https://github.com/user-attachments/assets/bba1873f-46ec-4084-a75a-a942213057cb)


## When no role is mentioned  
![image](https://github.com/user-attachments/assets/2b0935d4-50dc-498f-b2dd-b5e9a1621fc9)

## When role is Admin 
![image](https://github.com/user-attachments/assets/374ff5ec-1bf3-4a1a-9ded-d91420d9d9a6)

