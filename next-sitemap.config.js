const siteUrl = "https://cavagna.shop"

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ["/checkout", "/account", "/account/*", "/cart"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account", "/cart"],
      },
    ],
  },
}
