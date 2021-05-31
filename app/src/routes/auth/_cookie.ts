
export const cookie = (token='', expires = new Date(1-1-1970)) =>  `token=${token}; Path=/; expires=${expires.toUTCString()}; HttpOnly`