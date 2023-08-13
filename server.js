const http = require("http");
const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const { koaBody } = require("koa-body");
const koaStatic = require("koa-static");
const uuid = require("uuid");
const app = new Koa();
const Fake = require("./components/Fake");

const fake = new Fake();

const public = path.join(__dirname, "/public");
app.use(koaStatic(public));

app.use(async (ctx, next) => {
  const origin = ctx.request.get("Origin");
  if (!origin) {
    return await next();
  }

  const headers = { "Access-Control-Allow-Origin": "*" };

  if (ctx.request.method !== "OPTIONS") {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get("Access-Control-Request-Method")) {
    ctx.response.set({
      ...headers,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
    });

    if (ctx.request.get("Access-Control-Request-Headers")) {
      ctx.response.set("Access-Control-Allow-Headers", ctx.request.query);
    }

    ctx.response.status = 204;
  }
});

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    miltipart: true,
    json: true,
  })
);

const Router = require("koa-router");
const router = new Router();

router.get("/messages/unread", async (ctx, next) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  if (ctx.request.method !== "GET") {
    next();

    return;
  }
  try {
    const unreadMessages = fake.getUnreadMessages();

    ctx.response.body = JSON.stringify(unreadMessages);
    ctx.response.status = 200;
  } catch (err) {
    console.log(err);
  }
  next();
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
