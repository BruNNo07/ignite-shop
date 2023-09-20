import { HomeConteiner, Product } from "@/styles/pages/home"
import Image from "next/image"
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { stripe } from "@/lib/stripe"
import { GetStaticProps } from "next"
import Stripe from "stripe"
import Link from "next/link"

interface HomeProps{
  products:{
    id: string;
    name: string;
    imageURL: string;
    price: string;
  }[]
}

export default function Home({ products }: HomeProps) {
  const [ sliderRef ] = useKeenSlider({
    slides:{
      perView: 2,
      spacing: 48,
    }
  })

  return (
    <HomeConteiner ref={sliderRef} className="keen-slider">
      {products.map(product =>{
        return(
          <Link key={product.id} href={`/product/${product.id}`}>
            <Product className="keen-slider__slide">
              <Image src={product.imageURL} alt="" width={520} height={480}/>
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        )
      })}
      

    </HomeConteiner>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product =>{
    const price = product.default_price as Stripe.Price

    return{
      id: product.id,
      name: product.name,
      imageURL: product.images[0],
      price: new Intl.NumberFormat('pt-BR',{
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount! / 100,)
    }
  })
  
  return{
    props:{
      products,
    },
    revalidate: 60 * 60 * 2 //atualização a cada 2 horas
  }
}
