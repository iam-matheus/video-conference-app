const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const { Socket } = require("dgram");
const res = require("express/lib/response");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

app.use(cors());

const PORT = process.env.PORT || 5000;

//root route
app.get("/", (req, res) => {
	res.send("Server is running..")
})

io.on("connection", (socket) => {
	socket.emit("me", socket.id); 

	socket.on("disconnect", () => {
		socket.broadcast.emit("call ended");
	});
	
	socket.on("calluser", ({ userToCall, signalData, from, usname})=> {
		io.to(userToCall).emit("calluser", {signal: signalData, from, usname});

	}) 

	socket.on("answercall", (data) => {
		io.to(data.to).emit("call accepted", data.signal)
	})
})



//output what port the server is listening on
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
