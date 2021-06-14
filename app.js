const { Client } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SESSION_FILE_PATH = './selalusiap-sess.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  session: sessionCfg });

server.listen(8000, () => {
  console.log('App Running on port *:' + 8000)
})

// Run Frontend
app.get('/', (req, res) => {
  res.sendFile('src/index.html', { root: __dirname })
})

client.on('message', msg => {
  if (msg.body == '!hai') {
    msg.reply('Hai, kamu lagi apa?');
  }
});

client.initialize();


// Start Socket IO
io.on('connection', (socket) => {
  socket.emit('messages', 'Menghubungkan...')

  client.on('qr', (qr) => {
    console.log('QR Diterima', qr)
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('messages', 'QRCode diterima, silahkan scan')
    })
  });

  client.on('ready', () => {
    socket.emit('messages', 'Whatsapp siap digunakan!');
  });

  // client whatsapp web
  client.on('authenticated', (session) => {
    console.log('Klien terotentikasi', session);
    socket.emit('messages', 'Whatsapp terotentikasi');
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
      if (err) {
        console.error(err);
      }
    });
  });

})

// Send Message
app.post('/send-message', (req, res) => {
  const number = req.body.number;
  const message = req.body.message;

  client.sendMessage(number, message).then((response) => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: true,
      response: err
    });
  });
})

// Bulk message (Boradcast)
app.post('/send-bulk', (req, res) => {
  const message = req.body.message;
  const contact = req.body.number;

  for (let i = 0; i < contact.length; i++) {
    client.sendMessage(contact[i], message);
    if(i+1 == contact.length){
      res.status(200).json({
        status: true,
        response: 'Selesai'
      });
    }
  }
})

// Bom message
app.post('/send-bom', (req, res) => {
  const message = req.body.message;
  const contact = req.body.number;
  const limit = req.body.limit;

  for (let i = 0; i < limit; i++) {
    client.sendMessage(contact, message);
    if(i+1 == limit){
      res.status(200).json({
        status: true,
        response: 'Selesai'
      });
    }
  }
})
