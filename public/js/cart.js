document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart")
  const viewCartButton = document.getElementById("viewCartButton")
  const cleanCart = document.querySelectorAll(".clean-cart")
  const buyCart = document.querySelectorAll(".buy-cart")
  const email = document.querySelector(".email").textContent.trim()

  //Funcion para ver el carrito
  viewCartButton.addEventListener("click", async (event) => {
    event.preventDefault()

    let cartId = getCartIdFromCookie()
    if (cartId != null) {
      window.location.href = `/cart/${cartId}`
    } else {
      const response = await fetch(`http://localhost:8080/api/carts/${email}`, {
        method: "GET",
      })
      if (response.ok) {
        const responseData = await response.json()
        cartId = responseData
        document.cookie = `cartID=${cartId}`
        window.location.href = `/cart/${cartId}`
      } else {
        //TODO
        //obtener

        return
      }
    }
  })

  //Funcion para limpiar el carrito
  cleanCart.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault()
      let cartId = getCartIdFromCookie()
      if (cartId) {
        const response = await fetch(
          `http://localhost:8080/api/carts/${cartId}`,
          {
            method: "DELETE",
          }
        )
        if (response.ok) {
          location.reload()
        } else {
          alert(
            "Hubo un problema al vaciar el carrito, por favor intente más tarde."
          )
          return
        }
      }
    })
  })

  //Funcion para comprar el carrito
  buyCart.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault()
      let cartId = getCartIdFromCookie()
      if (cartId) {
        const response = await fetch(`http://localhost:8080/order/${cartId}`, {
          method: "GET",
        })
        if (response.ok) {
          alert("Orden de compra creada")
          window.open("http://localhost:8080/success")
        } else {
          alert(
            "Hubo un problema al generar la orden de compra, por favor intente más tarde."
          )
          location.reload()
          return
        }
      }
    })
  })

  //Modulo para obtener el cartId de las cookies
  function getCartIdFromCookie() {
    const cookiesSplitt = document.cookie.split(";")
    const cartCookie = cookiesSplitt.find((cookie) =>
      cookie.trim().startsWith("cartID=")
    )

    if (cartCookie) {
      const [, cartId] = cartCookie.trim().split("=")
      return cartId
    }

    return null // Return null if the "cartID" cookie is not found.
  }

  //Funcion para agregar productos al carrito
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault()
      const productId = button.getAttribute("data-product-id")
      try {
        let cartId = getCartIdFromCookie()
        // Si no hay cartId en las cookies, creamos un nuevo carrito
        if (!cartId) {
          const response = await fetch(`http://localhost:8080/api/${email}`, {
            method: "GET",
          })
          if (response.ok) {
            const responseData = await response.json()
            cartId = responseData
            document.cookie = `cartID=${cartId}`
          } else {
            alert("Hubo un problema al crear el carrito")
            return
          }
        }
        const response = await fetch(
          `http://localhost:8080/api/carts/${cartId}/product/${productId}`,
          {
            method: "POST",
          }
        )
        if (response.ok) {
          alert("Producto agregado al carrito exitosamente")
          // Puedes redirigir o actualizar la página según sea necesario
        } else {
          alert("No tienes permiso para agregar productos")
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error)
      }
    })
  })
})
