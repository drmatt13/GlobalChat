"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const https_1 = require("https");
const socket_io_1 = require("socket.io");
const open_graph_scraper_1 = __importDefault(require("open-graph-scraper"));
const options = {
  key: fs_1.default.readFileSync("./server.key"),
  cert: fs_1.default.readFileSync("./server.cert"),
};
const httpsServer = (0, https_1.createServer)(options);
const io = new socket_io_1.Server(httpsServer, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const activeUsers = {};
io.on("connection", (socket) => {
  socket.on("register user", (user) => {
    if (activeUsers[socket.id]) {
      return;
    }
    activeUsers[socket.id] = Object.assign(Object.assign({}, user), {
      id: socket.id,
    });
    io.emit("broadcast user status change", {
      user: activeUsers[socket.id],
    });
  });
  socket.on("global message", (message) =>
    __awaiter(void 0, void 0, void 0, function* () {
      if (
        !activeUsers[socket.id] ||
        (!message.text && !message.image && !message.url)
      ) {
        return;
      }
      if (message.urls.length > 0 && !message.image) {
        try {
          const { result, error } = yield (0, open_graph_scraper_1.default)({
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
    })
  );
  socket.on("disconnect", () => {
    io.emit("broadcast user status change", {
      exiting: true,
      user: activeUsers[socket.id],
    });
    delete activeUsers[socket.id];
  });
});
const PORT = process.env.PORT || 8080;
httpsServer.listen(8080, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
