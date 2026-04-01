import './globals.css'

export const metadata = {
  title: 'Creator Campaign',
  description: 'Submit content and earn points',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
