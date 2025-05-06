

import { Hook, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma';

type Props = {
  data: Hook[]
}

export default function WebhookTable({ data }: Props) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Hook</th>
          <th style={thStyle}>Auth?</th>
          <th style={thStyle}>Created At</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td style={tdStyle}>{item.id}</td>
            <td style={tdStyle}>{item.hook}</td>
            <td style={tdStyle}>{item.isAuth ? '✅' : '❌'}</td>
            <td style={tdStyle}>{new Date(item.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const thStyle = { border: '1px solid #ddd', padding: '8px', background: '#f0f0f0' }
const tdStyle = { border: '1px solid #ddd', padding: '8px' }
