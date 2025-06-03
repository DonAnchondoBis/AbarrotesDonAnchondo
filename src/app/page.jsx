import Link from 'next/link'

const Home = () => {
  return (
    <div>
      <h1>Aquí debería ir la UI</h1>
      <Link href="/Login">
        <button>Login</button>
      </Link>
    </div>
  )
}

export default Home
