var fs = require('fs');
var koa = require('koa');
var app = koa();

var domain = process.env.PORT ? 'www.theclevernode.com' : 'localhost:3000';

app.use(function *redirect301(next) {
  if (this.req.headers.host !== domain) {
    this.status = 301;
    this.redirect(`https://${domain}`);
  }

  yield next;
});

app.use(require('koa-static')('build', {
  gzip: true,
}));

app.use(function *pageNotFound(next) {
  yield next;

  if (this.status != 404) return;

  this.status = 404;

  switch (this.accepts('html', 'json')) {
    case 'html':
      this.type = 'html';
      this.body = fs.createReadStream('build/404.html');
      break;
    case 'json':
      this.body = {
        message: 'Page Not Found',
      };
      break;
    default:
      this.type = 'text';
      this.body = 'Page Not Found';
  }
});

app.listen(process.env.PORT || 3000);
