
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
 
const baseUrl = process.env.WEBHOOK_BASE_URL;
const serverApiKey = process.env.API_SECRET_KEY_3RDP;






export async function POST(request: Request) {

    const clientApiKey = request.headers.get('key');

    // Validate API key
    if (!clientApiKey || clientApiKey !== serverApiKey) {


      const ip = request.headers.get('x-forwarded-for') || 'Unknown IP';
      const logMessage = `UNAUTHORIZED: ${ip} - Key: ${clientApiKey || 'None'}`;
      await logHook(logMessage, false);

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      const body = await request.json();
      const { hook } = body;
  
      if (!hook || typeof hook !== 'string') {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }
  
       
      if (hook != "moein") {

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

      }

      // Send POST to external backend
        const  backendResponse = await fetch(`${baseUrl}${hook}`, {
        method: 'POST',
      });

  
      // Insert into PostgreSQL via Prisma
      await logHook(hook,true);

      const responseText = await backendResponse.text();
       
  
      return NextResponse.json({
        message: 'Forwarded and inserted and  successfully',
        backendResponse: responseText,
      });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }


async function logHook(hook: string, isAuth: boolean) {

 
      console.warn(hook);

      if (!isAuth) console.warn(`[UNAUTHORIZED] ${hook}`);

      // Insert the log into the webhook table
      const newHook = await prisma.hook.create({
        data: { 
          hook: hook,
          isAuth: isAuth,
        },
      });

      console.log(newHook);
    }


