let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");

var data = new Date();
var dia     = data.getDate();
var mes     = data.getMonth();
var ano     = data.getFullYear();
var hora    = data.getHours();  
var min     = data.getMinutes();    
var seg     = data.getSeconds();
// Formata a data e a hora
var str_data = dia + '/' + (mes+1) + '/' + ano;
var str_hora = hora + ':' + min + ':' + seg;

var LGerr = false;

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
let client = new proto.unesc.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);



// Inicializa a transmissão entre o servidor e o cliente
function startChat() {
  let channel = client.join({ user: username });
  console.log(channel);
  client.send({ user: username, text: "::. Entrou no servidor .::" }, res => {});

  channel.on("data", onData);

  rl.on("line", function(text) {
    client.send({ user: username, text: text }, res => {});
  });
}


// Quando servidor envia uma mensagem
function onData(message) {
  
  if (message.user == username) 
  {
    if(!LGerr)
    {
      console.log("Olá " + username + " envie uma mensagem ...");
      LGerr = true;
      return;
    }
    else
      return;
  }

  console.log(`${message.user}: ${message.text}` + "         " + str_data + " às " + str_hora);
}


// Pergunta qual o nome do usuário quando inicializa o chat
rl.question("Qual seu nome? ", answer => {
  username = answer; 

  //verificaUsers(username);
  
  startChat();
});


/* function verificaUsers(username)
{
  console.log(client); 
  return;
} */
