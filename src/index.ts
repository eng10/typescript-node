import express from 'express'
import Routes from './Routes/userRouter'
import Product from './Routes/Product'
import Category from './Routes/CategoryRouter';
import cartRouter from './Routes/CartRouter'
const app = express();
const Port = process.env.Port

app.use(express.json())



app.use('/api/users', Routes)
app.use('/api/products', Product)
app.use('/api/category',Category)
app.use('/api/cart',cartRouter)

//hello mom


app.listen(Port, function() {console.log('Serven is on ' +Port)})
