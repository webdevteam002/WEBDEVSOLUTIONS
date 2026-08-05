export const metadata = {
  title: 'Sanity Studio',
  description: 'The backend for WebDev Solutions',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
