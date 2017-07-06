var koa 	= require('koa');
var Router 	= require('./siteRouter');
var views 	= require('koa-views');

var app 	=  new koa();
1
const  serve = require("koa-static");
app.use(serve(__dirname+ "/static/html"));
  
// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


//jade
app.use(views('views', {
  map: {
    html: 'jade'
  }
}));


app
  .use(Router.routes())
  .use(Router.allowedMethods());


var ProtoBuf = require("protobufjs");

//const server = require('http').createServer(app.callback())
var http = require('http').Server(app.callback());
var io = require('socket.io')(http);
// 关键代码 Socket.io的标准用法
io.on('connection', socket=>
{
  const output = function(msg) {
    socket.emit('output', msg.toString());
  }
  console.log("user connected");
  //process.stdout.on('data', output)

  socket.on('login',obj=>
  	{
  		console.log("login:" + obj.userName);

      ProtoBuf.load("./proto/user.login.proto").then(root=>
      {
          var loginMessage = root.lookupType("user.login");
          var message = loginMessage.create({userID:32112455,userName:"melp中文",userPass:"123123"});
          var buffer = loginMessage.encode(message).finish();

          console.log("send message :" + buffer);

          socket.emit('login',buffer);

          var mm = loginMessage.decode(buffer);
          console.log(mm);
      });
/*
      var data = new userpk.login({userName:"melp",userPass:"123123"});
      var sendBuff = data.encode();
      socket.emit('login',sendBuff.toBuffer());

      console.log("send message :" + sendBuff.toBuffer());
*/
  	});

  socket.emit('disconnect',obj=>{
  		console.log("user disconnect");
  });
});

http.listen(1337);

app.listen(3000);
