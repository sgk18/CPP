export function mapEvent(e: any) {
  if (!e) return null;
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    date: e.date instanceof Date ? e.date.toISOString().split("T")[0] : e.date,
    description: e.description,
    venue: e.venue,
    registration_link: e.registrationLink,
    image_path: e.imagePath,
    image_url: e.imageUrl,
    status: e.status,
    created_at: e.createdAt?.toISOString(),
  };
}

export function mapWorkshop(w: any) {
  if (!w) return null;
  return {
    id: w.id,
    title: w.title,
    slug: w.slug,
    description: w.description,
    date: w.date,
    duration: w.duration,
    category: w.category,
    image_url: w.imageUrl,
    registration_link: w.registrationLink,
    status: w.status,
    created_at: w.createdAt?.toISOString(),
  };
}
