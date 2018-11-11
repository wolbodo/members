# Graphql Auth service

- Driven by [PostgreSQL]
- Supported by [hasura]
- Produced by Dexter


Able to sign a token for himself as auth_robot
Listens to /login, /password-reset endpoints
Generates jwt's for users.


# Load fixtures:
```bash 
cat sql/*.sql | docker-compose exec -T postgres psql -U postgres wolbodo
```