import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// GET ALL COMMENTS OF A POST
export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get("postSlug");

    try {
        const comments = await prisma.comment.findMany({
            where: { 
                ...(postSlug && { postSlug }),
            },
            include: { user: true },
        })
        return new NextResponse(
            JSON.stringify(JSON.stringify(comments, { status: 200 }))
        );
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: `Something went wrong!${err}` }, { status: 500 })
        );
    }
}

// CREATE A COMMENT
export const POST = async (req) => {
    const session = await getAuthSession();

    if(!session) {
        return new NextResponse(
            JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
        );
    }

    try {
        const body = await req.json();
        console.log({body});

        await prisma.category.create({
            data: {
              slug: body.catSlug,
              title: body.catSlug,
            },
          });
        const comment = await prisma.comment.create({
            data: {
                ...body,
                userMail: session.user.email,
                cat: {
                    connect: {
                        slug: body.catSlug, // Connect to an existing category by its unique slug
                    },
                },
            }
        })
        return new NextResponse(
            JSON.stringify(JSON.stringify(comment, { status: 200 }))
        );
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: `Something went wrong!${err}` }, { status: 500 })
        );
    }
}