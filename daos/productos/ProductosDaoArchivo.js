const ContainerArchivo = require("../../contenedores/containerArchivo");
const fs = require("fs")

class ProductosDaoArchivo extends ContainerArchivo {
  constructor() {
    super("DB/productos.json")
  }

  async getAllProducts() {
    const fileContent = await this.readFile()
    if (fileContent.length !== 0) {
      // console.table(fileContent)
      return fileContent;
    } else {
      console.log("Lo sentimos, la lista de Productos está vacía!!!");
    }
  }

  async getById(id) {
    const fileContent = await this.readFile()
    const product = fileContent.filter((item) => item.id === id);

    if (product.length > 0) {
      console.log("Producto encontrado: " + JSON.stringify(product, true, 2));
      return product;
    } else {
      console.log(
        "Lo sentimos, el Id del producto ingresado no existe en nuestra Base de Datos!!"
      );
    }
  }

  async createProduct(obj) {
    const fileContent = await this.readFile()
    //console.log(fileContent)
    if (fileContent.length !== 0) {
      try {
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify([...fileContent, { ...obj, id: fileContent[fileContent.length - 1].id + 1} ], null, 2)
        )
        console.log(
          "Producto guardado con exito en Base de Datos! con productos anteriores ",
          fileContent
        )
        return fileContent;
      } catch (error) {
        console.log("Error al escribir en archivo-----aca es el error!! \n" + error);
      }
    } else {
      try {
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify([{ ...obj, id: 1 }], null, 2),
          "utf-8"
        )
        console.log("Producto guardado con éxito en Base de Datos vacia!");
      } catch (error) {
        console.log("Error al escribir en archivo--vacio!! \n" + error);
      }
    }
  }

  async deleteProduct(id) {
    const fileContent = await this.readFile();

    const nonDeletedProducts = fileContent.filter((item) => item.id !== id);
    const productToBeDeleted = fileContent.filter((item) => item.id === id);

    if (productToBeDeleted.length > 0) {
      try {
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(nonDeletedProducts, null, 2)
        );
        console.log(
          `Producto ${JSON.stringify(
            productToBeDeleted,
            null,
            2
          )} \nEliminado con éxito de la Base de Datos!!\n`
        );
      } catch (error) {
        console.log("Error al escribir en archivo!! \n" + error);
      }
    } else {
      console.log(
        "Lo sentimos, el Id del producto ingresado NO existe en nuestra Base de Datos"
      );
    }
  }

  async deleteAll() {
    const fileContent = await this.readFile();

    if (fileContent.length > 0) {
      try {
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify([], null, 2),
          "utf-8"
        );
        console.log(
          "Todos los productos han sido Eliminados de la Base de Datos!!!"
        );
      } catch (error) {
        console.log("Error al escribir en archivo!! \n" + error);
      }
    } else {
      console.log("La Base de Datos está vacía!!!");
    }
  }
  //----------------------------------------------------------------

  async desconectar() {}
}

module.exports = ProductosDaoArchivo;
