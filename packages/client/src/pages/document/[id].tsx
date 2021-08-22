import { useRouter } from 'next/router'

export default function Document() {
  const router = useRouter()
  const { id } = router.query

  return <p>Document: {id}</p>
}
