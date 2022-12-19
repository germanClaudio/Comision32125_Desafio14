const fs = require("fs")

module.exports = class ContainerArchivo {
  constructor(filePath) {
    this.filePath = filePath
  }

  async readFile() {
    try {
      const content = await fs.promises.readFile(this.filePath, "utf-8")
      //console.log("content: " + content)
      const contentParsed = JSON.parse(content)
      return contentParsed
    } catch (error) {
      console.error("Error leer archivo: " + error)
    }
  }
}
