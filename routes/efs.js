const EFS = require("../models/EFS");
const createCrudRouter = require("./crud");
module.exports = createCrudRouter(EFS, { sortField: "updatedAt", sortOrder: -1 });
