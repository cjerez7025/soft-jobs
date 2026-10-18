export const notFound = (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
}

// Captura y devuelve los errores ocurridos en el servidor
export const errorHandler = (error, req, res, next) => {
  console.error(error)
  const status = error.status ?? (error.code === '23505' ? 409 : 500)
  const message = error.code === '23505'
    ? 'El email ya se encuentra registrado'
    : error.status ? error.message : 'Error interno del servidor'
  res.status(status).json({ message })
}
