const axios = require("axios");
const xml2js = require("xml2js");
const mediumFeedURL = "https://medium.com/feed/@";

exports.getArticles = async (request, response, next) => {
  const { username, limit, responseType } = request.query;

  if (!username || !limit || !responseType) {
    return response.status(400).send({
      error: {
        status: 400,
        message: "Missing params!",
      },
    });
  }

  try {
    const feedURL = `${mediumFeedURL}${username}`;
    const { data } = await axios.get(feedURL);
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if (err) {
        return next(err);
      }
      const articles = result.rss.channel[0].item.map((item) => {
        return {
          title: item.title[0],
          link: item.link[0].replace(/\?source.*/, ""),
        };
      });

      if (responseType === "json") {
        return response.status(200).send(articles.slice(0, limit));
      } else if (responseType === "html") {
        return response.status(200).send(`
          <ul>
            ${articles
              .slice(0, limit)
              .map(
                (article) =>
                  `<li><a href="${article.link}">${article.title}</a></li>`
              )
              .join("")}
          </ul>
        `);
      } else if (responseType === "svg") {
        let svg = '<svg width="500" height="250" xmlns="http://www.w3.org/2000/svg">';
        svg += '<rect x="0" y="0" width="500" height="250" fill="transparent" />';
        svg += '<foreignobject x="0" y="0" width="500" height="250"><body xmlns="http://www.w3.org/1999/xhtml">';
        svg += '<ul>';
        articles.slice(0, limit).map((article) => {
          svg += `<li><a href="${article.link}">${article.title}</a></li>`;
        });
        svg += '</ul></body></foreignobject></svg>';
        return response.status(200).send(svg);
      }
    });
  } catch (error) {
    next(error);
  }
};
