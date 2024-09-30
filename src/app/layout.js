
import "./globals.css";


export const metadata = {
  title: "Inditronics Dashboard",
  description: "Advanced IoT dashboard to monitor and manage remote devices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" bg-background poppins">
        {children}
      </body>
    </html>
  );
}
