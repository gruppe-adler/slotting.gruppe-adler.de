export function parseSearchString(searchString: string): {[name: string]: string} {
  const search = {};
  searchString.split('?').pop().split('&').map((param) => {
    const [name, value] = param.split('=').map(decodeURIComponent);
    search[name] = value;
  });

  return search;
}
