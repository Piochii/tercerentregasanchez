const socketClient = io()

socketClient.on("cart", data => {
  render(data)
})

render = (data) => {
  if(data.message === 'Do not exist'){
    const html = `<h1>Carrito inexistente, por favor verifique el ID</h1>`
    return (document.getElementById("cart").innerHTML = html)
  }
  if (data.message === 'Wrong id format') {
    const html = `<h1>El formato del ID es incorrecto, por favor verifique el id y vuelva a ingresarlo</h1>`
    return (document.getElementById("cart").innerHTML = html)
  }

  const html = data.products
    .map(item => {
      return `<div class="productsCard">
      <h3>${item.product.title}</h3>
      <img src="${item.product.thumbnail}" />
      <h4>Precio: ${item.product.price}</h4>
      <h5>Cantidad: ${item.quantity}</h5>
    </div>
      `
    })
    .join(" ");
  document.getElementById("cart").innerHTML = html
}

searchCart = () => {
  const cartsId = document.getElementById("cartsId").value
  socketClient.emit("cart", cartsId)
  const form = document.getElementById("searchCart")
  form.reset()
}