/**
 * SQLite is a native module with no Jest backing. This stub keeps imports and
 * schema setup working; tests that care about queries mock the `database`
 * helpers instead. Jest picks this up automatically for the node module.
 *
 * @format
 */

const emptyResultSet = () => ({
  rows: { length: 0, item: () => undefined, raw: () => [] },
  rowsAffected: 0,
  insertId: undefined,
});

const database = {
  executeSql: jest.fn(async () => [emptyResultSet()]),
  transaction: jest.fn(async callback =>
    callback({ executeSql: jest.fn(() => [emptyResultSet()]) }),
  ),
  close: jest.fn(async () => undefined),
};

const SQLite = {
  enablePromise: jest.fn(),
  DEBUG: jest.fn(),
  openDatabase: jest.fn(async () => database),
  deleteDatabase: jest.fn(async () => undefined),
};

module.exports = {
  __esModule: true,
  default: SQLite,
  ...SQLite,
  __database: database,
};
