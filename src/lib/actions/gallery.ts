"use server";

import { prisma } from "@/lib/prisma";
import { storageService } from "@/lib/storage";

export type GalleryUploadData = {
  url: string;
  thumbnail_url?: string;
  medium_url?: string;
  caption: string;
  album: string;
  is_featured?: boolean;
  sort_order?: number;
};

function mapGallery(g: any) {
  if (!g) return null;
  return {
    id: g.id,
    url: g.imageUrl,
    thumbnail_url: g.thumbnailUrl || g.imageUrl,
    medium_url: g.mediumUrl || g.imageUrl,
    caption: g.caption,
    album: g.album,
    is_featured: g.isFeatured,
    sort_order: g.sortOrder,
    created_at: g.createdAt?.toISOString(),
  };
}

export async function getGalleryAction() {
  try {
    const records = await prisma.gallery.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return { success: true, records: records.map(mapGallery) };
  } catch (err: any) {
    console.error("Error fetching gallery:", err);
    return { success: false, error: err.message || "Failed to fetch gallery" };
  }
}

export async function addGalleryImageAction(data: GalleryUploadData) {
  try {
    // Get highest sort order
    const maxOrderRecord = await prisma.gallery.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true }
    });

    const nextSortOrder = maxOrderRecord ? (maxOrderRecord.sortOrder ?? 0) + 1 : 0;

    const record = await prisma.gallery.create({
      data: {
        imageUrl: data.url,
        thumbnailUrl: data.thumbnail_url,
        mediumUrl: data.medium_url,
        caption: data.caption,
        album: data.album,
        sortOrder: data.sort_order ?? nextSortOrder,
        isFeatured: data.is_featured ?? false,
      },
    });

    return { success: true, record: mapGallery(record) };
  } catch (err: any) {
    console.error("Error inserting gallery image:", err);
    return { success: false, error: err.message || "Failed to add image to database" };
  }
}

export async function updateGalleryCaptionAction(id: string, caption: string) {
  try {
    await prisma.gallery.update({
      where: { id },
      data: { caption },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error updating caption:", err);
    return { success: false, error: err.message || "Failed to update caption" };
  }
}

export async function toggleGalleryFeaturedAction(id: string, isFeatured: boolean) {
  try {
    await prisma.gallery.update({
      where: { id },
      data: { isFeatured },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error updating featured status:", err);
    return { success: false, error: err.message || "Failed to update featured status" };
  }
}

export async function reorderGalleryImagesAction(updates: { id: string; sort_order: number }[]) {
  try {
    const transaction = updates.map(u => 
      prisma.gallery.update({
        where: { id: u.id },
        data: { sortOrder: u.sort_order }
      })
    );
    await prisma.$transaction(transaction);

    return { success: true };
  } catch (err: any) {
    console.error("Error reordering gallery:", err);
    return { success: false, error: err.message || "Failed to save order" };
  }
}

export async function deleteGalleryImageAction(id: string, urlPath: string) {
  try {
    // 1. Delete image files from disk
    await storageService.delete(urlPath);

    // 2. Delete entry from database
    await prisma.gallery.delete({
      where: { id },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting gallery image:", err);
    return { success: false, error: err.message || "Failed to delete gallery image" };
  }
}

