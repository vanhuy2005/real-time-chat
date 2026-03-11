const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-100/30 p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      <div className="max-w-md text-center z-10 glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[2rem] bg-primary/20 backdrop-blur-sm border border-white/10 shadow-inner ${
                i % 2 === 0 ? "animate-pulse" : "animate-bounce hover:scale-110 transition-transform cursor-pointer"
              }`}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-base-content">{title}</h2>
        <p className="text-base-content/70 font-medium leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
