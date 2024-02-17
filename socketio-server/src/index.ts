import fs from "fs";
import { createServer } from "https";
// import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import ogs from "open-graph-scraper";

config();

const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

const httpsServer = createServer(options);
const io = new Server(httpsServer, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const activeUsers: {
  [key: string]: {
    name: string;
    avatar: string;
    id: string;
  };
} = {};

io.on("connection", (socket) => {
  socket.on("register user", (user) => {
    if (activeUsers[socket.id]) {
      return;
    }
    activeUsers[socket.id] = { ...user, id: socket.id };
    io.emit("broadcast user status change", {
      user: activeUsers[socket.id],
    });
  });

  socket.on("global message", async (message) => {
    if (
      !activeUsers[socket.id] ||
      (!message.text && !message.image && !message.url)
    ) {
      return;
    }

    if ((message.urls as string[]).length > 0 && !message.image) {
      try {
        const { result, error } = await ogs({
          url: message.urls[0],
        });

        if (error) {
          throw new Error("Failed to fetch OG");
        }

        message.og = {
          description: result.ogDescription,
          image: result.ogImage,
          siteName: result.ogSiteName,
          title: result.ogTitle,
          url: result.requestUrl,
        };
      } catch (error) {
        console.error("error fetching og data: ", error);
      }
    }

    if (message.image) console.log(message.image);

    io.emit("broadcast global message", message);
  });

  socket.on("disconnect", () => {
    io.emit("broadcast user status change", {
      exiting: true,
      user: activeUsers[socket.id],
    });
    delete activeUsers[socket.id];
  });
});

const PORT = process.env.PORT || 8080;

httpsServer.listen(process.env.PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
