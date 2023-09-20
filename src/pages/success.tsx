import { stripe } from "@/lib/stripe";
import { ImageConteiner, SuccessConteiner } from "@/styles/pages/success";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";

interface SuccessProps{
  customerName:string,
  product:{
    name:string;
    imageURL: string;
  }
}

export default function Success({customerName, product}: SuccessProps){
  return(
    <SuccessConteiner>
      <h1>Compra Efetuada!</h1>

      <ImageConteiner>
        <Image src={product.imageURL} alt="" width={120} height={110}/>
      </ImageConteiner>

      <p>Uhuul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa. </p>

      <Link href={"/"}>
        Voltar ao Catálogo
      </Link>
    </SuccessConteiner>
  )
}

export const getServerSideProps:GetServerSideProps = async ({query}) => {
  

  if(!query.session_id){
    return{
      redirect: {
        destination: '/',
        permanent:false,
      }

    }
  }
  const sessionId = String(query.session_id)
  const session = await stripe.checkout.sessions.retrieve(sessionId,{
    expand: ['line_items','line_items.data.price.product']
  })

  const customerName = session.customer_details?.name
  const product = session.line_items?.data[0].price?.product as Stripe.Product
  return {
    props:{
      customerName,
      product:{
        name:product.name,
        imageURL: product.images[0],
      }
    }
  }
}