import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from './config/db.js'

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, rol, lenguage } = req.body
    const passwordHash = bcrypt.hashSync(password, 10)
    await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)',
      [email, passwordHash, rol, lenguage]
    )
    res.status(201).json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { rows: [user] } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Email o contraseña incorrecta' })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

// El cliente espera un arreglo con el registro del usuario
export const getUser = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, rol, lenguage FROM usuarios WHERE email = $1',
      [req.user.email]
    )
    res.json(rows)
  } catch (error) {
    next(error)
  }
}
