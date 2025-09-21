// SPDX-License-Identifier: MIT

function ImageCard({
  imageUrl,
  alt,
  numCopies,
  loading = 'auto',
  small = false,
  children,
}) {
  const width = small ? 40 : 80
  const height = small ? 56 : 112

  if (imageUrl.startsWith('https://static.wixstatic.com/media/')) {
    const filename = imageUrl.slice(
      'https://static.wixstatic.com/media/'.length
    )
    imageUrl =
      'https://static.wixstatic.com/media/' +
      filename +
      '/v1/fit/w_80,h_112,q_85,enc_avif,quality_auto/' +
      filename
  }

  return (
    <>
      <img
        width={width}
        height={height}
        src={imageUrl}
        alt={alt}
        loading={loading}
      />
      {numCopies !== undefined && (
        <span role="textbox" aria-readonly className="container-num-copies">
          {numCopies}
        </span>
      )}
      {children}
    </>
  )
}

export default ImageCard
