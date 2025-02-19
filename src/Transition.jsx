<Route path="/" element={!user ? <LoginPage setUser={setUser} /> : <ClippedDrawer user={user} setUser={setUser} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
