import { stripe } from "@/lib/stripe"
import { ImageConteiner, ProductConteiner, ProductDetails } from "@/styles/pages/product"
import axios from "axios"
import { GetStaticProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import Stripe from "stripe"

interface ProductProps{
  product:{
    id: string;
    name: string;
    imageURL: string;
    price: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product({product}: ProductProps){
  const [isRedirecting,setisRedirecting] = useState(false)
  async function handleBuyProduct(){
    try {
      setisRedirecting(true)
      const response = await axios.post('/api/checkout',{
        priceId: product.defaultPriceId
      })

      const { checkoutURL } = response.data

      window.location.href = checkoutURL
    } catch (err) {
      setisRedirecting(false)
      alert('Falha ao direcionar ao checkout')
    }
  }

  return(
    <ProductConteiner>
      <ImageConteiner>
        <Image src={product.imageURL} width={520} height={480} alt=""/>
      </ImageConteiner>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>
      
        <button disabled={isRedirecting} onClick={handleBuyProduct}>Comprar Agora</button>
      </ProductDetails>
    </ProductConteiner>
  )
}

export const getStaticPaths = async () => {
  return{
    paths:[
      {params: { id: 'prod_O25ncjfBZPUxTO'}}
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string}> = async ({ params }) =>{
  const productId = params!.id
  
  const product = await stripe.products.retrieve(productId,{
    expand: ['default_price'],
  })

  console.log(product)

  const price = product.default_price as Stripe.Price

  return{
    props:{
      product:{
        id: product.id,
        name: product.name,
        imageURL: product.images[0],
        price: new Intl.NumberFormat('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }).format(price.unit_amount! / 100,),
        defaultPriceId: price.id,
        description: product.description,
      },
    },
    revalidate: 60 * 60 * 1 // atualização a cada 1 hr
  }
}