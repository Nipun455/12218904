export const generateShortCode = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * alphabet.length);
      code += alphabet[index];
    }
    return code;
  };
  
  export const isValidURL = (input) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  };
  