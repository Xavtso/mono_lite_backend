## Main technology
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)


## How To Launch

### 1. Install dependencies
```bash
$ npm install
```

### 2. Run the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test (not nessecary)

```bash
# unit tests
$ npm run test

```

## Decomposition 

1. Deployment

✅ Configure server settings
✅ Add web.config
✅ Add variables on azure
✅ Configure startup command on azure
✅ Deploy

2. Database
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

✅ Create AZURE SQL DB
✅ Configure with ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
✅ Connect to database

3. Auth
✅ Create ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) services

✅ Configure sign up/in methods

4. Debit Cards

✅ Create Cards model with all includes
✅ Create dependencies with user
✅ Create card for each new user

5. Transactions

✅ Create Transactions model with all includes
✅ Create dependencies with cards 
✅ Create SQL transactions between users
✅ Create custom transactions (like in the shop or make deposit)

6. CashBack

✅ Create Cashback model with all includes
✅ Create dependecies with transaction
✅ Calculate amount in dependece of transaction amount
✅ Update balance

7. Pig Jar
✅Create Model 
✅ Create dependencies with Users
✅ Configure operation logic

8. Loans
✅Create Model 
✅Configure operations
✅Add Schedule functions

9. Deposits
✅Create Model 
✅Configure operations
✅Add Schedule functions

10. Currency
✅Create Model  
✅Create users currency balancies
✅Connect To open API (Monobank)
✅Get data and put in model
✅Configure operations logic

11. Testing
✅ Specify tests for services on ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)


Link to client: https://github.com/Xavtso/mono-lite-front
 
