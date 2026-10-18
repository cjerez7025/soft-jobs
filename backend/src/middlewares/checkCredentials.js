// Verifica la existencia de credenciales en el body (login y registro)
export const checkCredentials = (req, res, next) => {
  const { email, password } = req.body ?? {}
  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Email y password son obligatorios' })
  }
  next()
}

// Verifica los campos adicionales requeridos para registrar un usuario
export const checkRegisterFields = (req, res, next) => {
  const { rol, lenguage } = req.body ?? {}
  if (!rol?.trim() || !lenguage?.trim()) {
    return res.status(400).json({ message: 'Rol y lenguage son obligatorios' })
  }
  next()
}
