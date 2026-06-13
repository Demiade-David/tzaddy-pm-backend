const Compliance = require("../models/Compliance");
const createCrudRouter = require("./crud");

const router = createCrudRouter(Compliance, { sortField: "dueDate", sortOrder: 1 });

module.exports = router;
