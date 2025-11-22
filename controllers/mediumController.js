const puppeteer = require("puppeteer");
const UserAgent = require("user-agents");
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

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });

    try {
      const page = await browser.newPage();

      // Generate random user agent
      const userAgent = new UserAgent();
      const randomUserAgent = userAgent.toString();

      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(randomUserAgent);

      // Set extra headers to match browser
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br, zstd",
      });

      const pageResponse = await page.goto(feedURL, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      let rssContent = "";
      if (pageResponse) {
        rssContent = await pageResponse.text();
      } else {
        // Fallback: extract from page content
        const preTag = await page.$("pre");
        if (preTag) {
          rssContent = await page.evaluate((el) => el.textContent, preTag);
        } else {
          rssContent = await page.content();
        }
      }

      await browser.close();

      if (typeof rssContent === "string" && (rssContent.includes("Just a moment") || rssContent.includes("cf-browser-verification") || rssContent.includes("Checking your browser"))) {
        throw new Error("Cloudflare protection detected. The RSS feed is currently blocked.");
      }

      const parser = new xml2js.Parser();
      parser.parseString(rssContent, (err, result) => {
        console.log(err);
        if (err) {
          return next(err);
        }
        const articles = result.rss.channel[0].item.map((item) => {
          const body = item["content:encoded"] ? item["content:encoded"][0] : item.description[0];
          const rawShortDescription = body.replace(/<[^>]*>?/gm, "");
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
      return;
    } catch (puppeteerError) {
      await browser.close();
      throw puppeteerError;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
