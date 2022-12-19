const fs = require("fs")

module.exports = class ContainerMsg {
    constructor(configConnection) {
        // console.log('config: ', configConnection)
        this.myFile = configConnection
    }

    async readFile() {
        try {
          const content = await fs.promises.readFile(this.myFile, "utf-8")
          const contentParsed = JSON.parse(content)
          return contentParsed
        } catch (error) {
          console.error("Error leer archivo: " + error)
        }
      }

    async getAllMsg() {
        const fileContent = await this.readFile()
        try {
            if (fileContent.length !== 0) {
            return fileContent
            } else {
            console.log("Lo sentimos, la lista de mensajes está vacía!!!")
            }
        } catch (error) {
            console.error(`Error getting all messages ${error}`)
        }
    }
   
    async saveMsg(addMessage) {
        const fileContent = await this.readFile()
        // console.log('Dentro del saveProduct: '+ JSON.stringify(addMessage))
        if (addMessage !== undefined) {
            try {
                await fs.promises.writeFile(
                    this.myFile,
                  JSON.stringify([...fileContent, { ...addMessage, id: fileContent[fileContent.length - 1].id + 1} ], null, 2)
                )
                // console.log("Mensaje guardado en Base de Datos!", fileContent)
                return fileContent
                
            } catch (error) {
                console.log(error)
                return { Error: 'Upps! Hubo un error y no pudimos guardar el Mensaje.' }
            }
        } else {
            return { Error: 'Upps! We had some problems saving the mensaje, try later.' }
        }
    }
}    