export const post = async (endpoint, body) => {
  const res = await fetch(endpoint, {
    method: 'post', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if(!res.ok) {
    // TODO: this is register specific, please make better
    return {
      errorCode: res.status
    }
  }
 
  return await res.json();
}