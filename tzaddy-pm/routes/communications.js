const Communication = require("../models/Communication");
const createCrudRouter = require("./crud");
module.exports = createCrudRouter(Communication, { sortField: "date", sortOrder: -1 });
