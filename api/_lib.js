function sendJsonError(res, fileName, error) {
  const statusCode = error && error.code === 'ENOENT' ? 404 : 500;
  res.status(statusCode).json({
    ok: false,
    error: statusCode === 404 ? 'not_found' : 'read_failed',
    file: fileName,
  });
}

function createDataHandler(fileName, loadData) {
  return async function handler(_req, res) {
    try {
      const data = loadData();
      res.status(200).json(data);
    } catch (error) {
      sendJsonError(res, fileName, error);
    }
  };
}

module.exports = {
  sendJsonError,
  createDataHandler,
};
