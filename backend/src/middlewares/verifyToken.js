import jwt from 'jsonwebtoken'

// Valida el token recibido en la cabecera Authorization (Bearer <token>)
export const verifyToken = (req, res, next) => {
  const authorization = req.header('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authorization.split(' ')[1]
  try {
    // verify valida la firma y la expiración; decode obtiene el payload
    jwt.verify(token, process.env.JWT_SECRET)
    req.user = jwt.decode(token)
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
