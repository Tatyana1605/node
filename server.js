const express = require('express');
const fs = require('fs');

const app = express();


app.use(express.static('./'));
app.use(express.json());

app.get('/goods', (req, res) => {
  fs.readFile('./catalog.json', 'utf-8', (err, data) => {
    res.send(data);
  });
});

app.get('/baskets', (req, res) => {
  fs.readFile('./baskets.json', 'utf-8', (err, data) => {
    res.send(data);
  });
});

app.post('/baskets', (req, res) => {
  fs.readFile('./baskets.json', 'utf-8', (err, data) => {
    const parsedData = JSON.parse(data);

    // if(parsedData.some((item) => +item.id === +req.body.id)) {
    //   return res.status(500);
    // }

    parsedData.push(req.body);

    fs.writeFile('./baskets.json', JSON.stringify(parsedData), () => {
      res.send(req.body);
    });
  });
});


  app.patch('/baskets/:id', (req, res) => {
    fs.readFile('./baskets.json', 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);
  
      // if(parsedData.every((item) => +item.id !== +req.params.id)) {
      //   return res.status(500).send({});
      // }
  
      const basketsItemIdx = parsedData.findIndex((basketItem) => +basketItem.id === +req.params.id);
      parsedData[basketsItemIdx].qty = req.body.qty;
  
      fs.writeFile('./baskets.json', JSON.stringify(parsedData), () => {
        res.send(parsedData[basketsItemIdx]);
      });
  });
});

app.delete('/baskets/:id', (req, res) => {
  fs.readFile('./baskets.json', 'utf-8', (err, data) => {
    const parsedData = JSON.parse(data);

    if(parsedData.every((item) => +item.id !== +req.params.id)) {
      return res.status(500).send({});
    }

    const basketsItem = parsedData.findIndex((basketItem) => +basketItem.id === +req.params.id); 
    parsedData[basketsItem].qty = req.body.qty;

    fs.writeFile('./baskets.json', JSON.stringify(parsedData), () => {
      res.send(parsedData[basketsItem]);
    });
  });
});

app.listen(3000);