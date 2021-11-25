 Restaurant Schedule App
##### _Test Driven Development[TTD] Example_

## Installation

Install the dependencies and devDependencies and start the server.

```sh
create .env file on the root folder
inside the .env file, write CONNECTION_STRING=[your mongodb connection string]
npm i
npm run dev
```

To run the system test

```sh
npm run test
```

### To test the search api

```sh
http://localhost:3000/seed [GET]
will seed the mongodb instance from database.json file
```

```json
http://localhost:3000/ [GET] with json request data formatted like this:
(note: the space between the time and the period is important)
{
    "days": "mon-fri",
    "time": "8 am - 5:00 pm"
}
```


## Plugins
This project is dependent with this plugins
| Plugin |
| ------ | 
| Moongodb | 
| Express JS |
| Mocha |
| Chai |
| Supertest |
| dotenv |
