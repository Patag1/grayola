import db from '../db'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { id: email } })
    return user
  } catch (error) {
    return null
  }
}
