import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/utils";

// GET - Fetch all job leads for user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await prisma.jobLead.findMany({
    where: { userId: session.user.id },
    include: {
      contacts: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

// POST - Create a new job lead
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Fetch user's preferences and profile for match scoring
  const [preferences, profile] = await Promise.all([
    prisma.careerPreferences.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.careerProfile.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  // Calculate match score if preferences exist
  let matchScore = null;
  let matchBreakdown = null;

  if (preferences && profile) {
    const weights = (preferences.weights as Record<string, number>) || {
      salary: 20,
      workLocation: 15,
      commute: 10,
      mustHaveSkills: 25,
      niceToHaveSkills: 10,
      nonNegotiables: 15,
      responsibilities: 5,
    };

    const result = calculateMatchScore(
      {
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        location: data.location,
        workType: data.workType,
        jobDescription: data.jobDescription,
      },
      {
        salaryMin: preferences.salaryMin,
        salaryIdeal: preferences.salaryIdeal,
        workLocationPreference: preferences.workLocationPreference,
        maxCommute: preferences.maxCommute,
        nonNegotiables: preferences.nonNegotiables,
        responsibilitiesWant: preferences.responsibilitiesWant,
        responsibilitiesAvoid: preferences.responsibilitiesAvoid,
      },
      {
        technicalSkills: profile.technicalSkills,
        softSkills: profile.softSkills,
        toolsAndSoftware: profile.toolsAndSoftware,
      },
      weights
    );

    matchScore = result.score;
    matchBreakdown = result.breakdown;
  }

  const job = await prisma.jobLead.create({
    data: {
      userId: session.user.id,
      jobTitle: data.jobTitle,
      company: data.company,
      url: data.url,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      location: data.location,
      workType: data.workType,
      jobDescription: data.jobDescription,
      matchScore,
      matchBreakdown,
      status: "SAVED",
    },
  });

  return NextResponse.json(job);
}

// PATCH - Update a job lead
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { id, ...updateData } = data;

  // Verify ownership
  const existing = await prisma.jobLead.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // If status is changing to APPLIED, set appliedDate
  if (updateData.status === "APPLIED" && existing.status === "SAVED") {
    updateData.appliedDate = new Date();
  }

  const job = await prisma.jobLead.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(job);
}

// DELETE - Delete a job lead
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.jobLead.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  await prisma.jobLead.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
