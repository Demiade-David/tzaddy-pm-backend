const Document = require("../models/Document");
const createCrudRouter = require("./crud");
module.exports = createCrudRouter(Document, { sortField: "createdAt", sortOrder: -1 });
