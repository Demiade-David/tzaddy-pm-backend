const Billing = require("../models/Billing");
const createCrudRouter = require("./crud");
module.exports = createCrudRouter(Billing, { sortField: "date", sortOrder: -1 });
