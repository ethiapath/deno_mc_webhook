import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const messages = [];
const channel = new BroadcastChannel("chat");
channel.onmessage = (event) => {
  messages.push(event.data);
};

const router = new Router();
router
  .get("/", (context) => {
	  console.log(Date.now() + ' main route ' + JSON.stringify(context, null, 2));
    context.response.body = "Chat server!";
  })
  .get("/messages", (context) => {
	  console.log('messeges route')
    context.response.body = messages;
  })
  .post("/messages", async (context) => {
    const message = await context.request.body().value;
    messages.push(message);
    channel.postMessage(message);
    context.response.body = messages;
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

addEventListener("fetch", app.fetchEventHandler());

