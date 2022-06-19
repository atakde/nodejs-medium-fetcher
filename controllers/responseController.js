const sendResponse = (
  response,
  responseType = "json",
  data = [],
  limit = 5
) => {
  switch (responseType) {
    case "json":
      response.setHeader("Content-Type", "application/json");
      return response.status(200).send(data.slice(0, limit));
    case "svg":
      response.setHeader("Content-Type", "image/svg+xml");
      return response
        .status(200)
        .send(prepareSVGResponse(data.slice(0, limit)));
    case "html":
      response.setHeader("Content-Type", "text/html");
      return response
        .status(200)
        .send(prepareHTMLResponse(data.slice(0, limit)));
  }

  return response.status(400).send({
    error: {
      status: 400,
      message: "Invalid response type!",
    },
  });
};

const prepareSVGResponse = (data = []) => {
  let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="150">';
  let svgY = 20;
  svg +=
    '<style type="text/css">text { font: 500 14px "Segoe UI", Ubuntu, Sans-Serif; fill: #81a1c1; } circle {fill: blue;}</style>';
  data.forEach((article) => {
    svg += `<a href="${article.link}">`;
    svg += `<circle cx="10" cy="${
      svgY - 4
    }" r="3"/><text x="20" y="${svgY}">${article.title.replace(
      "&",
      ""
    )}</text>`;
    svg += "</a>";
    svgY += 20;
  });
  svg += "</svg>";
  return svg;
};

const prepareHTMLResponse = (data = []) => {
  return `
        <ul>
        ${data
          .map(
            (article) =>
              `<li><a href="${article.link}">${article.title}</a></li>`
          )
          .join("")}
        </ul>
    `;
};

exports.sendResponse = sendResponse;
