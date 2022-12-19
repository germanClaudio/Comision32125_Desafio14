const { options } = require("../options/config.js")

const ContainerMessages = require("../contenedores/containerMessages.js")
const containerMsg = new ContainerMessages(options.filePath.pathMsg)

const ContainerProducts = require("../daos/productos/ProductosDaoArchivo.js")
const containerProduct = new ContainerProducts(options.filePath.path)

const { normalize, schema } = require("normalizr");

const initSocket = (io) => {
  io.on("connection", async (socket) => {
        logger.info("Nuevo cliente conectado!")
        // console.log("Nuevo cliente conectadoooo!")
        
        // --------------------------  Products --------------------------------
        socket.emit('productsAll', await containerProduct.getAllProducts() )   
        
        socket.on("productsAll", async (arrProd) => {
        renderProduct(await arrProd);
        });

        socket.on('newProducto', async (producto) => {
            logger.info('Data servidor: ' + JSON.stringify(producto))
            //console.log('Data servidor: ' + JSON.stringify(producto))
            const arrayProducts = await containerProduct.createProduct(producto)
            io.sockets.emit('productsAll', arrayProducts)
        })


    // -----------------------------  Messages ---------------------------------
        const normalizarMensajes = (mensajesConId) =>
        normalize(mensajesConId, schemaMensajes)

        async function listarMensajesNormalizados() {
            const mensajes = await containerMsg.getAllMsg();
            const normalizados = normalizarMensajes({ id: "mensajes", mensajes });
            return normalizados;
            }

        // NORMALIZACIÓN DE MENSAJES
        // Definimos un esquema de autor
        const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "email" } );
        // Definimos un esquema de mensaje
        const schemaMensaje = new schema.Entity("post", { author: schemaAuthor }, { idAttribute: "id" });
        // Definimos un esquema de posts
        const schemaMensajes = new schema.Entity("posts", { mensajes: [schemaMensaje] }, { idAttribute: "id" });

        socket.emit("mensajesAll", await listarMensajesNormalizados()); //containerMsg.getAllMsg() )

        socket.on("newMensaje", async (message) => {
        message.fyh = new Date().toLocaleString()
        await containerMsg.saveMsg(message) //mensajesApi.addMessage(mensaje)
        io.sockets.emit("mensajesAll", await listarMensajesNormalizados())
        })
    
        socket.on('disconnect', () => {
            logger.err('User desconectado!!')
            //console.log(`User desconectado`)
        })

    })

}

module.exports = initSocket