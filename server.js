let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";

//Carrega o protobuf
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

let users = [];
const usuarios = [];
let LGinsere = false;

// Recebe mensagem do cliente ao entrar no servidor
function join(call, callback) {
  users.push(call);
  //notifyChat({ user: "Server", text: "Novo usuário entrou no chat ..." });
}

function listUsers(call, callback) {

  if(usuarios.length == 0)
  {
    callback(null, { error: 1, msg: "Não existem usuários logados" });
  }
  else
  {
    callback(null, {
      error: 0,
      msg: "Success",
      users: usuarios,
      qtd : usuarios.length
    });
  }

}


// Receba mensagem do usuario cliente
function send(call, callback) {
  notifyChat(call.request);
}

// Envia a mensagem para todos os usuarios conectados ao client
function notifyChat(message) {
  users.forEach(user => {
    // console.log(message.user);
    user.write(message);
  });


  if(usuarios.includes(message.user))
  {
    LGinsere = false;
  }
  else
    LGinsere = true;

  if(LGinsere)
    usuarios.push(message.user);
  
}

// Define o servidor com os métodos e inicia
server.addService(proto.example.Chat.service, { join: join, send: send, listUsers: listUsers, getAllUsers: (call, callback) => {
  console.log(usuarios);
  callback(null, usuarios);
} });

server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

server.start();

console.log("Servidor iniciado na porta: " + SERVER_ADDRESS);
