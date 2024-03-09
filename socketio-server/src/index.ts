import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import ogs from "open-graph-scraper";

// types
import type Message from "./types/messageType";
import type User from "./types/userType";

config();

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

    if (!message.recipient) io.emit("message", message);

    if (message.recipient) {
      io.to(socket.id).emit("message", message);
      message.recipient.id &&
        socket.id !== message.recipient.id &&
        io.to(message.recipient.id).emit("message", message);
    }
  });

  socket.on("read", (recipientId: string) => {
    // if the message has no recipient
    // or the recipient is not in the active users list
    // or if somehow (you) are trying to read a message from yourself
    // then return
    if (!recipientId || !activeUsers[recipientId] || recipientId === socket.id)
      return;

    console.log(
      "read event received from: ",
      socket.id,
      "recipientId: ",
      recipientId
    );

    // emit to the other user that (you) read message their last read
    console.log("emitting read event to: ", recipientId);
    io.to(recipientId).emit("read", socket.id);
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
