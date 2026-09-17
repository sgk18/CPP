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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EVENTS_TABLE = "events";

function hasPrismaDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function isDatabaseUrlMissingError(err: any) {
  const message = String(err?.message || err || "");
  return message.includes("DATABASE_URL") || message.includes("Env var not found");
}

function mapSupabaseEvent(record: any) {
  if (!record) return null;
  return mapEvent({
    ...record,
    registrationLink: record.registration_link,
    imagePath: record.image_path,
    imageUrl: record.image_url,
    thumbnailUrl: record.thumbnail_url,
    mediumUrl: record.medium_url,
    createdAt: record.created_at ? new Date(record.created_at) : undefined,
  });
}

function supabaseHeaders() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(),
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Supabase request failed with status ${res.status}`);
  }

  return res;
}

async function getEventsFromSupabase() {
  const res = await supabaseRequest(`${EVENTS_TABLE}?select=*&order=date.desc`);
  const records = await res.json();
  return records.map(mapSupabaseEvent);
}

async function createEventInSupabase(data: EventData) {
  const slug = data.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
  const payload = {
    title: data.title,
    slug,
    date: data.date,
    description: data.description || null,
    venue: data.venue || null,
    registration_link: data.registration_link || null,
    image_path: data.image_path || null,
    image_url: data.image_path || null,
    thumbnail_url: data.thumbnail_url || null,
    medium_url: data.medium_url || null,
    status: data.status,
  };

  const res = await supabaseRequest(EVENTS_TABLE, {
    method: "POST",
    body: JSON.stringify([payload]),
  });
  const records = await res.json();
  return mapSupabaseEvent(records[0]);
}

async function updateEventInSupabase(id: string, data: Partial<EventData>) {
  const updateData: Record<string, any> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.date !== undefined) updateData.date = data.date;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.venue !== undefined) updateData.venue = data.venue;
  if (data.registration_link !== undefined) updateData.registration_link = data.registration_link;
  if (data.image_path !== undefined) {
    updateData.image_path = data.image_path;
    updateData.image_url = data.image_path;
  }
  if (data.thumbnail_url !== undefined) updateData.thumbnail_url = data.thumbnail_url;
  if (data.medium_url !== undefined) updateData.medium_url = data.medium_url;
  if (data.status !== undefined) updateData.status = data.status;

  const res = await supabaseRequest(`${EVENTS_TABLE}?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
  });
  const records = await res.json();
  return mapSupabaseEvent(records[0]);
}

async function deleteEventInSupabase(id: string) {
  await supabaseRequest(`${EVENTS_TABLE}?id=eq.${id}`, {
    method: "DELETE",
  });
}

export async function getEventsAction() {
  try {
    if (!hasPrismaDatabaseUrl()) {
      return { success: true, records: await getEventsFromSupabase() };
    }

    const records = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
    return { success: true, records: records.map(mapEvent) };
  } catch (err: any) {
    if (isDatabaseUrlMissingError(err)) {
      try {
        return { success: true, records: await getEventsFromSupabase() };
      } catch (fallbackErr: any) {
        console.error("Fallback Supabase read failed:", fallbackErr);
      }
    }
    console.error("Error fetching events:", err);
    return { success: false, error: err.message || "Failed to fetch events" };
  }
}

export async function createEventAction(data: EventData) {
  try {
    if (!hasPrismaDatabaseUrl()) {
      return { success: true, record: await createEventInSupabase(data) };
    }

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
    if (isDatabaseUrlMissingError(err)) {
      try {
        return { success: true, record: await createEventInSupabase(data) };
      } catch (fallbackErr: any) {
        console.error("Fallback Supabase create failed:", fallbackErr);
      }
    }
    console.error("Error creating event:", err);
    return { success: false, error: err.message || "Failed to create event" };
  }
}

export async function updateEventAction(id: string, data: Partial<EventData>) {
  try {
    if (!hasPrismaDatabaseUrl()) {
      return { success: true, record: await updateEventInSupabase(id, data) };
    }

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
    if (isDatabaseUrlMissingError(err)) {
      try {
        return { success: true, record: await updateEventInSupabase(id, data) };
      } catch (fallbackErr: any) {
        console.error("Fallback Supabase update failed:", fallbackErr);
      }
    }
    console.error("Error updating event:", err);
    return { success: false, error: err.message || "Failed to update event" };
  }
}

export async function deleteEventAction(id: string) {
  try {
    if (!hasPrismaDatabaseUrl()) {
      await deleteEventInSupabase(id);
      return { success: true };
    }

    await prisma.event.delete({
      where: { id },
    });

    return { success: true };
  } catch (err: any) {
    if (isDatabaseUrlMissingError(err)) {
      try {
        await deleteEventInSupabase(id);
        return { success: true };
      } catch (fallbackErr: any) {
        console.error("Fallback Supabase delete failed:", fallbackErr);
      }
    }
    console.error("Error deleting event:", err);
    return { success: false, error: err.message || "Failed to delete event" };
  }
}
