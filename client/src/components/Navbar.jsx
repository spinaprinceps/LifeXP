function Navbar({ onLogout }) {
  return (
    <div className="bg-white border-2 border-primary rounded-lg p-4 px-8 mb-5 flex justify-between items-center shadow-md">
      <h1 className="text-primary-dark text-3xl font-bold tracking-widest m-0 font-mono">
        LIFEXP
      </h1>
      
      <button 
        onClick={onLogout} 
        className="bg-primary-dark border-2 border-primary-dark text-white py-2.5 px-6 rounded-md cursor-pointer font-mono font-bold text-sm transition-all hover:bg-primary hover:border-primary"
      >
        LOGOUT
      </button>
    </div>
  );
}

export default Navbar;
