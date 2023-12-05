const productManager = require("../dao/product.manager")
const { CustomError, ErrorType } = require("../errors/custom.error")
const productModel = require("../models/product.model")
const userModel = require("../models/user.model")
const MailSender = require("../services/mail.sender.service")
const logger = require("../logger")

const getAll = async (req, res, next) => {
  try {
    const { search, max, min, limit } = req.query
    logger.debug(`Searching products for ${search} max ${max} and min ${min}`)

    const products = await productManager.getProducts()
    let filtrados = products
    if (search) {
      filtrados = filtrados.filter(
        (p) =>
          p.keywords.includes(search.toLowerCase) ||
          p.title.includes(search.toLowerCase) ||
          p.description.includes(search.toLowerCase)
      )
    }

    if (min || max) {
      filtrados = filtrados.filter(
        (p) => p.price >= (min || 0) && p.price <= (max || Infinity)
      )
    }

    if (limit) {
      filtrados = filtrados.slice(0, limit)
    }
    await res.send(filtrados)
  } catch (error) {
    next(new CustomError("No se pudo obtener productos de la DB", ErrorType.DB))
  }
}

// GetAll mocks
const getAllMNock = async (req, res, next) => {
  try {
    const products = await productManager.getMockProducts()
    res.send(products)
  } catch (error) {
    next(
      new CustomError("No se pudo obtener productos mockeados", ErrorType.DB)
    )
  }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const products = await productManager.getProductById(id)

    if (!products) {
      next(new CustomError("No se pudo obtener producto por ID", ErrorType.DB))
    }
    res.send(products)
  } catch {
    //res.status(404).send("Product not found")
    next(new CustomError("No se pudo obtener producto por ID", ErrorType.DB))
  }
}

const create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body
    // Propietario opcional, si se proporciona en el cuerpo de la solicitud
    const { userType, email } = req.body.owner || {}

    const productData = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      // Agregar el propietario si se proporciona en la solicitud, de lo contrario, será null
      owner: userType && email ? { userType, email } : null,
    }

    await productManager.addProduct(productData)
    res.status(201).json({ message: "Product added successfully" })
  } catch (error) {
    //res.status(400).json({ error: error.message })
    next(new CustomError("No se pudo crear producto", ErrorType.DB))
  }
}

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedFields = req.body
    const result = await productManager.updateProduct(id, updatedFields)
    res.json({ message: "Product updated successfully" })
  } catch (error) {
    //res.status(404).json({ error: error.message })
    next(new CustomError("No se pudo actualizar producto", ErrorType.DB))
  }
}

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await productManager.getProductById(id)

    try {
      const userEmail = product.owner.email
      const messageBody = `Estimado usuario premium, el producto "${product.title}" ha sido eliminado.`
      await MailSender.send(userEmail, messageBody)
    } catch (error) {
      next(new CustomError("No pertenece a un usuario premium", ErrorType.DB))
    }
    await productManager.deleteProduct(id)
    res.status(200).send("Product deleted successfully")
  } catch {
    next(new CustomError("No se pudo borrar producto", ErrorType.DB))
  }
}

const getBase = async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query
  logger.debug(limit, page, sort, query)
  const filters = {}

  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ]
  }

  if (sort === "asc") {
    // Ordenar ascendente por precio
    sortObj = { price: 1 }
  } else if (sort === "desc") {
    // Ordenar descendente por precio
    sortObj = { price: -1 }
  } else {
    sortObj = {} // Sin ordenamiento por defecto
  }

  const productsPerPage = parseInt(limit)
  const currentPage = parseInt(page)

  const totalCount = await productModel.countDocuments(filters)
  const totalPages = Math.ceil(totalCount / productsPerPage)
  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  try {
    const products = await productModel
      .find(filters)
      .sort(sortObj)
      .skip((currentPage - 1) * productsPerPage)
      .limit(productsPerPage)

    res.status(200).json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      nextPage: hasNextPage ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage
        ? `/api/products?limit=${limit}&page=${
            currentPage - 1
          }&sort=${sort}&query=${query}`
        : null,
      nextLink: hasNextPage
        ? `/api/products?limit=${limit}&page=${
            currentPage + 1
          }&sort=${sort}&query=${query}`
        : null,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      nextPage: hasNextPage ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage
        ? `/api/products?limit=${limit}&page=${
            currentPage - 1
          }&sort=${sort}&query=${query}`
        : null,
      nextLink: hasNextPage
        ? `/api/products?limit=${limit}&page=${
            currentPage + 1
          }&sort=${sort}&query=${query}`
        : null,
    })
  }
}

module.exports = {
  getAll,
  getAllMNock,
  getById,
  create,
  updateById,
  deleteById,
  getBase,
}
