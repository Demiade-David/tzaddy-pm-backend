const Client = require("../models/Client");
const createCrudRouter = require("./crud");

const router = createCrudRouter(Client, { sortField: "name", sortOrder: 1 });

module.exports = router;
