<nav className="flex items-center gap-4">
  {user ? (
    <>
      <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600">
        Dashboard
      </Link>
      <span className="text-sm text-gray-600">
        Hi, {user.fullName || user.username}
      </span>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </>
  ) : (
    // guest mode
  )}
</nav>