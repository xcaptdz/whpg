




import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
 
const baseUrl = process.env.WEBHOOK_BASE_URL;
const serverApiKey = process.env.API_SECRET_KEY;



// export async function GET() {
//     try {
//       const hooks = await prisma.hook.findMany();
//       return NextResponse.json(hooks);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       return NextResponse.json(
//         { error: 'Internal Server Error' },
//         { status: 500 }
//       );
//     }
//   }


export async function POST(request: Request) {

    const clientApiKey = request.headers.get('x-api-key');

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
  

      // Send POST to external backend
      const backendResponse = await fetch(`${baseUrl}${hook}`, {
        method: 'POST',
      });
  
      // Insert into PostgreSQL via Prisma
      await logHook(hook,true);

      const responseText = await backendResponse.text();
       
  
      return NextResponse.json({
        message: 'Inserted and forwarded successfully',
        backendResponse: responseText,
      });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }


async function logHook(hook: string, isAuth: boolean) {

 
      console.warn(hook);

      console.warn(`[UNAUTHORIZED] ${hook}`);

      // Insert the log into the webhook table
      const newHook = await prisma.hook.create({
        data: { 
          hook: hook,
          isAuth: isAuth,
        },
      });

      console.log(newHook);
    }












  // export async function POST(request: Request) {
  //   try {
  //     const body = await request.json();
  //     const { hook } = body;
  
  //     const newHook = await prisma.hook.create({
  //       data: {
  //         hook
           
  //       },
  //     });
  
  //     return NextResponse.json(newHook, { status: 201 });
  //   } catch (error) {
  //     console.error('Error creating user:', error);
  //     return NextResponse.json(
  //       { error: 'Failed to create user' },
  //       { status: 500 }
  //     );
  //   }
  // }











// import {comments} from "./data";



// export async function GET() {

//     return   Response.json(comments);
// }









  // export async function POST(request : Request) {

//     const comment = await request.json();
//     const newComment = {
//         id : comments.length + 1,
//         text : comment.text,  

//     };
//     comments.push(newComment);

//      return new Response(JSON.stringify(newComment), {
//         headers: {"Content-Type":"application/json"},
//         status:201,
//      });
// }