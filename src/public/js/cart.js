document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const viewCartButton = document.getElementById("viewCartButton");

  viewCartButton.addEventListener("click", (event) => {
    event.preventDefault();

    const cartId = getCartIdFromCookie();
    if (cartId) {
      window.location.href = `/cart/${cartId}`;
    } else {
      console.error("Cart ID not found in cookies.");
    }
  });



  // Función para obtener el cartId de las cookies
  function getCartIdFromCookie() {
    const cookiesSplitt = document.cookie.split(';')
    const cookiestrim = cookiesSplitt[0].trim().split("=")
    const cartID = cookiestrim[1]
    return cartID
  }


  addToCartButtons.forEach(button => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const productId = button.getAttribute("data-product-id");

      try {
        let cartId = getCartIdFromCookie();
        // Si no hay cartId en las cookies, creamos un nuevo carrito
        if (!cartId) {
          const response = await fetch(`http://localhost:8080/api/carts`, {
            method: "POST",
          });
          if (response.ok) {
            console.log(response)
            const responseData = await response.json();
            cartId = responseData.newCart._id;
            document.cookie = `cartID=${cartId}`;
          } else {
            alert("Hubo un problema al crear el carrito");
            return;
          }
        }

        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
          method: "POST",
        });
        if (response.ok) {
          alert("Producto agregado al carrito exitosamente");
          // Puedes redirigir o actualizar la página según sea necesario
        } else {
          alert("Hubo un problema al agregar el producto al carrito");
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    });
  });
});
