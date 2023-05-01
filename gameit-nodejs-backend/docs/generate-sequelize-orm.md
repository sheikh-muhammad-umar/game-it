# Generate Sequelize ORM models

- Please open Terminal inside `root` directory.

- Paste the follow command.

```shell
./node_modules/.bin/sequelize-auto -o "./sequelize/models/dist" -d gameit_pf_global -h localhost -u root -x admin -e mysql --cm p --cp c --sg --cf p
```

*Note: Please update password before executing above command:* `-x <password>`

- Hit enter and generate ORM files.

- Move file from `dist` to `models` (one directory back)

- Make sure to update `relations` in `sequelize/init-models.js` file.

- Also please update JSDoc / definations too, for each model:

- ```js
  /**
   * @typedef SequelizeModelsDefs
   * @type {Object}
   * ....
   * @property {import('sequelize/types/model').ModelStatic&<Name>.} <Name> - <Name> model
   */
  ```

## Generated files:

Please check the directory following directory:

`sequelize/models/dist`


