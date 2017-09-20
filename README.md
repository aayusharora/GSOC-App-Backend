
# GSOC-Info Backend

 `Deployed URL:` https://gsoc-backend.herokuapp.com/

`Link to API DOCS:` https://documenter.getpostman.com/view/1032305/gsoc_backend/6tgUgXi

### Clone the repository and install node packages
> Please ensure you have the latest version of Nodejs and Node Package Manager (NPM) installed
```
git clone https://github.com/aayusharora/GSOC-App-Backend.git
cd GSoC-Info-Chat-Backend
npm install
```
### Configure the Database 

> Install Postgres, and use the following commands to setup the database and new role.
```
create database gsocdb

In dbconfig.json file

Configure the user and password in dbconfig.json file in the root folder.

For postgresql,
mention the dialect : 'postgres'
port: 5432

```
# Running the app
```
node server.js
```


