export const toArray = input => (Array.isArray(input) ? input : [input]);

export const ucFirst = str => (str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : '');
