const notFoundHandler = (req, res, next) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: `The page '${req.originalUrl}' does not exist.`,
    nav: res.locals.nav
  });
};

const errorHandler = (err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);

  res.status(err.status || 500).render("errors/error", {
    title: "Server Error",
    message: err.message || "Something unexpected happened.",
    nav: res.locals.nav
  });
};

module.exports = { notFoundHandler, errorHandler };
