export const permissionError = {
  error: true,
  status: 401,
  data: "You don't have permission to perform this action."
};
export const authenticationError = {
  error: true,
  status: 401,
  data: 'Authentication Failed'
};

export const successResponse = {
  error: false,
  status: 200,
  data: 'Ok'
};

export const duplicateDataError = {
  error: true,
  status: 409,
  data: 'Duplicate data error'
}

export const requestFailError = {
  error: true,
  status: 400,
  data: ''
}
