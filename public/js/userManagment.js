document.addEventListener("DOMContentLoaded", () => {
  const updateUserButton = document.querySelector("#change-role-form > button")
  const deleteUserButton = document.querySelector("#delete-user-form > button")
  //Funcion para actualizar usuario
  updateUserButton.addEventListener("click", async (event) => {
    event.preventDefault()
    const userID = document.getElementById("userId").value
    try {
      const response = await fetch(`/api/changeRole/${userID}`, {
        method: "POST",
      })
      if (response.ok) {
        setTimeout(function () {
          location.reload()
        }, 1000)
      } else {
        console.error("No se encontró el usuario")
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error)
    }
  })
  deleteUserButton.addEventListener("click", async (event) => {
    event.preventDefault()
    const duserId = document.getElementById("duserId").value
    try {
      const response = await fetch(`/api/deleteUser/${duserId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setTimeout(function () {
          location.reload()
        }, 1000)
      } else {
        console.error("No se encontró el usuario")
      }
    } catch (error) {
      console.error("Usuario eliminado correctamente:", error)
    }
  })
})
