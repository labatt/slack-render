var fs = require('fs');

function msg2html(msg) {
  return `
<article class="media">
  <figure class="media-left">
    <p class="image is-64x64">
      <img src="https://bulma.io/images/placeholders/128x128.png">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p>
        <strong>${msg.username}</strong> <small>${msg.date}</small>
        <br>
        ${msg.text}
      </p>
    </div>
  </div>
</article>`;
}

function day2html(day, messages) {
  const all_messages = messages.map(msg2html).join("\n");
  return `<h3>${day}</h3>
    <div>
    ${all_messages}
    </div>`;
}

function json2html(filename) {
  var file = fs.readFileSync(filename, 'utf8');
  var obj = JSON.parse(file);
  var messages_by_day = {};

  for(var msg of obj.messages) {
    var day = msg.date.split(' ')[0];
    if (messages_by_day[day] === undefined) {
      messages_by_day[day] = [];
    }

    messages_by_day[day].push({
      "date": msg.date,
      "text": msg.text,
      "username": msg.username,
    });
  }

  // for (const [key, value] of Object.entries(obj)) {
  //   console.log(
  // }

  const xday = "2019-03-27";
  var dayhtml = day2html(xday, messages_by_day[xday]);

  return dayhtml;

  // var context = {
  //   "messages_by_day": messages_by_day,
  // };
}

function writeTemplate(filename, content) {
  const wrappedBody = `
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/static/css/bulma.45a491b38359.css">
  </head>
  <body>
  ${content}
  </body>
  </html>`;
    fs.writeFileSync(filename, wrappedBody);
}

const data = json2html('direct_messages/julmrose.json');
writeTemplate("output/julia.html", data)
