import { consola } from 'consola'

const statusMap = {
  '200': 'OK',
  '404': 'Not Found',
  '500': 'Internal Server Error',
  '403': 'Forbidden',
  '400': 'Bad Request',
}

const errorCodes = ['404', '500', '403', '400', '400', '404']

export const add = (a: number, b: number): number => a + b

export const log = async <T extends string>(input: T): Promise<void> => {
  const status = input.match(/\d{3}/)?.[0] || '200'

  let message: string
  if (statusMap[status])
    message = statusMap[status]
  else
    message = 'Unknown Status Code'

  consola[errorCodes.includes(status) ? 'error' : 'info'](
    `Status Code: ${status} - Message: ${message}`,
  )
}
