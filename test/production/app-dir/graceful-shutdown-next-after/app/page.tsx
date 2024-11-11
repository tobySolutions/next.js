import { unstable_after as after, connection } from 'next/server'
import { setTimeout } from 'timers/promises'

export default async function Page() {
  await connection()
  after(async () => {
    console.log('[after] starting sleep')
    await setTimeout(5_000)
    console.log('[after] finished sleep')
  })
  return <>Hello</>
}
