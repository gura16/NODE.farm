const fs = require(`fs`);
const http = require(`http`);
const url = require(`url`);

//////////////////////////////
// file

//blocking sunchronous way
// const textIn = fs.readFileSync(`./txt/input.txt`, `utf-8`);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync(`./txt/output.txt`, textOut);
// console.log("written file");

//Non blocking asynchronous way
// fs.readFile(`./txt/start.txt`, `utf-8`, (err, date1) => {
//   if (err) return console.log(`error`);
//   fs.readFile(`./txt/${date1}.txt`, `utf-8`, (err, date2) => {
//     console.log(date2);
//     fs.readFile(`./txt/append.txt`, `utf-8`, (err, date3) => {
//       console.log(date3);

//       fs.writeFile(`./txt/final.txt`, `${date2}\n${date3}`, `utf-8`, (err) => {
//         console.log(`your file has been written`);
//       });
//     });
//   });
// });

// console.log(`read this file`);

//////////////////////////////
// server

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, `not-organic`);
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  `utf-8`
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  `utf-8`
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  `utf-8`
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  ///  Overview page
  if (pathName === `/` || pathName === `/overview`) {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(" ");

    const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
    res.end(output);
    /// Product page
  } else if (pathName === `/product`) {
    res.end(`This is the PRODUCT`);

    /// API
  } else if (pathName === `/api`) {
    res.writeHead(200, "Content-type", "application/json");
    res.end(data);

    /// Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end(`<h1> page not found! </h1>`);
  }
});

server.listen(3000, `127.0.0.1`, () => {
  console.log(`Listening to requests on port 3000`);
});