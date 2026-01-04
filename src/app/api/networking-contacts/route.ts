import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkActiveSubscription } from "@/lib/utils";

// GET - Fetch all networking contacts for user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  const whereClause: any = {};
  
  if (jobId) {
    whereClause.jobLeadId = jobId;
  } else {
    // Get contacts for user's jobs
    whereClause.jobLead = {
      userId: session.user.id,
    };
  }

  const contacts = await prisma.networkingContact.findMany({
    where: whereClause,
    include: {
      jobLead: {
        select: {
          id: true,
          jobTitle: true,
          company: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}

// POST - Create a new networking contact
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if subscription is active
  const { isExpired } = await checkActiveSubscription(session.user.id);
  if (isExpired) {
    return NextResponse.json(
      { error: "Your subscription has expired. Please reactivate to continue editing." },
      { status: 403 }
    );
  }

  const data = await request.json();

  // Verify job belongs to user
  const job = await prisma.jobLead.findFirst({
    where: {
      id: data.jobLeadId,
      userId: session.user.id,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const contact = await prisma.networkingContact.create({
    data: {
      userId: session.user.id,
      jobLeadId: data.jobLeadId,
      name: data.name,
      role: data.role,
      company: job.company,
      linkedinUrl: data.linkedinUrl,
      contactType: data.contactType,
      status: "NOT_CONTACTED",
    },
  });

  return NextResponse.json(contact);
}

// PATCH - Update a networking contact
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if subscription is active
  const { isExpired } = await checkActiveSubscription(session.user.id);
  if (isExpired) {
    return NextResponse.json(
      { error: "Your subscription has expired. Please reactivate to continue editing." },
      { status: 403 }
    );
  }

  const data = await request.json();
  const { id, ...updateData } = data;

  // Verify contact belongs to user's job
  const existing = await prisma.networkingContact.findFirst({
    where: {
      id,
      jobLead: {
        userId: session.user.id,
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // If marking as SENT, set messageSentDate
  if (updateData.status === "SENT" && existing.status === "NOT_CONTACTED") {
    updateData.messageSent = true;
    updateData.messageSentDate = new Date();
  }

  const contact = await prisma.networkingContact.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(contact);
}

// DELETE - Delete a networking contact
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if subscription is active
  const { isExpired } = await checkActiveSubscription(session.user.id);
  if (isExpired) {
    return NextResponse.json(
      { error: "Your subscription has expired. Please reactivate to continue editing." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Contact ID required" }, { status: 400 });
  }

  // Verify contact belongs to user's job
  const existing = await prisma.networkingContact.findFirst({
    where: {
      id,
      jobLead: {
        userId: session.user.id,
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  await prisma.networkingContact.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
