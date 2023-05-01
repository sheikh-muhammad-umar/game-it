#GameIt Production

### 1.1 Initialize/Start project:
 1. Install all packages using `npm i -D`
 2. Run `npm run nodemon` in Terminal to start project.


### 1.2 Creating a controller:
1. Head to the `/controllers/api/` directory.
2. Create a group directory. (e.g., `dashboard`)
3. Under the directory, Create a file like `<name>.controller.js`.
4. Paste the following template code:
```js
/**
 * Main controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  app.get('/api/path/to', async ( req, res ) => {
    // Implement logic here}
    
    return res.json({
      success: true,
    });
  });
};
```
5. Replace route `'/api/path/to'` with the real one.
6. Implement your logic.


### 1.3 Querying data with Sequelize model:
1. Existing models placed inside `/sequelize/models` directory.
2. In your controller, import model & query data:
```js
/**
 * Main controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  // Import a model using object destructing.
  const { User } = db;
  
  app.get('/api/users/active-count', async ( req, res ) => {
    /** @type {number} */
    const total = await User.count({
      active: true,
    });
    
    return res.json({
      success: true,
      total,
    });
  });
};
```

### 1.4 Generate Sequelize models from existing database:
To generate database tables, Use the following command:

```shell
./node_modules/.bin/sequelize-auto -o "./sequelize/models" -d gameit-pf -h localhost -u root -p 3306 -x root -e mysql
```
_**Warning**: Existing models will be replaced._

### 1.5 Database migration:
Note: Before migrating database make sure that `gameit-pf` database exist.

To migrate UP, execute the following command in Terminal:
```shell
npx sequelize-cli db:migrate
```

To migrate Down, execute the following command in Terminal:
```shell
npx sequelize-cli db:migrate:undo
```

### 1.6 Generate seeders:
Note: Before seeding database make sure migrations are up.

Execute the following command in Terminal:
```shell
npx sequelize-cli db:seed:all
```

### 1.7 JWT configuration
in `.env` file, please update the following variable:
```ini
JWT_SECRET=<long-random-hash>
```
_Replace `<long-random-hash>` with al least 30 chars random hash._ 


### 1.8 Website Base URL configuration
in `.env` file, please update the following variable 
```ini
WEBSITE_BASE_URL=<absolute-url>
```
_Replace `<absolute-url>` with: (without trailing slash):_
- for Development: http://localhost:4200
- for Production: https://gameit.ai

