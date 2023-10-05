const suma = (...sumandos) => {
  if (sumandos.length === 0) {
    return 0
  }

  const isSomeNan = sumandos.some((num) => isNaN(parseInt(num)))

  if (isSomeNan) {
    return null
  }

  return sumandos.reduce((total, num) => total + num, 0)
}

module.exports = suma
