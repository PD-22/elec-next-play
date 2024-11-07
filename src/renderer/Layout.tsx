import { Link, Outlet } from 'react-router-dom';

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

function Layout() {
  return (
    <div
    //  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* Add navigation bar */}
      <nav className="flex justify-center space-x-6 py-4 bg-black/[.05] dark:bg-white/[.06] ">
        <Link to="/" className="text-lg font-bold hover:text-blue-500">
          Home
        </Link>
        <Link to="/settings" className="text-lg font-bold hover:text-blue-500">
          Settings
        </Link>
      </nav>
      {/* Add a container with a maximum width */}
      <div className="max-w-4xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
