const axios = require("axios");
const xml2js = require("xml2js");
const mediumFeedURL = "https://medium.com/feed/@";
const { sendResponse } = require("./responseController");

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

      return sendResponse(response, responseType, articles, limit);
    });
  } catch (error) {
    next(error);
  }
};
