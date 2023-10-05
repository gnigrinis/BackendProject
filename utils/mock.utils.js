const { faker } = require("@faker-js/faker")

const generateUsers = (count = 5) => {
  const users = []

  for (let i = 0; i < count; i++) {
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    users.push({
      firstname,
      lastname,
      email: faker.internet.email({
        firstName: firstname,
        lastName: lastname,
        provider: "gmail.com",
      }),
      age: faker.number.int({ min: 17, max: 70 }),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(["user", "admin"]),
    })
  }

  return users
}
const generateProducts = (count = 99) => {
  const products = []

  for (let i = 0; i < count; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.commerce.isbn(),
      price: faker.commerce.price(),
      stock: faker.number.int(5),
      category: faker.commerce.productMaterial(),
    })
  }

  return products
}

module.exports = {
  generateProducts,
  generateUsers,
}
