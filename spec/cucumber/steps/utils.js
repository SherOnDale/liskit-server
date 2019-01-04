function getValidPayload(type) {
  switch (type.toLowerCase()) {
    case 'create user':
      return {
        email: 'e@ma.il',
        password: 'password',
        username: 'username',
      };
    default:
      return undefined;
  }
}

function convertStringToArray(string) {
  return string
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');
}

export { getValidPayload, convertStringToArray };
