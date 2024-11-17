import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const categories = await prisma.category.findMany({
            skip: 0,
        })

        return new NextResponse(
            JSON.stringify(JSON.stringify(categories, { status: 200 }))
        );
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: `Something went wrong!${err}` }, { status: 500 })
        );
    }
}