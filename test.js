fetch('http://localhost:3000/sw.js').then(res => console.log(res.status, res.headers.get('content-type'))).catch(console.error);
