const axios = require("axios");
const xml2js = require("xml2js");
const mediumFeedURL = "https://medium.com/feed/@";
const { sendResponse } = require("./responseController");

// find first image in the body of the article
const findImage = (body) => {
  const imgRegex = /<img.*?src="(.*?)"/;
  const imgSrc = body.match(imgRegex);
  if (imgSrc) {
    return imgSrc[1];
  }
  return null;
};

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
        const body = item["content:encoded"][0];
        const rawShortDescription = body.replace(/<[^>]*>?/gm, "");
        // the string should be 170 characters long, but we need to make sure it doesn't cut off a word
        // so we'll cut it off at the last space before 170 characters
        const shortDescription = rawShortDescription.substring(0, 170).split(" ").slice(0, -1).join(" ") + "...";
        return {
          title: item.title[0],
          link: item.link[0].replace(/\?source.*/, ""),
          date: item.pubDate[0],
          categories: item.category,
          shortDescription: shortDescription,
          featuredImage: findImage(body),
        };
      });

      return sendResponse(response, responseType, articles, limit);
    });
  } catch (error) {
    next(error);
  }
};
