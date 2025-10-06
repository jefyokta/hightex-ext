import { bibToObject, CiteUtils } from "bibtex.js";


const cite = bibToObject(`@article{lee2023neural,
  author    = {David Lee and Sarah Kim and Joshua Park and Emily Wong and Robert Tan},
  title     = {Neural Network Optimization for Real-Time Edge Computing},
  journal   = {IEEE Transactions on Neural Networks and Learning Systems},
  year      = {2023},
  volume    = {34},
  number    = {7},
  pages     = {2891--2905},
  doi       = {10.1109/TNNLS.2023.1234567},
  publisher = {IEEE}
}
`)

cite.map(c=>{

    const author =(new CiteUtils(c)).setMaxAuthors(1).toCite()
    console.log(author)
})