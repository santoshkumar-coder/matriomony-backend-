const cleanBody = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
  
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null
      ) {
        cleanBody(obj[key]);
      }
    }
  
    return obj;
  };

module.exports = cleanBody;