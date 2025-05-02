import { prisma } from "../../../../../lib/prisma";


export default async function handler(req, res) {
    const hooks = await prisma.hook.findMany();
    res.json(hooks);
  }
