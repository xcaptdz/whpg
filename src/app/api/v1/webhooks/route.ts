




import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';




export async function GET() {
    try {
      const hooks = await prisma.hook.findMany();
      return NextResponse.json(hooks);
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }



  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { hook } = body;
  
      if (!hook || typeof hook !== 'string') {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }
  
      // Insert into PostgreSQL via Prisma
      await prisma.hook.create({
        data: { hook },
      });
  
      // Send POST to external backend
      const backendResponse = await fetch(`http://10.0.20.4:8123/api/webhook/${hook}`, {
        method: 'POST',
      });
  
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