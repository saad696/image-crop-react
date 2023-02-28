export async function imagePreview(
  image,
  canvas,
  crop,
) {
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('No canvas found!')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  context.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

 
  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  context.save()

  context.translate(-cropX, -cropY)
  context.translate(centerX, centerY)
  context.translate(-centerX, -centerY)

  context.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  )

  context.restore()
}
