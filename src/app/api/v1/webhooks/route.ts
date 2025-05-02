


import {comments} from "./data";

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';




// export async function GET() {

//     return   Response.json(comments);
// }

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



export async function POST(request : Request) {

    const comment = await request.json();
    const newComment = {
        id : comments.length + 1,
        text : comment.text,  

    };
    comments.push(newComment);

     return new Response(JSON.stringify(newComment), {
        headers: {"Content-Type":"application/json"},
        status:201,
     });
}