import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Revalidation webhook triggered");

    revalidatePath("/", "layout");

    console.log("All site revalidated");

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: "Content revalidated successfully",
    });
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
