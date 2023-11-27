const expect = require("chai").expect
const supertest = require("supertest")

const requestor = supertest("http://localhost:8080")

describe("Integration - BestBuy", () => {
  // Suite de test para CRUD de productos
  let productID
  describe("products", () => {
    it("Product - /POST", async () => {
      const product = {
        title: "Televisor 8K",
        description: "Televisor de alta resolución smart tv",
        code: "9856",
        price: 500,
        status: true,
        stock: 4,
        category: ["electrónica", "televisor", "altaresolución", "smart"],
        thumbnails: [
          "https://electrobello.vtexassets.com/arquivos/ids/156630-300-300?v=1764511560&width=300&height=300&aspect=true",
        ],
      }

      const {
        statusCode,
        ok,
        _body: { payload },
      } = await requestor.post("/api/products/").send(product)

      expect(statusCode).to.be.equal(201)
    })
    it("Product - /GET", () => {})
    it("Product - /PUT", () => {})
    it("Product - /DELETE", () => {})
  })

  describe("users", () => {
    it("User - /GET", () => {})
  })
})
