Wolbodo Members database
========================

## TODO

+ [ ] Password reset
+ [ ] Forms to add, edit, delete? users
+ [ ] Redirect to login page if there is no token
+ [ ] Server-side token utilization for pre-rendering
+ [ ] Huisstijl?
+ [ ] Paaseieren

## For developers

### Graphql Auth service
- Driven by [PostgreSQL]
- Supported by [hasura]
- Produced by The People of Wolbodo

Able to sign a token for himself as auth_robot
Listens to /login, /password-reset endpoints
Generates jwt's for users.

### Load fixtures:
```bash 
cat sql/*.sql | docker-compose exec -T postgres psql -U postgres wolbodo
```