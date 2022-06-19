let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");

// Leitura das linhas do terminal
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const REMOTE_SERVER = "0.0.0.0:5001";

let username;

// Cria gRPC Cliente
let client = new proto.example.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

//Start the stream between server and client
// Inicializa o stream entre o servidor e o cliente
function startChat() {
  let channel = client.join({ user: username });
  client.send({ user: username, text: "::. Entrou no servidor .::" }, res => {});

  channel.on("data", onData);

  rl.on("line", function(text) {
    client.send({ user: username, text: text }, res => {});
  });
}

//When server send a message
// Quando servidor envia uma mensagem
function onData(message) {
  if (message.user == username) {
    console.log("Olá " + username + " envie uma mensagem ...");
    return;
  }
  console.log(`${message.user}: ${message.text}`);
}

//Ask user name than start the chat
// Pergunta qual o nome do usuário quando inicializa o chat
rl.question("Qual seu nome? ", answer => {
  username = answer; 

  startChat();
});
