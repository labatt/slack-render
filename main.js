var fs = require('fs');
var MarkdownIt = require('markdown-it');
var emoji = require('markdown-it-emoji');
markdown = new MarkdownIt();
markdown.use(emoji);

function msg2html(msg) {
  return `
<article class="media">
  <div class="media-content">
    <div class="content">
      <p>
        <strong>${msg.username}</strong> <small>${msg.time}</small>
        <br>
        ${msg.text.join("\n")}
      </p>
    </div>
  </div>
</article>`;
}

function day2html(day, messages) {
  const all_messages = messages.map(msg2html).join("\n");

  return `<h3 class="title is-3">${day}</h3>
    <div>
    ${all_messages}
    </div>`;
}

function json2html(filename) {
  var file = fs.readFileSync(filename, 'utf8');
  var obj = JSON.parse(file);
  var messages_by_day = {};
  var last_user = null;
  var last_day = null;

  for(var msg of obj.messages.sort((a, b) => a.date.localeCompare(b.date))) {
    var [day, time] = msg.date.split(' ');
    var mbd = messages_by_day[day];

    if (mbd === undefined) {
      mbd = messages_by_day[day] = [];
    }

    var rendered = markdown.render(msg.text);

    if (last_user !== msg.username || last_day !== day) {
      mbd.push({
        "time": time,
        "text": [rendered],
        "username": msg.username,
      });
    } else {
      mbd[mbd.length - 1].text.push(rendered);
    }

    last_user = msg.username;
    last_day = day;
  }

  var dayChunks = [];
  for (const [day, messages] of Object.entries(messages_by_day).sort()) {
    dayChunks.push(day2html(day, messages));
  }

  return `
  <section class="section">
  <div class="container">
    ${dayChunks.join("\n")}
  </div>
  </section>
  `;
}

function writeTemplate(filename, content) {
  const wrappedBody = `
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/static/bulma.min.css">
  </head>
  <body>
  ${content}
  </body>
  </html>`;
    fs.writeFileSync(filename, wrappedBody);
}

const data = json2html('direct_messages/test.json');
writeTemplate("output/test.html", data)
