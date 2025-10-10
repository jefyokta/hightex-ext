
fetch("https://ieeexplore.ieee.org/rest/search/citation/format",{
    method:"post",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({"recordIds":["796139"],"download-format":"download-bibtex","lite":true},
    credentials: "include",
    )
}).then(console.log)