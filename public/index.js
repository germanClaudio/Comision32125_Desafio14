const socket = io.connect()

// ----------  Messages ----------------
/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
// Definimos un esquema de autor
const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'id' });
// Definimos un esquema de mensaje
const schemaMensaje = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: '_id' })
// // Definimos un esquema de posts
const schemaMensajes = new normalizr.schema.Entity('posts', { mensajes: [ schemaMensaje ] }, { idAttribute: 'id' })

socket.on('mensajesAll', async (mensajes) => {   //async (data)
    //console.log('Data mensaje: ' + JSON.stringify(mensajes))
    let mensajesNsize = JSON.stringify(mensajes).length
    //console.log(mensajes, mensajesNsize);
    let mensajesD = normalizr.denormalize(mensajes.result, schemaMensajes, mensajes.entities)
    let mensajesDsize = JSON.stringify(mensajesD).length
    //console.log(mensajesD, mensajesDsize);
    let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
    //console.log(`Porcentaje de compresión ${porcentajeC}%`)
    document.getElementById('compressionRate').innerText = `Compression Rate: ${porcentajeC}%`

    const html = makeHtmlList(mensajesD.mensajes)
    document.getElementById('mostrarMensajes').innerHTML = html;
    // render(await mensajes)
})

const addMessage = () => {
    const mensaje = {
        author: {
            email : document.getElementById('author').value,
            nombre : document.getElementById('nombre').value,
            apellido : document.getElementById('apellido').value,
            edad : document.getElementById('edad').value,
            alias : document.getElementById('alias').value,
            avatar : document.getElementById('avatar').value
        },
        text: document.getElementById('texto').value
    }
    
    socket.emit('newMensaje', mensaje )
    return false
}

function makeHtmlList(mensajes) {
    const date = new Date().toLocaleString('en-GB')
    return mensajes.map((mensaje) => {
        return (`<div class="d-block mx-auto my-1 p-1">
                    <strong class="text-secondary"> Mensaje-> </strong>
                    <strong class="fw-bold text-primary">${mensaje.author.email}</strong>:
                    <e id="colorBrown" style="color:brown;">${date} </e>: 
                    <em id="colorGreen" style="color:MediumSeaGreen;">${mensaje.text}</em>
                    <img class="img-fluid rounded-circle" alt="avatar" src='${mensaje.author.avatar}' width="60" height="60">
               </div>`)
    }).join(" ")
}

// --------------  Products ----------------
socket.on('productsAll', async (arrProd) => {
    renderProduct(await arrProd)
})

const addProduct = () => {
    const title = document.getElementById('title').value
    const price = Number(document.getElementById('price').value)
    const thumbnail = document.getElementById('thumbnail').value
    socket.emit('newProducto', { title, price, thumbnail })

    return false
}

const renderProduct = (arrProd) => {
    
    const html = arrProd.map((element) => {
        return (`<tr>
                    <th scope="row" class="text-center"><strong>${element.id}</strong></th>
                    <td class="text-center">${element.title}</td>
                    <td class="text-center">$${element.price}</td>
                    <td class="text-center"><img class="img-fluid rounded" alt="Product Image" src='${element.thumbnail}' width="100" height="80"></td>
                    <td class="text-center">${element.thumbnail}</td>
                </tr>`)
    }).join(" ");

    document.getElementById('mostrarProductos').innerHTML = html

    const htmlProdList = 
        ( `<caption id="capProdList">Total Product List ${arrProd.length}</caption>`)

    document.getElementById('capProdList').innerHTML = htmlProdList    

    document.getElementById('title').value = ""
    document.getElementById('price').value = ""
    document.getElementById('thumbnail').value = ""
}