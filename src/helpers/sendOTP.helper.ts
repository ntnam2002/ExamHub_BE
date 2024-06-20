const https = require('https');
const ACCESS_TOKEN = 'aIECZCaTmxhMlc7injs_XIxCARvqhF-u';

export const sendSMS = function (phones, content, type = 2, sender) {
  const url = 'api.speedsms.vn';
  const text = `OPT của bạn là ${content}`;
  const params = JSON.stringify({
    to: phones,
    content: text,
    sms_type: type,
    sender: sender,
  });

  const buf = new Buffer(ACCESS_TOKEN + ':x');
  const auth = 'Basic ' + buf.toString('base64');
  const options = {
    hostname: url,
    port: 443,
    path: '/index.php/sms/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
  };

  const req = https.request(options, function (res) {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      const json = JSON.parse(body);
      if (json.status == 'success') {
        console.log('send sms success');
      } else {
        console.log('send sms failed ' + body);
      }
    });
  });

  req.on('error', function (e) {
    console.log('send sms failed: ' + e);
  });

  req.write(params);
  req.end();
};
