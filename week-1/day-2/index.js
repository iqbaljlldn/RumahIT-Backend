import http from 'http'
import { hello } from './hello.js'
import moment from 'moment'

// const server = http.createServer((req, res) => {
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'application/json')
//     res.write(JSON.stringify({
//         status: "success",
//         data: {
//             message: hello,
//             time: moment().calendar()
//         }
//     }))
//     res.end()
// })

const server = http.createServer((req, res) => {
    const url = req.url
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    // if (url === '/ucup') {
    //     res.write("M. Yusuf Ramadhani")
    // } else if (url === "/zidan") {
    //     res.write("Zidan Albani")
    // } else {
    //     res.write("page not found")
    // }
    switch (url) {
        case '/ucup':
            res.write("M. Yusuf Ramadhani")
            break;
        case '/zidan':
            res.write("Zidan Albani")
            break;        
        case '/zidan/makanan/favorit':
            res.write("Mie ayam")
            break;
        default:
            res.write("page not found")
            break;
    }
    res.end()
})

const hostname = '127.0.0.1'
const port = 3000
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})