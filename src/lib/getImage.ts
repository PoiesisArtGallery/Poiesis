export const getImageUrl = (
  fileName: string,
  bucket = "artworks"
) => {

  if (!fileName) return "/placeholder.jpg"

  // ✅ IF FULL URL → RETURN DIRECTLY
  if (fileName.startsWith("http")) {
    return fileName
  }

  // ✅ OTHERWISE → SUPABASE
  return `https://eodjhqlydbdqopganynm.supabase.co/storage/v1/object/public/${bucket}/${fileName}`
}