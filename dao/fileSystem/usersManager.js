const fs = require("fs")
const crypto = require("crypto")

class UserManager {
    constructor(archivo) {
      this.archivo = archivo
    }
    writeFile = async (data) => {
      try {
        await fs.promises.writeFile(
          this.archivo, JSON.stringify(data, null, 2)
        )
      } catch (error) {
        console.log(error)
      }
    }
    getUsers = async () => {
      try {
        //Nos aseguramos que el archivo existe
          if (fs.existsSync(this.archivo)) {
            //Si el archivo existe, se lee la informacion y se guarda en la constante "data"
              const data = await fs.promises.readFile(this.archivo, 'utf-8')
              //Si el archivo existe pero no tiene datos escritos dentro devuelve un arreglo vacio para evitar que nos de un error
              const users = data === "" ? [] : JSON.parse(data)
              return users
          }
          //Si el archivo no existe mostramos un log diciendo que la lista esta vacia y devolvemos un arreglo vacio para evitar errores
          console.log('La lista esta vacia')
          return await this.writeFile( [] )
      } catch (error) {
          console.log(error)
      }
    }
    createUser = async (user) => {
      try {
        const users = await this.getUsers()
        //Comprobamos que si no existen usuarios el primer id sera 1, en todo caso si existe uno o varios usuarios le incrementamos el id.
        users.length === 0 ? user.id = 1 : user.id = users[users.length-1].id + 1
        //Validamos el correo para que no se repitan
        const validateUserMail = users.find(u => u.email === user.email)
        //si el correo existe devolvemos un mensaje informando que ese correo ya esta en uso
        if(validateUserMail) return console.log('The email you enter is currently in use by another user')
        //Hacemos el hasheo de la password del usuario
        user.salt = crypto.randomBytes(128).toString('base64')
        user.password = crypto.createHmac('sha256', user.salt).update(user.password).digest('hex')
        //pusheamos el nuevo usuario a la lista de usuarios
        users.push(user)
        //Escribimos la informacion del nuevo usuario en el archivo JSON
        await this.writeFile(users)
        //Finalmente mostramos el nuevo usuario creado
        return user
      } catch (error) {
        console.log(error)
      }
    }
    getUserById = async (id) => {
      try {
        const users = await this.getUsers()
        const user = users.find(u => u.id === id)
        return user ? user : console.log('No user found')
      } catch (error) {
        console.log(error)
      }
    }
    //Para la validacion usamos el Email y la password proporcionada por el usuario
    validateUser = async (email, password) => {
      try {
        //Obtenemos todos los usuarios cargados
        const users = await this.getUsers()
        //Buscamos los email de los usuarios guardados y comparamos con el ingresado a validar
        const userIndex = users.findIndex(u => u.email === email)
        //Si el email ingresado no se encuentra en nuestra lista significa que el usuario no existe, devolvemos un mensaje informandolo
        //de otro modo si el email se encuentra en nuestra lista, el usuario existe y el proceso continua normalmente
        if(userIndex === -1) return console.log('No user found')
        //Guardamos al usuario en la constante 'user' para luego validar los passwords
        const user = users[userIndex]
        //Hasheamos el password ingresado por el usuario
        const compareHash = crypto.createHmac('sha256', user.salt).update(password).digest('hex')
        //Comparamos los password, el ingresado por el usuario y el guardado en la lista de usuarios
        //Una vez comparados, si son iguales el logueo es satisfactorio, de otra forma devolvemos un mensaje informando que el password es incorrecto
        compareHash === user.password ? console.log('successful login') : console.log('Invalid Password')
      } catch (error) {
        console.log(error)
      }
    }
    deleteUser = async (id) => {
      try {
        const users = await this.getUsers()
        const user = await this.getUserById(id)
        if(!user) return
        const usersFiltred = users.filter(u => u.id !== id)
        await this.writeFile(usersFiltred)
        return console.log('User was successfully removed')
      } catch (error) {
        console.log(error)
      }
    }
}
module.exports = UserManager
