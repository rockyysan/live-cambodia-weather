import "./globals.css";
import NavBar from "../components/NavBar"; 


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <NavBar />
        <main className="child">{children}</main>
      </body>
    </html>
  );
}
