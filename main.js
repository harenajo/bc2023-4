const http = require('http');
const fs = require('fs');
const xml2js = require('xml2js');

const Port = 8000;
const host = 'localhost';

const requestListener = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/xml' });

  function minvalue(xmldata) {
    let min = Infinity;
    for (let list of xmldata.indicators.res) {
      if (list.value < min) {
        min = list.value;
      }
    }
    return min;
  }

  const data = fs.readFileSync('data.xml', 'utf-8');
  const parseOptions = {
    explicitArray: false,
    mergeAttrs: true,
  };

  xml2js.parseString(data, parseOptions, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Invalid XML structure');
      return;
    }

    const mindata = minvalue(result);

    const xmlData = {
      result: {
        value: mindata,
      },
    };

    const builder = new xml2js.Builder();
    const xmlres = builder.buildObject(xmlData);

    fs.writeFileSync('res.xml', xmlres);

    res.end(xmlres);
  });
};

const server = http.createServer(requestListener);

server.listen(Port, host, () => {
  console.log(`Server is running on http://${host}:${Port}`);
});
