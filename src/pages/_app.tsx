import { GlobalStyles } from '../styles/global'
import type { AppProps } from 'next/app'
import logoImg from '../assets/Logo.svg'
import { Conteiner, Header } from '@/styles/pages/app'
import Image from 'next/image'
import Link from 'next/link'

GlobalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Conteiner>
      <Header>
        <Link href={'/'}>
          <Image width={150} src={logoImg} alt="" />
        </Link>
      </Header>
      <Component {...pageProps} />
    </Conteiner>
    
  )
}
