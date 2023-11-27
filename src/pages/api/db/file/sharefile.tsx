import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function shareFile(copiedFileURL: string, originalFileURL: string, userEmail: string) {
  try {
    // Check if the user with the specified email exists
    const sharedFolder = await prisma.folder.findUnique({
      where: {
        name: "shared",
        id: -1,
        user: {
            email: userEmail,
            },
      },
      });

    if (!sharedFolder) {
        return { message: 'User not found' };
    }

    // Find the source file information
    const sourceFile = await prisma.file.findUnique({
      where: {
        fileURL: originalFileURL,
      },
    });

    if (!sourceFile) {
      throw new Error("Original file not found");
    }

    // Copy the file into the "shared" folder
    await prisma.file.create({
      data: {
        folderId: sharedFolder.id,
        owner: sourceFile.owner,
        name: sourceFile.name,
        type: sourceFile.type,
        fileURL: copiedFileURL,
      },
    });

    return { message: 'File shared' };
  } catch (error) {
    console.error("Error sharing file:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { copiedFileURL, originalFileURL, userEmail } = req.body;

  if (!copiedFileURL || !originalFileURL || !userEmail) {
    res.status(400).json({ error: "Missing copiedFileURL, originalFileURL, or userEmail parameter" });
    return;
  }

  try {
    const message = await shareFile(copiedFileURL, originalFileURL, userEmail);
    await prisma.$disconnect();
    res.status(200).json(message);
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}