import fs from "fs";
import { createServer } from "http";
// import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import ogs from "open-graph-scraper";

// types
import type Message from "./types/messageType";
import type User from "./types/userType";

config();

// const options = {
//   key: fs.readFileSync("./server.key"),
//   cert: fs.readFileSync("./server.cert"),
// };

const httpServer = createServer();
const io = new Server(httpServer, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const activeUsers: {
  [key: string]: User;
} = {};

io.on("connection", (socket) => {
  socket.on("register user", (user: User) => {
    if (activeUsers[socket.id]) {
      return;
    }
    activeUsers[socket.id] = { ...user };
    io.emit("user status change", {
      user: activeUsers[socket.id],
    });
    io.to(socket.id).emit("update active users", activeUsers);
  });

  socket.on("message", async (message: Message) => {
    if (
      !activeUsers[socket.id] ||
      (!message.text && !message.image && !message.url)
    ) {
      return;
    }

    if (message.url && !message.image) {
      try {
        const { result, error } = await ogs({
          url: message.url,
        });

        if (error) {
          throw new Error("Failed to fetch OG");
        }

        message.og = {
          description: result.ogDescription,
          image: result.ogImage as {
            url: string;
            width: number;
            height: number;
            type: string;
          }[],
          siteName: result.ogSiteName,
          title: result.ogTitle,
          url: result.requestUrl,
        };
      } catch (error) {
        console.error("error fetching og data: ", error);
      }
    }

    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    io.emit("user status change", {
      exiting: true,
      user: activeUsers[socket.id],
    });
    delete activeUsers[socket.id];
  });
});

const PORT = process.env.PORT || 8080;

httpServer.listen(process.env.PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
