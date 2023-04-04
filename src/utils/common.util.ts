import { ResponseDto } from '../dtos/responses/response.dto'

export function createdResponse(message: string): ResponseDto {
  const res: ResponseDto = {
    message: message,
    success: true,
  }
  return res
}

export function errorResponse(message: string): ResponseDto {
  const res: ResponseDto = {
    message: message,
    success: false,
  }
  return res
}

export function isEmptyFields(object: any, keys: string[]): boolean {
  let is_empty = false
  keys.forEach((key) => {
    if (!object[key] || object[key] == '') is_empty = true
  })
  return is_empty
}
