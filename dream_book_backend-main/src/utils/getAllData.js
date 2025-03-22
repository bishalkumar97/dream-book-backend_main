const APIFeatures = require("./apiFeatures");
const { filteredResults } = require("./advanceFilter");

async function getAllData(model, query, populateConfig) {
    console.log("Received query for data retrieval:", query); // Debug log the received query

    const page = query.page && parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
    const limit = query.limit && parseInt(query.limit, 10) > 0 ? parseInt(query.limit, 10) : 10;

// FIX HERE NEW: Handle "oldToNew" or "newToOld" for sorting
    // If the client sends ?sort=oldToNew, we will replace it with "createdAt"
    // If the client sends ?sort=newToOld, we will replace it with "-createdAt"
    if (query.sort === 'oldToNew') {              // FIX HERE NEW
        query.sort = 'createdAt';                  // FIX HERE NEW (ascending by createdAt)
      } else if (query.sort === 'newToOld') {       // FIX HERE NEW
        query.sort = '-createdAt';                 // FIX HERE NEW (descending by createdAt)
      }
      // FIX HERE NEW: End of sort handling

    let dataQuery = model.find({});

    // Apply population dynamically based on the provided configuration
    if (populateConfig) {
        populateConfig.forEach(({ path, select, subPopulate }) => {
            const populateOptions = { path, select };
            if (subPopulate) {
                populateOptions.populate = subPopulate;
            }
            dataQuery = dataQuery.populate(populateOptions);
        });
    }

    let data = new APIFeatures(dataQuery, query).filter().sort().paginate();
    data = await data.query.lean(); // Fix: use the result of the chained methods

    const totalResults = await filteredResults(model, query);
    const totalPages = Math.ceil(totalResults / limit);

    return {
        page,
        limit,
        results: data,
        totalPages,
        totalResults,
    };
}

module.exports = {
    getAllData
}
