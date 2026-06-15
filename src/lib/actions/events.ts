"use server";

import { prisma } from "@/lib/prisma";
import { mapEvent } from "@/lib/mappers";

export type EventData = {
  title: string;
  date: string;
  description: string;
  venue: string;
  registration_link: string;
  image_path: string;
  thumbnail_url?: string;
  medium_url?: string;
  status: "upcoming" | "past" | "ongoing";
};


export async function getEventsAction() {
  try {
    const records = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
    return { success: true, records: records.map(mapEvent) };
  } catch (err: any) {
    console.error("Error fetching events:", err);
    return { success: false, error: err.message || "Failed to fetch events" };
  }
}

export async function createEventAction(data: EventData) {
  try {
    const slug = data.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
    
    const record = await prisma.event.create({
      data: {
        title: data.title,
        slug,
        date: new Date(data.date),
        description: data.description,
        venue: data.venue,
        registrationLink: data.registration_link,
        imagePath: data.image_path,
        imageUrl: data.image_path, // Sync both for compatibility
        thumbnailUrl: data.thumbnail_url,
        mediumUrl: data.medium_url,
        status: data.status,
      },
    });

    return { success: true, record: mapEvent(record) };
  } catch (err: any) {
    console.error("Error creating event:", err);
    return { success: false, error: err.message || "Failed to create event" };
  }
}

export async function updateEventAction(id: string, data: Partial<EventData>) {
  try {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.venue !== undefined) updateData.venue = data.venue;
    if (data.registration_link !== undefined) updateData.registrationLink = data.registration_link;
    if (data.image_path !== undefined) {
      updateData.imagePath = data.image_path;
      updateData.imageUrl = data.image_path;
    }
    if (data.thumbnail_url !== undefined) {
      updateData.thumbnailUrl = data.thumbnail_url;
    }
    if (data.medium_url !== undefined) {
      updateData.mediumUrl = data.medium_url;
    }
    if (data.status !== undefined) updateData.status = data.status;

    const record = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return { success: true, record: mapEvent(record) };
  } catch (err: any) {
    console.error("Error updating event:", err);
    return { success: false, error: err.message || "Failed to update event" };
  }
}

export async function deleteEventAction(id: string) {
  try {
    await prisma.event.delete({
      where: { id },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting event:", err);
    return { success: false, error: err.message || "Failed to delete event" };
  }
}

