export const dynamic = 'force-dynamic';

import WebhookTable from '@/src/components/WebhookTable'

import { prisma } from '@/lib/prisma'


 

export default async function Logs() {

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
