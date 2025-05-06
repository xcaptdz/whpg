// pages/index.tsx
import WebhookTable from '@/components/WebhookTable'

import { prisma } from '@/lib/prisma'


 

export default async function HomePage() {

  // const hooks = await prisma.hook.findMany();

  const hooks = await prisma.hook.findMany({
    orderBy: {
      id: 'desc',
    },
  })
 
console.log(hooks);
  return (
    <main style={{ padding: '20px' }}>
      <h1>Webhooks</h1>
      <WebhookTable data={hooks} />
    </main>
  )
}
